from rest_framework import serializers

class PaymentSettingsStatusSerializer(serializers.Serializer):
    connected = serializers.BooleanField()
    charges_enabled = serializers.BooleanField(required=False)
    payouts_enabled = serializers.BooleanField(required=False)
    account = serializers.DictField(required=False)

class CheckoutSessionSerialzer(serializers.Serializer):
    booking_id = serializers.IntegerField(required=True)
    user_id = serializers.IntegerField(required=True)
    agency_id = serializers.IntegerField(required=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    