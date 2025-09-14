from django.urls import path
from .views import AgencyProfileStatusView
from .views import AgencyProfileView
from .views import LogoutView

urlpatterns = [
    path('profile/',AgencyProfileView.as_view(), name = 'agency-profile'),
    path('profile/status/',AgencyProfileStatusView.as_view(), name = 'agency-profile-status'),
    path('logout/', LogoutView.as_view(), name='agency-logout'),
]
