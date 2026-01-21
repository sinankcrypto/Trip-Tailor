from user_auth.repository.user_repository import UserRepository
from agency_app.repository.agency_repository import AgencyRepository
from bookings.repositories.booking_repository import BookingRepository
from payments.repository.payment_repository import PaymentRepository

class SalesReportRepository:
    """
    Aggregates all admin-level sales metrics.
    """

    @staticmethod
    def generate_report(start_date=None, end_date=None):
        total_bookings = BookingRepository.get_total_bookings_by_date(
            start_date=start_date,
            end_date=end_date
        )
        total_amount = PaymentRepository.get_total_amount_transferred_by_date(
            start_date=start_date,
            end_date=end_date
        )
        total_platform_fee = PaymentRepository.get_total_platform_fee_collected_by_date(
            start_date=start_date,
            end_date=end_date
        )
        new_users = UserRepository.get_new_users_count_by_date(
            start_date=start_date,
            end_date=end_date
        )
        new_agencies = AgencyRepository.get_new_agencies_count_by_date(
            start_date=start_date,
            end_date=end_date
        )
        avg_booking_price = BookingRepository.get_average_booking_price_by_date(
            start_date=start_date,
            end_date=end_date
        )
        avg_platform_fee = PaymentRepository.get_average_platform_fee_by_date(
            start_date=start_date,
            end_date=end_date
        )

        return {
            "time_period": {
                "start_date": start_date,
                "end_date": end_date,
                "label": "All Time" if not start_date and not end_date else "Custom Range",
            },
            "metrics": {
                "total_bookings": total_bookings,
                "total_amount_transferred": total_amount,
                "total_platform_fee_collected": total_platform_fee,
                "new_users_count": new_users,
                "new_agencies_count": new_agencies,
                "average_booking_price": avg_booking_price,
                "average_platform_fee": avg_platform_fee,
            },
        }
