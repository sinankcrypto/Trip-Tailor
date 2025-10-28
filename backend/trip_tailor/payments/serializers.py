from rest_framework import serializers

class PaymentSettingsStatusSerializer(serializers.Serializer):
    connected = serializers.BooleanField()
    charges_enabled = serializers.BooleanField(required=False)
    payouts_enabled = serializers.BooleanField(requierd=False)
    account = serializers.DictField(required=False)
    