from rest_framework import viewsets, permissions  
from .serializers import ReviewSerializer
from .repository.review_repository import ReviewRepository
from rest_framework.exceptions import PermissionDenied

# Create your views here.   

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post"]

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

        ReviewRepository.create_review(
            user=self.request.user,
            booking=booking,
            rating=serializer.validated_data.get("rating"),
            comment=serializer.validated_data.get("comment")
        )