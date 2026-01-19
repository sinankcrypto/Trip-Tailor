from recommendations.models import PackageInterest
from packages.models import Package
from django.db.models import Count, Q

class PackageInterestRepository:

    @staticmethod
    def get_by_package(package):
        return PackageInterest.objects.filter(package=package).select_related("interest")
    
    @staticmethod
    def set_package_interests(package, interest_ids):
        """
        Replace all interests of a package
        """
        PackageInterest.objects.filter(package=package).delete()

        relations = [
            PackageInterest(
                package=package,
                interest_id=interest_id
            )
            for interest_id in interest_ids
        ] 
        return PackageInterest.objects.bulk_create(relations)
    
    @staticmethod
    def add_package_interests(package, interest_ids):
        existing_ids = set(
            PackageInterest.objects.filter(
                package=package,
                interest_id__in=interest_ids
            ).values_list("interest_id", flat=True)
        )

        relations = [
            PackageInterest(
                package=package,
                interest_id=interest_id
            )
            for interest_id in interest_ids
            if interest_id not in existing_ids
        ]

        return PackageInterest.objects.bulk_create(relations)
    
    @staticmethod
    def get_packages_matching_interests(interest_ids):
        return (
            Package.objects
            .filter(
                package_interests__interest_id__in=interest_ids,
                is_listed=True,
                is_deleted=False
            )
            .annotate(
                interest_match_count=Count(
                    "package_interests",
                    filter=Q(package_interests__interest_id__in=interest_ids),
                    distinct=True
                )
            )
            .distinct()
        )
        