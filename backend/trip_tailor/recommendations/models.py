from django.db import models
from django.conf import settings
from core.constants import ActionChoices

User = settings.AUTH_USER_MODEL

# Create your models here.

class UserInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    package = models.ForeignKey("packages.Package", on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ActionChoices.choices())
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "action"]),
            models.Index(fields=["package", "action"]),
            models.Index(fields=["created_at"]),
        ]
    def __str__(self):
        return f"{self.user} - {self.action}"
    
class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_interest_name")
        ]

    def __str__(self):
        return self.name
    
class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_interests")
    interest = models.ForeignKey("recommendations.Interest", on_delete=models.CASCADE, related_name="user_interests")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user","interest")
        indexes = [
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return f"{self.user} -> {self.interest}" 
    
class PackageInterest(models.Model):
    package = models.ForeignKey(
        "packages.Package", 
        on_delete=models.CASCADE, 
        related_name="package_interests"
    )
    interest = models.ForeignKey(
        "recommendations.Interest", 
        on_delete=models.CASCADE, 
        related_name="package_interests"
    )
    
    class Meta:
        unique_together = ("package","interest")
        indexes = [
            models.Index(fields=["interest"]),
            models.Index(fields=["package"]),
        ]

    def __str__(self):
        return f"{self.package} -> {self.interest}"