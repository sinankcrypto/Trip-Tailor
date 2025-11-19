from django.urls import path
from .views import ( UserLoginView, UserSignupView, OTPVerifyView, LogoutView,
                     GoogleLoginView, SendOTPView )

urlpatterns = [
    path('login/', UserLoginView.as_view(), name= 'user-login'),
    path('signup/', UserSignupView.as_view(), name='user-signup'),
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', OTPVerifyView.as_view(), name='verify-otp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),

]