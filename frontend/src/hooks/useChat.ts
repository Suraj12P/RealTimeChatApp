import { useState, useCallback, useRef, useEffect } from "react";
import useWebSocket from "react-use-websocket";

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

export const useChat = (roomName: string, username: string) => {
 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const normalizedRoom = roomName.toLowerCase();

  const { sendMessage, lastMessage } = useWebSocket(
    `ws://localhost:8000/ws/chat/${normalizedRoom}/`,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  // Fetch initial messages
  useEffect(() => {
    
    const fetchMessages = async () => {
      try {
       
        const response = await fetch(
          `http://localhost:8000/api/messages/${roomName}/`
        );
        const data = await response.json();
        setMessages(data);
        setIsLoading(false);

      } catch (err) {
        setError("Failed to load messages");
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomName]);

  // Handle new incoming messages
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      

      if (!data.id) {
        console.warn("WebSocket message missing ID:", data);
        return;
      }

      const newMessage: ChatMessage = {
        id: data.id,
        username: data.username,
        message: data.message,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, newMessage]);
    }
  }, [lastMessage]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message through WebSocket
  const sendChatMessage = useCallback(() => {
    
    if (message.trim()) {
      sendMessage(
        JSON.stringify({
          message,
          username,
          room_name: roomName,
        })
      );
      setMessage("");
    }
  }, [message, username, roomName, sendMessage]);

  // Delete message (API call)
  const deleteMessage = useCallback(async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/messages/${id}/delete/`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        console.error("Failed to delete message:", await res.text());
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  }, []);

  return {
    messages,
    setMessages,
    message,
    setMessage,
    isLoading,
    error,
    sendChatMessage,
    deleteMessage, 
    messagesEndRef,
  };
};
