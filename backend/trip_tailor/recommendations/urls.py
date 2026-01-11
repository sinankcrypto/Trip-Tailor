from django.urls import path
from .views import RecommendedPackagesView

urlpatterns = [
    path("recommended/", RecommendedPackagesView.as_view(), name="recommended-packages"),
]