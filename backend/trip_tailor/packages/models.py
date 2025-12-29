from django.db import models
from django.core.validators import MinValueValidator
from django.db.models import Q

from agency_app.models import AgencyProfile

# Create your models here.

class Package(models.Model):
    agency = models.ForeignKey(AgencyProfile, on_delete=models.CASCADE, related_name="packages")
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    duration = models.PositiveIntegerField(help_text="Duration in days")
    main_image = models.URLField()
    description = models.TextField()
    is_listed = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                name="package_price_positive",
                condition=Q(price__gt=0),
            )
        ]

    def __str__(self):
        return self.title
    

class PackageImage(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="images")
    image_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.package.title}"
    
