import uuid
from django.core.cache import cache
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import (UserLoginSerializer, UserSignupSerializer, OTPVerifySerializer, 
    CustomUserSerializer, GoogleLoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer)
from ..repository.user_repository import UserRepository
from ..repository.emailOTP_repository import EmailOTPRepository

from django.core.mail import send_mail
from random import randint
from datetime import timedelta
from django.utils import timezone
from ..domain.models import EmailOTP, CustomUser

from core.tasks import send_otp_email_task
from core.utils.otp_utils import can_resend_otp, generate_otp, create_otp_for_email

import logging
import requests

logger = logging.getLogger(__name__)

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
            
            if not user.is_active:
                return Response({'detail': 'Please verify your email with OTP before logging in.'}, 
                                status=status.HTTP_403_FORBIDDEN)
            

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
        serializer = UserSignupSerializer(data= request.data)   

        if serializer.is_valid():
            user = serializer.save()

            otp = generate_otp()
            EmailOTPRepository.create(
                email=user.email.lower().strip(),
                otp=otp,
                validity_minutes=10
            )

            send_otp_email_task.delay(user.email, otp)

            return Response(
                {'message': f'Signup successful. Please verify OTP sent to {user.email}.',
                 'username': user.username,
                 'email': user.email
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status= status.HTTP_400_BAD_REQUEST)
    
class SendOTPView(APIView):
    """
    Send a new OTP (first time) or Resend OTP 
    POST: {"email": u"ser@example.com"}
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            logger.warning("OTP request without email")
            return Response({"detail": "Email is required."},status=status.HTTP_400_BAD_REQUEST)
        
        can_resend, message = can_resend_otp(email, max_attempts=3, cooldown_seconds=30)

        if not can_resend:
            logger.warning(f"Resend blocked for {email}: {message}")
            return Response({"detail": message}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        otp = generate_otp()
        otp_obj = EmailOTPRepository.create(
            email=email,
            otp=otp,
            validity_minutes=10
        )

        if EmailOTPRepository.get_latest_by_email(email):
            EmailOTPRepository.increment_resend_attempts(email)

        send_otp_email_task.delay(email, otp)

        logger.info(f"OTP sent succesfully to {email} | Resend attempts: {otp_obj.resend_attempts}")

        resend_text = "resent" if otp_obj.resend_attempts > 0 else "sent"

        return Response({
            "detail": f"OTP {resend_text} succesfully to {email}. Valid for 10 minutes. ",
            "expires_in_seconds": 600
            }, status=status.HTTP_200_OK
        )


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data= request.data)
        if not serializer.is_valid():
            logger.warning(f"Invalid OTP verify payload: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].lower().strip()
        otp = serializer.validated_data['otp']

        otp_obj = EmailOTPRepository.get_latest_by_email(email)

        if not otp_obj:
            logger.info(f"OTP verification failed - no OTP found for {email}")
            return Response({"detail": "Invalid or Expired OTP. "}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.is_expired():
            EmailOTPRepository.delete_by_email(email)
            logger.info(f"OTP expired for {email}")
            return Response({'detail': 'OTP Expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.otp != otp:
            logger.warning(f"Invalid OTP attempt for {email} | Provided:{otp} | Expected:{otp_obj.otp}")
            return Response({"detail": "Invalid OTP. "}, status=status.HTTP_400_BAD_REQUEST)
        
        user = UserRepository.get_user_by_email(email)
        if not user:
            logger.warning(f"OTP Verified but no user found with email {email}")
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])
            logger.info(f"User activated succesfully: {email}")

        EmailOTPRepository.delete_by_email(email)
        logger.info(f"OTP verified and user active: {email}")

        return Response({
            "message": "OTP Verified succesfully!",
            "detail": "Account verified please login. ",
            "user": {
                "email": user.email,
                "username": user.username
            }
        }, status=status.HTTP_200_OK)
    
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
        refresh_token = request.COOKIES.get('refresh_token')
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
        

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleLoginSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        role = serializer.validated_data.get('role','user')
        is_agency = True if role == 'agency' else False
        
        google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        response = requests.get(google_url)

        if response.status_code != 200:
            return Response({"detail":"Invalid Google token"},status= status.HTTP_400_BAD_REQUEST)
        
        user_info = response.json()
        email = user_info.get("email")
        name = user_info.get("name","")
        username = email

        if not email:
            return Response({"detail":"Email not found in Google response"}, status= status.HTTP_400_BAD_REQUEST)

        user, created = UserRepository.get_or_create_google_user(
            email=email,
            username=username,
            is_agency=is_agency
        )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        redirect_to = "/agency/dashboard" if user.is_agency else "/user/Home"

        data = CustomUserSerializer(user).data

        response = Response({
            "message": "Google login succesfull",
            "user": data,
            "redirect_to": redirect_to,
        })

        response.set_cookie(
            key = "access_token",
            value = access_token,
            httponly= True,
            samesite= "Lax",
            secure= False,
            max_age= 3600,
            path= "/"
        )
        response.set_cookie(
            key="refresh_token",
            value = refresh_token,
            httponly= True,
            samesite= "Lax",
            secure= False,
            max_age=86400,
            path= "/"
        )

        return response

class ForgotPassordAPIView(APIView):
    """
    send otp to user's email for password reset
    """
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        
        user_exists = UserRepository.check_user_exists(email)

        allowed, reason = can_resend_otp(email)
        if not allowed:
            return Response(
                {"error": reason}, status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        if user_exists:
            otp_obj = create_otp_for_email(email)
            send_otp_email_task.delay(email, otp_obj.otp)

        return Response(
            {"message": "An OTP has been sent to the given email"},status=status.HTTP_200_OK
        )
    
class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        otp_obj = EmailOTPRepository.get_latest_by_email(email)

        if not otp_obj or otp_obj.is_expired() or otp_obj.otp != otp:
            return Response(
                {"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        user = UserRepository.get_user_by_email(email)

        if not user:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])

        cache.set(f"password_reset_allowed:{email}", True, timeout=300)

        EmailOTPRepository.delete_by_email(email)

        return Response(
            {
                "message": "OTP verified successfully"
            }, 
            status=status.HTTP_200_OK
        )
    
class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"invalid reset password payload: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data["email"].lower().strip()
        new_password = serializer.validated_data["new_password"]

        cache_key = f"password_reset_allowed:{email}"

        if not cache.get(cache_key):
            logger.warning(f"unauthorized password reset attempt for {email}")
            return Response(
                {"detail":"Password reset not allowed or session expired. please verify OTP again"},
                status=status.HTTP_403_FORBIDDEN
            )

        user = UserRepository.get_user_by_email(email)
        if not user:
            logger.warning(f"Password reset attempted for non existing email: {email}")
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        cache.delete(cache_key)

        return Response(
            {
                "message": "Password reset successful", 
                "detail": "You can now login with your new password."
            },
            status=status.HTTP_200_OK
        )