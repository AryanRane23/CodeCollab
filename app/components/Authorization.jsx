// Boiler plate
"use client";
import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

const Authorization = () => {
  const { data: session } = useSession(); // next-auth session
  console.log(session);
  return (
    
    <div className="mb-4">
        {session ? (
          <>
            <h1>Welcome {session.user.name}</h1>
            <h1 className="mb-2">Signed in as {session.user.email}</h1>
            <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ">
              Sign out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => signIn("github")} className="bg-black text-white px-4 py-2 rounded mr-2 cursor-pointer">
              Sign in with GitHub
            </button>
            <button onClick={() => signIn("google")} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              Sign in with Google
            </button>
          </>
        )}
      </div>
  )
}

export default Authorization
