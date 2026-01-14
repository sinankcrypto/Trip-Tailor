import json
from rest_framework import serializers
from .models import Package,PackageImage
from agency_app.models import AgencyProfile

class AgencyMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyProfile
        fields = ("agency_name", "profile_pic", "description", "phone_number", "address")
        read_only_fields = fields

class PackageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageImage
        fields = ["id", "image_url"]

class PackageSerializer(serializers.ModelSerializer):
    images = PackageImageSerializer(many = True, read_only = True)
    main_image = serializers.ImageField(write_only=True, required=False)
    agency = AgencyMiniSerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    interest_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        write_only=True,
        required=False,
        allow_empty=True,
        default=list
    )

    class Meta:
        model = Package
        fields = "__all__"
        read_only_fields = ("agency", "is_deleted")

    def validate_interest_ids(self, value):
        """
        Handle multipart/form-data  JSON string
        """
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return []
            try:
                parsed = json.loads(value)
                if not isinstance(parsed, list):
                    raise ValueError("JSON must be an array")
                if not all(isinstance(i, (int, float)) and float(i).is_integer() for i in parsed):
                    raise ValueError("All values must be integers")
                value = [int(i) for i in parsed]
            except (json.JSONDecodeError, ValueError) as e:
                raise serializers.ValidationError(
                    f"interest_ids must be a valid JSON array of integers. Got: {value!r} "
                    f"Error: {str(e)}"
                )
        elif not isinstance(value, list):
            raise serializers.ValidationError("interest_ids must be a list or json string array")
            
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["main_image"] = instance.main_image  
        return rep