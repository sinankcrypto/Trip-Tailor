from ..models import Booking
from django.shortcuts import get_object_or_404

class BookingRepository:
    @staticmethod
    def create(data: dict):
        return Booking.objects.create(**data)
    
    @staticmethod
    def get_all_by_user(user):
        return Booking.objects.select_related("package", "user").filter(user=user).order_by("-created_at")

    @staticmethod
    def get_all_by_agency(agency):
        return Booking.objects.select_related("package", "user").filter(agency=agency)

    @staticmethod
    def get_by_id(booking_id):
        try:
            return Booking.objects.select_related("package", "user").get(id=booking_id)
        except Booking.DoesNotExist:
            return None
    
    @staticmethod
    def update_payment_status(booking, status):
        booking.payment_status = status
        booking.save()
        return booking
    
    @staticmethod
    def get_by_id_and_user(booking_id, user):
        return get_object_or_404(Booking, id=booking_id, user=user)
    
    @staticmethod
    def get_all_bookings():
        return Booking.objects.select_related('user', 'agency', 'package').all().order_by('-created_at')
    
    @staticmethod
    def get_by_id_for_update(pk):
        try:
            return Booking.objects.select_for_update().select_related("user", "package", "agency").get(pk=pk)
        except Booking.DoesNotExist:
            return None
    