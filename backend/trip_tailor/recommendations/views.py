from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RecommendedPackageSerializer, InterestSerializer, UserInterestCreateSerializer, UserInterestSerializer
from rest_framework.permissions import IsAuthenticated
from core.pagination import StandardResultsSetPagination
from .services.recommendation_service import RecommendationService
from .repository.interest_repository import InterestRepository
from .repository.user_interest_repository import UserInterestRepository

# Create your views here.

class RecommendedPackagesView(generics.ListAPIView):
    serializer_class = RecommendedPackageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return RecommendationService.get_recommended_packages(
            user=self.request.user
        )
    
class InterestListView(generics.ListAPIView):
    serializer_class = InterestSerializer

    def get_queryset(self):
        return InterestRepository.get_all()
    
class UserInterestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserInterestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        UserInterestRepository.set_user_interests(
            user=request.user,
            interest_ids=serializer.validated_data["interest_ids"]
        )

        return Response(
            {"detail": "Interests saved succesfully"},
            status=status.HTTP_201_CREATED         
        )
    
    def get(self, request):
        user = request.user

        try:
            interests = UserInterestRepository.get_by_user(user)
        except Exception as e:
            return Response({"detail":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(UserInterestSerializer(interests, many=True).data, status=status.HTTP_200_OK)
