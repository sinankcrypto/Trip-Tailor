import jwt
from django.conf import settings
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
import re
import logging

logger = logging.Logger(__name__)

@database_sync_to_async
def get_user_from_token(token):
    """All Django/model imports happen INSIDE this function — safe for ASGI"""
    from django.contrib.auth.models import AnonymousUser
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()

        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        print(f"user id: {user_id}")
        if not user_id:
            return AnonymousUser()

        user = User.objects.get(id=user_id)
        return user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, jwt.DecodeError):
        return AnonymousUser()  
    except User.DoesNotExist:
        return AnonymousUser()
    except Exception as e:
        # Log in production
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        from django.contrib.auth.models import AnonymousUser
        scope["user"] = AnonymousUser()  # default

        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie", b"").decode("utf-8", errors="ignore")

        token = None
        if cookie_header:
            match = re.search(r"(?:access_token)=([^;]+)", cookie_header)
            if match:
                token = match.group(1)

        if not token:
            query = scope.get("query_string", b"").decode()
            import urllib.parse
            params = urllib.parse.parse_qs(query)
            token = params.get("token", [None])[0]

        if token:
            user = await get_user_from_token(token)
            scope["user"] = user

        return await self.app(scope, receive, send)