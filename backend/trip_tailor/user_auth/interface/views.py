from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserLoginSerializer, UserSignupSerializer, OTPVerifySerializer, CustomUserSerializer
from ..repository.user_repository import UserRepository

from django.core.mail import send_mail
from random import randint
from ..domain.models import EmailOTP
from ..domain.models import CustomUser

# Create your views here.

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data = request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = UserRepository.authenticate_user(username, password)

            if user and not user.is_superuser:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                data = CustomUserSerializer(user).data 
                response = Response({
                    'message': 'User Login Successful', 
                    'user' : data
                    })
                response.set_cookie(
                    key= 'access_token',
                    value = access_token,
                    httponly= True,
                    samesite= 'Lax',
                    secure= False,
                    max_age= 3600,
                    path='/user/'
                )

                return response
            
            return Response({'detail': 'Invalid Credentials or not a user'}, status = status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSignupSerializer(data= request.data)

        if serializer.is_valid():
            user = serializer.save()

            otp = f"{randint(100000,999999)}"
            EmailOTP.objects.create(email= user.email, otp= otp)

            send_mail(
                subject="Your Trip Tailor OTP",
                message=f"Your OTP is: {otp}",
                from_email="triptailor.boss@gmail.com",
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response(
                {'message': f'Signup successful. Please verify OTP sent to {user.email}.',
                 'username': user.username,
                 'email': user.email
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status= status.HTTP_400_BAD_REQUEST)
    

class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data= request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']

            try:
                otp_obj = EmailOTP.objects.filter(email= email, otp= otp).latest('created_at')
            except EmailOTP.DoesNotExist:
                return Response({'detail': 'Invalid OTP'},status=400)
            
            if otp_obj.is_expired():
                return Response({'detail': 'OTP Expired'}, status= 400)
            
            try:
                user = CustomUser.objects.get(email= email)
                user.is_active= True
                user.save()
                otp_obj.delete()
                return Response({'message': 'OTP Verified. Please Log In'})
            except CustomUser.DoesNotExist:
                return Response({'detail': 'User not found'},status=404)
        
        return Response(serializer.errors, status=400)
    
class LogoutView(APIView):
    def post(self, request):
        response = Response({'messsage': 'Logged out successfully'})
        response.delete_cookie(
        key='access_token',
        samesite='Lax',
        secure=False,
        path='/user/'
        )
        
        return response