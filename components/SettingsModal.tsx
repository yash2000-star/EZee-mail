"use client";

import { useState, useEffect } from "react";
import { X, Key, Check, ShieldAlert } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem("gemini_api_key");
      if (storedKey) setApiKey(storedKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim() === "") {
      localStorage.removeItem("gemini_api_key"); 
    } else {
      localStorage.setItem("gemini_api_key", apiKey.trim()); 
    }
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key size={18} className="text-purple-400" />
            AI Settings
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition bg-zinc-800/50 hover:bg-zinc-700 h-8 w-8 rounded-full flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-300">Google Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500 transition-colors font-mono text-sm shadow-inner"
            />
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex gap-3 text-purple-200/80 text-xs leading-relaxed">
            <ShieldAlert size={16} className="shrink-0 text-purple-400 mt-0.5" />
            <p>
              <strong>Your key is stored locally.</strong> We never send your API key to our servers. It is securely saved in your browser's local storage and sent directly to Google when you use AI features.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaved}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition shadow-lg disabled:bg-emerald-600 flex items-center gap-2"
          >
            {isSaved ? <><Check size={16} /> Saved</> : "Save Key"}
          </button>
        </div>
        
      </div>
    </div>
  );
}