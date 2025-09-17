from django.db import IntegrityError

from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

from .serializers import PackageSerializer
from .repositories.package_repository import PackageRepository



# Create your views here.

package_repo = PackageRepository()

class PackageCreateView(generics.CreateAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            package = package_repo.create_package(
                agency = self.request.user.agency_profile,  
                data = serializer.validated_data,
                images = self.request.FILES.getlist("images")
            )
            serializer.instance = package
        except ValueError as e:
            raise ValidationError({"error": str(e)})
    
class PackageUpdateView(generics.UpdateAPIView):
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return package_repo.get_all()
    
    def perform_update(self, serializer):
        package = self.get_object()
        package_repo.update_package(
            package,
            serializer.validated_data,
            images = self.request.FILES.getlist("images")
        )

        serializer.instance = package

class AgencyPackageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            packages = package_repo.get_by_agency(request.user.agency_profile)

            serializer = PackageSerializer(packages, many = True)
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail":str(e)}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PackageToggleListView(APIView):
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
        return package_repo.get_all()
    
# User Side

class PackageListView(APIView):
    def get(self, request):
        packages = package_repo.get_all()
        serializer = PackageSerializer(packages, many=True)

        return Response(serializer.data, status= status.HTTP_200_OK)
    
