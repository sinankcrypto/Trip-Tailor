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
    
    @staticmethod
    def get_new_agencies_count_by_date(start_date=None, end_date=None):
        qs = AgencyRepository.get_all_agencies_with_profiles()

        if start_date:
            qs = qs.filter(created_at__date__gte=start_date)

        if end_date:
            qs = qs.filter(created_at__date__lte=end_date)

        return qs.count()
    