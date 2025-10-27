from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from admin_app.interface.serializers import AdminLoginSerializer
from user_auth.repository.user_repository import UserRepository
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from user_auth.domain.models import CustomUser
from user_auth.interface.views import CustomUserSerializer
from agency_app.repository.agency_repository import AgencyRepository
from core.pagination import StandardResultsSetPagination

from agency_app.models import AgencyProfile
from payments.repository.payment_repository import PaymentRepository

from django.contrib.auth import get_user_model

User = get_user_model()


# Create your views here.

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = AdminLoginSerializer(data = request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = UserRepository.authenticate_user(username, password)

            if user and user.is_superuser:
                refresh = RefreshToken.for_user(user)
                response = Response({'message' : 'Login succesful'})
                access_token = str(refresh.access_token)
                refresh_token  = str(refresh)
                response.set_cookie(
                    key= 'access_token',
                    value= access_token,
                    httponly= True,
                    secure= False,
                    samesite= 'Lax',
                    max_age= 3600,
                )
                response.set_cookie(
                    key= 'refresh_token',
                    value= refresh_token,
                    httponly= True,
                    secure= False,
                    samesite= 'Lax',
                    max_age= 86400,
                )

                print("login success and cookie set")
                return response
            else:
                return Response({'detail': 'Invalid credentials or not admin'}, status= status.HTTP_401_UNAUTHORIZED)
            
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
class AdminProfileView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        return Response({
            'username': request.user.username,
            'email': request.user.email
        })

class AdminLogoutView(APIView):
    def post(self, request):
        response = Response({'message': 'Logged out'})
        response.delete_cookie(
            key='access_token',
            path='/',
            samesite='Lax',
        )
        response.delete_cookie(
            key='refresh_token',
            path='/',
            samesite='Lax',
        )
        return response
    

class UserListView(generics.ListAPIView):
    queryset = UserRepository.get_all_users()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination
    

class AgencyListView(generics.ListAPIView):
    queryset = AgencyRepository.get_all_agencies_with_profiles()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination
    
class AgencyDetailsView(APIView):
    permission_classes= [IsAdminUser]
    
    def get(self, request, pk):
        try:
            user = AgencyRepository.get_agency_by_id(pk=pk)
            profile = user.agency_profile

            data = CustomUserSerializer(user).data
            data.update({
                'profile_completed': all([
                    profile.agency_name,
                    profile.profile_pic,
                    profile.address,
                    profile.phone_number,
                    profile.license_document,
                    profile.description,
                ]),
                'agency_name': profile.agency_name,
                'phone_number': profile.phone_number,
                'profile_pic': request.build_absolute_uri(profile.profile_pic.url) if profile.profile_pic else None,
                'license_document':(
                    request.build_absolute_uri(profile.license_document.url) if profile.profile_pic else None
                ), 
                'address': profile.address,
                'description': profile.description,
                'status': profile.status,
                'rejection_reason': profile.rejection_reason,
            })

            return Response(data)
        
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=404)
        
        
class AgencyVerifyView(APIView):
    permission_classes= [IsAdminUser]

    def post(self, request, pk):
        try:
            user = AgencyRepository.get_agency_by_id(pk=pk)
            profile = user.agency_profile

            if not profile:
                return Response({'detail': 'Agency profile not found'}, status=status.HTTP_404_NOT_FOUND)

            if profile.status == AgencyProfile.Status.VERIFIED:
                return Response({'detail': 'Agency already verified'}, status=status.HTTP_400_BAD_REQUEST)
            if profile.status == AgencyProfile.Status.REJECTED:
                return Response({'detail': 'Agency already rejected'}, status=status.HTTP_400_BAD_REQUEST)
            
            required_fields = [
                profile.agency_name,
                profile.profile_pic,
                profile.address,
                profile.phone_number,
                profile.license_document,
                profile.description,
            ]
            if not all(required_fields):
                return Response({'detail': 'Incomplete profile, cannot verify'}, status=status.HTTP_400_BAD_REQUEST)

            profile.status = AgencyProfile.Status.VERIFIED
            profile.rejection_reason = None
            profile.save()

            return Response({'message': 'Agency successfully verified'}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=status.HTTP_404_NOT_FOUND)
        
class AgencyRejectView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = AgencyRepository.get_agency_by_id(pk = pk)
            profile = user.agency_profile

            if profile.status == AgencyProfile.Status.VERIFIED:
                return Response({'detail': 'Cannot reject a verified agency'}, status= status.HTTP_400_BAD_REQUEST)
            
            if profile.status == AgencyProfile.Status.REJECTED:
                return Response({'detail': 'Agency already rejected'}, status=status.HTTP_400_BAD_REQUEST)
            
            reason = request.data.get('reason', '').strip() or None

            profile.status = AgencyProfile.Status.REJECTED
            profile.rejection_reason = reason
            profile.save()

            return Response({'message': 'Agency rejected', 'reason': reason}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=status.HTTP_404_NOT_FOUND)

class PlatformFeeView(APIView):
    def get(self, request):
        fee = PaymentRepository.get_current_fee()
        return Response({
            "percentage":fee
        })