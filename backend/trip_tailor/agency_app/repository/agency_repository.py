from agency_app.models import AgencyProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class AgencyRepository:
    @staticmethod
    def get_all_agencies_with_profiles():
        return User.objects.filter(is_agency= True, is_deleted = False).select_related('agency_profile').order_by("-created_at")
    
    @staticmethod
    def get_profile(user):
        return AgencyProfile.objects.get(user=user)
    
    @staticmethod
    def update_profile(user, data):
        profile = AgencyProfile.objects.get(user=user)

        for attr, value in data.items():
            setattr(profile, attr, value)
        profile.save()

        return profile
    
    @staticmethod
    def get_agency_by_id(pk):
        return User.objects.get(pk = pk, is_agency = True)
    
    @staticmethod
    def count_of_all_agencies():
        return AgencyRepository.get_all_agencies_with_profiles().count()
    