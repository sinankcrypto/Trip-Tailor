from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRepository:
    @staticmethod
    def get_user_by_username(username):
        return User.objects.filter(username=username).first()
    
    @staticmethod
    def authenticate_user(username,password):
        return authenticate(username=username, password=password)
    
    @staticmethod
    def get_all_users():
        return User.objects.filter(is_superuser= False, is_agency= False, is_deleted= False).order_by("-created_at")
    
    @staticmethod
    def get_or_create_google_user(email: str, username: str, is_agency: bool= False):
        user, created = User.objects.get_or_create(
            email = email,
            defaults= {
                "username": username,
                "is_active": True,
                "is_agency": is_agency,
            },
        )

        if created:
            user.set_unusable_password()
            user.save()

        return user, created
    
    
    
    