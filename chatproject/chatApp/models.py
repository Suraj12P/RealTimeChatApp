from django.db import models


class Room(models.Model):
    room_name = models.CharField(max_length=255,unique=True)
    
    
    def save(self, *args, **kwargs):
       self.room_name = self.room_name.lower()
       super().save(*args, **kwargs)
        
    def __str__(self):
        return self.room_name
    
    
class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE,related_name='messages')
    username = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    
        
    def __str__(self):
        return f'{self.username}: {self.message[:20]}'