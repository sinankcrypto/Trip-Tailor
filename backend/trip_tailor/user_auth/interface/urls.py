from django.urls import path
from .views import UserLoginView, UserSignupView, OTPVerifyView, LogoutView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name= 'user-login'),
    path('signup/', UserSignupView.as_view(), name='user-signup'),
    path('verify-otp/', OTPVerifyView.as_view(), name='verify-otp'),
    path('logout/', LogoutView.as_view(), name='logout'),

]