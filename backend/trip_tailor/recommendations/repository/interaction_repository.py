from recommendations.models import UserInteraction
from core.constants import ActionChoices
from datetime import timedelta
from django.utils import timezone

class InteractionRepository:
    def create(self, user, action, package=None, metadata=None):
        return UserInteraction.objects.create(
            user=user,
            action=action,
            package=package,
            metadata=metadata
        )
    
    def recent_by_user(self, user, limit=50):
        return UserInteraction.objects.filter(
            user=user
        ).order_by("-created_at")[:limit]
    
    def has_booked(self, user, package):
        return UserInteraction.objects.filter(
            user=user,
            package=package,
            action=ActionChoices.BOOK
        ).exists()

    def create_view_if_needed(self, user, package, window_minutes=15):
        since = timezone.now() - timedelta(minutes=window_minutes)

        exists = UserInteraction.objects.filter(
            user=user,
            package=package,
            action=ActionChoices.VIEW,
            created_at__gte=since
        ).exists()

        if not exists:
            return UserInteraction.objects.create(
                user=user,
                package=package,
                action=ActionChoices.VIEW
            )
        
        return None