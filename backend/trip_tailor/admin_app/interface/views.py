from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_app.interface.serializers import AdminLoginSerializer
from user_auth.repository.user_repository import UserRepository
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class AdminLoginView(APIView):
    def post(self, request):
        print("Reached AdminLoginView")
        serializer = AdminLoginSerializer(data = request.data)
        print("after serializer")

        if serializer.is_valid():
            print("serializer is valid")
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = UserRepository.authenticate_user(username, password)
            print(f"user: {user}")

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
                print("everything working")
                return response
            else:
                print("no user")
                return Response({'detail': 'Invalid credentials or not admin'}, status= status.HTTP_401_UNAUTHORIZED)
        else:
            print('serializer is not valid')
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        print("get request working")
        return Response({
            'username': request.user.username,
            'email': request.user.email
        })