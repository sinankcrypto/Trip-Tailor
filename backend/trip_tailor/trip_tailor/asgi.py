"""
ASGI config for trip_tailor project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from chat.middleware import JWTAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trip_tailor.settings')

def get_websocket_urlpatterns():
    from chat.routing import websocket_urlpatterns
    return websocket_urlpatterns

application = ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            JWTAuthMiddleware(
                URLRouter(get_websocket_urlpatterns())
            ))
    ),
})