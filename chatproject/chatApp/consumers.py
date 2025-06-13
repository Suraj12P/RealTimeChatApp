import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chatApp.models import Room, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        saved_message = await self.create_message(data)
        if not saved_message:
            return  # Don't broadcast if message creation failed

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': saved_message.id,
                'username': saved_message.username,
                'message': saved_message.message,
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],  # ✅ send ID for deletion/editing
            'username': event['username'],
            'message': event['message'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def create_message(self, data):
        room_name = data.get('room_name', '').strip().lower()
        username = data.get('username')
        message_text = data.get('message')

        if not (room_name and username and message_text):
            print("Missing data fields:", data)
            return None

        try:
            room = Room.objects.get(room_name=room_name)
        except Room.DoesNotExist:
            print(f"Room '{room_name}' does not exist.")
            return None

        return Message.objects.create(
            room=room,
            username=username,
            message=message_text
        )
