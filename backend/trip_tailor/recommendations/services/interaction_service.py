from django.utils import timezone
from datetime import timedelta
from django.conf import settings

from recommendations.repository.interaction_repository import InteractionRepository

def track_interaction(user, action, package=None):
    window_minutes = settings.INTERACTION_DEDUP_WINDOW_MINUTES
    since = timezone.now() - timedelta(minutes=window_minutes)

    if InteractionRepository.exists_recent(user, action, package, since):
        return None
    
    return InteractionRepository.create(
        user=user,
        action=action,
        package=package
    )