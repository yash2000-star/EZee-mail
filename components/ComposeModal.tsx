"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { X, Send, Paperclip, Type, Sparkles } from "lucide-react";

interface ComposeModalProps {
    isOpen: boolean;
    onClose:  () => void;
    defaultTo?: string;
  defaultSubject?: string;
  defaultBody?: string;
}

export default function ComposeModal({ isOpen, onClose, defaultBody,defaultSubject,defaultTo}: ComposeModalProps) {
    const {data: session} = useSession();
    const [to, setTo] = useState(defaultTo);
    const [subject, setSubject] = useState(defaultSubject);
    const [message, setMessage] = useState(defaultBody);
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!session || !(session as any).accessToken || !to.trim() || !message.trim()) return;
        setIsSending(true);

        try {
            const response = await fetch("/api/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${(session as any).accessToken}`,
                },
                body: JSON.stringify({ to, subject, message }),
            });

            if (response.ok) {
                setTo("");
                setSubject("");
                setMessage("")
                onClose();
            }
        } catch (error) {
            console.log("Failed to send:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-0 right-4 md:right-24 w-full md:w-[500px] bg-zinc-900 border border-zinc-700 shadow-2xl rounded-t-xl overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-8 duration-300">

            {/*Header*/}
            <div className="bg-zinc-800 px-4 py-3 flex justify-between items-center cursor-pointer">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    New Message
                </h3>
                <button
                onClick={onClose} className="text-zinc-400 hover::text-white transition">
                    <X size={18} />
                </button>
            </div>

            {/* Inputs Area */}
            <div className="flex flex-col px-4 py-2 border-b border-zinc-800/50">
            <div className="flex items-center border-b border-zinc-800/50 py-2">
            <span className="text-zinc-500 text-sm w-12">To:</span>
            <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-white"
            placeholder="recipient@example.com"
            />
            </div>
            <div className="flex items-center py-2">
                <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-white font-medium"
                placeholder="Subject"
                />
            </div>
            </div>

            {/* Message Body Area */}
            <div className="flex-1 p-4 min-h-[250px]">
                <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-full bg-transparent outline-none text-sm text-zinc-300 resize-none"
                placeholder="Write your email here..."
                />
            </div>

            {/* Bottom Action Bar */}
            <div className="p-3 bg-zinc-950/50 border-t border-zinc-800 flex justify-between items-center">
            <div className="flex gap-2">
                <button className="text-zinc-400 hover:text-white p-2 rounded transition" title="Formatting"><Type size={18} /></button>
          <button className="text-zinc-400 hover:text-white p-2 rounded transition" title="Attach Files"><Paperclip size={18} /></button>
          <button className="text-purple-400 hover:text-purple-300 p-2 rounded transition flex items-center gap-1 bg-purple-500/10" title="Help me write">
            <Sparkles size={16} /> <span className="text-xs font-bold hidden sm:block">Write with AI</span>
          </button>
            </div>
            <button
            onClick={handleSend}
            disabled={isSending || !to.trim() || !message.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
            >
                {isSending ? "Sending..." : <>Send <Send size={14} /></>}
            </button>

            </div>

        </div>
    )
}