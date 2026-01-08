from recommendations.models import PackageInterest
from packages.models import Package
from django.db.models import Count

class PackageInterestRepository:

    @staticmethod
    def get_by_package(self, package):
        return PackageInterest.objects.filter(package=package).select_related("interest")
    @staticmethod
    def get_packages_matching_interests(interest_ids):
        return (
            Package.objects
            .filter(
                is_listed=True,
                is_deleted=False,
                package_interests_id__in=interest_ids
            )
            .annotate(
                interest_match_count=Count(
                    "package_interests",
                    distinct=True
                )
            )
        )