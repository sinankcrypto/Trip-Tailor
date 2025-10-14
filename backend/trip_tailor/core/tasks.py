from celery import shared_task
from core.utils.email_utils import send_otp_email, send_booking_confirmation_email
from bookings.models import Booking

@shared_task
def send_otp_email_task(email, otp):
    send_otp_email(email, otp)

@shared_task(bind=True, max_retries=3)
def send_booking_confirmation_email_task(self, booking_id):
    try:
        booking = Booking.objects.select_related('user', 'package').get(id=booking_id)
        send_booking_confirmation_email(booking)
    except Exception as e:
        self.retry(exc=e, countdown=30)