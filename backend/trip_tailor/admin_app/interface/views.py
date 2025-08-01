from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_app.interface.serializers import AdminLoginSerializer
from user_auth.repository.user_repository import UserRepository
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from user_auth.domain.models import CustomUser
from user_auth.interface.views import CustomUserSerializer


# Create your views here.

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = AdminLoginSerializer(data = request.data)
        print("post working")

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = UserRepository.authenticate_user(username, password)

            if user and user.is_superuser:
                refresh = RefreshToken.for_user(user)
                response = Response({'message' : 'Login succesful'})
                access_token = str(refresh.access_token)
                response.set_cookie(
                    key= 'access_token',
                    value= access_token,
                    httponly= True,
                    secure= False,
                    samesite= 'Lax',
                    max_age= 3600,
                )
                print("login success and cookie set")
                return response
            else:
                return Response({'detail': 'Invalid credentials or not admin'}, status= status.HTTP_401_UNAUTHORIZED)
            
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        print("get request working")
        return Response({
            'username': request.user.username,
            'email': request.user.email
        })

class AdminLogoutView(APIView):
    def post(self, request):
        response = Response({'message': 'Logged out'})
        response.delete_cookie('access_token')
        return response
    
class UserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.filter(is_superuser= False)
        serializer = CustomUserSerializer(users, many = True)

        return Response(serializer.data)