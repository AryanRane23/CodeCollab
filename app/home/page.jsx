'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const { data: session, status } = useSession();

  const handleCreateRoom = async () => {
    const roomId = uuidv4();
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, language }),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(`Failed to create room: ${err.error || 'Unknown error'}`);
    }

    navigator.clipboard.writeText(`${window.location.origin}/${language}/${roomId}`);
    router.push(`/${language}/${roomId}`);
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return alert('Please enter a room code');

    const res = await fetch(`/api/rooms/${roomCode.trim()}`);
    if (!res.ok) return alert('❌ Invalid room code');

    const { language } = await res.json();
    router.push(`/${language}/${roomCode.trim()}`);
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      
      {/* Greetings HEADER */}
      {status === 'loading' ? (
        <p className="text-gray-300">Loading session...</p>
      ) : session ? (
        <h2 className="text-2xl font-bold mb-6">
          Welcome, {session.user.name || 'User'}!
        </h2>
      ) : (
        <h2 className="text-2xl font-bold mb-6">Welcome, Guest!</h2>
      )}

      {/* Language Selector */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 p-2 rounded border-white bg-gray-800 text-white"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      {/* Create Room Button */}
      <button
        onClick={handleCreateRoom}
        className="bg-blue-600 text-white px-6 py-2 rounded mb-6 hover:bg-blue-700 transition"
      >
        Create Room
      </button>

      {/* Join Room */}
      <div className="flex gap-2 text-white">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter room code"
          className="border p-2 rounded text-white"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
