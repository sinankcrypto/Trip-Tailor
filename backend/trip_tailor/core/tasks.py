from celery import shared_task
from core.utils.email_utils import (send_otp_email, send_booking_confirmation_email, 
                                    send_refund_failed_email, send_refund_success_email, send_refund_initiated_email)
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

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=30, retry_kwargs={"max_retries": 3})
def send_refund_success_email_task(
    self, *,
    user_email,
    user_name,
    package_name,
    amount,
):
    send_refund_success_email(
        user_email=user_email,
        user_name=user_name,
        package_name=package_name,
        amount=amount,
    )


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=30, retry_kwargs={"max_retries": 3})
def send_refund_failed_email_task(
    self, *,
    user_email,
    user_name,
    package_name,
    amount,
):
    send_refund_failed_email(
        user_email=user_email,
        user_name=user_name,
        package_name=package_name,
        amount=amount,
    )

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=30, retry_kwargs={"max_retries": 3})
def send_refund_initiated_email_task(
    self, *,
    user_email,
    user_name,
    package_name,
    amount,
):
    send_refund_initiated_email(
        user_email=user_email,
        user_name=user_name,
        package_name=package_name,
        amount=amount,
    )