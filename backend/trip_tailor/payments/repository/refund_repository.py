import stripe
import logging

from bookings.models import Booking
from ..models import Transaction, Refund
from core.constants import RefundStatus
from core.utils.email_utils import send_email
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

        if not txn.stripe_payment_intent:
            raise ValueError("No payment intent found for refund")
        
        if refund_amount > txn.amount:
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
        
        stripe_refund = stripe.Refund.create(**refund_params)

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
        send_email(
            subject="Refund initiated",
            message="Your refund has been initiated and is being processed. This may take up to 3-7 business days",
            recipient_list=[booking.user.email],
        )

        return refund
    
    @staticmethod
    def get_refund_with_booking(stripe_refund_id):
        try:
            refund = Refund.objects.select_related(
                "transaction__booking"
            ).get(stripe_refund_id=stripe_refund_id)
            return refund
        except Refund.DoesNotExist:
            logger.warning("Refund not found: %s", stripe_refund_id)
            return