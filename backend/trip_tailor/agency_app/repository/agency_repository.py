from user_auth.domain.models import CustomUser
from agency_app.models import AgencyProfile

class AgencyRepository:
    @staticmethod
    def get_all_agencies_with_profiles():
        return CustomUser.objects.filter(is_agency= True, is_deleted = False).select_related('agency_profile')
    
    @staticmethod
    def get_profile(user):
        return AgencyProfile.objects.get(user=user.id)
    
    @staticmethod
    def update_profile(user, data):
        profile = AgencyProfile.objects.get(user=user)

        for attr, value in data.items():
            setattr(profile, attr, value)
        profile.save()

        return profile
    