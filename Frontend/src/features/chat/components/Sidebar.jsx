import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, X, Home, Compass, LayoutGrid, History, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

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

const OrchardLogo = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22C12 22 4 16 4 9C4 5 7 2 12 2C17 2 20 5 20 9C20 16 12 22 12 22Z" />
    <path d="M12 22V12" />
    <path d="M12 16C9 14 8 11 8 11" />
  </svg>
);

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
        ? "bg-[var(--border)] border-[var(--border)]"
        : "border-transparent hover:bg-[var(--border)]"
      }
    `}
  >
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-[var(--accent)]"
      />
    )}

    <MessageSquare
      size={15}
      className={`shrink-0 transition-colors ${
        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
      }`}
    />

    <span className={`text-sm font-sans truncate flex-1 transition-colors ${
      isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
    }`}>
      {stripMarkdown(chatItem.title) || "New Chat"}
    </span>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(chatItem.id);
      }}
      aria-label={`Delete "${stripMarkdown(chatItem.title) || "chat"}"`}
      className="shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10"
    >
      <Trash2 size={14} />
    </button>
  </motion.div>
);

const Sidebar = ({ chats, currentChatId, onOpenChat, onNewChat, onDeleteChat, isOpen, onClose, isDark }) => {
  const chatList = Object.values(chats);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  const handleProfileClick = () => {
    onClose();
    navigate("/profile");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="sidebar"
          initial={{ x: -260, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -260, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed sm:relative top-0 left-0 h-full z-50 w-[260px] flex flex-col"
          style={{ 
            background: "var(--glass-bg)", 
            backdropFilter: "blur(24px) saturate(180%)",
            borderRight: "1px solid var(--border)" 
          }}
        >
          {/* Logo + Close */}
          <div className="flex items-center justify-between px-4 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <OrchardLogo size={20} className="text-[var(--accent)]" />
              <span className="text-sm font-serif font-medium tracking-tight text-[var(--text-primary)]">
                Orchard AI
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1.5 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] sm:hidden"
            >
              <X size={16} />
            </button>
          </div>

          {/* New Thread */}
          <div className="px-3 pt-4 pb-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onNewChat}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all border text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--border)]"
            >
              <Plus size={16} />
              <span className="font-sans">New thread</span>
            </motion.button>
          </div>

          {/* Nav */}
          <div className="px-3 pb-2 pt-2 space-y-0.5 shrink-0">
            {[{ icon: Home, label: "Home" }, { icon: Compass, label: "Discover" }, { icon: LayoutGrid, label: "Spaces" }].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
              >
                <Icon size={16} />
                <span className="text-sm font-sans">{label}</span>
              </div>
            ))}
          </div>

          {/* History header */}
          <div className="px-3 pt-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 px-3 mb-2">
              <History size={13} className="text-[var(--text-tertiary)]" />
              <span className="text-[10px] uppercase tracking-widest font-mono text-[var(--text-tertiary)]">
                History
              </span>
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 px-3 overflow-y-auto space-y-0.5 pb-4">
            {chatList.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <p className="text-xs font-sans text-[var(--text-tertiary)]">No threads yet</p>
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
          <div className="px-3 py-3 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            <motion.button
              type="button"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProfileClick}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all hover:bg-[var(--border)]"
              aria-label="View profile"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif text-white shrink-0"
                  style={{ background: "var(--accent)" }}
                >
                  {avatarLetter}
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-sans truncate max-w-[130px] text-[var(--text-primary)]">
                    {user?.username || "My Account"}
                  </span>
                </div>
              </div>
              <Settings size={14} className="text-[var(--text-secondary)]" />
            </motion.button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;