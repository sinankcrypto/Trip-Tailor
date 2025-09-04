from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from users.application.services.profile_service import ProfileService
from users.interface.serializers import UserProfileSerializer
from users.infra.repositories.django_profile_repository import DjangoProfileRepository

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        serializer = UserProfileSerializer(data = request.data)
        if serializer.is_valid():
            repo = DjangoProfileRepository()
            service = ProfileService(repo)

            entity = service.create_profile(
                user_id = request.user.id,
                profile_data = serializer.validated_data
            )

            return Response(UserProfileSerializer(entity).data, status= status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        repo = DjangoProfileRepository()
        service = ProfileService(repo)

        entity = service.get_profile_by_user_id(request.user.id)

        if entity:
            return Response(UserProfileSerializer(entity).data, status= status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        profile = self.service.update_profile(request.user, request.data)
        return Response({"message": "Profile updated"})