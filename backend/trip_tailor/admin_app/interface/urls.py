from django.urls import path
from admin_app.interface.views import AdminLoginView, AdminProfileView

urlpatterns = [
    path('login/',AdminLoginView.as_view(), name='admin-login'),
    path('profile/',AdminProfileView.as_view(), name='admin-profile'),
]