from django.db import IntegrityError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

from .serializers import PackageSerializer
from .repositories.package_repository import PackageRepository
from .filters import PackageFilter
from agency_app.permissions import IsVerifiedAgency, IsAdminOrVerifiedAgency
from core.exceptions import ImageUploadError

from core.pagination import StandardResultsSetPagination

# Create your views here.

package_repo = PackageRepository()

class PackageCreateView(generics.CreateAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsVerifiedAgency]

    def perform_create(self, serializer):
        try:
            package = package_repo.create_package(
                agency = self.request.user.agency_profile,  
                data = serializer.validated_data,
                images = self.request.FILES.getlist("images")
            )
            serializer.instance = package
        except ImageUploadError:
            raise ValidationError({
                "image": "Image upload failed. Please try again."
            })
        except ValueError as e:
            raise ValidationError({"error": str(e)})
    
class PackageUpdateView(generics.UpdateAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsVerifiedAgency]

    def get_queryset(self):
        return package_repo.get_all_listed()
    
    def perform_update(self, serializer):
        package = self.get_object()
        
        try:
            images = self.request.FILES.getlist("images")
            existing_image_ids = self.request.data.getlist("existing_image_ids")
            package_repo.update_package(
                package,
                serializer.validated_data,
                images=images,
                existing_image_ids=existing_image_ids, 
            )

            serializer.instance = package
        except ImageUploadError:
            raise ValidationError({"image":"Image upload failed. Please try again."})
        
        except ValueError as e:
            raise ValidationError({"error":str(e)})

class AgencyPackageListView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedAgency]

    def get(self, request):
        try:
            packages = package_repo.get_by_agency(request.user.agency_profile)

            serializer = PackageSerializer(packages, many = True)
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail":str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PackageToggleListView(APIView):
    permission_classes = [IsAdminOrVerifiedAgency]

    def patch(self,request, pk):
        try:
            package = package_repo.get_by_id(pk = pk)
            updated = package_repo.toggle_listing(package)
            return Response(PackageSerializer(updated).data, status= status.HTTP_200_OK)
        except IntegrityError:
            return Response({"detail": "Database error"}, status= status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"detail": str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PackageSoftDeleteView(APIView):
    permission_classes = [IsVerifiedAgency]

    def delete(self, request, pk):
        try:
            package = package_repo.get_by_id(pk = pk)
            package_repo.soft_delete(package)

            return Response({"detail": "Package deleted"}, status= status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class PackageDetailView(generics.RetrieveAPIView):
    serializer_class = PackageSerializer

    def get_queryset(self):
        return package_repo.get_all_listed()
    
# User Side

class PackageListView(generics.ListAPIView):
    queryset = package_repo.get_all_listed()
    serializer_class = PackageSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    filterset_fields = {
        "agency": ["exact"],
        "price": ["gte", "lte"],
    }
    
    ordering_fields = ["price", "created_at"]
    ordering = ["-created_at"]
    search_fields = ["title", "description"]

class LatestPackagesView(generics.ListAPIView):
    serializer_class = PackageSerializer

    def get_queryset(self):
        return package_repo.get_all_listed()[:6]

#Admin side

class AdminPackageListView(generics.ListAPIView):
    queryset = package_repo.get_all()
    serializer_class = PackageSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class =  PackageFilter
    ordering_fields = ["price", "duration", "created_at"]
    ordering = ["-created_at"]
