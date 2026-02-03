from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db import transaction
from django.conf import settings
from django.utils import timezone
from datetime import timedelta, datetime

from .serializers import (
    BookingSerializer,
    UserBookingSerializer,
    PaymentStatusUpdateSerializer,
    BookingStatusUpdateSerializer
)
from .repositories.booking_repository import BookingRepository
from agency_app.permissions import IsVerifiedAgency

from django_filters.rest_framework import DjangoFilterBackend

from core.tasks import (send_booking_confirmation_email_task, send_agency_booking_notification_email_task,
        send_booking_cancellation_email_task, send_agency_booking_cancellation_notification_email_task)
from core.constants import BookingStatus, PaymentStatus, PaymentMethod
from payments.repository.payment_repository import PaymentRepository
from payments.repository.refund_repository import RefundRepository
from payments.repository.payment_settings_repository import PaymentSettingsRepository
from recommendations.repository.interaction_repository import InteractionRepository
from core.constants import ActionChoices

import logging

# Create your views here.

logger = logging.getLogger(__name__)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = BookingRepository.get_all_bookings()  # base queryset
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["booking_status", "payment_status", "payment_method", "agency"]
    search_fields = ["user__username", "package__title", "agency__name"]
    ordering_fields = ["date", "amount", "created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return BookingSerializer
        if self.request.user.is_staff or hasattr(self.request.user, "agency_profile"):
            return BookingSerializer  
        else:
            return UserBookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BookingRepository.get_all_bookings()
        if hasattr(user, "agency_profile"):
            return BookingRepository.get_all_by_agency(user.agency_profile)
        return BookingRepository.get_all_by_user(user)

    def perform_create(self, serializer):
        user = self.request.user
        package = serializer.validated_data["package"]
        booking_date = serializer.validated_data["date"]

        buffer_days = settings.BOOKING_DATE_BUFFER_DAYS
        #check for existing booking
        start_date = booking_date - timedelta(days=buffer_days)
        end_date = booking_date + timedelta(days=buffer_days)

        existing = BookingRepository.get_conflicting_booking(
            user=user,
            package=package,
            start_date=start_date,
            end_date=end_date
            )
        if existing:
            logger.info("conflicting booking exists")
            raise serializers.ValidationError(
                f"You already have a booking for {package.title} on {existing.date.strftime('%B %d, %Y')}"
            ) 
        
        members = serializer.validated_data["no_of_members"]
        adults = serializer.validated_data["no_of_adults"]
        kids = serializer.validated_data["no_of_kids"]
        if adults + kids != members:
            logger.info(f"Total number of members is not correct. total: {members} kids: {kids} adults:{adults}")
            raise serializers.ValidationError(
                "Total number of members is not correct"
            )
        
        agency = package.agency
        if not agency.stripe_account_id:
            raise serializers.ValidationError("The agency is not accepting online payment as of now")

        status_info = PaymentSettingsRepository.get_account_status(agency.stripe_account_id)
        if not status_info:
            raise serializers.ValidationError("Agency has not completed Stripe onboarding")
        
        with transaction.atomic():
            booking = serializer.save()
            InteractionRepository.create(
                user=user,
                action=ActionChoices.BOOK,
                package=booking.package
            )
            logger.info("New booking created: ID=%s by user=%s", booking.id, booking.user.id)
            send_booking_confirmation_email_task.delay(booking.id)
            send_agency_booking_notification_email_task.delay(booking.id)


    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.booking_status != BookingStatus.ACTIVE:
            logger.warning("Cancel attempt on non-active booking %s (status=%s)", pk, booking.booking_status)
            return Response(
                {"detail": "Only active bookings can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cutoff = timezone.now().date() + timedelta(days=1)
        if booking.date < cutoff:
            logger.warning("Late cancel attempt on booking %s (date=%s)", pk, booking.date)
            return Response(
                {"detail": "Cancellation is only allowed at least 24 hours before the booking date."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_owner = booking.user == request.user
        is_agency = hasattr(request.user, "agency_profile") and booking.agency == request.user.agency_profile
        is_staff = request.user.is_staff

        if not (is_owner or is_agency or is_staff):
            logger.warning("Unauthorized cancel attempt on booking %s by user %s", pk, request.user.id)
            return Response(
                {"detail": "You do not have permission to cancel this booking."},
                status=status.HTTP_403_FORBIDDEN,
            )

        with transaction.atomic():
            booking = BookingRepository.get_by_id_for_update(pk)

            if booking.payment_method == PaymentMethod.ONLINE and booking.payment_status == PaymentStatus.PAID:
                now = timezone.now()
                cutoff = timezone.make_aware(
                    datetime.combine(booking.date, datetime.min.time())
                ) - timedelta(hours=24)

                is_full_refund = now <= cutoff

                if is_full_refund:
                    RefundRepository.refund_booking(
                        booking=booking,
                        full_refund=True,
                        reason="requested_by_customer",
                    )
                else:
                    refund_amount = int(booking.amount * 0.8)

                    RefundRepository.refund_booking(
                        booking=booking,
                        refund_amount=refund_amount,
                        full_refund=False,
                        reason="requested_by_customer",
                    )
                booking.payment_status = PaymentStatus.REFUND_PENDING
            booking.booking_status = BookingStatus.CANCELLED
            booking.cancelled_at = timezone.now()
            booking.save()
            send_booking_cancellation_email_task.delay(booking.id)
            send_agency_booking_cancellation_notification_email_task.delay(booking.id)

            logger.info(
                "Booking %s cancelled by %s (user=%s, agency=%s)",
                pk, "staff" if is_staff else "agency" if is_agency else "owner",
                request.user.id, request.user.agency_profile.id if is_agency else None
            )

        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=["patch"], permission_classes=[IsVerifiedAgency], url_path="update-payment-status")
    def update_payment_status(self, request, pk=None):
        booking = self.get_object()

        if booking.agency != request.user.agency_profile:
            logger.warning("Unauthorized payment status update attempt on booking %s by agency %s", pk, request.user.agency_profile.id)
            return Response({"detail": "Not authorized"}, status=403)

        serializer = PaymentStatusUpdateSerializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        updated = BookingRepository.update_payment_status(
            booking, serializer.validated_data["payment_status"]
        )

        logger.info(
            "Payment status updated for booking %s → %s by agency %s",
            pk, updated.payment_status, request.user.agency_profile.id
        )

        return Response(self.get_serializer(updated).data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsVerifiedAgency],url_path="update-status")
    def update_booking_status(self, request, pk=None):
        booking = self.get_object()

        old_status = booking.booking_status

        if booking.agency != request.user.agency_profile:
            logger.warning("Unauthorized booking status update attempt on booking %s by agency %s", pk, request.user.agency_profile.id)
            return Response({"detail":"not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = BookingStatusUpdateSerializer(
            booking,
            data=request.data,
            partial=True,
            context={"request":request}
        )
        serializer.is_valid(raise_exception=True)

        booking.booking_status = serializer.validated_data["booking_status"]
        booking.save(update_fields=["booking_status", "updated_at"])

        logger.info(
            "Booking %s status updated: %s > %s by %s",
            booking.id, old_status, booking.booking_status, request.user
        )

        return Response(self.get_serializer(booking).data)
    