from django.contrib import admin
from recommendations.models import Interest

# Register your models here.

@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering=("name",)