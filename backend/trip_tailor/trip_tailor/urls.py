"""
URL configuration for trip_tailor project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from user_auth.interface.views import RefreshTokenCookieView
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
   openapi.Info(
      title="Trip Tailor API",
      default_version='v1',
      description="API docs for user and admin auth, bookings, etc.",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/admin-panel/',include('admin_app.interface.urls')),
    path('api/user/', include('user_auth.interface.urls')),
    path('api/agency/', include('agency_app.urls')),
    path('api/user/', include('users.interface.urls')),
    path('api/packages/', include('packages.urls')),
    path('api/',include('bookings.urls')),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),       
    path('api/token/refresh-cookie/', RefreshTokenCookieView.as_view(), name='refresh-cookie'),

    re_path(r'^docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
