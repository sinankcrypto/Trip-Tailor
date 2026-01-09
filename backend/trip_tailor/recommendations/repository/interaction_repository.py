from recommendations.models import UserInteraction
from core.constants import ActionChoices
from datetime import timedelta
from django.utils import timezone
from packages.models import Package
from django.db.models import Q, Count

class InteractionRepository:
    @staticmethod
    def create_view(user, package, window_minutes=15):
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
                        user_interaction__actino=ActionChoices.VIEW,
                        User_interaction__created_at__gte=since,
                    ),
                ),
                book_count=Count(
                    "user_interactinon",
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