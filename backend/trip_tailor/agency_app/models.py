from django.db import models
from user_auth.domain.models import CustomUser

class AgencyProfile(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        VERIFIED = "verified", "Verified"
        REJECTED = "rejected", "Rejected"

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='agency_profile')
    agency_name = models.CharField(max_length=255)
    address = models.TextField()
    phone_number = models.CharField(max_length=15)
    profile_pic = models.ImageField(upload_to='agency/profile_pics/')
    license_document = models.ImageField(upload_to='agency/licenses/')
    description = models.TextField()
    stripe_account_id = models.CharField(max_length=255, blank=True, null=True)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    rejection_reason = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True, null= True)
