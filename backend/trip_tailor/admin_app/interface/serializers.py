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

class TimePeriodSerializer(serializers.Serializer):
    start_date = serializers.DateField(allow_null=True)
    end_date = serializers.DateField(allow_null=True)
    label = serializers.CharField()


class SalesMetricsSerializer(serializers.Serializer):
    total_bookings = serializers.IntegerField()
    total_amount_transferred = serializers.DecimalField(
        max_digits=12, decimal_places=2
    )
    total_platform_fee_collected = serializers.DecimalField(
        max_digits=12, decimal_places=2
    )
    new_users_count = serializers.IntegerField()
    new_agencies_count = serializers.IntegerField()
    average_booking_price = serializers.DecimalField(
        max_digits=12, decimal_places=2
    )
    average_platform_fee = serializers.DecimalField(
        max_digits=12, decimal_places=2
    )


class SalesReportSerializer(serializers.Serializer):
    time_period = TimePeriodSerializer()
    metrics = SalesMetricsSerializer()