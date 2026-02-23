"use client";

import { useState } from "react";
// Added 'Check' to the imports!
import { Clock, Info, ThumbsDown, Trash2, Sparkles, AlertCircle, Check } from "lucide-react";

// 1. Updated interface to accept our 4 new target actions
interface ToDoDashboardProps {
  tasks?: any[];
  onToggleTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onViewEmail?: (emailId: string) => void;
}

export default function ToDoDashboard({ 
  tasks = [], 
  onToggleTask, 
  onDeleteTask, 
  onViewEmail 
}: ToDoDashboardProps) {
  const [activeTab, setActiveTab] = useState("active");

  const displayTasks = tasks.filter((task) => task.status === activeTab);

  return (
    <div className="flex-1 h-screen bg-[#0a0a0a] flex flex-col overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Header Navigation */}
      <div className="h-16 border-b border-zinc-800/80 px-6 flex items-center justify-between shrink-0 bg-[#0a0a0a]/80 backdrop-blur-md z-10">
        
        {/* Active / Done Toggle */}
        <div className="flex items-center p-1 bg-[#121214] border border-zinc-800 rounded-lg">
          <button 
            onClick={() => setActiveTab("active")}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
              activeTab === "active" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveTab("done")}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
              activeTab === "done" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Done
          </button>
        </div>

        {/* AI Auto-Scan Button */}
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]" title="Scan inbox for new tasks">
          <Sparkles size={16} />
        </button>
      </div>

      {/* Main Task List Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
        <div className="max-w-4xl mx-auto">
          
          <h2 className="text-2xl font-extrabold text-white mb-8 tracking-tight">
            {activeTab === "active" ? "Past Due & Upcoming" : "Completed Tasks"}
          </h2>

          <div className="space-y-1 relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-px bg-zinc-800/50 z-0 hidden sm:block"></div>

            {displayTasks.length === 0 ? (
              <div className="text-center py-20 relative z-10 bg-[#0a0a0a]">
                <p className="text-zinc-500 font-medium">
                  No {activeTab} tasks found. The Mail-Man AI will extract them automatically as emails arrive!
                </p>
              </div>
            ) : (
              displayTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="group relative z-10 flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-[#121214] hover:shadow-lg transition-all cursor-pointer"
                >
                  
                  {/* TARGET 1: Interactive Checkbox */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleTask) onToggleTask(task.id);
                    }}
                    className={`w-6 h-6 rounded-md border-2 flex-shrink-0 mt-0.5 transition-colors flex items-center justify-center cursor-pointer ${
                      task.status === "done" 
                        ? "bg-blue-500 border-blue-500" 
                        : "border-zinc-700 bg-[#0a0a0a] group-hover:border-blue-500"
                    }`}
                  >
                     {task.status === "done" && <Check size={14} className="text-white" />}
                  </div>

                  {/* Task Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {task.isUrgent && <AlertCircle size={16} className="text-red-500 shrink-0 fill-red-500/20" />}
                      {/* Add line-through styling if the task is done */}
                      <h3 className={`text-[15px] font-bold transition-all ${
                        task.status === "done" 
                          ? "text-zinc-600 line-through" 
                          : (task.isPastDue ? "text-zinc-200" : "text-zinc-300")
                      }`}>
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock size={14} className={task.isPastDue && task.status !== "done" ? "text-red-400" : "text-zinc-500"} />
                      <span className={`text-xs font-bold ${task.isPastDue && task.status !== "done" ? "text-red-400" : "text-zinc-500"}`}>
                        {task.date}
                      </span>
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity bg-[#121214] pl-4 rounded-l-xl">
                    
                    {/* TARGET 2: View Source Email */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(onViewEmail) onViewEmail(task.emailId); }}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition" title="View Source Email">
                      <Info size={18} />
                    </button>
                    
                    {/* TARGET 3: Not a Task (Deleting for now) */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(onDeleteTask) onDeleteTask(task.id); }}
                      className="p-2 text-zinc-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition" title="Not a task (Train AI)">
                      <ThumbsDown size={18} />
                    </button>
                    
                    {/* TARGET 4: Delete Task */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(onDeleteTask) onDeleteTask(task.id); }}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Delete Task">
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              ))
            )}
            
          </div>
        </div>
      </div>

    </div>
  );
}