from django.db import models
from django.db.models import Q
from django.conf import settings
from django.utils import timezone

from core.constants import BookingStatus, PaymentMethod, PaymentStatus


class Booking(models.Model):
    
    package = models.ForeignKey("packages.Package", on_delete=models.CASCADE, related_name="bookings")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    agency = models.ForeignKey("agency_app.AgencyProfile", on_delete=models.CASCADE, related_name="agency_bookings")

    no_of_members = models.PositiveIntegerField()
    no_of_adults = models.PositiveIntegerField(null=True, blank=True)
    no_of_kids = models.PositiveIntegerField(null=True, blank=True)
    
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # computed server-side
    date = models.DateField() 

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices(),
        default=PaymentMethod.ON_HAND,
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices(),
        default=PaymentStatus.PENDING,
    )
    booking_status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices(),
        default=BookingStatus.ACTIVE,
    )

    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(null=True,blank=True)
    cancelled_by = models.CharField(
        max_length=20,
        choices=[
            ("user","User"),
            ("agency","Agency"),
            ("admin","Admin"),
        ],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="booking_amount_positive",
                condition=Q(amount__gt=0)
            )
        ]


    def __str__(self):
        return f"Booking #{self.pk} - {self.package} for {self.user}"
