from rest_framework import serializers
from .models import Transaction

class PaymentSettingsStatusSerializer(serializers.Serializer):
    connected = serializers.BooleanField()
    charges_enabled = serializers.BooleanField(required=False)
    payouts_enabled = serializers.BooleanField(required=False)
    account = serializers.DictField(required=False)
    
class TransactionSerializer(serializers.ModelSerializer):
    user_username = serializers.EmailField(source="user.username", read_only=True)
    agency_name = serializers.CharField(source="agency.agency_name", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id", "booking_id", "user_username", "agency_name",
            "amount", "platform_fee", "currency", "status",
            "stripe_session_id", "stripe_payment_intent",
            "created_at"
        ]