from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import Http404
import logging

from .repositories.chat_repository import ChatRepository
from .serializers import (
    UserChatListSerializer,
    AgencyChatListSerializer,
    MessageSerializer,
)
# Create your views here.

logger = logging.getLogger(__name__)

class ChatSessionCreateView(APIView):
    def post(self, request, package_id):
        session = ChatRepository.get_or_create_session(
            package_id=package_id,
            user=request.user
        )

        return Response({"session_id": session.id}, status=status.HTTP_200_OK)


class UserChatListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = ChatRepository.get_user_chat_sessions(request.user)
        data = UserChatListSerializer(sessions, many=True, context={"request": request}).data
        return Response(data)


class AgencyChatListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        agency = getattr(request.user, "agency_profile", None)
        if not agency:
            return Response({"error": "Not an agency"}, status=403)

        sessions = ChatRepository.get_agency_chat_sessions(agency)
        data = AgencyChatListSerializer(sessions, many=True, context={"request": request}).data
        return Response(data)


class ChatMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        session = ChatRepository.get_session_by_id(id)
        messages = ChatRepository.get_recent_messages(session)
        serializer = MessageSerializer(messages, many=True, context={"request": request})
        return Response(serializer.data)

    # def post(self, request, id):
    #     user = request.user
    #     content = request.data.get("message", "").strip()

    #     if not content:
    #         logger.warning("no content in message")
    #         return Response({"error": "Message required"}, status=400)
        
    #     try:
    #         session = ChatRepository.get_session_by_id(id)
    #     except Http404:
    #         logger.info("Session %s not found, creating new for user %s", id, user.username)
    #         session = ChatRepository.get_or_create_session(
    #             package_id=id,
    #             user=user
    #         )

    #     message = ChatRepository.create_message(session, request.user, content)
    #     serializer = MessageSerializer(message, context={"request": request})
    #     return Response(serializer.data, status=201)