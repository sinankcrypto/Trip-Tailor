from django.urls import path
from .views import ( AgencyPackageListView, PackageCreateView, PackageToggleListView, PackageSoftDeleteView, 
                    PackageUpdateView )
                    

urlpatterns = [
    path('my-packages/', AgencyPackageListView.as_view(), name="packages"),
    path('create/', PackageCreateView.as_view(), name= "create-package"),
    path('update/<int:pk>', PackageUpdateView.as_view(), name="update-package"),
    path('<int:pk>/toggle-list/', PackageToggleListView.as_view(), name="toggle-package"),
    path('delete/<int:pk>', PackageSoftDeleteView.as_view(), name="delete-package"),
    
]