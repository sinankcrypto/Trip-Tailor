from django.urls import path
from admin_app.interface.views import (
    AdminLoginView, AdminProfileView, AdminLogoutView, UserListView, AgencyListView, AgencyDetailsView, AgencyVerifyView
) 

urlpatterns = [
    path('login/',AdminLoginView.as_view(), name='admin-login'),
    path('profile/',AdminProfileView.as_view(), name='admin-profile'),
    path('logout/',AdminLogoutView.as_view(), name='admin-logout'),
    path('users/',UserListView.as_view(), name='admin-user-list'),
    path('agencies/',AgencyListView.as_view(), name='admin-agency-list'),
    path('agencies/<int:pk>/', AgencyDetailsView.as_view()),
    path('agencies/<int:pk>/verify/', AgencyVerifyView.as_view()),
]