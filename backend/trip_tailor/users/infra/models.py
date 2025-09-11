from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    place = models.CharField(max_length=200, blank=True, null=True)
    profile_pic = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=15,null=True, blank= True)

    def __str__(self):
        return f"{self.user.username} Profile"