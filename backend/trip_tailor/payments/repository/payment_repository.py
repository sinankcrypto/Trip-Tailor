import stripe

from django.conf import settings
from admin_app.models import PlatformFee
from ..models import Transaction
from bookings.repositories.booking_repository import BookingRepository

class PaymentRepository:

    @staticmethod
    def get_transaction_by_payment_intent(payment_intent):
        return Transaction.objects.filter(stripe_payment_intent=payment_intent).first()

    @staticmethod
    def get_transaction_by_session_id(session_id):
        try:
            return Transaction.objects.get(stripe_session_id=session_id)
        except Transaction.DoesNotExist:
            return None
        
    @staticmethod
    def update_transaction_status(transaction, status: Transaction.Status, payment_intent: str = None):
        transaction.status = status
        if payment_intent:
            transaction.stripe_payment_intent = payment_intent
        transaction.save(update_fields=["status", "stripe_payment_intent"])
        return transaction
    
    @staticmethod
    def get_platform_fee(amount):
        
        platform_fee_obj = PlatformFee.get_current_fee()
        if not platform_fee_obj:
            raise ValueError("Platform fee configuration not found")
        

        final_fee = platform_fee_obj.calculate_fee(amount)
        return round(final_fee,2)
    
    @staticmethod
    def get_current_fee():
        return PlatformFee.objects.first()
    
    @staticmethod
    def get_or_create_fee(id):
        return PlatformFee.objects.get_or_create(id=id)
    
    @staticmethod
    def create_checkout_session(booking_id, user, agency, amount):
        fee = PaymentRepository.get_platform_fee(amount)

        platform_fee = int(fee)
        total_amount = int(amount)

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data":{
                        "currency":"inr",
                        "unit_amount":total_amount*100, #converted to paise since stripe uses paise
                        "product_data":{
                            "name":f"Trip Booking #{booking_id}",
                        },
                    },
                    "quantity":1,
                },
            ],
            payment_intent_data={
                "application_fee_amount":platform_fee*100,
                "transfer_data":{
                    "destination":agency.stripe_account_id,
                },
            },
            success_url=f"{settings.DOMAIN}/payment/success",
            cancel_url=f"{settings.DOMAIN}/payment/cancel",
            metadata={
                "booking_id":booking_id,
                "user_id":user.id,
                "agency_id":agency.id,
                "platform_fee":platform_fee,
            },
        )
        booking_repo = BookingRepository()
        booking = booking_repo.get_by_id(booking_id)

        Transaction.objects.create(
            booking=booking,
            user=user,
            agency=agency,
            stripe_session_id=session.id,
            amount=amount,
            platform_fee=platform_fee,
            currency="inr",
            status=Transaction.Status.PENDING,
        )

        return session.url


    
