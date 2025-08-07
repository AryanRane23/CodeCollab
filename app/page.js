// app/page.js (Home page)
'use client';
// import LanguageSelector from "./components/LanguageSelector"
import Authorization from "./components/Authorization";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuagidv4 } from 'uuid';

export default function HomePage() {
 
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  // Generate a room and redirect to /[language]?room=uuid
  const handleCreateRoom = () => {
    const roomId = uuagidv4();
    router.push(`/${language}/${roomId}`);
  };

  // Join a room if room code is valid
  const handleJoinRoom = async () => {
  if (!roomCode.trim()) return alert('Please enter a room code');

  // ask the server: “does this room exist, and what language was it created with?”
  const res = await fetch(`/api/rooms/${roomCode.trim()}`);
  if (!res.ok) return alert('❌  Invalid room code');

  const { language } = await res.json();   // <- host’s language
  router.push(`/${language}/${roomCode.trim()}`);
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Collaborative Code Editor</h1>

      {/* LOGIN PAGE */}
      <Authorization/>

      {/* Language Selector - DROPDOWN */}
      <select 
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 p-2 border rounded cursor-pointer"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      {/* Create Room Button */}
      <button
        onClick={handleCreateRoom}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 cursor-pointer"
      >
        Create Room
      </button>

      {/* Join Room Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter room code"
          className="border p-2 rounded"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Join Room
        </button>

        {/* if (!roomCode.trim()) {
         alert("Please enter a room code.");
         return;
}

2. Automatically copy invite link (when room is created):

navigator.clipboard.writeText(`${window.location.origin}/${language}/${roomId}`);
*/}

      </div>
    </div>
  );
}