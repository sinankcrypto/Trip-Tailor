from django.urls import path
from .views import (
    stripe_webhook, CreateCheckoutSessionView, AgencyConnectStripeView, AgencyPaymentSettingsView,
    AgencyDisconnectStripeView, AdminTransactionListView, UserTransactionListView, AgencyTransactionListView
)

urlpatterns = [
    path("webhook/", stripe_webhook, name="stripe-webhook"),
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path("agency/payment-settings/", AgencyPaymentSettingsView.as_view(), name="agency-payment-settings"),
    path("agency/payment-settings/connect/", AgencyConnectStripeView.as_view(), name="agency-connect-strie"),
    path("agency/payment-settings/disconnect/", AgencyDisconnectStripeView.as_view(), name="agency-disconnect-stripe"),
    path("admin/transactions/", AdminTransactionListView.as_view(), name="admin-transactions"),
    path("user/transactions/", UserTransactionListView.as_view(), name="user-transactions"),
    path("agency/transactions/", AgencyTransactionListView.as_view(), name="agency-transactions"),
]   
