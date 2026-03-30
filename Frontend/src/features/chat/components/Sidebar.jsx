import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, ChevronRight, X, Home, Compass, LayoutGrid, History, Settings } from "lucide-react";

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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M5.73486 2L11.4299 7.24715V7.24595V2.01211H12.5385V7.27063L18.2591 2V7.98253H20.6078V16.6118H18.2663V21.9389L12.5385 16.9066V21.9967H11.4299V16.9896L5.74131 22V16.6118H3.39258V7.98253H5.73486V2ZM10.5942 9.0776H4.50118V15.5167H5.73992V13.4856L10.5942 9.0776ZM6.84986 13.9715V19.5565L11.4299 15.5225V9.81146L6.84986 13.9715ZM12.5704 15.4691L17.1577 19.4994V16.6118H17.1518V13.9663L12.5704 9.80608V15.4691ZM18.2663 15.5167H19.4992V9.0776H13.4516L18.2663 13.4399V15.5167ZM17.1505 7.98253V4.51888L13.3911 7.98253H17.1505ZM10.6028 7.98253L6.84346 4.51888V7.98253H10.6028Z" />
  </svg>
);

// ─── Sidebar Chat Item ────────────────────────────────────────────────────────
const SidebarChatItem = ({ chatItem, isActive, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ x: 3 }}
    onClick={onClick}
    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
      isActive
        ? "bg-white/10 border border-white/10"
        : "hover:bg-white/5 border border-transparent"
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/60 rounded-full"
      />
    )}
    <MessageSquare
      size={13}
      className={isActive ? "text-white/70 shrink-0" : "text-white/20 shrink-0"}
    />
    <span className={`text-sm truncate flex-1 transition-colors ${isActive ? "text-white/80" : "text-white/40 group-hover:text-white/60"}`}>
      {stripMarkdown(chatItem.title) || "New Chat"}
    </span>
  </motion.div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ chats, currentChatId, onOpenChat, onNewChat, isOpen, onClose }) => {
  const chatList = Object.values(chats);

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
          style={{
            background: "#111111",
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Top: Logo + Close */}
          <div
            className="flex items-center justify-between px-4 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2.5">
              <PerplexityLogo size={17} className="text-white/80" />
              <span
                className="text-white/85 text-sm font-medium tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Perplexity
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/8 text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* New Thread button */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onNewChat}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white/85 hover:bg-white/5 transition-all border border-white/8"
            >
              <Plus size={15} />
              <span>New thread</span>
            </motion.button>
          </div>

          {/* Nav items */}
          <div className="px-3 pb-2 space-y-0.5 shrink-0">
            {[
              { icon: Home, label: "Home" },
              { icon: Compass, label: "Discover" },
              { icon: LayoutGrid, label: "Spaces" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
              >
                <Icon size={15} />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* History section */}
          <div
            className="px-3 pt-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2 px-3 mb-2">
              <History size={13} className="text-white/25" />
              <span className="text-xs text-white/25 uppercase tracking-widest font-mono-dm">
                History
              </span>
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 px-3 overflow-y-auto scrollbar-thin space-y-0.5 pb-4">
            {chatList.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-white/15 font-mono-dm">No threads yet</p>
              </div>
            ) : (
              <AnimatePresence>
                {chatList.map((chatItem) => (
                  <SidebarChatItem
                    key={chatItem.id}
                    chatItem={chatItem}
                    isActive={chatItem.id === currentChatId}
                    onClick={() => onOpenChat(chatItem.id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* User area */}
          <div
            className="px-3 py-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                >
                  U
                </div>
                <span className="text-sm text-white/45 truncate">My Account</span>
              </div>
              <Settings size={13} className="text-white/20" />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;