from django.shortcuts import render, get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import BookingSerializer, BookingStatusUpdateSerializer
from packages.models import Package
from .repositories.booking_repository import BookingRepository

# Create your views here.

booking_repo = BookingRepository()

class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class AgencyBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

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
