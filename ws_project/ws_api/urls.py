from django.urls import path, re_path
from ws_api import consumers

websocket_urlpatterns = [
    re_path(r'ws/(?P<room_name>\w+)/$', consumers.MyConsumer.as_asgi()),
]
