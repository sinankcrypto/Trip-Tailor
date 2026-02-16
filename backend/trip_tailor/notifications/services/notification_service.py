from notifications.repositories.notification_repository import NotificationRepository

class NotificationService:

    @staticmethod
    def notify_booking_cancelled(booking, cancelled_by):
        if cancelled_by == booking.user:
            notification = NotificationRepository.create(
                recipient=booking.agency.user,
                title="Booking Cancelled By User",
                message=(
                    f"The booking for '{booking.package.title}' "
                    f"on {booking.date} has been cancelled by user {booking.user}."
                ),
                notification_type="BOOKING_CANCELLED",
                reference_id=booking.id,
            )
        elif hasattr(cancelled_by, "agency_profile"):
            notification = NotificationRepository.create(
                recipient=booking.user,
                title="Booking Cancelled By Agency",
                message=(
                    f"Your booking for '{booking.package.title}' "
                    f"on {booking.date} has been cancelled by agency."
                ),
                notification_type="BOOKING_CANCELLED",
                reference_id=booking.id,
            )
        elif cancelled_by.is_staff:
            notification = NotificationRepository.create(
                recipient=booking.user,
                title="Booking Cancelled By Admin",
                message=(
                    f"Your booking for '{booking.package.title}' "
                    f"on {booking.date} has been cancelled by admin."
                ),
                notification_type="BOOKING_CANCELLED",
                reference_id=booking.id,
            )
            NotificationRepository.create(
                recipient=booking.agency.user,
                title="Booking Cancelled By Admin",
                message=(
                    f"The booking for '{booking.package.title}' "
                    f"on {booking.date} made by {booking.user} has been cancelled by admin."
                ),
                notification_type="BOOKING_CANCELLED",
                reference_id=booking.id,
            )
        else:
            notification = None
        return notification

    @staticmethod
    def notify_booking_created_for_agency(booking):
        return NotificationRepository.create(
            recipient=booking.agency.user,
            title="Booking Created",
            message=(
                f"New booking for '{booking.package.title}' "
                f"on {booking.date} has been made by {booking.user}"
            ),
            notification_type="BOOKING_CREATED",
            reference_id=booking.id,
        )
    
    @staticmethod
    def notify_refund_initiated(booking, amount):
        return NotificationRepository.create(
            recipient=booking.user,
            title="Refund Initiated",
            message=f"A refund of ₹{amount} has been initiated for your booking.",
            notification_type="REFUND",
            reference_id=booking.id,
        )
    
    @staticmethod
    def notify_refund_processed(booking, amount):
        return NotificationRepository.create(
            recipient=booking.user,
            title="Refund has been succesfully processed",
            message=f"A refund of ₹{amount} has been credited to your bank account for your booking.",
            notification_type="REFUND",
            reference_id=booking.id,
        )
    
    @staticmethod
    def notify_refund_failed(booking, amount):
        return NotificationRepository.create(
            recipient=booking.user,
            title="Refund has been marked failed",
            message=f"A refund of ₹{amount} has failed due to techincal issues.",
            notification_type="REFUND",
            reference_id=booking.id,
        )

    @staticmethod
    def notify_generic(
        *,
        recipient,
        title,
        message,
        notification_type=None,
        reference_id=None,
    ):
        """
        Escape hatch for uncommon notifications
        """
        return NotificationRepository.create(
            recipient=recipient,
            title=title,
            message=message,
            notification_type=notification_type,
            reference_id=reference_id,
        )