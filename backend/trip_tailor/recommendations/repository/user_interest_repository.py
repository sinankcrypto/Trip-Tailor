from recommendations.models import UserInterest
from django.db import transaction

class UserInterestRepository:
    def get_by_user(self, user):
        return UserInterest.objects.filter(user=user).select_related("interest")
    
    def set_user_interests(self, user, interests):
        with transaction.atomic():
            UserInterest.objects.filter(user=user).delete()
            UserInterest.objects.bulk_create([
                UserInterest(user=user, interest=interest)
                for interest in interests
            ])