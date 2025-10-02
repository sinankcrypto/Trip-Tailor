from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    package_title = serializers.CharField(source="package.title", read_only=True)
    package_image = serializers.ImageField(source="package.main_image", read_only=True)
    package_duration = serializers.CharField(source="package.duration", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    agency_name = serializers.CharField(source="agency.agency_name", read_only=True)  # ✅ new field

    class Meta:
        model = Booking
        fields = [
            "id", "package", "package_title", "package_image", "package_duration",
            "user", "no_of_members", "amount", "date","agency_name",
            "payment_method", "payment_status","booking_status","cancelled_at","username"
        ]
        read_only_fields =["amount", "payment_status", "user", "agency"]

    def create(self, validated_data):
        package = validated_data["package"]
        members = validated_data["no_of_members"]

        validated_data["amount"] = package.price * members
        validated_data["payment_status"] = Booking.PAYMENT_PENDING
        validated_data["agency"] = package.agency
        validated_data["user"] = self.context["request"].user

        return super().create(validated_data)
    
class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    payment_status = serializers.ChoiceField(choices=Booking.PAYMENT_STATUS_CHOICES, required=True)

    class Meta:
        model = Booking
        fields = ["payment_status"]

class UserBookingSerializer(serializers.ModelSerializer):
    package_title = serializers.CharField(source="package.title", read_only=True)
    agency_name = serializers.CharField(source="agency.name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "package_title",
            "agency_name",
            "date",
            "no_of_members",
            "amount",
            "payment_status",
            "payment_method",
            "created_at",
        ]