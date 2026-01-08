from recommendations.models import UserInterest
from django.db import transaction

class UserInterestRepository:
    @staticmethod
    def get_by_user(self, user):
        return UserInterest.objects.filter(user=user).select_related("interest")
    
    @staticmethod
    def set_user_interests(self, user, interests):
        with transaction.atomic():
            UserInterest.objects.filter(user=user).delete()
            UserInterest.objects.bulk_create([
                UserInterest(user=user, interest=interest)
                for interest in interests
            ])

    @staticmethod
    def get_user_interest_ids(user):
        return (
            UserInterest.objects.filter(user=user).values_list("interest_id", flat=True)
        )
