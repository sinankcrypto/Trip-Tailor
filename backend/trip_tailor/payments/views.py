from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user_auth.repository.user_repository import UserRepository
from agency_app.repository.agency_repository import AgencyRepository
from .repository.payment_repository import PaymentRepository

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
            

            