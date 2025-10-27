from django.db import models
from django.conf import settings

# Create your models here.



class Transaction(models.Model):
    booking_id = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="tansactions")
    agency = models.ForeignKey("agency_app.AgencyProfile", null=True, on_delete=models.SET_NULL, related_name="transactions")

    stripe_session_id = models.CharField(max_length=255, unique=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)

    amount = models.IntegerField()
    platform_fee = models.IntegerField(default=0)
    currency = models.CharField(max_length=10, default="inr")

    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.id} | {self.status}"
    
    