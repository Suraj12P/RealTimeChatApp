import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const roomName = room.trim().toLowerCase();
    
   try {
      const response = await fetch("http://localhost:8000/api/create-room/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_name: roomName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create/join room");
      }

      navigate(`/chat/${roomName}`, { state: { username } });
    } catch (error: any) {
      console.error("Room creation failed:", error.message);
      alert("Could not create or join the room: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0065F8] to-purple-600 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Join Chat Room
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xl font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-md focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="room"
              className="block text-xl font-medium text-gray-700"
            >
              Room Name
            </label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room name"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-md focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 text-lg bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
