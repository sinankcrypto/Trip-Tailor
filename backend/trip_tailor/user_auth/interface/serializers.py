from rest_framework import serializers
from ..domain.models import CustomUser
from agency_app.models import AgencyProfile

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserSignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only= True)
    role = serializers.ChoiceField(choices=['user', 'agency'], write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password','confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def validate(self, data):
        if data['password']!= data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        
        role = validated_data.pop('role', 'user')  # Get role from validated_data
        is_agency = True if role == 'agency' else False

        user = CustomUser.objects.create_user(
            **validated_data,
            is_agency=is_agency,
            is_active=False
        )
        return user

    
class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length= 6)

class CustomUserSerializer(serializers.ModelSerializer):
    verified = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_active','is_agency', 'verified']

    def get_verified(self, obj):
        if obj.is_agency:
            try:
                return obj.agency_profile.verified
            except AgencyProfile.DoesNotExist:
                return False
        return None

class AgencyListSerializer(serializers.Serializer):
    is_verified = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'phone_number','is_verified']
    
    def get_is_verified(self, obj):
        try:
            return obj.agency_profile.is_verified
        except AgencyProfile.DoesNotExist:
            return False