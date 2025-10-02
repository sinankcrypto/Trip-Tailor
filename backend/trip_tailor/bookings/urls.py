from django.urls import path
from .views import BookingCreateView, AgencyBookingListView,BookingStatusUpdateView, BookingDetailView, AdminBookingListView

urlpatterns = [
    path("bookings",BookingCreateView.as_view(), name="create-booking"),
    path("bookings/<int:pk>", BookingDetailView.as_view(), name="booking-detail"),
    path("agency/bookings",AgencyBookingListView.as_view(), name="agency-bookings"),
    path("agency/bookings/<int:pk>/status", BookingStatusUpdateView.as_view(), name="update-booking-status"),

    path("admin-panel/bookings/", AdminBookingListView.as_view(), name="admin-bookings"),
]