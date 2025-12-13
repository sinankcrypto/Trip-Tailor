from django.db import transaction
from django.db.models import Sum
from ..repository.refund_repository import RefundRepository
from core.constants import RefundStatus, PaymentStatus
from ..models import Transaction
from core.tasks import send_refund_failed_email_task, send_refund_success_email_task

def handle_refund_updated(refund_data):
    stripe_refund_id = refund_data["id"]
    refund_status = refund_data["status"]
    refund_amount = refund_data["amount"]

    refund = RefundRepository.get_refund_with_booking(
        stripe_refund_id=stripe_refund_id
    )

    if not refund:
        return

    booking = refund.transaction.booking
    with transaction.atomic():

        if refund_status == "succeeded":
            refund.status = RefundStatus.SUCCEEDED
            send_refund_success_email_task.delay(
                booking.user.email,
                booking.user.username,
                booking.package.title,
                refund.amount // 100,
            )

        elif refund_status in ("failed", "canceled"):
            refund.status = RefundStatus.FAILED
            refund.save(update_fields=["status"])
            send_refund_failed_email_task.delay(
                booking.user.email,
                booking.user.username,
                booking.package.title,
                refund.amount // 100,
            )

            return  
        
        else:
            return

        refund.save(update_fields=["status"])

        txn = refund.transaction
        booking = txn.booking

        total_refunded = (
            txn.refunds
            .filter(status=RefundStatus.SUCCEEDED)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        if total_refunded >= txn.amount * 100:
            booking.payment_status = PaymentStatus.REFUNDED
            txn.status = Transaction.Status.CANCELLED
        else:
            booking.payment_status = PaymentStatus.PARTIALLY_REFUNDED
            txn.status = Transaction.Status.PARTIALLY_REFUNDED

        booking.save(update_fields=["payment_status"])
        txn.save(update_fields=["status"])
