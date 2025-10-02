from rest_framework import serializers
from agency_app.models import AgencyProfile

class AgencyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyProfile
        fields = '__all__'
        read_only_fields = ['user', 'status']