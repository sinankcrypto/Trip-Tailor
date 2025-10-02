from django.shortcuts import render, get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import BookingSerializer, BookingStatusUpdateSerializer, UserBookingSerializer
from packages.models import Package
from .repositories.booking_repository import BookingRepository
from agency_app.permissions import IsVerifiedAgency

# Create your views here.

booking_repo = BookingRepository()

class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

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
