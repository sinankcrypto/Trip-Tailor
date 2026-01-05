from recommendations.models import PackageInterest

class PackageInterestRepository:

    def get_by_package(self, package):
        return PackageInterest.objects.filter(package=package).select_related("interest")