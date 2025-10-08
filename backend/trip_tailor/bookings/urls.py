from django.urls import path
from .views import (BookingCreateView, AgencyBookingListView,BookingStatusUpdateView, 
                    BookingDetailView, AdminBookingListView, UserBookingsListView, BookingCancelView )

urlpatterns = [
    path("bookings",BookingCreateView.as_view(), name="create-booking"),
    path("bookings/<int:pk>", BookingDetailView.as_view(), name="booking-detail"),
    path("bookings/<int:pk>/cancel/",BookingCancelView.as_view(), name="booking-cancel"),
    path("user/bookings/", UserBookingsListView.as_view(), name="user-bookings"),

    path("agency/bookings",AgencyBookingListView.as_view(), name="agency-bookings"),
    path("agency/bookings/<int:pk>/status", BookingStatusUpdateView.as_view(), name="update-booking-status"),

    path("admin-panel/bookings/", AdminBookingListView.as_view(), name="admin-bookings"),
]