from packages.models import Package, PackageImage
from users.infra.services.cloudinary_service import CloudinaryService

from django.shortcuts import get_object_or_404

class PackageRepository:
    def create_package(self, agency, data:dict, images: list = None):
        if Package.objects.filter(agency = agency, title = data["title"], is_deleted = False).exists():
            raise ValueError("You already have a package with this title.")
        
        package = Package.objects.create(
            agency = agency,
            title = data["title"],
            price = data["price"],
            duration = data["duration"],
            description = data.get("description", ""),
            main_image = CloudinaryService.upload_image(data["main_image"])
            if data.get("main_image") else None,
        )

        if images:
            for img in images:
                PackageImage.objects.create(
                    package = package, image_url = CloudinaryService.upload_image(img)
                )

        return package
    
    def update_package(self, package: Package, data: dict, images: list = None):
        package.title = data.get("title", package.title)
        package.price = data.get("price", package.price)
        package.duration = data.get("duration", package.duration)
        package.description = data.get("description", package.description)

        if data.get("main_image"):
            package.main_image = CloudinaryService.upload_image(data["main_image"])

        package.save()

        if images:
            for img in images:
                PackageImage.objects.create(
                    package = package, image_url = CloudinaryService.upload_image(img)
                )

        return package
    
    def get_all_listed(self):
        return Package.objects.filter(is_listed = True, is_deleted = False)
    
    def get_by_id(self,pk):
        return Package.objects.get(pk = pk)
    
    def get_by_agency(self, agency):
        return Package.objects.filter(agency = agency, is_deleted = False)
    
    def toggle_listing(self, package: Package):
        package.is_listed = not package.is_listed
        package.save()
        return package
    
    def soft_delete(self, package: Package):
        package.is_deleted = True
        package.is_listed = False
        package.save()

        return package
    
    def get_all(self):
        return Package.objects.all().select_related("agency")