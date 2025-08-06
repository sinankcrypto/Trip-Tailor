from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..domain.models import AgencyProfile
from ..repository.agency_repository import AgencyRepository
from .serializer import AgencyProfileSerializer
from rest_framework import status

# Create your views here.

class AgencyProfileStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not hasattr(user, 'agency_profile'):
            return Response({
                'profile_exists': False,
                'is_verified': False,
                'message': 'profile not created'
            })
        
        profile = user.agency_profile

        required_fields = [profile.agency_name, profile.address, profile.phone_number, profile.license_document]

        is_complete = all(required_fields)

        return Response({
            'profile_exists': True,
            'is_verified': profile.verified,
            'is_complete': is_complete
        })


class AgencyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = AgencyRepository.get_profile(request.user)
        serializer = AgencyProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request):
        print("put working")
        profile = AgencyRepository.get_profile(request.user)
        serializer = AgencyProfileSerializer(profile, data= request.data, partial= True)

        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data)
        return Response(serializer.errors, status=400)  
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        # Clear both access and refresh tokens from cookies
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response