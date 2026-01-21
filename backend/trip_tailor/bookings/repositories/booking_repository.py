from ..models import Booking
from django.shortcuts import get_object_or_404
from core.constants import BookingStatus
from django.db.models import Count, Avg
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from datetime import timedelta

class BookingRepository:
    @staticmethod
    def create(data: dict):
        return Booking.objects.create(**data)
    
    @staticmethod
    def get_all_by_user(user):
        return (
            Booking.objects
            .select_related("package", "user")
            .prefetch_related("review")
            .filter(user=user)
            .order_by("-created_at")
        )

    @staticmethod
    def get_all_by_agency(agency):
        return (
            Booking.objects
            .select_related("package", "user")
            .prefetch_related("review")
            .filter(agency=agency)
        ) 

    @staticmethod
    def get_by_id(booking_id):
        try:
            return (
                Booking.objects
                .select_related("package", "user")
                .prefetch_related("review")
                .get(id=booking_id)
            ) 
        except Booking.DoesNotExist:
            return None
    
    @staticmethod
    def update_payment_status(booking, status):
        booking.payment_status = status
        booking.save()
        return booking
    
    @staticmethod
    def get_by_id_and_user(booking_id, user):
        return get_object_or_404(Booking, id=booking_id, user=user)
    
    @staticmethod
    def get_all_bookings():
        return (
            Booking.objects
            .select_related('user', 'agency', 'package')
            .prefetch_related('review')
            .all().order_by('-created_at')
        ) 
    
    @staticmethod
    def get_by_id_for_update(pk):
        try:
            return Booking.objects.select_for_update().select_related("user", "package", "agency").get(pk=pk)
        except Booking.DoesNotExist:
            return None
    
    @staticmethod
    def get_conflicting_booking(user, package, start_date, end_date):
        return Booking.objects.filter(
            user=user,
            package=package,
            date__range=[start_date,end_date],
            booking_status=BookingStatus.ACTIVE
        ).first()
    
    @staticmethod
    def count_of_bookings():
        return BookingRepository.get_all_bookings().count()
    
    @staticmethod
    def monthly_booking_stats():
        """
        Returns booking count grouped by month
        """
        qs = (
            Booking.objects
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(bookings=Count("id"))
            .order_by("month")
        )

        return qs   
    
    @staticmethod
    def count_of_bookings_for_agency(agency):
        return BookingRepository.get_all_by_agency(agency).count()
    
    @staticmethod
    def count_of_booking_of_the_day_for_agency(agency):
        now = timezone.now()
        start_of_day = now.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        end_of_day = start_of_day + timezone.timedelta(days=1)

        today_bookings = Booking.objects.filter(
            agency=agency,
            created_at__gte=start_of_day,
            created_at__lt=end_of_day
        ).count()

        return today_bookings
    
    @staticmethod
    def weekly_bookings_current_week(agency):
        """
        Returns booking count for each day of the current week (Mon–Sun)
        """

        today = timezone.localdate()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        qs = (
            Booking.objects
            .filter(
                agency=agency,
                created_at__date__gte=start_of_week,
                created_at__date__lte=end_of_week
            )
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(bookings=Count("id"))
        )

        bookings_by_day = {
            entry["day"]: entry["bookings"]
            for entry in qs
        }

        result = []

        for i in range(7):
            day_date = start_of_week + timedelta(days=i)
            result.append({
                "day": day_date.strftime("%a"),  # Mon, Tue, ...
                "bookings": bookings_by_day.get(day_date, 0)
            })

        return result
    
    @staticmethod
    def get_total_bookings_by_date(start_date=None, end_date=None):
        qs = Booking.objects.all()

        if start_date:
            qs = qs.filter(created_at__date__gte=start_date)

        if end_date:
            qs = qs.filter(created_at__date__lte=end_date)

        return qs.count()
    
    @staticmethod
    def get_average_booking_price_by_date(start_date=None, end_date=None):
        qs = Booking.objects.all()

        if start_date:
            qs = qs.filter(created_at__date__gte=start_date)
        
        if end_date:
            qs = qs.filter(created_at__date__lte=end_date)

        return qs.aggregate(avg=Avg("amount"))["avg"] or 0