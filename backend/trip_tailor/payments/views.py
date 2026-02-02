from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count, Q
from django.db import transaction
from django.utils.timezone import make_aware

from datetime import datetime

from rest_framework import status, generics, permissions, filters
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from user_auth.repository.user_repository import UserRepository
from agency_app.repository.agency_repository import AgencyRepository
from .repository.payment_repository import PaymentRepository
from .repository.payment_settings_repository import PaymentSettingsRepository
from agency_app.permissions import IsVerifiedAgency
from .serializers import PaymentSettingsStatusSerializer, TransactionSerializer
from bookings.repositories.booking_repository import BookingRepository

from core.constants import TransactionStatus, PaymentStatus
from .handlers.refund_handler import handle_refund_updated

from stripe.error import SignatureVerificationError

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
    except SignatureVerificationError:
        #invalid signature
        logger.error("⚠️ Invalid Stripe signature")
        return HttpResponse(status=400)
    
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
        txn = PaymentRepository.get_transaction_by_session_id(session_id)
        if not txn:
            logger.error(f"⚠️ Transaction not found for session {session_id}")
            return HttpResponse(status=400)

        if txn.status == TransactionStatus.COMPLETED:
            logger.info(f"⚠️ Transaction {txn.id} already completed, ignoring duplicate webhook.")
            return HttpResponse(status=200)
        
        # Update related booking payment status
        booking = BookingRepository.get_by_id(booking_id)
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
        with transaction.atomic():
            PaymentRepository.update_transaction_status(txn, TransactionStatus.COMPLETED, payment_intent)
            BookingRepository.update_payment_status(booking,PaymentStatus.PAID)

            logger.info(f"✅ Payment successful for Booking #{booking_id}")

    elif event["type"] == "payment_intent.payment_failed":
        intent = event["data"]["object"]
        payment_intent_id = intent.get("id")
        logger.warning(f"❌ Payment failed for intent: {payment_intent_id}")

        # mark transaction as failed
        txn = PaymentRepository.get_transaction_by_payment_intent(payment_intent_id)
        if txn:
            PaymentRepository.update_transaction_status(txn, TransactionStatus.FAILED)
            logger.warning(f"❌ Payment failed for session {session_id}")
    
    elif event["type"] == "refund.updated":
        refund_data = event["data"]["object"]
        handle_refund_updated(refund_data)

    else:
        logger.info(f"Unhandled event type: {event['type']}")

    return HttpResponse(status=200)

class CreateCheckoutSessionView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request):
        """
        Create a checkout session and a transaction
        """
        booking_id = request.data.get("booking_id")
        if not booking_id:
            return Response({"error": "booking_id is required"}, status=400)
        booking = BookingRepository.get_by_id(booking_id)
        if not booking:
            logger.error("Booking not found")
            return Response({"error": "Booking not found"}, status=404)
        
        user = request.user
        agency = booking.agency
        amount = booking.amount

        try:
            session_url = PaymentRepository.create_checkout_session(
                booking_id, user, agency, amount
            )
            return Response({"checkout_url":session_url})
        except Exception as e:
            logger.error({"error":str(e)})
            return Response({"error":str(e)}, status=400)
    
class AgencyPaymentSettingsView(APIView):
    permission_classes = [IsVerifiedAgency]

    def get(self, request):
        """
        Return the agency's stripe connection status
        """
        agency = AgencyRepository.get_profile(request.user)
        if not agency:
            return Response({"detail": "Agency profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        status_info = PaymentSettingsRepository.get_account_status(agency.stripe_account_id)
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
        return_url = f"{settings.DOMAIN.rstrip('/')}/agency/payment-settings/"

        account_link_url = repo.create_account_link(stripe_account_id, refersh_url, return_url)
        return Response({"url":account_link_url, "stripe_account_id":stripe_account_id})
    
class AgencyDisconnectStripeView(APIView):
    permission_classes=[IsVerifiedAgency]

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

            
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

#---ADMIN---

class AdminTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAdminUser]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["amount", "created_at", "status"]

    def get_queryset(self):
        params = self.request.query_params

        filters_data = {
            "status": params.get("status"),
            "agency": params.get("agency"),
            "user": params.get("user"),
        }
        filters_data = {k: v for k, v in filters_data.items() if v}
        ordering = self.request.query_params.get("ordering", "-created_at")

        qs = PaymentRepository.list_transactions_for_admin(filters=filters_data, ordering=ordering)

        search = params.get("search")
        if search:
            qs = qs.filter(
                Q(user__username__icontains=search)
                | Q(agency__agency_name__icontains=search)
                | Q(booking__id__icontains=search)
            )

        start_date = params.get("start_date")
        end_date = params.get("end_date")

        if start_date and end_date:
            start = make_aware(datetime.fromisoformat(start_date))
            end = make_aware(datetime.fromisoformat(end_date))
            qs = qs.filter(created_at__range=(start,end))

        return qs
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        queryset = self.get_queryset()

        summary = queryset.aggregate(
            total_amount=Sum("amount"),
            total_platform_fee=Sum("platform_fee"),
            total_transactions=Count("id")
        )

        response.data["summary"] = summary
        return response
    
#----USER-----
class UserTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["amount", "created_at", "status"]

    def get_queryset(self):
        filters_data = {"status": self.request.query_params.get("status")}
        filters_data = {k:v for k,v in filters_data.items() if v}
        ordering = self.request.query_params.get("ordering", "-created_at")

        return PaymentRepository.list_transactions_for_user(
            user=self.request.user, filters=filters_data, ordering=ordering
        )
    
    def list(self, request, *args, **kwargs):
        """
        Override the default list method to include summary (total spent, total transactions, etc.)
        """
        queryset = self.filter_queryset(self.get_queryset())

        # Default paginated response
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        paginated_response = self.get_paginated_response(serializer.data)

        # Summary aggregation
        summary = queryset.aggregate(
            total_spent=Sum("amount"),
            total_transactions=Count("id"),
            total_platform_fee=Sum("platform_fee"),
        )

        # Add summary to paginated response
        paginated_response.data["summary"] = summary

        return paginated_response
    
#----AGENCY-----
class AgencyTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["amount", "created_at", "status"]

    def get_queryset(self):
        agency = getattr(self.request.user, "agency_profile", None)
        if not agency:
            return None

        filters_data = {"status": self.request.query_params.get("status")}
        filters_data = {k: v for k, v in filters_data.items() if v}
        ordering = self.request.query_params.get("ordering", "-created_at")

        return PaymentRepository.list_transactions_for_agency(
            agency=agency, filters=filters_data, ordering=ordering
        )
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        queryset = self.get_queryset()

        #  Add summary info
        summary = queryset.aggregate(
            total_earned=Sum("amount")-Sum("platform_fee"),
            total_transactions=Count("id"),
            total_platform_fee=Sum("platform_fee"),
        )

        data = response.data

        if isinstance(data, dict) and "results" in data:
            data["summary"] = summary
        else:
            data = {"results": data, "summary": summary}

        return Response(data)