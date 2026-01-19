from recommendations.models import UserInteraction
from core.constants import ActionChoices
from datetime import timedelta
from django.utils import timezone
from packages.models import Package
from django.db.models import Q, Count

class InteractionRepository:

    @staticmethod
    def exists_recent(user, action, package, since):
        return UserInteraction.objects.filter(
            user=user,
            action=action,
            package=package,
            created_at__gte=since
        ).exists()
    
    @staticmethod
    def create(user, action, package=None, metadata=None):
        return UserInteraction.objects.create(
            user=user,
            action=action,
            package=package,
            metadata=metadata or {}
        )
        return None
    
    @staticmethod
    def recent_by_user(user, limit=50):
        return UserInteraction.objects.filter(
            user=user
        ).order_by("-created_at")[:limit]
    
    @staticmethod
    def has_booked(user, package):
        return UserInteraction.objects.filter(
            user=user,
            package=package,
            action=ActionChoices.BOOK
        ).exists()
    
    @staticmethod
    def get_popularity_data(days=14):
        since = timezone.now() - timedelta(days=days)

        return (
            Package.objects
            .filter(is_listed=True, is_deleted=False)
            .annotate(
                view_count=Count(
                    "user_interaction",
                    filter=Q(
                        user_interaction__action=ActionChoices.VIEW,
                        user_interaction__created_at__gte=since,
                    ),
                ),
                book_count=Count(
                    "user_interaction",
                    filter=Q(
                        user_interaction__action=ActionChoices.BOOK,
                        user_interaction__created_at__gte=since,
                    ),
                ),
            )
        )

    @staticmethod
    def get_booked_package_ids(user):
        return (
            UserInteraction.objects
            .filter(user=user, action=ActionChoices.BOOK)
            .values_list("package_id", flat=True)
        )