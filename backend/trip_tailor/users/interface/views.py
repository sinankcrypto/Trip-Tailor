from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from users.application.services.profile_service import ProfileService
from users.interface.serializers import UserProfileSerializer
from users.infra.repositories.django_profile_repository import DjangoProfileRepository
from users.domain.exceptions import ProfileNotFoundError

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self,request):
        serializer = UserProfileSerializer(data = request.data)
        if serializer.is_valid():
            repo = DjangoProfileRepository()
            service = ProfileService(repo)

            entity = service.create_profile(
                user = request.user,
                data = serializer.validated_data
            )

            return Response(UserProfileSerializer(entity).data, status= status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        repo = DjangoProfileRepository()
        service = ProfileService(repo)

        try:
            entity = service.get_profile_by_user_id(request.user.id)
        except ProfileNotFoundError as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)

        if entity:
            return Response(UserProfileSerializer(entity).data, status= status.HTTP_200_OK)
    
    def put(self, request):
        repo = DjangoProfileRepository()
        service = ProfileService(repo)

        profile = service.update_profile(request.user, request.data)
        return Response({"message": "Profile updated"})