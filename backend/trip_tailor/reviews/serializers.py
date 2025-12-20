from rest_framework import serializers
from .models import Review
from bookings.models import Booking
from core.constants import BookingStatus

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ("user", "package", "agency")

    def validate(self, attrs):
        booking = attrs.get("booking")
        user = self.context["request"].user

        if booking.user != user:
            raise serializers.ValidationError(
                "You can only review your own booking."
            )

        if booking.booking_status != BookingStatus.COMPLETED:
            raise serializers.ValidationError(
                "You can only review completed bookings."
            )

        if hasattr(booking, "review"):
            raise serializers.ValidationError(
                "You have already reviewed this booking."
            )

        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)