from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .repositories.chat_repository import ChatRepository
from .serializers import (
    UserChatListSerializer,
    AgencyChatListSerializer,
    MessageSerializer,
)
# Create your views here.

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

    def get(self, request, package_id):
        session = ChatRepository.get_or_create_session(package_id, request.user)
        messages = ChatRepository.get_recent_messages(session)
        serializer = MessageSerializer(messages, many=True, context={"request": request})
        return Response(serializer.data)

    def post(self, request, package_id):
        session = ChatRepository.get_or_create_session(package_id, request.user)
        content = request.data.get("message", "").strip()
        if not content:
            return Response({"error": "Message required"}, status=400)

        message = ChatRepository.create_message(session, request.user, content)
        serializer = MessageSerializer(message, context={"request": request})
        return Response(serializer.data, status=201)