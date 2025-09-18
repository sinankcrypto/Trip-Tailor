from django.db import models
from django.conf import settings
from django.utils import timezone


class Booking(models.Model):
    # ---- Payment ----
    PAYMENT_METHOD_ON_HAND = "ON_HAND"
    PAYMENT_METHOD_ONLINE = "ONLINE"
    PAYMENT_METHOD_CHOICES = [
        (PAYMENT_METHOD_ON_HAND, "On hand"),
        (PAYMENT_METHOD_ONLINE, "Online"),
    ]

    PAYMENT_PENDING = "PENDING"
    PAYMENT_PAID = "PAID"
    PAYMENT_FAILED = "FAILED"
    PAYMENT_REFUNDED = "REFUNDED"
    PAYMENT_STATUS_CHOICES = [
        (PAYMENT_PENDING, "Pending"),
        (PAYMENT_PAID, "Paid"),
        (PAYMENT_FAILED, "Failed"),
        (PAYMENT_REFUNDED, "Refunded"),
    ]

    # ---- Booking Lifecycle ----
    BOOKING_ACTIVE = "ACTIVE"
    BOOKING_CANCELLED = "CANCELLED"
    BOOKING_COMPLETED = "COMPLETED"
    BOOKING_STATUS_CHOICES = [
        (BOOKING_ACTIVE, "Active"),
        (BOOKING_CANCELLED, "Cancelled"),
        (BOOKING_COMPLETED, "Completed"),
    ]

    package = models.ForeignKey("packages.Package", on_delete=models.CASCADE, related_name="bookings")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    agency = models.ForeignKey("agency_app.AgencyProfile", on_delete=models.CASCADE, related_name="agency_bookings")

    no_of_members = models.PositiveIntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # computed server-side
    date = models.DateField() 

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default=PAYMENT_METHOD_ON_HAND)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default=PAYMENT_PENDING)

    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default=BOOKING_ACTIVE)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ---- Helpers ----
    def cancel(self):
        """Cancel a booking and set timestamp."""
        self.booking_status = self.BOOKING_CANCELLED
        self.cancelled_at = timezone.now()
        self.save()

    def __str__(self):
        return f"Booking #{self.pk} - {self.package} for {self.user}"
