from users.infra.models import UserProfile
from users.domain.repositories.profile_repository import AbstractProfileRepository
from users.infra.services.cloudinary_service import CloudinaryService
from users.domain.entities.profile_entity import UserProfileEntity
from users.infra.models import UserProfile

class DjangoProfileRepository(AbstractProfileRepository):

    def create_profile(self, user, data: dict):
        profile_pic_url = None
        if "profile_pic" in data and data["profile_pic"]:
            profile_pic_url = CloudinaryService.upload_image(data["profile_pic"])

        profile = UserProfile.objects.create(
            user = user,
            first_name = data.get("first_name", ""),
            last_name = data.get("last_name",""),
            place = data.get("place",""),
            phone_number = data.get("phone_number",""), 
            profile_pic = profile_pic_url,
        )

        return profile
    
    def update_profile(self, user, data: dict):
        profile = UserProfile.objects.get(user=user)

        if "profile_pic" in data and data["profile_pic"]:
            profile.profile_pic = CloudinaryService.upload_image(data["profile_pic"])

        profile.first_name = data.get("first_name", profile.first_name)
        profile.last_name = data.get("last_name",profile.last_name)
        profile.place = data.get("place", profile.place)
        profile.phone_number = data.get("phone_number", profile.phone_number)

        profile.save()  
        return profile
    
    def get_profile_by_user_id(self, user_id):
        return UserProfile.objects.select_related("user").get(user__id=user_id)
    
    def to_entity(self, obj: UserProfile) -> UserProfileEntity:
        return UserProfileEntity(
            id = obj.id,
            user_id= obj.user.id,
            first_name= obj.first_name,
            last_name= obj.last_name,
            place= obj.place,
            profile_pic= obj.profile_pic
        )
    
    def to_model(self, entity: UserProfileEntity) -> UserProfile:
        return UserProfile(
            id = entity.id,
            user_id = entity.user_id,
            first_name = entity.first_name,
            last_name = entity.last_name,
            place = entity.place,
            profile_pic = entity.profile_pic
        )

