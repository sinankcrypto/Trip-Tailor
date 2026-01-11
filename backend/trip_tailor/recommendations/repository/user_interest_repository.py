from recommendations.models import UserInterest
from django.db import transaction

class UserInterestRepository:
    @staticmethod
    def get_by_user(user):
        return UserInterest.objects.filter(user=user).select_related("interest")
    
    @staticmethod
    def set_user_interests(user, interests):
        """
        Replace user's interests (recommended approach)
        """
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
    
    @staticmethod
    def add_user_interests(user, interest_ids):
        existing_ids = set(
            UserInterest.objects.filter(
                user=user,
                interest_id__in=interest_ids
            ).values_list("interst_id", flat=True)
        )

        relations = [
            UserInterest(
                user=user,
                interest_id=interest_id
            )
            for interest_id in interest_ids
            if interest_id not in existing_ids  
        ]

        return UserInterest.objects.bulk_create(relations)
