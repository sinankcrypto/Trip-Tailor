from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_app.interface.serializers import AdminLoginSerializer
from user_auth.repository.user_repository import UserRepository
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from user_auth.domain.models import CustomUser
from user_auth.interface.views import CustomUserSerializer
from agency_app.repository.agency_repository import AgencyRepository


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
    
class UserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.filter(is_superuser= False, is_agency=False)
        serializer = CustomUserSerializer(users, many = True)

        return Response(serializer.data)
    
class AgencyListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        agencies = AgencyRepository.get_all_agencies_with_profiles()
        serializer = CustomUserSerializer(agencies, many= True)

        return Response(serializer.data)
    
class AgencyDetailsView(APIView):
    permission_classes= [IsAdminUser]
    
    def get(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk, is_agency=True)
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
                'profile_pic': request.build_absolute_uri(profile.profile_pic.url),
                'license_document': request.build_absolute_uri(profile.license_document.url),
                'address': profile.address,
                'description': profile.description,
                'is_verified': profile.verified
            })

            return Response(data)
        
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=404)
        
class AgencyVerifyView(APIView):
    permission_classes= [IsAdminUser]

    def post(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk, is_agency=True)
            profile = user.agency_profile

            if not profile:
                return Response({'detail': 'Agency profile not found'}, status=status.HTTP_404_NOT_FOUND)

            if profile.verified:
                return Response({'detail': 'Agency already verified'}, status=status.HTTP_400_BAD_REQUEST)
            
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

            profile.verified = True
            profile.save()

            return Response({'message': 'Agency successfully verified'}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'detail': 'Agency not found'}, status=status.HTTP_404_NOT_FOUND)