//  app/page.js (Home page)
'use client';
import BlackHole from './components/BlackHole';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLoginClick = () => {
    if (status === "authenticated") router.push('/home');
    else router.push('/login');
  };

  const handleSignupClick = () => {
    if (status === "authenticated") router.push('/home');
    else router.push('/signup');
  };

  return (
    // <div className="relative z-10 bg-opacity-60 shadow-lg text-center overflow-hidden bg-black" >
    <div className=" fixed inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <BlackHole />


      {/* Navbar */}
      <h3 className='text-amber-50 font-bold absolute top-[20px] '>CodeCollab</h3>

      {/* Only show Login/Signup if user is NOT logged in */}
      {status !== "authenticated" && (
        <>
          <button
            onClick={handleLoginClick}
            className="border-1 rounded-3xl border-gray-400 text-gray-200 text-sm font-thin py-1 px-3 absolute right-[132px] top-[28px] cursor-pointer">
            Login
          </button>
          <button
            onClick={handleSignupClick}
            className="border-1 rounded-3xl border-gray-400 text-gray-200 text-sm font-thin py-1 px-3 absolute right-[50px] top-[28px] cursor-pointer">
            Sign up
          </button>
        </>
      )}
      {/* Only show Logout if user IS logged in */}
      {status === "authenticated" && (
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="border-1 rounded-3xl border-gray-400 text-gray-200 text-sm font-thin py-1 px-3 absolute right-[10px] top-[28px] cursor-pointer"
        >
          Logout
        </button>
      )}


      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text absolute right-[316px] top-[100px] ">Collaborative Code Editor</h1>
      <p className="text-mono text-center text-gray-300 mb-6 absolute right-[260px] top-[167px]  ">
        Experience the future of collaborative coding with our real-time platform including audio/video features.<br></br>
        Connect with developers worldwide, share ideas instantly, and build together effortlessly with us.</p>

      {/* <a
        // href="/signup"
        href={status === "authenticated" ? "/home" : "/signup"}
        className="inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-tl from-indigo-500 to-fuchsia-500 text-white px-4 py-2 h-[42px]  z-10 hover:opacity-90 absolute right-[588px] bottom-[367px]">
        Get Started
      </a> */}
      <button
        onClick={() => {
          if (status === "authenticated") router.push("/home");
          else router.push("/signup");
        }}
        className=" cursor-pointer inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-tl from-indigo-500 to-fuchsia-500 text-white px-4 py-2 h-[42px] z-10 hover:opacity-90 absolute right-[588px] bottom-[367px]">
        Get Started
      </button>


    </div>
  );
}
