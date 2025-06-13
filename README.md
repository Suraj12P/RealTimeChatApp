# 💬 Real-Time Chat Application (Django + React + WebSockets)

This is a real-time chat application built using **Django** (backend), **React** (frontend), and **WebSockets** powered by **Django Channels**. Users can join a chat room, send messages, and delete their own messages instantly.

## 🔧 Features

- ✅ Join rooms and chat in real-time
- ✅ Message broadcast using WebSocket
- ✅ Delete messages (own messages only)
- ✅ Scroll-to-latest message
- ✅ Responsive UI with Tailwind CSS

---

## ⚙️ Tech Stack

| Layer     | Tech                                 |
|-----------|--------------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS      |
| Backend   | Django, Django REST Framework        |
| Realtime  | Django Channels + WebSocket          |
| Database  | SQLite (or PostgreSQL in production) |

---

## 🔌 WebSockets Overview

This project uses **WebSockets** for real-time messaging.

- WebSocket connections are established at:
ws://localhost:8000/ws/chat/<room_name>/

- When a message is sent:
- It is first saved in the backend DB.
- Then it's broadcast to all connected clients in that room using Django Channels.

- Backend:
- Uses `AsyncWebsocketConsumer` in Django Channels.
- Messages are sent and received in JSON format.

- Frontend:
- Uses [`react-use-websocket`](https://www.npmjs.com/package/react-use-websocket) to manage WebSocket connections easily.
- Auto reconnects on disconnection.

---
