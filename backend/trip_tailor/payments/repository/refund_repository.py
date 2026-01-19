import stripe
import logging

from django.db.utils import IntegrityError
from bookings.models import Booking
from ..models import Transaction, Refund
from core.constants import RefundStatus
from core.tasks import send_refund_initiated_email_task

logger = logging.getLogger(__name__)

class RefundRepository:

    @staticmethod
    def refund_booking(
        booking: Booking, 
        refund_amount: int | None = None,
        reason: str = "requested_by_customer",
        full_refund: bool = False,
    ):
        txn = (
            booking.transactions
            .select_for_update()
            .filter(status=Transaction.Status.COMPLETED).
            latest("created_at")
        )
        if full_refund:
            refund_amount = txn.amount
        if not txn.stripe_payment_intent:
            raise ValueError("No payment intent found for refund")
        
        if refund_amount and refund_amount > txn.amount:
            raise ValueError("Refund amount cannot exceed payment amount")
        
        refund_params = {
            "payment_intent": txn.stripe_payment_intent,
            "reason": reason
        }

        if not full_refund:
            refund_params["refund_application_fee"] = False
            refund_params["amount"]= refund_amount*100
        else:
            refund_params["refund_application_fee"] = True 
            refund_params["reverse_transfer"] = True
        
        stripe_refund = stripe.Refund.create(**refund_params)

        user = booking.user
        try:
            refund = Refund.objects.create(
                transaction=txn,
                stripe_refund_id=stripe_refund.id,
                amount=(
                    stripe_refund.amount
                    if stripe_refund.amount is not None 
                    else txn.amount * 100
                ),
                currency=stripe_refund.currency,
                reason=reason,
                status=RefundStatus.PENDING
            )
            send_refund_initiated_email_task.delay(
                user_email=user.email,
                user_name=user.username,
                package_name=booking.package.title,
                amount=refund_amount//100,
            )

        except IntegrityError:
            refund = Refund.objects.get(stripe_refund=stripe_refund.id)

        logger.info(
            "Refund initiated | booking=%s | txn=%s | refund=%s",
            booking.id, txn.id, stripe_refund.id
        )   
        return refund
    
    @staticmethod
    def get_or_create_refund_with_booking(refund_data, stripe_refund_id,refund_amount, currency):
        txn = Transaction.objects.get(
            stripe_payment_intent=refund_data["payment_intent"]
        )
        refund, created = Refund.objects.select_related(
                "transaction__booking"
        ).get_or_create(
            stripe_refund_id=stripe_refund_id,
            defaults={
                "transaction": txn,
                "status":RefundStatus.PENDING,
                "amount":refund_amount,
                "currency": currency,
            },
        )

        booking = refund.transaction.booking
        user = booking.user
        if created:
            send_refund_initiated_email_task.delay(
                user_email=user.email,
                user_name=user.username,
                package_name=booking.package.title,
                amount=refund_amount//100,
            )

        return refund