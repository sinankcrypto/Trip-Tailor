from recommendations.repository.interaction_repository import InteractionRepository
from recommendations.repository.user_interest_repository import UserInterestRepository
from recommendations.repository.package_interest_repository import PackageInterestRepository
from django.db.models import F, Count, Q
from django.utils import timezone
from django.contrib.postgres.aggregates import ArrayAgg
from datetime import timedelta

class RecommendationService:

    VIEW_WEIGHT = 1
    BOOK_WEIGHT = 5
    INTEREST_WEIGHT = 3

    @classmethod
    def get_popular_packages(cls, days=14, limit=10):
        qs = InteractionRepository.get_popularity_data(days=days)

        scored = (
            qs.annotate(
                popularity_score=(
                    cls.VIEW_WEIGHT * F("view_count") + cls.BOOK_WEIGHT  * F("book_count")
                )
            ).order_by("-popularity_score", "-created_at")
        )

        return scored[:limit]
    
    @classmethod
    def get_recommended_packages(cls, user, days=14, limit=10):
        since = timezone.now() - timedelta(days)

        interest_ids = UserInterestRepository.get_user_interest_ids(user)

        if not interest_ids:
            return cls.get_popular_packages(days, limit)
        
        qs = PackageInterestRepository.get_packages_matching_interests(interest_ids)

        qs = qs.annotate(
            view_count=Count(
                "user_interaction",
                filter=Q(
                    user_interaction__action="VIEW",
                    user_interaction__created_at__gte=since
                ),
            ),
            book_count=Count(
                "user_interaction",
                filter=Q(
                    user_interaction__action="BOOK",
                    user_interaction__created_at__gte=since
                ),
                
            ),
        )
        booked_ids = InteractionRepository.get_booked_package_ids(user)

        qs = qs.exclude(id__in=booked_ids)

        qs = qs.annotate(
            recommended_score=(
                cls.INTEREST_WEIGHT * F("interest_match_count")+
                cls.VIEW_WEIGHT * F("view_count")+
                cls.BOOK_WEIGHT * F("book_count")
            ),
            matched_interests=ArrayAgg(
                "package_interests__interest__name",
                distinct=True
            )
        ).order_by("-recommended_score", "-created_at")

        return qs[:limit]