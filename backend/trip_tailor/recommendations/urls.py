from django.urls import path
from .views import RecommendedPackagesView, InterestListView, UserInterestView

urlpatterns = [
    path("packages/", RecommendedPackagesView.as_view(), name="recommended-packages"),
    path("interests/", InterestListView.as_view(), name="interest-list"),
    path("interests/user/", UserInterestView.as_view(), name="user-interests")
]