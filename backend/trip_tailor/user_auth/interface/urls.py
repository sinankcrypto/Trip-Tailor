from django.urls import path
from .views import UserLoginView
from .views import UserSignupView
from .views import OTPVerifyView
from .views import LogoutView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name= 'user-login'),
    path('signup/', UserSignupView.as_view(), name='user-signup'),
    path('verify-otp/', OTPVerifyView.as_view(), name='verify-otp'),
    path('logout/', LogoutView.as_view(), name='logout')
]