from django.urls import path
from . import views





urlpatterns = [
    path('create-room/', views.RoomList.as_view(),name='room-list-create'),
    path('messages/<str:room_name>/', views.MessageList.as_view()),
    path('messages/<int:pk>/delete/', views.MessageDelete.as_view(), name='delete-message'),
]

