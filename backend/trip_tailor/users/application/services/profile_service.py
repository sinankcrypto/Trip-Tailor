from users.infra.repositories.django_profile_repository import DjangoProfileRepository
from django.core.exceptions import ObjectDoesNotExist
from users.domain.exceptions import ProfileNotFoundError

class ProfileService:
    def __init__(self, repo):
        self.repo = repo

    def create_profile(self, user, data: dict):
        try:
            return self.repo.create_profile(user, data)
        except Exception as e:
            raise Exception(f"Failed to create profile: {e}")
    
    def update_profile(self, user, data: dict):
        try:
            return self.repo.update_profile(user, data)
        except ObjectDoesNotExist:
            raise ProfileNotFoundError(f"No profile found for user_id {user.id}")
    
    def get_profile_by_user_id(self, user_id):
        try:
            return self.repo.get_profile_by_user_id(user_id)
        except ObjectDoesNotExist:
            raise ProfileNotFoundError(f"No profile found for user_id {user_id}")