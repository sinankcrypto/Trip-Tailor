from notifications.models import Notification
from notifications.serializers import NotificationSerilizer
from notifications.utils.ws import push_notification

from django.core.exceptions import PermissionDenied

class NotificationRepository:

    @staticmethod
    def create(
         *,
        recipient,
        title,
        message,
        notification_type=None,
        reference_id=None,
        chat_session=None,
    ):
        notification = Notification.objects.create(
           recipient=recipient,
            title=title,
            message=message,
            notification_type=notification_type,
            reference_id=reference_id,
            chat_session=chat_session,
        )

        payload = NotificationSerilizer(notification).data

        push_notification(recipient.id, payload)

        return notification
    
    @staticmethod
    def get_for_user(user):
        return Notification.objects.filter(recipient=user)
    
    @staticmethod
    def unread_count(user):
        return Notification.objects.filter(
            recipient=user, is_read=False
        ).count()
    
    @staticmethod
    def mark_as_read(notification, user):
        if notification.recipient != user:
           raise PermissionDenied("Not allowed.")
        
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return notification
    
    @staticmethod
    def mark_all_as_read(user):
        Notification.objects.filter(
            recipient=user,
            is_read=False
        ).update(is_read=True)