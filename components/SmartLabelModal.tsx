"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

interface SmartLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLabel: (label: { name: string; prompt: string; color: string; applyRetroactively: boolean }) => void;
}

const COLORS = [
  { id: "blue", class: "bg-blue-500" },
  { id: "green", class: "bg-emerald-500" },
  { id: "yellow", class: "bg-amber-500" },
  { id: "red", class: "bg-red-500" },
  { id: "gray", class: "bg-zinc-500" },
  { id: "indigo", class: "bg-indigo-500" },
  { id: "purple", class: "bg-purple-500" },
];

export default function SmartLabelModal({ isOpen, onClose, onAddLabel }: SmartLabelModalProps) {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [applyRetroactively, setApplyRetroactively] = useState(true);

  if (!isOpen) return null;

  const handleCreate = () => {
    // 1. THIS is where we finally use the onAddLabel function!
    onAddLabel({ 
      name, 
      prompt, 
      color: selectedColor, 
      applyRetroactively 
    });
    
    // 2. Clear the form so it's empty next time you open it
    setName("");
    setPrompt("");
    
    // 3. Close the modal
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="w-full max-w-md bg-[#121214] border border-zinc-800 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-800/80">
          <h2 className="text-xl font-extrabold text-white">New Smart Label</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition p-1 rounded-md hover:bg-zinc-800">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Label Name Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-zinc-400">Name</label>
              <span className="text-xs font-medium text-zinc-600">{name.length}/30</span>
            </div>
            <input 
              type="text" 
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Urgent Invoices"
              className="w-full bg-[#0a0a0a] border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-3 text-zinc-200 text-sm font-medium outline-none transition-colors placeholder:text-zinc-600"
            />
          </div>

          {/* Label Prompt Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-zinc-400">Label Prompt</label>
              <span className="text-xs font-medium text-zinc-600">{prompt.length}/100</span>
            </div>
            <textarea 
              maxLength={100}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what this label is for to help Mail-Man AI work smarter."
              className="w-full bg-[#0a0a0a] border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-3 text-zinc-200 text-sm font-medium outline-none transition-colors min-h-[100px] resize-none placeholder:text-zinc-600"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-sm font-bold text-zinc-400 mb-3 block">Color</label>
            <div className="flex items-center gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center transition-transform hover:scale-110 ${
                    selectedColor === color.id ? "ring-2 ring-zinc-300 ring-offset-2 ring-offset-[#121214]" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {selectedColor === color.id && <Check size={16} className="text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>

          {/* Retroactive Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer group pt-2">
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
              applyRetroactively ? "bg-blue-500 border-blue-500" : "bg-[#0a0a0a] border-zinc-700 group-hover:border-zinc-500"
            }`}>
              {applyRetroactively && <Check size={14} className="text-white" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={applyRetroactively} 
              onChange={() => setApplyRetroactively(!applyRetroactively)} 
            />
            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
              Apply to your last 50 emails
            </span>
          </label>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-zinc-800/80 bg-[#0a0a0a] flex justify-end">
          <button 
            onClick={handleCreate}
            disabled={!name.trim() || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:shadow-none"
          >
            Create Label
          </button>
        </div>

      </div>
    </div>
  );
}