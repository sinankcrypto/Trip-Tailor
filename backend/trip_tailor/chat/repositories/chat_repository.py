import logging
from django.utils import timezone
from django.db import transaction
from typing import Optional
from ..models import ChatSession, Message
from django.contrib.auth import get_user_model
from django.db.models import Q, Max, Count
from django.shortcuts import get_object_or_404

User = get_user_model()

logger = logging.getLogger(__name__)

class ChatRepository:
    @staticmethod
    @transaction.atomic
    def get_or_create_session(package_id: int, user):
        """one private session per user per package"""
        session,created = ChatSession.objects.select_for_update().get_or_create(
            package_id=package_id,
            user=user,
            defaults={"created_at": timezone.now()}
        )
        if created:
            logger.info("New chat session created : user=%s package=%s", user.id,   package_id)
        session.updated_at = timezone.now()
        session.save(update_fields=["updated_at"])
        return session
    
    @staticmethod
    @transaction.atomic
    def create_message(session: ChatSession, sender, content: str ):
        if not content.strip():
            raise ValueError("Message cannot be empty")
        
        if len(content)>2000:
            ValueError("Message too long")

        message = Message.objects.create(
            chat_session=session,
            sender=sender,
            content=content.strip()
        )
        logger.info(
            "New message in session %s: from  %s (%s chars)",
            session.id, sender.username, len(content)
        )

        return message
    
    @staticmethod
    def get_recent_messages(session: ChatSession, limit: int=50):
        return list(
            session.messages.select_related("sender")
            .order_by("timestamp")[:limit]
        )
    
    @staticmethod
    def mark_messages_as_read(session: ChatSession, reader):
        """Mark all unread messages from other persion as read"""
        count = session.messages.filter(is_read=False).exclude(sender=reader).update(is_read=True)
        if count:
            logger.info("Marked %s messages as read in session %s by %s", count, session.id, reader)
        return count
    
    @staticmethod
    def get_user_chat_sessions(user):
        return ChatSession.objects.filter(user=user).annotate(
                last_message_time=Max("messages__timestamp"),
                unread_count=Count(
                    "messages",
                    filter=Q(messages__is_read=False) & ~Q(messages__sender=user)
                )
            ).order_by("-last_message_time")
    
    @staticmethod
    def get_agency_chat_sessions(agency_profile):
        return ChatSession.objects.filter(package__agency=agency_profile)\
            .annotate(
                last_message_time=Max("messages__timestamp"),
                unread_count=Count(
                    "messages",
                    filter=Q(messages__is_read=False) & ~Q(messages__sender=agency_profile.user)
                )
            )\
            .order_by("-last_message_time")

    @staticmethod
    def get_session_for_user_or_agency(package_id, user):
        """
        Get chat session for a package if user is either:
        - The customer (user)
        - OR the agency owner
        """
        return get_object_or_404(
            ChatSession,
            package_id,
            Q(user=user) | Q(package__agency=user.agency_profile)
        )