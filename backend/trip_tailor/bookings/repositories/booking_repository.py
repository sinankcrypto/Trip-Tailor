from ..models import Booking
from django.shortcuts import get_object_or_404

class BookingRepository:
    def create(package, data: dict):
        return Booking.objects.create(**data)
    
    def get_all_by_user(self, user):
        return Booking.objects.select_related("package", "user").filter(user=user)

    def get_all_by_agency(self, agency):
        return Booking.objects.select_related("package", "user").filter(agency=agency)

    def get_by_id(self, booking_id):
        try:
            return Booking.objects.select_related("package", "user").get(id=booking_id)
        except Booking.DoesNotExist:
            return None
    
    def update_payment_status(self, booking, status):
        booking.payment_status = status
        booking.save()
        return booking
    
    def get_by_id_and_user(self, booking_id, user):
        return get_object_or_404(Booking, id=booking_id, user=user)
    
    def get_all_bookings(self):
        return Booking.objects.select_related('user', 'agency', 'package').all().order_by('-created_at')
    
    def get_by_id_for_update(self, pk):
        try:
            return Booking.objects.select_for_update().select_related("user", "package", "agency").get(pk=pk)
        except Booking.DoesNotExist:
            return None
    