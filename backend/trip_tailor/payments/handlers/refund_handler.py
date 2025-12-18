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
    currency = refund_data["currency"]

    refund = RefundRepository.get_or_create_refund_with_booking(
        refund_data=refund_data,
        stripe_refund_id=stripe_refund_id,
        refund_amount=refund_amount,
        currency=currency
    )

    if not refund:
        return

    booking = refund.transaction.booking
    user=booking.user
    with transaction.atomic():

        if refund_status == "succeeded":
            refund.status = RefundStatus.SUCCEEDED
            refund.save(update_fields=["status"])
            send_refund_success_email_task.delay(
                user_email=user.email,
                user_name=user.username,
                package_name=booking.package.title,
                amount=refund_amount//100,
            )

        elif refund_status in ("failed", "canceled"):
            refund.status = RefundStatus.FAILED
            refund.save(update_fields=["status"])
            send_refund_failed_email_task.delay(
                user_email=user.email,
                user_name=user.username,
                package_name=booking.package.title,
                amount=refund_amount/100,
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
