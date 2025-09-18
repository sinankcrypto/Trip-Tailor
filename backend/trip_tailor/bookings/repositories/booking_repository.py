from ..models import Booking
from django.shortcuts import get_object_or_404

class BookingRepository:
    def create(package, data: dict):
        return Booking.objects.create(**data)
    
    def get_all_by_user(self, user):
        return Booking.objects.filter(user=user)

    def get_all_by_agency(self, agency):
        return Booking.objects.filter(agency=agency)

    def get_by_id(self, booking_id):
        return get_object_or_404(Booking, id = booking_id)
    
    def update_payment_status(self, booking, status):
        booking.payment_status = status
        booking.save()
        return booking
    
    def get_by_id_and_user(self, booking_id, user):
        return get_object_or_404(Booking, id=booking_id, user=user)