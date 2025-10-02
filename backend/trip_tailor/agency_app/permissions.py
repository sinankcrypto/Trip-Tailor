from rest_framework.permissions import BasePermission
from agency_app.models import AgencyProfile

class IsVerifiedAgency(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated and 
            hasattr(user, "agency_profile") and
            user.agency_profile.status == AgencyProfile.Status.VERIFIED
        )