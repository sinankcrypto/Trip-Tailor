from reviews.models import Review
from django.db.models import Avg, Count

class ReviewRepository:

    @staticmethod
    def base_queryset():
        return Review.objects.select_related(
            "booking",
            "booking__user",
            "booking__package",
            "booking__agency",
        )

    @staticmethod
    def get_all():
        return ReviewRepository.base_queryset()

    @staticmethod
    def filter_by_package(package_id):
        return ReviewRepository.base_queryset().filter(
            booking__package_id=package_id
        )

    @staticmethod
    def filter_by_agency(agency_id):
        return ReviewRepository.base_queryset().filter(
            booking__agency_id=agency_id
        )

    @staticmethod
    def create_review(*, user, booking, rating, comment):
        return Review.objects.create(
            user=user,
            booking=booking,
            package=booking.package,
            agency=booking.agency,
            rating=rating,
            comment=comment
        )

    @staticmethod
    def get_package_rating_stats(package_id):
        """
        Returns average rating and total review count for a package
        """
        return Review.objects.filter(
            booking__package_id=package_id
        ).aggregate(
            average_rating=Avg("rating"),
            total_reviews=Count("id")
        )
    
    @staticmethod
    def get_ratings_for_packages(package_ids):
        return (
            Review.objects
            .filter(booking__package_id__in=package_ids)
            .values("booking__package_id")
            .annotate(
                average_rating=Avg("rating"),
                total_reviews=Count("id")
            )
        )