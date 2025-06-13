import { useParams, useLocation } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { type FormEvent } from "react";
import { MdDelete } from "react-icons/md";

interface Message {
  id: number;
  username: string;
  message: string;
  timestamp: string | number | Date;
}

interface LocationState {
  username?: string;
}

const ChatRoom = () => {

  const { roomName } = useParams();
  const { state } = useLocation();
  const username = (state as LocationState)?.username || "Anonymous";

  const {
    messages,
    message,
    setMessage,
    isLoading,
    error,
    sendChatMessage,
    deleteMessage,
    messagesEndRef,
  } = useChat(roomName || "", username);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendChatMessage();
  };

  const handleDeleteMessage = async (msg: Message) => {
    if (window.confirm("Delete this message permanently?")) {
      await deleteMessage(msg.id);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-bl from-[#0065F8] to-purple-600">
      <div className="flex flex-col bg-gray-100 w-full md:w-2/3 lg:w-1/2 h-full mx-auto">
        
        <div className="bg-blue-400 text-white px-6 py-4 shadow-lg">
          <h2 className="text-xl font-extrabold">
            Room: <span className="text-[26px] text-gray-300">{roomName}</span>
          </h2>
          <p className="text-lg">
            Welcome, <span className="text-2xl text-gray-300">{username}</span>!
          </p>
        </div>

      
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center text-xl text-gray-500">Loading messages...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`relative group flex ${
                  msg.username === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-lg sm:max-w-md p-2 rounded-xl shadow-lg text-lg relative ${
                    msg.username === username
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 "
                  }`}
                >
                  {msg.username !== username && (
                    <span className="font-semibold text-lg text-gray-600  block">
                      {msg.username}
                    </span>
                  )}
                  <p className="break-words">{msg.message}</p>
                  <span className="text-xs mt-1 text-gray-400 block text-right">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : "No timestamp"}
                  </span>

                  {msg.username === username && (
                    <button
                      onClick={() => handleDeleteMessage(msg)}
                      className="absolute top-1 right-1 hidden group-hover:block text-lg  text-white p-1 rounded"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

       
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 p-4 border-t border-blue-500 bg-white"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            required
            className="flex-1 text-lg p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
