from rest_framework import viewsets, permissions, serializers
from rest_framework.serializers import ValidationError
from .serializers import ReviewSerializer
from .repository.review_repository import ReviewRepository
from rest_framework.exceptions import PermissionDenied
from core.pagination import ReviewPagination

# Create your views here.   

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    http_method_names = ["get", "post"]
    pagination_class = ReviewPagination

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        package_id = self.request.query_params.get("package_id")
        agency_id = self.request.query_params.get("agency_id")

        if package_id:
            return ReviewRepository.filter_by_package(package_id)

        if agency_id:
            return ReviewRepository.filter_by_agency(agency_id)

        return ReviewRepository.get_all()

    def perform_create(self, serializer):
        booking = serializer.validated_data.get("booking")
        
        if booking.user != self.request.user:
            raise PermissionDenied("You cannot review this booking.")
        
        if hasattr(booking, "review"):
            raise ValidationError("You have already reviewed this booking.")

        serializer.save(user=self.request.user)