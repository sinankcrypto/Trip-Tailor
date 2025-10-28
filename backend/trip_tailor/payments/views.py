from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user_auth.repository.user_repository import UserRepository
from agency_app.repository.agency_repository import AgencyRepository
from .repository.payment_repository import PaymentRepository
from .repository.payment_settings_repository import PaymentSettingsRepository
from agency_app.permissions import IsVerifiedAgency
from .serializers import PaymentSettingsStatusSerializer

import stripe
import json
import logging

# Create your views here.

User = get_user_model()

logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        #invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        #invalid signature
        return HttpResponse(status=400)
    
    #handle the event type
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        logger.info(f"✅ Payment succeeded for session: {session['id']}")
        #  TODO: handle succesful payment logic here

    elif event["type"] == "payment_intent.payment_failed":
        logger.warning(f"❌ Payment failed: {event['data']['object']['id']}")

    return HttpResponse(status=200)

class CreateCheckoutSessionView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request):
        import json
        data = json.loads(request.body)

        booking_id = data.get("booking_id")
        user_id = data.get("user_id")
        agency_id = data.get("agency_id")
        amount = data.get("amount")

        if not all([booking_id, user_id, agency_id, amount]):
            return JsonResponse({"error": "Missing required fields"}, status=400)
        
        user = UserRepository.get_user_by_id(user_id)
        agency = AgencyRepository.get_agency_by_id(agency_id)

        try:
            session_url = PaymentRepository.create_checkout_session(
                booking_id, user, agency, amount
            )
            return Response({"checkout_url":session_url})
        except Exception as e:
            return Response({"error":str(e)}, status=400)
    
class AgencyPaymentSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return the agency's stripe connection status
        """
        repo = PaymentSettingsRepository()
        agency = AgencyRepository.get_profile(request.user)
        if not agency:
            return Response({"detail": "Agency profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        status_info = repo.get_account_status(agency.stripe_account_id)
        serializer = PaymentSettingsStatusSerializer(status_info)
        return Response(serializer.data)
            
class AgencyConnectStripeView(APIView):
    permission_classes = [IsVerifiedAgency]

    def post(self, request):
        """
        Create Stripe Express account if necessary, then return an account_link URL
        for onboarding. Frontend should redirect the agency user to the returned URL.
        """

        repo = PaymentSettingsRepository()
        agency = AgencyRepository.get_profile(request.user)
        if not agency:
            return Response({"detail": "Agency profile not found."}, status= status.HTTP_404_NOT_FOUND)
        
        #create account if doesn't exist
        stripe_account_id = repo.create_express_account_for_agency(agency, email=request.user.email)
        refersh_url = f"{settings.DOMAIN.rstrip('/')}/agency/payment-settings" 
        return_url = f"{settings.DOMAIN.rstrip('/')}/agency/payment-settings/success"

        account_link_url = repo.create_account_link(stripe_account_id, refersh_url, return_url)
        return Response({"url":account_link_url, "stripe_account_id":stripe_account_id})
    
class AgencyDisconnectStripeView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request):
        """
        Remove stripe_account_id from AgencyProfile (local disconnect)
        """
        repo = PaymentSettingsRepository()
        agency = AgencyRepository.get_profile(request.user)
        if not agency:
            return Response({"detail": "Agency profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        repo.disconnect_agency_account(agency)
        return Response({"message": "Disconnected stripe account locally"})

            