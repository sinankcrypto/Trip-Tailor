from user_auth.domain.models import CustomUser
from django.contrib.auth import authenticate

class UserRepository:
    @staticmethod
    def get_user_by_username(username):
        return CustomUser.objects.filter(username=username).first()
    
    @staticmethod
    def authenticate_user(username,password):
        return authenticate(username=username, password=password)
    
    
    