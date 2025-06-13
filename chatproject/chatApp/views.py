from rest_framework import generics
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class MessageDelete(APIView):
   
    def delete(self, request, pk):
        try:
            message = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            return Response({"detail": "Message not found."}, status=404)

        message.delete()
 
        return Response({"detail": "Message deleted successfully."}, status=204)

class RoomList(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    
    def create(self, request, *args, **kwargs):
        room_name = request.data.get('room_name', '').lower().strip()

        if not room_name:
            return Response({"detail": "Room name is required."}, status=status.HTTP_400_BAD_REQUEST)

        room, created = Room.objects.get_or_create(room_name=room_name)
        serializer = self.get_serializer(room)

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)

class MessageList(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        room_name = self.kwargs['room_name'].lower().strip()

        try:
            room = Room.objects.get(room_name=room_name)
        except Room.DoesNotExist:
            raise NotFound("Room not found")

        return Message.objects.filter(room=room).order_by("timestamp")
