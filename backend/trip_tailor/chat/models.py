from django.db import models
from django.conf import settings

# Create your models here.

class ChatSession(models.Model):
    package = models.ForeignKey("packages.Package", on_delete=models.CASCADE, related_name="chat_sesssions")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chat_sessions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("package", "user") #one chat per user per package
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Chat: {self.user} <-> {self.package.title}"
    
class Message(models.Model):
    chat_session = models.ForeignKey("chat.ChatSession", on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"