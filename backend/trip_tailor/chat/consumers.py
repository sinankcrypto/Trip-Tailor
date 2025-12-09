import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .repositories.chat_repository import ChatRepository

User = get_user_model()

logger = logging.getLogger(__name__)

class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            logger.info("the user is anonymous, closing")
            await self.close(code=4001)
            return 

        self.session_id = int(self.scope["url_route"]["kwargs"]["session_id"])

        self.session = await self.get_session(self.session_id)

        self.room_group_name = f"chat_session_{self.session.id}"

        #join private room
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        #load message history
        # messages = await self.get_message_history()
        # for msg in messages:
        #     await self.send(text_data=json.dumps({
        #         "type": "history",
        #         "id": msg.id,
        #         "message": msg.content,
        #         "sender": msg.sender.username,
        #         "is_me": msg.sender == self.user,
        #         "timestamp": msg.timestamp.isoformat(),
        #     }))

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            logger.info("WebSocket disconnected cleanly: %s", self.room_group_name)
        else:
            logger.warning("WebSocket disconnect before connect completed")

    async def receive(self, text_data = None):
        data = json.loads(text_data)
        message_text = data.get("message", "").strip()
        if not message_text:
            return 
        
        # Save message + get object
        message = await self.save_message(message_text)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": message.id,
                "message":message.content,
                "sender": self.user.username,
                "sender_id": self.user.id,
                "timestamp": message.timestamp.isoformat(),
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "id": event["id"],
            "message": event["message"],
            "sender": event["sender"],
            "sender_id": event["sender_id"],
            "is_me": event["sender_id"] == self.user.id,
            "timestamp": event["timestamp"],
        }))


    # @database_sync_to_async
    # def get_message_history(self):
    #     try:
    #         session = ChatRepository.get_or_create_session(
    #             package_id=self.package_id,
    #             user=self.user
    #         )
    #         return ChatRepository.get_recent_messages(session, limit=100)
    #     except Exception as e:
    #         logger.error("Failed to load history: %s", e)
    #         return []
        
    @database_sync_to_async
    def save_message(self, content: str):
        session = ChatRepository.get_session_by_id(self.session_id)
        return ChatRepository.create_message(
            session=session,
            sender=self.user,
            content=content
        )
    
    @database_sync_to_async
    def get_session(self, session_id):
        return ChatRepository.get_session_by_id(session_id)