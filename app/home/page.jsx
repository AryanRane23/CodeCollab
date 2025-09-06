'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import styles from "../components/GlassCard.module.css";

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

    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">

      <h3 className='text-amber-50 font-bold absolute top-[20px] left-[20px]'>CodeCollab</h3>

      {/* Greetings HEADER */}
      {status === 'loading' ? (
        <p className="text-gray-300">Loading session...</p>
      ) : session ? (
        <h2 className="text-[40px] font-medium absolute top-[60px] bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Welcome, {session.user.name || 'User'}!
        </h2>
      ) : (
        <h2 className="text-[40px] font-extralight absolute top-[60px]">Welcome, Guest!</h2>
      )}

      {/* Description */}
      <div className='absolute top-[130px] text-center text-gray-200'>
        Your interactive coding workspace awaits! Easily create a new room or join an existing one, collaborate with teammates, share ideas instantly, and <br></br> build projects together seamlessly in real-time, all in one unified platform
      </div>

      <div className="flex gap-[600px]">
        {/* Card 1 */}
        <div className={styles.container}>
          <div className={styles.box}>
            <div className='flex flex-row gap-4'>
              <div className="flex items-center justify-center box-border border border-black w-14 h-14 rounded-2xl bg-gradient-to-tl from-indigo-500 to-fuchsia-500 hover:bg-[#7e45ff]">
                <i className="fa-regular fa-plus text-4xl text-white"></i>
              </div>

              <h2 className="text-2xl font-extralight mt-3" >Create Room</h2></div>

            {/* Language Selector */}
            {/* <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 p-2 rounded border-white bg-gray-800 text-white cursor-pointer"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select> */}

            <div className='text-gray-300 mb-4'>
              Start a new collaborative coding session with your preferred programming language and invite your team.
            </div>
            {/* Create Room Button */}
            <button
              onClick={handleCreateRoom}
              className=" whitespace-nowrap  text-sm font-medium ring-offset-background  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-tl from-indigo-500 to-fuchsia-500  h-[42px] z-10 hover:opacity-90  text-black px-4 py-2 rounded hover:bg-[#7e45ff] transition cursor-pointer  "
            >
              Create Room
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className={styles.container}>
          <div className={styles.box}>
            <div className='flex flex-row gap-4'>
              <div className='flex items-center justify-center box-border border border-black w-14 h-14 rounded-2xl text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 bg-[linear-gradient(90deg,rgba(135,224,63,1)_22%,rgba(30,230,73,1)_69%)] text-black z-10 hover:opacity-90 hover:bg-green-700 transition'>
                <i class="fa-regular fa-user text-3xl text-white"></i>
              </div>

              <h2 className="text-2xl font-extralight mt-3">Join Room</h2> </div>

            <div className='text-gray-300 mt-4 '>
              Enter a room code to join an existing collaborative coding session and start coding with others.
            </div>
            {/* Enter room Code */}
            <div className="flex text-white mb-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="border p-1 rounded text-white w-full mt-4 text-sm "
              />
            </div>
            {/* Join Room Button */}
            <button
              onClick={handleJoinRoom}
              className="whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 bg-[linear-gradient(90deg,rgba(135,224,63,1)_22%,rgba(30,230,73,1)_69%)] text-black  h-[42px] z-10 hover:opacity-90 px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


