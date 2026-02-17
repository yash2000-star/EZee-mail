"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<any[]>([]);

  //Find a specific header from the list
  const getHeader = (headers: any[], name: string) => {
    if (!headers) return "";
    const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : "";
  };

  const fetchEmails = async () => {
    // Safety Check
    if (!(session as any)?.accessToken) return;

    //Knock on Google's door
    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5",
      {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      },
    );

    // Read the response
    const data = await response.json();

    // Fill it up
    if (data.messages) {
      const detailedEmails = await Promise.all(
        data.messages.map(async (msg: any) => {
          const res = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: {
                Authorization: `Bearer ${(session as any).accessToken}`,
              },
            },
          );
          return await res.json();
        }),
      );

      const cleanEmails = detailedEmails.map((msg: any) => ({
        id: msg.id,
        snippet: msg.snippet,
        subject: getHeader(msg.payload.headers, "Subject"),
        from: getHeader(msg.payload.headers, "From"),
      }));

      console.log("CLEAN LIST:", cleanEmails);
      setEmails(cleanEmails);
    }
  };

  const classifyEmail = async (id: string, snippet: string) => {
    const response = await fetch("/api/classify", {
      method: "POST",
      body: JSON.stringify({ snippet }),
    });

    const result = await response.json();
    console.log("AI SAID", result);

    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, category: result.category } : email,
      ),
    );
  };

  const classifyAll = async () => {
    const unclassified = emails.filter((msg: any) => !msg.category);

    if (unclassified.length === 0) {
      alert("All  emails are already classified!");
      return;
    }

    await Promise.all(
      unclassified.map((msg: any) => classifyEmail(msg.id, msg.snippet))
    )
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white py-20">
        <h1 className="text-4xl font-bold mb-4">
          Welcome, {session.user?.name}!
        </h1>
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
            <h2 className="text-xl font-bold mb-4 text-green-400">
              Found {emails.length} Emails!
            </h2>
          )}

          {emails.length > 0 && (
            <button
            onClick={classifyAll}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition"
            >
              AI Classify All
            </button>
          )}

          <ul className="space-y-4">
            {emails.map((msg: any, index: number) => (
              <li
                key={`${msg.id}-${index}`}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition"
              >
                <h3 className="font-bold text-lg text-green-400">
                  {msg.subject || "(No Subject)"}
                </h3>

                <p className="text-gray-300 text-sm">From: {msg.from}</p>

                <p className="text-gray-500 text-xm mt-2 truncate">
                  {msg.snippet}
                </p>

                <div className="mt-4">
                  {msg.category ? (
                    <span className="bg-yellow-500 text-black font-bold py-1 px-3 rounded text-xs">
                      {msg.category}
                    </span>
                  ) : (
                    <button
                      onClick={() => classifyEmail(msg.id, msg.snippet)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-1 px-3 rounded transition"
                    >
                      Ask AI
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // If NO-one loged-in...
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-5xl font-bold mb-8 tracking-tighter">EZee Mail</h1>
      <p className="text-xl text-gray-400 mb-8">Stop drowing in email.</p>

      {/* The Login Button */}
      <button
        onClick={() => signIn("google")}
        className="bg-white text-black font-bold py-4 px-8 rounded-full text-xl hover:bg-gray-200 transition cursor-pointer"
      >
        Sign in with Google
      </button>
    </div>
  );
}
