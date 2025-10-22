import random
from datetime import timedelta
from django.utils import timezone
from user_auth.models import EmailOTP

def generate_otp():
    return str(random.randint(100000, 999999))

def create_or_update_otp(user):
    otp = generate_otp()
    expiry_time = timezone.now() + timedelta(minutes=5)

    email_otp, created = EmailOTP.objects.update_or_create(
        user=user,
        defaults={
            'otp': otp,
            'expires_at': expiry_time,
            'resend_attempts': 0 
        }
    )
    return email_otp