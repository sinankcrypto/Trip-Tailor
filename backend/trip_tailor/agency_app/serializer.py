from rest_framework import serializers
from agency_app.models import AgencyProfile

class AgencyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyProfile
        fields = '__all__'
        read_only_fields = ['user', 'status']

class WeeklyBookingSerializer(serializers.Serializer):
    day = serializers.CharField()          # Mon, Tue, Wed...
    bookings = serializers.IntegerField()

class AgencyDashboardMetricsSerializer(serializers.Serializer):
    total_bookings = serializers.IntegerField()
    total_earnings = serializers.IntegerField()
    today_bookings = serializers.IntegerField()
    weekly_data = WeeklyBookingSerializer(many=True)
