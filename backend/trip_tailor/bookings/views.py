from django.shortcuts import render, get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction

from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import BookingSerializer, BookingStatusUpdateSerializer, UserBookingSerializer
from .models import Booking
from .repositories.booking_repository import BookingRepository
from agency_app.permissions import IsVerifiedAgency

from core.tasks import send_booking_confirmation_email_task

import logging

# Create your views here.

logger = logging.getLogger(__name__)

booking_repo = BookingRepository()

class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        booking = serializer.save()

        send_booking_confirmation_email_task.delay(booking.id)

class AgencyBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsVerifiedAgency]

    def get_queryset(self):
        return booking_repo.get_all_by_agency(self.request.user.agency_profile)
    
class BookingStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        
        booking = booking_repo.get_by_id(pk)

        # only the agency of the booking can update
        if booking.agency != request.user.agency_profile:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = BookingStatusUpdateSerializer(booking, data=request.data)
        serializer.is_valid(raise_exception=True)

        updated_booking = booking_repo.update_payment_status(booking, serializer.validated_data["payment_status"])

        return Response(BookingSerializer(updated_booking).data)

class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        booking = booking_repo.get_by_id(pk)

        if booking.user != request.user and booking.agency != getattr(request.user, "agency_profile", None):
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserBookingsListView(generics.ListAPIView):
    serializer_class = UserBookingSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["booking_status", "payment_status"]
    ordering_fields = ["date", "amount"]

    def get_queryset(self):
        return booking_repo.get_all_by_user(self.request.user)

class AdminBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ["payment_status", "booking_status", "payment_method", "agency"]

    search_fields = ["user__username", "package__title", "agency__name"]

    ordering_fields = ["created_at", "updated_at", "amount", "date"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return booking_repo.get_all_bookings()


class BookingCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            with transaction.atomic():
                booking = booking_repo.get_by_id_for_update(pk)
                if not booking:
                    return Response({"detail": "Booking not found"}, status= status.HTTP_404_NOT_FOUND)
                
                user = request.user

                is_owner = booking.user_id == user.id
                is_staff = user.is_staff

                user_agency_id = None

                try:
                    user_agency_id = user.agency_profile.id
                
                except Exception:
                    user_agency_id = None

                is_agency_owner = (user_agency_id is not None and booking.agency_id == user_agency_id)

                if not(is_owner or is_agency_owner or is_staff):
                    return Response({"detail":"you do not have permission to cancel this booking."}, status=status.HTTP_403_FORBIDDEN)
                
                if booking.booking_status != Booking.BOOKING_ACTIVE:
                    return Response({"detail":"only active bookings can be cancelled"}, status=status.HTTP_400_BAD_REQUEST)
                
                if booking.payment_status == Booking.PAYMENT_PAID:
                    booking.payment_status = Booking.PAYMENT_REFUNDED

                booking.cancel()

                serialized = UserBookingSerializer(booking).data
                return Response(serialized, status=status.HTTP_200_OK)
            
        except Exception as exc:
            logger.exception("Error cancelling booking %s: %s", pk, exc)
            return Response({"detail":"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)