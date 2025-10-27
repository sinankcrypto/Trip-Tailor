from django.urls import path
from .views import stripe_webhook, CreateCheckoutSessionView

urlpatterns = [
    path("webhook/", stripe_webhook, name="stripe-webhook"),
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
]   
