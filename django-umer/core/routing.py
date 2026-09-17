"""
I used this file to route the websocket url
"""
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from core.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/test/(?P<room_name>[^/]+)/$', ChatConsumer.as_asgi()),
]

# the websocket will open at 127.0.0.1:8000/ws/<room_name>
application = ProtocolTypeRouter({
    'websocket':
        URLRouter(
            websocket_urlpatterns
        ),})
