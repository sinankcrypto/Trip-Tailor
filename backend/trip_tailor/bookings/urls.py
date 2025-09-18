from django.urls import path
from .views import BookingCreateView, AgencyBookingListView,BookingStatusUpdateView

urlpatterns = [
    path("bookings",BookingCreateView.as_view(), name="create-booking"),
    path("agency/bookings",AgencyBookingListView.as_view(), name="agency-bookings"),
    path("agency/bookings/<int:pk>/status", BookingStatusUpdateView.as_view(), name="update-booking-status"),
]