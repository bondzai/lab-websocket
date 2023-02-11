# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class MyConsumer(WebsocketConsumer):
    def connect(self):
        # self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        # Send message to room group
        if "trigger_count" in text_data_json:
            print("********** PIR **********")
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {"type": "chat_message",
                    "location": text_data_json["location"],
                    "trigger_count": text_data_json["trigger_count"],
                }
            )
        else:
            print("********** Magnetic **********")
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {"type": "chat_message",
                    "location": text_data_json["location"],
                    "max_room": text_data_json["max_room"],
                    "avaliable_room": text_data_json["avaliable_room"],
                }
            )

    # Receive message from room group
    def chat_message(self, event):
        print("**********")
        print(event)
        print("**********")
        
        # Send message to WebSocket
        if "trigger_count" in event:
            self.send(text_data=json.dumps(
                {
                    "location": event["location"],
                    "trigger_count": event["trigger_count"],
                }))
        else: 
            self.send(text_data=json.dumps(
                {
                    "location": event["location"],
                    "max_room": event["max_room"],
                    "avaliable_room": event["avaliable_room"],
                }))
