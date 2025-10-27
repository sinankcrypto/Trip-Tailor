import stripe

from admin_app.models import PlatformFee
from ..models import Transaction

class PaymentRepository:

    @staticmethod
    def get_platform_fee(amount):
        
        platform_fee_obj = PlatformFee.get_current_fee()
        if not platform_fee_obj:
            raise ValueError("Platform fee configuration not found")
        

        final_fee = PlatformFee.calculate_fee(amount)
        return round(final_fee,2)
    
    @staticmethod
    def get_current_fee():
        return PlatformFee.get_current_fee()
    
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
            success_url="",
            cancel_url="",
            metadata={
                "booking_id":booking_id,
                "user_id":user.id,
                "agency_id":agency.id,
                "platform_fee":platform_fee,
            },
        )

        Transaction.objects.create(
            booking_id=booking_id,
            user=user,
            agency=agency,
            stripe_session_id=session.id,
            amount=amount,
            platform_fee=platform_fee,
            currency="inr",
            status="pending",
        )

        return session.url

