from rest_framework import serializers
from packages.serializers import PackageImageSerializer, AgencyMiniSerializer
from packages.models import Package
from .models import Interest, UserInteraction, PackageInterest, UserInterest

class RecommendedPackageSerializer(serializers.Serializer):
    images = PackageImageSerializer(many=True, read_only=True)
    agency = AgencyMiniSerializer(read_only=True)

    recommended_score = serializers.FloatField(read_only=True)
    matched_interests = serializers.ListField(
        child=serializers.CharField(),
        read_only=True
    )
    view_count = serializers.IntegerField(read_only=True)
    book_count = serializers.IntegerField(read_only=True)

    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Package
        fields = [
            "id",
            "title",
            "description",
            "price",
            "duration",
            "agency",
            "main_image",

            "average_rating",
            "total_reviews",

            "recommendation_score",
            "matched_interests",
            "view_count",
            "book_count",

            "created_at",
        ]

class InterestSerializer(serializers.Serializer):
    class Meta:
        model = Interest
        fields = ["id", "name"]

class UserInterestCreateSerializer(serializers.Serializer):
    interest_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )

    def validate_interest_ids(self, value):
        if len(set(value)) != len(value):
            raise serializers.ValidationError("Duplicate interests are not allowed")
        
        return value
    
class PackageInterestInputSerializer(serializers.Serializer):
    interest_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )

class UserInteractionSerializer(serializers.Serializer):
    class Meta:
        model = UserInteraction
        fields = "__all__"
        read_only_fields = ["user", "created_at"]