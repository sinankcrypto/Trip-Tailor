# chat/urls.py
from django.urls import path
from .views import (
    UserChatListAPIView,
    AgencyChatListAPIView,
    ChatMessagesAPIView,
)


urlpatterns = [
    path("user/chats/", UserChatListAPIView.as_view(), name="user-chat-list"),
    path("agency/chats/", AgencyChatListAPIView.as_view(), name="agency-chat-list"),
    path("messages/<int:package_id>/", ChatMessagesAPIView.as_view(), name="chat-messages"),
]