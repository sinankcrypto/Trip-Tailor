# chat/urls.py
from django.urls import path
from .views import (
    UserChatListAPIView,
    AgencyChatListAPIView,
    ChatMessagesAPIView,
    ChatSessionCreateView,
)


urlpatterns = [
    path("user/chats/", UserChatListAPIView.as_view(), name="user-chat-list"),
    path("agency/chats/", AgencyChatListAPIView.as_view(), name="agency-chat-list"),
    path("package/<int:package_id>/", ChatSessionCreateView.as_view(), name="create-chat_session"),
    path("messages/<int:id>/", ChatMessagesAPIView.as_view(), name="chat-messages"),
]