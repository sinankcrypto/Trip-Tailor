from rest_framework import serializers
from ..models import PlatformFee

class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class PlatformFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformFee
        fields = ['percentage', 'minimum_fee']

class MonthlyBookingSerializer(serializers.Serializer):
    month = serializers.CharField()
    bookings = serializers.IntegerField()

class AdminDashboardMetricsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_agencies = serializers.IntegerField()
    total_bookings = serializers.IntegerField()
    total_earnings = serializers.IntegerField()
    total_platform_fee = serializers.IntegerField()
    monthly_bookings = MonthlyBookingSerializer(many=True)