from rest_framework import serializers
from .models import Room, Message

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'room_name']

class MessageSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(write_only=True)  # For input
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ", read_only=True)
    room = serializers.SerializerMethodField(read_only=True)  # For output

    class Meta:
        model = Message
        fields = ['id', 'username', 'message', 'timestamp', 'room_name', 'room']

    def create(self, validated_data):
        room_name = validated_data.pop('room_name')
        try:
            room = Room.objects.get(room_name=room_name)
        except Room.DoesNotExist:
            raise serializers.ValidationError(f"Room '{room_name}' not found.")

        return Message.objects.create(room=room, **validated_data)

    def get_room(self, obj):
        return obj.room.room_name
