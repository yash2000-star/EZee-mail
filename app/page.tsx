"use client";

import {signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [emails, setEmails] =  useState<any[]>([]);

  const fetchEmails = async () => {
    
    // Safety Check
    if (!(session as any)?.accessToken) return;


    //Knock on Google's door
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5",{
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
    });

    // Read the response
    const data = await response.json();

    // Fill it up
    if (data.messages) {
      const detailedEmails = await Promise.all(
        data.messages.map(async (msg: any) => {
          const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,{
            headers: { Authorization: `Bearer ${(session as any).accessToken}` },
          });
          return await res.json();
        })
      );

      console.log("FULL EMAILS:", detailedEmails);
      setEmails(detailedEmails);
    }
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">

        
        <h1 className="text-4xl font-bold mb-4">Welcome, { session.user?.name}!</h1>
        <p className="text-gray-400 mb-8">{session.user?.email}</p>

        <div className="flex gap-4 mb-8">
          <button
          onClick={fetchEmails}
          className="bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition cursor-pointer"
          >
            Fetch Recent Emails 📩
          </button>

           {/* Logout */}
        <button
        onClick={() => signOut()}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition cursor-pointer"
        >
          Sign Out
        </button>
        </div>

        <div className="w-full max-w-md">
          {emails.length > 0 && (
            <h2 className="text-xl font-bold mb-4 text-green-400">Found {emails.length} Emails!</h2>
          )}

          <ul className="space-y-2">
            {emails.map((msg: any) => (
              <li key={msg.id} className="bg-gray-800 p-4 rounded border border-gray-700 font-mono text-sm">
                ID: {msg.id}
                </li>
            ))}
          </ul>

        </div>

       
      </div>
    )
  }

  // If NO-one loged-in...
  return(
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-5xl font-bold mb-8 tracking-tighter">EZee Mail</h1>
      <p className="text-xl text-gray-400 mb-8">Stop drowing in email.</p>

      {/* The Login Button */}
      <button onClick={() => signIn("google")}
        className="bg-white text-black font-bold py-4 px-8 rounded-full text-xl hover:bg-gray-200 transition cursor-pointer"
        >
        Sign in with Google
      </button>

    </div>
  )
}
