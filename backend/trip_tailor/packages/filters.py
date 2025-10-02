import django_filters
from .models import Package

class PackageFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(field_name="title", lookup_expr="icontains")
    agency = django_filters.CharFilter(field_name="agency__agency_name", lookup_expr="icontains")

    class Meta:
        model = Package
        fields = ["search", "agency"]
