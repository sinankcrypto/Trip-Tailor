from rest_framework import serializers
from django.utils.timesince import timesince
from .models import ChatSession, Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.get_full_name", default="User")
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "content", "sender", "timestamp", "is_read", "is_me"]

    def get_is_me(self, obj):
        return obj.sender == self.context["request"].user


class UserChatListSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source="package.agency.name", read_only=True)
    package_title = serializers.CharField(source="package.title", read_only=True)
    last_message = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    unread = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            "id",
            "package_id",
            "agency_name",
            "package_title",
            "last_message",
            "time_ago",
            "unread",
        ]

    def get_last_message(self, obj):
        """Get the actual most recent message by timestamp"""
        last_msg = obj.messages.order_by("-timestamp").first()
        return last_msg.content if last_msg else ""

    def get_time_ago(self, obj):
        """Show human-readable time since last message"""
        last_msg = obj.messages.order_by("-timestamp").first()
        if last_msg:
            return timesince(last_msg.timestamp)
        return "Never"

    def get_unread(self, obj):
        """Count messages from agency that user hasn't read"""
        request_user = self.context["request"].user
        return obj.messages.filter(
            is_read=False,
            sender__agency_profile=obj.package.agency  # assuming sender is agency
        ).exclude(sender=request_user).count()


class AgencyChatListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username")
    package_title = serializers.CharField(source="package.title")
    last_message = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    unread = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = ["id", "user_id", "user_name", "package_title", "last_message", "time_ago", "unread"]

    def get_last_message(self, obj):
        msg = obj.messages.order_by("-timestamp").first()
        return msg.content if msg else ""

    def get_time_ago(self, obj):
        from django.utils.timesince import timesince
        msg = obj.messages.order_by("-timestamp").first()
        return timesince(msg.timestamp) if msg else "Never"

    def get_unread(self, obj):
        request_user = self.context["request"].user
        return obj.messages.filter(is_read=False).exclude(sender=request_user).count()