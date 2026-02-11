from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny

from notifications.repositories.notification_repository import NotificationRepository
from notifications.serializers import NotificationSerilizer

# Create your views here.

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerilizer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NotificationRepository.get_for_user(self.request.user)
    
    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        NotificationRepository.mark_as_read(notification, request.user)
        return Response({"detail": "Mark as read"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"unread": count})
    
    @action(detail=False, methods=["post"])
    def mark_all_as_read(self, request):
        NotificationRepository.mark_all_as_read(request.user)
        return Response({"detail": "All marked as read"})