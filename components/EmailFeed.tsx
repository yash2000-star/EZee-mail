"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  ListFilter,
  Sparkles,
  Archive,
  Trash2,
  Mail,
  Star,
  Coffee,
  MailOpen
} from "lucide-react";

interface EmailFeedProps {
  emails: any[];
  onSelect: (email: any) => void;
  selectedEmail: any;
  onRefresh: () => void;
  isSyncing: boolean;
  onAction: (id: string, action: string) => void;
  onSearch: (query: string) => void;
}

export default function EmailFeed({
  emails,
  onSelect,
  selectedEmail,
  onRefresh,
  isSyncing,
  onAction,
  onSearch,
}: EmailFeedProps) {
  // The memory for what the user is searching and what tab is active!
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    unread: false,
    toMe: false,
    ccMe: false,
    hasAttachment: false,
    dateRange: "all",
  });

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState({
    Important: true,
    Updates: true,
    Promotions: true,
  });

  // Generates a random premium gradient based on the sender's name
  const getAvatarGradient = (name: string) => {
    const char = name?.charAt(0).toUpperCase() || "A";
    if (/[A-G]/.test(char)) return "from-blue-500 to-cyan-500";
    if (/[H-N]/.test(char)) return "from-purple-500 to-pink-500";
    if (/[O-U]/.test(char)) return "from-orange-500 to-red-500";
    return "from-emerald-500 to-teal-500";
  };

  // Google ugly timestamp into clean human time
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    // Check if the email was sent today
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Filter ENGINE
  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject?.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
      email.from?.toLowerCase().includes(searchQuery.toLocaleLowerCase());

    let matchesTab = true;
    if (activeTab === "Important")
      matchesTab = email.category?.toLowerCase() === "important";
    if (activeTab === "Updates")
      matchesTab =
        email.category?.toLowerCase() === "updates" ||
        email.category?.toLowerCase() === "social";
    if (activeTab === "Promotions")
      matchesTab = email.category?.toLowerCase() === "promotions";

    let matchesAdvanced = true;

    if (advancedFilters.unread && !email.isUnread) matchesAdvanced = false;
    if (advancedFilters.hasAttachment && !email.hasAttachment)
      matchesAdvanced = false;
    if (advancedFilters.toMe && !email.to?.includes("@"))
      matchesAdvanced = false;
    if (advancedFilters.ccMe && !email.cc?.includes("@"))
      matchesAdvanced = false;

    //Date Filter
    if (advancedFilters.dateRange !== "all" && email.date) {
      const emailDate = new Date(email.date);
      const now = new Date();
      const diffInDays =
        (now.getTime() - emailDate.getTime()) / (1000 * 3600 * 24);

      if (advancedFilters.dateRange === "week" && diffInDays < 7)
        matchesAdvanced = false;
      if (advancedFilters.dateRange === "month" && diffInDays < 30)
        matchesAdvanced = false;
      if (advancedFilters.dateRange === "6months" && diffInDays < 180)
        matchesAdvanced = false;
    }

    return matchesSearch && matchesTab && matchesAdvanced;
  });

  return (
    <section
      className={`h-screen overflow-y-auto bg-zinc-950 border-r border-zinc-800/50 flex-col transition-all duration-300 ${
        selectedEmail
          ? "hidden md:flex md:w-[450px] shrink-0"
          : "flex flex-1 w-full"
      }`}
    >
      {/* THE STICKY HEADER */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md p-4 border-b border-zinc-800/50">
        {/* SEARCH & FILTER */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition shrink-0 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={isSyncing ? "animate-spin text-purple-500" : ""}
            />
          </button>

          <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 focus-within:border-purple-500/50 transition-colors">
            <Search size={16} className="text-zinc-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch(searchQuery);
                }
              }}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-zinc-500"
            />
          </div>

          {/* ADVANCED SEARCH FILTER (Next to Search Bar) */}
          <div className="relative shrink-0">
            {/* The Trigger Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-full transition ${isFilterOpen ? "bg-purple-500/20 text-purple-400" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
              title="Advanced Search"
            >
              <ListFilter size={18} />
            </button>

            {/* The Floating Menu */}
            {isFilterOpen && (
              <div className="absolute right-0 top-12 w-72 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header & Clear Button */}
                <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Filter Messages
                  </span>
                  <button
                    onClick={() =>
                      setAdvancedFilters({
                        unread: false,
                        toMe: false,
                        ccMe: false,
                        hasAttachment: false,
                        dateRange: "all",
                      })
                    }
                    className="text-xs text-purple-400 hover:text-purple-300 transition font-bold"
                  >
                    Clear All
                  </button>
                </div>

                {/* The Checkboxes */}
                <div className="p-4 space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={advancedFilters.unread}
                        onChange={(e) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            unread: e.target.checked,
                          })
                        }
                        className="accent-purple-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition">
                        Unread
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={advancedFilters.toMe}
                        onChange={(e) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            toMe: e.target.checked,
                          })
                        }
                        className="accent-purple-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition">
                        To: me
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={advancedFilters.ccMe}
                        onChange={(e) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            ccMe: e.target.checked,
                          })
                        }
                        className="accent-purple-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition">
                        Cc: me
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={advancedFilters.hasAttachment}
                        onChange={(e) =>
                          setAdvancedFilters({
                            ...advancedFilters,
                            hasAttachment: e.target.checked,
                          })
                        }
                        className="accent-purple-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition">
                        Has attachment
                      </span>
                    </label>
                  </div>

                  {/* The Date Dropdown */}
                  <div className="pt-3 border-t border-zinc-700/50">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                      Date
                    </span>
                    <select
                      value={advancedFilters.dateRange}
                      onChange={(e) =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          dateRange: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-purple-500/50 cursor-pointer"
                    >
                      <option value="all">Any time</option>
                      <option value="week">Older than a week</option>
                      <option value="month">Older than a month</option>
                      <option value="6months">Older than 6 months</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABS & CUSTOMIZE */}
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex gap-5 overflow-x-auto scrollbar-hide">
            {visibleTabs.Important && (
              <button
                onClick={() => setActiveTab("Important")}
                className={`pb-2 px-1 whitespace-nowrap border-b-2 transition-colors ${activeTab === "Important" ? "text-white border-purple-500" : "text-zinc-500 hover:text-zinc-300 border-transparent"}`}
              >
                Important
              </button>
            )}

            {visibleTabs.Updates && (
              <button
                onClick={() => setActiveTab("Updates")}
                className={`pb-2 px-1 flex items-center gap-2 whitespace-nowrap border-b-2 transition-colors ${activeTab === "Updates" ? "text-white border-purple-500" : "text-zinc-500 hover:text-zinc-300 border-transparent"}`}
              >
                Updates
              </button>
            )}

            {visibleTabs.Promotions && (
              <button
                onClick={() => setActiveTab("Promotions")}
                className={`pb-2 px-1 flex items-center gap-2 whitespace-nowrap border-b-2 transition-colors ${activeTab === "Promotions" ? "text-white border-purple-500" : "text-zinc-500 hover:text-zinc-300 border-transparent"}`}
              >
                Promotions
              </button>
            )}

            <button
              onClick={() => setActiveTab("All")}
              className={`pb-2 px-1 whitespace-nowrap border-b-2 transition-colors ${activeTab === "All" ? "text-white border-purple-500" : "text-zinc-500 hover:text-zinc-300 border-transparent"}`}
            >
              All
            </button>
          </div>

          {/* CUSTOMIZE TABS BUTTON (Next to Tabs) */}
          <div className="relative">
            {/* The Button */}
            <button
              onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
              className={`pb-2 pl-2 shrink-0 transition-colors ${isCustomizeOpen ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Customize Views"
            >
              <SlidersHorizontal size={16} />
            </button>

            {/* The Floating Menu (Only shows if isCustomizeOpen is true) */}
            {isCustomizeOpen && (
              <div className="absolute right-0 top-8 w-48 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 bg-zinc-800/50 border-b border-zinc-700/50 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Visible Tabs
                </div>
                <div className="p-2 space-y-1">
                  {/*checkbox*/}
                  {Object.keys(visibleTabs).map((tab) => (
                    <label
                      key={tab}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-zinc-800 rounded-lg cursor-pointer transition group"
                    >
                      <input
                        type="checkbox"
                        checked={visibleTabs[tab as keyof typeof visibleTabs]}
                        onChange={() => {
                          // 1. Flip the switch in memory
                          setVisibleTabs((prev) => ({
                            ...prev,
                            [tab]: !prev[tab as keyof typeof visibleTabs],
                          }));

                          // 2. Safety feature: If they hide the tab they are currently looking at, kick them back to "All"
                          if (
                            activeTab === tab &&
                            visibleTabs[tab as keyof typeof visibleTabs]
                          ) {
                            setActiveTab("All");
                          }
                        }}
                        className="accent-purple-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-zinc-200 group-hover:text-white transition">
                        {tab}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* THE EMAIL LIST */}
      {/* THE EMAIL LIST OR EMPTY STATE */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-1 h-full pb-20">
        {filteredEmails.length === 0 ? (
          
          /* --- THE EMPTY STATE UI --- */
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4 border border-zinc-800/50 shadow-inner">
              <Coffee size={28} className="text-zinc-500" />
            </div>
            <h3 className="text-zinc-300 font-bold text-lg">Nothing to see here</h3>
            <p className="text-zinc-500 text-sm mt-2 max-w-[250px]">
              {searchQuery ? "No emails match your search." : "This folder is completely empty. Enjoy your free time!"}
            </p>
          </div>

        ) : (
          
          /* --- THE NORMAL EMAIL LIST --- */
          filteredEmails.map((email: any) => {
            const isSelected = selectedEmail?.id === email.id;
            const senderName = email.from.split("<")[0].replace(/"/g, "").trim();

            return (
              <div
                key={email.id}
                onClick={() => onSelect(email)}
                className={`group relative flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? "bg-purple-500/10 border-purple-500/20 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-zinc-900"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(senderName)} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-inner`}
                >
                  {senderName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0 pr-20 md:pr-10">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3
                     className={`text-sm truncate pr-2 ${isSelected ? "text-purple-300 font-bold" : (email.isUnread ? "text-white font-bold" : "text-zinc-300 font-medium")}`}
                    >
                      {senderName}
                    </h3>
                    <span className={`text-xs shrink-0 ${email.isUnread ? "text-zinc-300 font-bold" : "text-zinc-500"}`}>
                      {formatTime(email.date)}
                    </span>
                  </div>
                  <div className={`text-sm truncate flex items-center gap-2 ${email.isUnread ? "text-zinc-300 font-semibold" : "text-zinc-400"}`}>
                    <span className="truncate">{email.subject}</span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 shadow-xl border border-zinc-800 p-1.5 rounded-lg flex items-center gap-1 hidden md:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(email.id, email.isStarred ? "unstar" : "star");
                    }}
                    className={`p-1.5 rounded transition ${email.isStarred ? "text-yellow-400 hover:text-yellow-300" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
                    title={email.isStarred ? "Unstar" : "Star"}
                  >
                    <Star
                      size={14}
                      className={email.isStarred ? "fill-yellow-400" : ""}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(email.id, "archive");
                    }}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition"
                    title="Archive"
                  >
                    <Archive size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(email.id, "trash");
                    }}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                 <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // If it is currently unread, clicking it marks it as read!
                      onAction(email.id, email.isUnread ? "read" : "unread");
                    }}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition"
                    title={email.isUnread ? "Mark as Read" : "Mark as Unread"}
                  >
                    {email.isUnread ? <MailOpen size={14} /> : <Mail size={14} />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}