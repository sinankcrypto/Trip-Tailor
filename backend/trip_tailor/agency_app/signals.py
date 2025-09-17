from django.db.models.signals import post_save
from django.dispatch import receiver
from user_auth.domain.models import CustomUser
from agency_app.models import AgencyProfile

@receiver(post_save, sender = CustomUser)
def create_agency_profile(sender, instance, created, **kwargs): 

    if created and instance.is_agency:
        AgencyProfile.objects.create(user= instance)