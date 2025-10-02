from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from agency_app.models import AgencyProfile
from .repository.agency_repository import AgencyRepository
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
                'status': None,
                'message': 'Profile not created'
            })
        
        profile = user.agency_profile

        required_fields = [profile.agency_name, profile.address, profile.phone_number, profile.license_document]

        is_complete = all(required_fields)



        response_data = {
            'profile_exists': True,
            'status': profile.status,
            'is_complete': is_complete,
            'is_verified': profile.status == profile.Status.VERIFIED
        }

        if profile.status == profile.Status.REJECTED:
            response_data['rejection_reason'] = profile.rejection_reason
        
        return Response(response_data)


class AgencyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = AgencyRepository.get_profile(request.user)
        serializer = AgencyProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request):
        profile = AgencyRepository.get_profile(request.user)
        serializer = AgencyProfileSerializer(profile, data= request.data, partial= True)

        if serializer.is_valid():
            serializer.save() 

            profile.status = AgencyProfile.Status.PENDING
            profile.save(update_fields=['status'])

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