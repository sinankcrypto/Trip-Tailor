from users.infra.repositories.django_profile_repository import DjangoProfileRepository

class ProfileService:
    def __init__(self):
        self.repo = DjangoProfileRepository()

    def create_profile(self, user, data: dict):
        return self.repo.create_profile(user, data)
    
    def update_profile(self, user, data: dict):
        return self.repo.update_profile(user, data)
    
    def get_profile_by_user_id(self, user_id):
        return self.repo.get_profile_by_user_id(user_id)