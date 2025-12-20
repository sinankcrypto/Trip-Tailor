from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL

class Review(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    booking = models.OneToOneField(
        "bookings.Booking",
        on_delete=models.CASCADE,
        related_name="review"
    )

    package = models.ForeignKey(
        "packages.Package",
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    agency = models.ForeignKey(
        "agency_app.AgencyProfile",
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["package"]),
            models.Index(fields=["agency"]),
        ]
        constraints = [
        models.CheckConstraint(
            condition=models.Q(rating__gte=1, rating__lte=5),
            name="rating_between_1_and_5",
        ),
        models.UniqueConstraint(
            fields=["booking"],
            name="unique_review_per_booking"
        )
        ]

    def __str__(self):
        return f"{self.rating}★ - {self.user}"