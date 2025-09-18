from django.urls import path
from .views import ( AgencyPackageListView, PackageCreateView, PackageToggleListView, PackageSoftDeleteView, 
                    PackageUpdateView, PackageDetailView, PackageListView, LatestPackagesView)
                    

urlpatterns = [
    path('my-packages', AgencyPackageListView.as_view(), name="packages"),
    path('create', PackageCreateView.as_view(), name= "create-package"),
    path('<int:pk>/', PackageDetailView.as_view(), name='package-detail'),
    path('<int:pk>/update', PackageUpdateView.as_view(), name="update-package"),
    path('<int:pk>/toggle-list', PackageToggleListView.as_view(), name="toggle-package"),
    path('<int:pk>/delete', PackageSoftDeleteView.as_view(), name="delete-package"),
    path("", PackageListView.as_view(), name="package-list"),
    path("latest/", LatestPackagesView.as_view(), name="latest-packages"),
    
]