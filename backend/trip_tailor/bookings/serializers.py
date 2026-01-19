from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Booking
from reviews.models import Review
from core.constants import BookingStatus, PaymentStatus
import logging

logger = logging.Logger(__name__)

class BookingSerializer(serializers.ModelSerializer):
    package_title = serializers.CharField(source="package.title", read_only=True)
    package_image = serializers.CharField(source="package.main_image", read_only=True)
    package_duration = serializers.CharField(source="package.duration", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    agency_name = serializers.CharField(source="agency.agency_name", read_only=True) 
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "package", "package_title", "package_image", "package_duration",
            "user", "no_of_members", "no_of_adults", "no_of_kids", "amount", "date","agency_name",
            "payment_method", "payment_status","booking_status","cancelled_at","username", "created_at", "user_email"
        ]
        read_only_fields =["amount", "payment_status", "user", "agency", "user_email"]

    def create(self, validated_data):
        package = validated_data["package"]
        members = validated_data["no_of_members"]
        adults = validated_data["no_of_adults"]
        kids = validated_data["no_of_kids"]

        validated_data["amount"] = package.price * adults + (package.price//2) * kids
        validated_data["payment_status"] = PaymentStatus.PENDING
        validated_data["agency"] = package.agency
        validated_data["user"] = self.context["request"].user

        return super().create(validated_data)
    
class PaymentStatusUpdateSerializer(serializers.ModelSerializer):
    payment_status = serializers.ChoiceField(choices=PaymentStatus.choices(), required=True)

    class Meta:
        model = Booking
        fields = ["payment_status"]
    
    def validate_payment_status(self, value):
        booking = self.instance
        current = booking.payment_status

        # Define allowed transitions
        allowed = {
            PaymentStatus.PENDING: {PaymentStatus.PAID, PaymentStatus.FAILED},
            PaymentStatus.PAID: {PaymentStatus.REFUNDED},
            PaymentStatus.FAILED: {PaymentStatus.PENDING, PaymentStatus.PAID},
            PaymentStatus.REFUNDED: set(),  # no further changes
        }

        if value not in allowed.get(current, set()):
            raise serializers.ValidationError(
                f"Cannot change payment status from {current} to {value}. "
                f"Allowed: {', '.join(allowed.get(current, [])) or 'none'}"
            )
        return value

class UserBookingSerializer(BookingSerializer):
    review = serializers.SerializerMethodField()

    class Meta(BookingSerializer.Meta):
        fields = [
            "id", "package_title", "package_image", "package_duration",
            "agency_name", "date", "no_of_members", "amount",
            "payment_method", "payment_status", "booking_status", "created_at", "review",
        ]

    def get_review(self, obj):
        try:
            review = obj.review
        except Review.DoesNotExist:
            logger.info("No review exists for booking %s", obj.id)
            return None
        
        return {
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
        }

class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    """Only for updating booking status"""
    booking_status = serializers.ChoiceField(
        choices=BookingStatus.choices(),
        required=True,
        help_text="New booking Lifecylce status"
    )

    class Meta:
        model=Booking
        fields = ["booking_status"]

    def validate_booking_status(self, value: BookingStatus) -> BookingStatus:
        current = self.instance.booking_status
        user = self.context["request"].user

        allowed = {
            BookingStatus.ACTIVE:{
                BookingStatus.CANCELLED,
                BookingStatus.COMPLETED,
            },
            BookingStatus.CANCELLED:{
                BookingStatus.ACTIVE
            },
            BookingStatus.COMPLETED : set(),
        }

        if value not in allowed.get(current, set()):
            raise serializers.ValidationError(
                f"Cannot change booking status from {current} to {value}. "
                f"Allowed: {', '.join(allowed.get(current, [])) or 'none'}"
            )
        
        if value == BookingStatus.COMPLETED:
            if not (user.is_staff or hasattr(user, "agency_profile")):
                raise serializers.ValidationError("Only staff or agency can mark as completed")
            
            date = self.instance.date
            duration = self.instance.package.duration
            if timezone.localdate() < date + timedelta(duration):
                raise serializers.ValidationError(
                    "Booking can only be marked completed after the travel period ends."
                )
            
        return value