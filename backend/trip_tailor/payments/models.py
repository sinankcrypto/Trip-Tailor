from django.db import models
from django.conf import settings

# Create your models here.

class Transaction(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    booking = models.ForeignKey("bookings.Booking", on_delete=models.CASCADE, related_name="transactions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="transactions")
    agency = models.ForeignKey("agency_app.AgencyProfile", null=True, on_delete=models.SET_NULL, related_name="transactions")

    stripe_session_id = models.CharField(max_length=255, unique=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)

    amount = models.IntegerField()
    platform_fee = models.IntegerField(default=0)
    currency = models.CharField(max_length=10, default="inr")

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.id} | {self.status}"
    
    