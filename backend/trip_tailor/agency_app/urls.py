from django.urls import path
from .views import (AgencyProfileStatusView, AgencyProfileView,
                    LogoutView, AgencyDashboardMetricsView
)

urlpatterns = [
    path('dashboard/metrics/',AgencyDashboardMetricsView.as_view(), name='dashboard-metrics'),
    path('profile/',AgencyProfileView.as_view(), name = 'agency-profile'),
    path('profile/status/',AgencyProfileStatusView.as_view(), name = 'agency-profile-status'),
    path('logout/', LogoutView.as_view(), name='agency-logout'),
]
