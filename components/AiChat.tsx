"use client";

import { useState } from "react";

interface AiChatProps {
  isOpen: boolean;
  onClose: () => void;
  emails: any[];
}

// The buttons the user can click to auto-fill the chat
const SUGGESTED_PROMPTS = [
  "Summarize my most recent emails.",
  "Do I have any verification codes?",
  "Search for any important bank alerts.",
];

export default function AiChat({ isOpen, onClose, emails }: AiChatProps) {
  const [input, setInput] = useState("");
  // Start with an empty chat history so we can show the welcome screen!
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (overridePrompt?: string) => {
    const promptText = overridePrompt || input;
    if (!promptText.trim() || isLoading) return;

    // 1. SECURITY CHECK: Grab the key from the Vault!
    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Please click the Gear icon in the bottom left to add your Gemini API Key first!" }]);
      return;
    }

    // 2. Add user message to UI
    const newMessages = [...messages, { role: "user", content: promptText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 3 Only send the last 4 messages to save tokens!
      const recentHistory = newMessages.slice(-4);
      
      // Only send the 5 most recent emails to save tokens!
      const recentEmails = emails.slice(0, 5).map(e => ({
        from: e.from,
        subject: e.subject,
        snippet: e.snippet,
        date: e.date
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: promptText, 
          history: recentHistory,
          emails: recentEmails, 
          apiKey: apiKey        
        }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "ai", content: `❌ Error: ${error.message || "Failed to connect to Gemini."}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer container: Adds padding so the inner card "floats"
<div className="w-[350px] lg:w-[400px] shrink-0 h-screen flex flex-col border-l border-zinc-800/50 bg-zinc-950 animate-in slide-in-from-right-8 duration-300">      {/* Inner Card: Rounded corners, border, and distinct background */}
      <div className="flex-1 flex flex-col bg-zinc-950/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden relative">
        {/* Header */}
<div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-950">          <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
            ✨ EZee AI
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition bg-zinc-900 hover:bg-zinc-800 h-8 w-8 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 pt-24 flex flex-col gap-6 scrollbar-hide">
          {/* Show Welcome Screen if no messages yet */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hi Yash!</h3>
              <p className="text-zinc-400 text-sm mb-8">
                Need help with an email?
              </p>

              <div className="space-y-3 w-full max-w-[280px]">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="w-full text-left p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/15 text-purple-300 border border-purple-500/10 hover:border-purple-500/30 transition-all text-sm font-medium flex items-center gap-3 group"
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      💡
                    </span>{" "}
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Show Chat History if messages exist
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-zinc-800" : "bg-gradient-to-br from-blue-500 to-purple-600"}`}
                >
                  <span className="text-white text-[10px] font-bold uppercase">
                    {msg.role === "user" ? "You" : "AI"}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-white rounded-tr-none"
                      : "bg-zinc-950 border border-zinc-800/80 text-zinc-300 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold">AI</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-2xl rounded-tl-none text-sm text-zinc-400 flex gap-1 items-center h-[52px]">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800/50">
          <div className="flex bg-zinc-950 rounded-2xl border border-zinc-700/50 focus-within:border-purple-500/50 overflow-hidden shadow-inner transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Search, write, or ask anything..."
              className="flex-1 bg-transparent text-white text-sm px-4 py-3 outline-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-5 font-semibold transition"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
