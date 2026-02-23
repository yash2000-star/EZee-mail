"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

import { 
  Inbox, CheckSquare, Plus, Folder, Star, File, Send, 
  Archive, AlertOctagon, Trash2, MoreHorizontal, Minus,
  PanelLeftClose, PanelLeft, Settings, PenSquare, Tag, LogOut, Sparkles, Edit2, Check
} from "lucide-react";

interface SidebarProps {
  onCompose?: () => void;
  activeMailbox: string;
  onSelectMailbox: (mailbox: string) => void;
  onOpenSettings?: () => void;
  onOpenSmartLabelModal?: () => void;
  customLabels?: any[]; // <-- Added custom labels array
  onDeleteCustomLabel?: (name: string) => void; // <-- Added delete function
}

// Color mapper for the dots
const LABEL_COLORS: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  gray: "bg-zinc-500",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
};

export default function Sidebar({ 
  onCompose, 
  activeMailbox, 
  onSelectMailbox, 
  onOpenSettings, 
  onOpenSmartLabelModal,
  customLabels = [],
  onDeleteCustomLabel
}: SidebarProps) {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMailboxesOpen, setIsMailboxesOpen] = useState(true);
  const [isMoreOpen, setIsMoreOpen] = useState(false); 
  
  // State to track which label's 3-dot menu is currently open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const NavItem = ({ icon, label, count, active = false, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      active 
        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm" 
        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 border border-transparent"
    }`}>
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-blue-400" : "text-zinc-400"}`}>
          {icon}
        </span>
        {!isCollapsed && <span>{label}</span>}
      </div>
      {!isCollapsed && count && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-800 text-zinc-500'}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} hidden md:flex flex-col bg-[#0a0a0a] border-r border-zinc-800/80 h-screen transition-all duration-300 shrink-0 z-10`}>
      
      {/* 1. Header & Collapse Toggle */}
      <div className="p-4 flex items-center justify-between h-16 mt-2">
        {!isCollapsed && (
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            Mail-Man
          </h1>
        )}
        {isCollapsed && (
          <div className="mx-auto bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-500 hover:text-white transition p-1.5 rounded-lg hover:bg-zinc-900"
        >
          {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* 2. Primary Action: Compose Button */}
      <div className="px-4 mb-6 mt-4">
        <button 
        onClick={onCompose}
        className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] flex items-center justify-center gap-2">
          <PenSquare size={18} />
          {!isCollapsed && "Compose"}
        </button>
      </div>

      {/* 3. Main Navigation Area */}
      <div className="flex-1 overflow-y-auto px-3 space-y-8 scrollbar-hide pb-4">
        
        {/* Smart Views */}
        <div className="space-y-1">

          <NavItem icon={<Inbox size={18} />} label="Inbox" active={activeMailbox === "Inbox"} onClick={() => onSelectMailbox("Inbox")} />
          <NavItem icon={<CheckSquare size={18} />} label="Master To-Do" active={activeMailbox === "To-do"} onClick={() => onSelectMailbox("To-do")} />
          
          {/* --- RENDER CUSTOM LABELS WITH HOVER MENU --- */}
          {customLabels.map((label, idx) => {
            const isActive = activeMailbox === label.name;
            const dotColorClass = LABEL_COLORS[label.color] || "bg-blue-500";
            
            return (
              <div key={idx} className="relative group">
                <button 
                  onClick={() => onSelectMailbox(label.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm" : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 border border-transparent"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColorClass} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                    {!isCollapsed && <span className="truncate pr-4">{label.name}</span>}
                  </div>
                </button>

                {/* The 3 Dots Hover Button */}
                {!isCollapsed && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === label.name ? null : label.name);
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${
                      openMenuId === label.name ? "opacity-100 bg-zinc-800 text-white" : "opacity-0 group-hover:opacity-100 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                )}

                {/* The Popover Menu (Based exactly on Screenshot 288) */}
                {openMenuId === label.name && !isCollapsed && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                    <div className="absolute left-full ml-2 top-0 w-56 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                      
                      <div className="flex flex-col p-1.5 border-b border-zinc-800/80">
                        <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition">
                          <span>Edit</span>
                          <Edit2 size={14} className="text-zinc-500" />
                        </button>
                        <button 
                          onClick={() => {
                            if(onDeleteCustomLabel) onDeleteCustomLabel(label.name);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <span>Delete</span>
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Color Changers */}
                      <div className="px-4 py-3 bg-zinc-950/50 flex justify-between items-center gap-2">
                         {Object.keys(LABEL_COLORS).map((colorKey) => (
                           <button 
                             key={colorKey}
                             className={`w-4 h-4 rounded-full ${LABEL_COLORS[colorKey]} hover:scale-110 transition-transform flex items-center justify-center ${label.color === colorKey ? 'ring-2 ring-zinc-400 ring-offset-1 ring-offset-zinc-900' : ''}`}
                           >
                             {label.color === colorKey && <Check size={10} className="text-white drop-shadow-md" />}
                           </button>
                         ))}
                      </div>

                    </div>
                  </>
                )}
              </div>
            );
          })}

          {!isCollapsed && (
            <button 
              onClick={onOpenSmartLabelModal}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-all mt-2 group border border-transparent hover:border-blue-500/20"
            >
              <Plus size={16} className="text-blue-500 group-hover:text-blue-400 transition-colors" /> 
              <Sparkles size={14} className="text-blue-500" />
              New Smart Label
            </button>
          )}
        </div>

        {/* Mailboxes Section */}
        <div>
          {!isCollapsed && (
            <div 
              className="px-3 py-2 text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between cursor-pointer hover:text-zinc-300 transition-colors"
              onClick={() => setIsMailboxesOpen(!isMailboxesOpen)}
            >
              <span>Mailboxes</span>
              <span className="text-xs transition-transform duration-200" style={{ transform: isMailboxesOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▼</span>
            </div>
          )}
          
          <div className={`space-y-1 mt-1 overflow-hidden transition-all duration-300 ${isMailboxesOpen || isCollapsed ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <NavItem icon={<Folder size={18} />} label="All Mail" active={activeMailbox === "All Mail"} onClick={() => onSelectMailbox("All Mail")} />
            <NavItem icon={<Star size={18} />} label="Starred" active={activeMailbox === "Starred"} onClick={() => onSelectMailbox("Starred")} />
            <NavItem icon={<File size={18} />} label="Draft" active={activeMailbox === "Draft"} onClick={() => onSelectMailbox("Draft")} />
            <NavItem icon={<Send size={18} />} label="Sent" active={activeMailbox === "Sent"} onClick={() => onSelectMailbox("Sent")} />
            <NavItem icon={<Archive size={18} />} label="Archive" active={activeMailbox === "Archive"} onClick={() => onSelectMailbox("Archive")} />
            <NavItem icon={<AlertOctagon size={18} />} label="Spam" active={activeMailbox === "Spam"} onClick={() => onSelectMailbox("Spam")} />
            <NavItem icon={<Trash2 size={18} />} label="Trash" active={activeMailbox === "Trash"} onClick={() => onSelectMailbox("Trash")} />
            
            {!isCollapsed && (
              <NavItem 
                icon={isMoreOpen ? <Minus size={18} /> : <MoreHorizontal size={18} />} 
                label={isMoreOpen ? "Less" : "More"} 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              />
            )}

            {!isCollapsed && isMoreOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-zinc-800/50 ml-4 mt-2 animate-in slide-in-from-top-2 duration-200">
                 <NavItem icon={<Tag size={16} />} label="Conversation History" active={activeMailbox === "Conversation History"} onClick={() => onSelectMailbox("Conversation History")} />
                 <NavItem icon={<Tag size={16} />} label="GMass Auto Followup" active={activeMailbox === "GMass Auto Followup"} onClick={() => onSelectMailbox("GMass Auto Followup")} />
                 <NavItem icon={<Tag size={16} />} label="GMass Reports" active={activeMailbox === "GMass Reports"} onClick={() => onSelectMailbox("GMass Reports")} />
                 <NavItem icon={<Tag size={16} />} label="GMass Scheduled" active={activeMailbox === "GMass Scheduled"} onClick={() => onSelectMailbox("GMass Scheduled")} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. User Profile Footer */}
      <div className="p-4 border-t border-zinc-800/80 bg-[#0a0a0a]">
        <div className="flex items-center justify-between bg-[#121214] hover:bg-zinc-900 p-2 rounded-xl border border-zinc-800 transition cursor-pointer group shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-9 h-9 rounded-full border border-zinc-700 shrink-0 object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                {session?.user?.name?.charAt(0) || "Y"}
              </div>
            )}
            
            {!isCollapsed && (
              <div className="flex flex-col truncate pr-2">
                <span className="text-sm font-bold text-white truncate group-hover:text-blue-100 transition-colors">
                  {session?.user?.name || "Yash Nirwan"}
                </span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">BYOK Active</span>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button onClick={onOpenSettings} className="text-zinc-500 hover:text-white transition p-1.5 hover:bg-zinc-800 rounded-lg" title="AI Settings">
                <Settings size={18} />
              </button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-zinc-500 hover:text-red-400 transition p-1.5 hover:bg-red-500/10 rounded-lg" title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
}