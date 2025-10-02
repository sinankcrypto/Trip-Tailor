from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import UserLoginSerializer, UserSignupSerializer, OTPVerifySerializer, CustomUserSerializer
from ..repository.user_repository import UserRepository

from django.core.mail import send_mail
from random import randint
from ..domain.models import EmailOTP, CustomUser

# Create your views here.

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data = request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = UserRepository.authenticate_user(username, password)

            if not user or user.is_superuser:
                return Response({'detail': 'Invalid Credentails'}, status= status.HTTP_401_UNAUTHORIZED)
            

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

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
                path='/'
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                samesite='Lax',
                secure=False,
                max_age=86400,  # 1 day
                path='/'  
            )

            return response
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
    
class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        role = request.data.get('role')
        serializer = UserSignupSerializer(data= request.data)   

        if serializer.is_valid():
            user = serializer.save()

            otp = f"{randint(100000,999999)}"
            EmailOTP.objects.create(email= user.email, otp= otp)

            send_mail(
                subject="Your Trip Tailor OTP",
                message=f"Your OTP is: {otp} Please verify to login to Trip Tailor",
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
            path='/'
        )
        response.delete_cookie(
            key='refresh_token',
            path='/'
        )
        
        return response
    
class RefreshTokenCookieView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("inside post")
        refresh_token = request.COOKIES.get('refresh_token')
        print(f"refresh token: {refresh_token}")
        if not refresh_token:
            return Response({'detail': 'No refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            response = Response({'access': access_token})
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                samesite='Lax',
                secure=False,
                max_age=300,
                path='/'
            )
            return response

        except TokenError as e:
            return Response({'detail': 'Refresh token invalid'}, status=status.HTTP_401_UNAUTHORIZED)