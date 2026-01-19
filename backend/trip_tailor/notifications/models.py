from django.db import models
from django.conf import settings

# Create your models here.

class Notification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    message = models.TextField()
    chat_session = models.ForeignKey("chat.ChatSession", null=True, blank=True, on_delete=models.SET_NULL)
    is_read = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient} - {self.title}"