from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRepository:
    @staticmethod
    def get_user_by_username(username):
        return User.objects.filter(username=username).first()
    
    @staticmethod
    def get_user_by_id(id):
        return User.objects.filter(id=id).first()
    
    @staticmethod
    def get_user_by_email(email):
        return User.objects.filter(email__iexact=email.strip()).first()
    
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
    
    @staticmethod
    def count_of_all_users():
        return UserRepository.get_all_users().count()
    
    @staticmethod
    def check_user_exists(email):
        return User.objects.filter(email=email, is_deleted=False).exists()
    
    @staticmethod
    def get_new_users_count_by_date(start_date=None, end_date=None):
        qs = User.objects.filter(is_staff=False,is_agency=False, is_active=True, is_deleted=False)

        if start_date:
            qs.filter(created_at__date__gte=start_date)

        if end_date:
            qs.filter(created_at__date__lte=end_date)

        return qs.count()
    