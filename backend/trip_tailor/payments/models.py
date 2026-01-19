from django.db import models
from django.db.models import Q
from django.conf import settings

from core.constants import RefundStatus

# Create your models here.

class Transaction(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded","Refunded"
        PARTIALLY_REFUNDED = "partially_refunded","Paritally_refunded"

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

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="transaction_amount_positive",
                condition=Q(amount__gt=0)
            )
        ]

    def __str__(self):
        return f"Transaction {self.id} | {self.status}"
    
    @property
    def total_refunded(self):
        """Return total refunded amount in paise."""
        return self.refunds.aggregate(total=models.Sum('amount'))["total"] or 0
        
    
    def refundable_amount(self):
        """Return amount still refundable in paise"""
        total_paid_paise = int(self.amount*100  )
        return max(total_paid_paise-self.total_refunded, 0)

class Refund(models.Model):
    transaction = models.ForeignKey("payments.Transaction", on_delete=models.CASCADE, related_name="refunds")
    stripe_refund_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    amount = models.IntegerField(help_text="Amount refunded (in paise)")
    currency = models.CharField(max_length=10, default="inr")
    reason = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=RefundStatus.choices(), default=RefundStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                name="refund_amount_positive",
                condition=Q(amount__gt=0)
            )
        ]
        
    def __str__(self):
        return f"Refund {self.id} | {self.status} | {self.amount} {self.currency}"
    