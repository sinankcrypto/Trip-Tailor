from celery import shared_task
from core.utils.email_utils import (send_otp_email, send_booking_confirmation_email, 
            send_refund_failed_email, send_refund_success_email, send_refund_initiated_email,
            send_agency_booking_notification_email, send_booking_cancellation_email,
            send_agency_booking_cancellation_email)
from bookings.models import Booking
import logging

logger = logging.Logger(__name__)

@shared_task(bind=True, max_retries=3)
def send_otp_email_task(self, email: str, otp: str):
    try:
        send_otp_email(email, otp)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=5)

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

@shared_task(bind=True, max_retries=3)
def send_agency_booking_notification_email_task(self, booking_id):
    try:
        booking = Booking.objects.select_related('agency', 'package').get(id=booking_id)
        send_agency_booking_notification_email(booking)
        logging.info("Booking notification email succesfully sent to agency")
    except Exception as e:
        self.retry(exc=e, countdown=30)

@shared_task(bind=True, max_retries=3)
def send_booking_cancellation_email_task(self, booking_id, reason):
    try:
        booking = Booking.objects.select_related('user', 'package').get(id=booking_id)
        send_booking_cancellation_email(booking, reason)
    except Exception as e:
        self.retry(exc=e, countdown=30)

@shared_task(bind=True, max_retries=3)
def send_agency_booking_cancellation_notification_email_task(self, booking_id, reason):
    try:
        booking = Booking.objects.select_related('agency', 'package').get(id=booking_id)
        send_agency_booking_cancellation_email(booking, reason)
        logging.info("Booking notification email succesfully sent to agency")
    except Exception as e:
        self.retry(exc=e, countdown=30)