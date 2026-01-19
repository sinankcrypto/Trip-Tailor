import random
from datetime import timedelta
from django.utils import timezone
from user_auth.repository.emailOTP_repository import EmailOTPRepository


def generate_otp(length: int = 6):
    return ''.join([str(random.randint(0,9)) for _ in range(length)])

def create_otp_for_email(email: str, validity_minutes: int = 10):
    otp = generate_otp()

    return EmailOTPRepository.create(email, otp, validity_minutes)

def can_resend_otp(email: str, max_attempts: int = 3, cooldown_seconds: int = 30) -> tuple[bool, str]:
    otp_obj = EmailOTPRepository.get_latest_by_email(email)
    if not otp_obj:
        return True, "allowed"

    now = timezone.now()

    # 1. Cooldown check
    time_since_creation = now - otp_obj.created_at
    if time_since_creation < timedelta(seconds=cooldown_seconds):
        remaining = int(cooldown_seconds - time_since_creation.total_seconds())
        return False, f"Please wait {remaining} second{'s' if remaining != 1 else ''} before retrying."

    # 2. Max attempts check
    if otp_obj.resend_attempts >= max_attempts:
        return False, "Maximum resend attempts reached."

    return True, "allowed"