from rest_framework import serializers
from .models import Package,PackageImage

class PackageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageImage
        fields = ["id", "image_url"]

class PackageSerializer(serializers.ModelSerializer):
    images = PackageImageSerializer(many = True, read_only = True)
    main_image = serializers.ImageField(write_only=True, required=False)
    agency_name = serializers.CharField(source="agency.agency_name", read_only=True)


    class Meta:
        model = Package
        fields = "__all__"
        read_only_fields = ("agency", "is_deleted")

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["main_image"] = instance.main_image  
        return rep