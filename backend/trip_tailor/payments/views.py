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
from .serializers import PaymentSettingsStatusSerializer, CheckoutSessionSerialzer
from bookings.repositories.booking_repository import BookingRepository

from core.constants import TransactionStatus, PaymentStatus

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
        logger.error("⚠️ Invalid payload received in Stripe webhook")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        #invalid signature
        logger.error("⚠️ Invalid Stripe signature")
        return HttpResponse(status=400)
    
    booking_repo = BookingRepository()
    
    #handle the event type
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        logger.info(f"✅ Payment succeeded for session: {session['id']}")
        session_id = session.get("id")
        payment_intent = session.get("payment_intent")
        metadata = session.get("metadata", {})

        booking_id = metadata.get("booking_id")
        user_id = metadata.get("user_id")
        agency_id = metadata.get("agency_id")


        # Get transaction linked to this session
        transaction = PaymentRepository.get_transaction_by_session_id(session_id)
        if not transaction:
            logger.error(f"⚠️ Transaction not found for session {session_id}")
            return HttpResponse(status=400)

        if transaction.status == TransactionStatus.COMPLETED:
            logger.info(f"⚠️ Transaction {transaction.id} already completed, ignoring duplicate webhook.")
            return HttpResponse(status=200)
        
        # Update related booking payment status
        booking = booking_repo.get_by_id(booking_id)
        if not booking:
            logger.error(f"⚠️ Booking not found for ID {booking_id}")
            return HttpResponse(status=400)
        
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent)
            connected_account = intent.get("transfer_data", {}).get("destination")
            logger.info(f"💸 Transfer made to connected account: {connected_account}")
        except Exception as e:
            logger.warning(f"⚠️ Could not retrieve payment intent details: {str(e)}")

        #update both statuses
        PaymentRepository.update_transaction_status(transaction, TransactionStatus.COMPLETED, payment_intent)
        booking_repo.update_payment_status(booking,PaymentStatus.PAID)

        logger.info(f"✅ Payment successful for Booking #{booking_id}")

    elif event["type"] == "payment_intent.payment_failed":
        intent = event["data"]["object"]
        payment_intent_id = intent.get("id")
        logger.warning(f"❌ Payment failed for intent: {payment_intent_id}")

        # mark transaction as failed
        transaction = PaymentRepository.get_transaction_by_payment_intent(payment_intent_id)
        if transaction:
            PaymentRepository.update_transaction_status(transaction, TransactionStatus.FAILED)
            logger.warning(f"❌ Payment failed for session {session_id}")
    
    else:
        logger.info(f"Unhandled event type: {event['type']}")

    return HttpResponse(status=200)

class CreateCheckoutSessionView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request):
        """
        Create a checkout session and a transaction
        """
        serializer = CheckoutSessionSerialzer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        user = UserRepository.get_user_by_id(data['user_id'])
        agency = AgencyRepository.get_profile(data['agency_id'])
        booking_id = data["booking_id"]
        logger.info(f"booking id: {booking_id}")

        try:
            session_url = PaymentRepository.create_checkout_session(
                booking_id, user, agency, data['amount']
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

            
