from rest_framework import serializers
from ..infra.services.cloudinary_service import CloudinaryService
    
class UserProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    place = serializers.CharField(max_length=200, allow_blank=True, required=False)
    profile_pic = serializers.ImageField(allow_empty_file=True, required=False)
    phone_number = serializers.CharField(max_length=15, allow_blank=True, required=False)  # ✅ if in profile

    def validate_profile_pic(self, value):
        pic = self.initial_data.get("profile_pic")

        if hasattr(pic, "read"):
            return CloudinaryService.upload_image(pic)
        
        return value

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "user_id": instance.user_id,
            "first_name": instance.first_name,
            "last_name": instance.last_name,
            "place": instance.place,
            "profile_pic": instance.profile_pic,
            "phone_number": getattr(instance, "phone_number", None),  # ✅ from profile
            "email": getattr(instance.user, "email", None),  # ✅ from related user
        }