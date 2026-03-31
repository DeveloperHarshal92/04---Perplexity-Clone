import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, X, Home, Compass, LayoutGrid, History, Settings, Trash2 } from "lucide-react";

// ─── Strip markdown from titles ───────────────────────────────────────────────
const stripMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim();
};

// ─── Perplexity SVG Logo ──────────────────────────────────────────────────────
const PerplexityLogo = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M5.73486 2L11.4299 7.24715V7.24595V2.01211H12.5385V7.27063L18.2591 2V7.98253H20.6078V16.6118H18.2663V21.9389L12.5385 16.9066V21.9967H11.4299V16.9896L5.74131 22V16.6118H3.39258V7.98253H5.73486V2ZM10.5942 9.0776H4.50118V15.5167H5.73992V13.4856L10.5942 9.0776ZM6.84986 13.9715V19.5565L11.4299 15.5225V9.81146L6.84986 13.9715ZM12.5704 15.4691L17.1577 19.4994V16.6118H17.1518V13.9663L12.5704 9.80608V15.4691ZM18.2663 15.5167H19.4992V9.0776H13.4516L18.2663 13.4399V15.5167ZM17.1505 7.98253V4.51888L13.3911 7.98253H17.1505ZM10.6028 7.98253L6.84346 4.51888V7.98253H10.6028Z" />
  </svg>
);

// ─── Sidebar Chat Item ────────────────────────────────────────────────────────
const SidebarChatItem = ({ chatItem, isActive, onClick, onDelete, isDark }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -8 }}
    whileHover={{ x: 2 }}
    onClick={onClick}
    className={`
      group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 border
      ${isActive
        ? isDark ? "bg-white/10 border-white/10" : "bg-black/7 border-black/10"
        : isDark ? "border-transparent hover:bg-white/5" : "border-transparent hover:bg-black/5"
      }
    `}
  >
    {/* Active left-edge indicator */}
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full ${isDark ? "bg-white/60" : "bg-black/40"}`}
      />
    )}

    {/* Icon */}
    <MessageSquare
      size={15}
      className={`shrink-0 transition-colors ${
        isActive
          ? isDark ? "text-white/70" : "text-black/60"
          : isDark ? "text-white/20" : "text-black/20"
      }`}
    />

    {/* Title */}
    <span className={`text-sm truncate flex-1 transition-colors ${
      isActive
        ? isDark ? "text-white/80" : "text-black/80"
        : isDark ? "text-white/40 group-hover:text-white/65" : "text-black/40 group-hover:text-black/65"
    }`}>
      {stripMarkdown(chatItem.title) || "New Chat"}
    </span>

    {/* ── DELETE BUTTON — revealed on row hover ── */}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // prevent opening the chat
        onDelete(chatItem.id);
      }}
      aria-label={`Delete "${stripMarkdown(chatItem.title) || "chat"}"`}
      className={`
        shrink-0 p-1 rounded-md
        opacity-0 group-hover:opacity-100
        transition-all duration-150
        ${isDark
          ? "text-white/25 hover:text-red-400 hover:bg-red-400/12"
          : "text-black/25 hover:text-red-500 hover:bg-red-500/10"
        }
      `}
    >
      <Trash2 size={14} />
    </button>
  </motion.div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ chats, currentChatId, onOpenChat, onNewChat, onDeleteChat, isOpen, onClose, isDark }) => {
  const chatList = Object.values(chats);

  // All colours derived from isDark so the whole panel switches
  const panel     = isDark ? { bg: "#111111", border: "rgba(255,255,255,0.07)", divider: "rgba(255,255,255,0.06)", faint: "rgba(255,255,255,0.05)" }
                           : { bg: "#f8f8f6", border: "rgba(0,0,0,0.08)",       divider: "rgba(0,0,0,0.07)",       faint: "rgba(0,0,0,0.05)"       };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="sidebar"
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed top-0 left-0 h-full z-50 w-[260px] flex flex-col"
          style={{ background: panel.bg, borderRight: `1px solid ${panel.border}` }}
        >
          {/* Logo + Close */}
          <div className="flex items-center justify-between px-4 py-4 shrink-0" style={{ borderBottom: `1px solid ${panel.divider}` }}>
            <div className="flex items-center gap-2.5">
              <PerplexityLogo size={17} className={isDark ? "text-white/80" : "text-black/70"} />
              <span className={`text-sm font-medium tracking-tight ${isDark ? "text-white/85" : "text-black/80"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Perplexity
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-white/30 hover:text-white/70 hover:bg-white/8" : "text-black/30 hover:text-black/70 hover:bg-black/6"}`}
            >
              <X size={16} />
            </button>
          </div>

          {/* New Thread */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onNewChat}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all border ${
                isDark
                  ? "text-white/60 hover:text-white/85 hover:bg-white/5 border-white/8"
                  : "text-black/55 hover:text-black/85 hover:bg-black/5 border-black/10"
              }`}
            >
              <Plus size={16} />
              <span>New thread</span>
            </motion.button>
          </div>

          {/* Nav */}
          <div className="px-3 pb-2 space-y-0.5 shrink-0">
            {[{ icon: Home, label: "Home" }, { icon: Compass, label: "Discover" }, { icon: LayoutGrid, label: "Spaces" }].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  isDark ? "text-white/40 hover:text-white/70 hover:bg-white/5" : "text-black/40 hover:text-black/70 hover:bg-black/5"
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* History header */}
          <div className="px-3 pt-3 shrink-0" style={{ borderTop: `1px solid ${panel.faint}` }}>
            <div className="flex items-center gap-2 px-3 mb-2">
              <History size={13} className={isDark ? "text-white/25" : "text-black/25"} />
              <span className={`text-xs uppercase tracking-widest font-mono-dm ${isDark ? "text-white/25" : "text-black/25"}`}>
                History
              </span>
            </div>
          </div>

          {/* Chat list — this is where delete buttons live */}
          <div className="flex-1 px-3 overflow-y-auto scrollbar-thin space-y-0.5 pb-4">
            {chatList.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <p className={`text-xs font-mono-dm ${isDark ? "text-white/15" : "text-black/20"}`}>No threads yet</p>
              </div>
            ) : (
              <AnimatePresence>
                {chatList.map((chatItem) => (
                  <SidebarChatItem
                    key={chatItem.id}
                    chatItem={chatItem}
                    isActive={chatItem.id === currentChatId}
                    onClick={() => onOpenChat(chatItem.id)}
                    onDelete={onDeleteChat}
                    isDark={isDark}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* User */}
          <div className="px-3 py-3 shrink-0" style={{ borderTop: `1px solid ${panel.divider}` }}>
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${isDark ? "hover:bg-white/5" : "hover:bg-black/4"}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                  U
                </div>
                <span className={`text-sm truncate ${isDark ? "text-white/45" : "text-black/50"}`}>My Account</span>
              </div>
              <Settings size={14} className={isDark ? "text-white/20" : "text-black/25"} />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;