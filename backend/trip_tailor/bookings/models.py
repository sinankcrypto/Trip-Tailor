from django.db import models
from django.conf import settings

# Create your models here.

class Booking(models.Model):
    PAYMENT_METHOD_ON_HAND = "ON_HAND"
    PAYMENT_METHOD_ONLINE = "ONLINE"
    PAYMENT_METHOD_CHOICES = [
        (PAYMENT_METHOD_ON_HAND, "On hand"),
        (PAYMENT_METHOD_ONLINE, "Online"),
    ]

    STATUS_PENDING = "PENDING"
    STATUS_PAID = "PAID"
    STATUS_CANCELLED = "CANCELLED"
    PAYMENT_STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_PAID, "Paid"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    package = models.ForeignKey("packages.Package", on_delete=models.CASCADE, related_name="bookings")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    agency = models.ForeignKey("agency_app.AgencyProfile", on_delete=models.CASCADE, related_name="agency_bookings")
    no_of_members = models.PositiveIntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, null= True, blank= True)  # final amount computed server-side
    date = models.DateField()  # the date of travel
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default=PAYMENT_METHOD_ON_HAND)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default=STATUS_PENDING)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking #{self.pk} - {self.package} for {self.user}"