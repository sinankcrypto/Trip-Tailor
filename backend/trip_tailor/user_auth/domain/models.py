from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

# Create your models here.

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    is_deleted = models.BooleanField(default=False)
    notification_status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_agency = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
class EmailOTP(models.Model):
    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=6)
    expires_at = models.DateTimeField(db_index=True)
    resend_attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def is_expired(self):
        return timezone.now()> self.expires_at
    
    def __str__(self):
        return f"OTP for {self.email} - {self.otp}"