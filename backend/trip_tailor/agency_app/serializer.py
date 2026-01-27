from rest_framework import serializers
from agency_app.models import AgencyProfile

class AgencyProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(write_only = True, required=False)
    license_document = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = AgencyProfile
        fields = '__all__'
        read_only_fields = ['user', 'status']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["profile_pic"] = instance.profile_pic
        rep["license_document"] = instance.license_document
        
        return rep

class WeeklyBookingSerializer(serializers.Serializer):
    day = serializers.CharField()          # Mon, Tue, Wed...
    bookings = serializers.IntegerField()

class AgencyDashboardMetricsSerializer(serializers.Serializer):
    total_bookings = serializers.IntegerField()
    total_earnings = serializers.IntegerField()
    today_bookings = serializers.IntegerField()
    weekly_data = WeeklyBookingSerializer(many=True)
