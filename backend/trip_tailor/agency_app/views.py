from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from agency_app.models import AgencyProfile
from .repository.agency_repository import AgencyRepository
from .serializer import AgencyProfileSerializer, AgencyDashboardMetricsSerializer
from rest_framework import status
from .permissions import IsVerifiedAgency
from bookings.repositories.booking_repository import BookingRepository
from payments.repository.payment_repository import PaymentRepository
from core.exceptions import ImageUploadError

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

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        try:
            updated_profile = AgencyRepository.update_profile(
                user=request.user,
                data=serializer.validated_data,
                files=request.FILES
            )
        except ImageUploadError:
            raise ValidationError({"image":"Image upload failed. Please try again."})
        
        return Response(
            AgencyProfileSerializer(updated_profile).data,
            status=200
        )
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        # Clear both access and refresh tokens from cookies
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response
    
class AgencyDashboardMetricsView(APIView):
    permission_classes = [IsVerifiedAgency]

    def get(self, request):
        agency = request.user.agency_profile
        qs = {
            "total_bookings":BookingRepository.count_of_bookings_for_agency(agency),
            "total_earnings":PaymentRepository.total_earning_for_agency(agency)["total_earning"],
            "today_bookings":BookingRepository.count_of_booking_of_the_day_for_agency(agency),
            "weekly_data":BookingRepository.weekly_bookings_current_week(agency)
        }
        response = AgencyDashboardMetricsSerializer(qs)

        return Response(response.data)