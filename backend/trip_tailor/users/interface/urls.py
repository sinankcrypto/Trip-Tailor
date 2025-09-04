from django.urls import path
from users.interface.views import UserProfileView

urlpatterns = [
    path('profile/',UserProfileView.as_view(), name= "profile"),
    
]