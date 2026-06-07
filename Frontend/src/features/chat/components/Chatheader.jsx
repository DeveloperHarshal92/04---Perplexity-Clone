import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Share2, Menu, X } from "lucide-react";

const OrchardLogo = ({ size = 24, className = "" }) => (
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

const ChatHeader = ({ title, isLoading, isDark, onToggleTheme, onMenuToggle, sidebarOpen }) => {
  const menuBtn = "text-[var(--text-secondary)] hover:text-[var(--text-primary)]";
  const logoText = "text-[var(--text-primary)]";
  const thinkingDot = "bg-[var(--accent)]";
  const thinkingText = "text-[var(--text-secondary)]";
  const themeBtn = "text-[var(--text-secondary)] hover:text-[var(--text-primary)]";
  const shareBtn = "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border)]";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        height: "52px",
        transition: "background 0.3s ease",
      }}
    >
      {/* Left: menu + logo */}
      <div className="flex items-center gap-1">
        <motion.button
          onClick={onMenuToggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`p-1.5 rounded-lg transition-all ${menuBtn}`}
          aria-label="Toggle sidebar"
        >
          <AnimatePresence mode="wait" initial={false}>
            {sidebarOpen ? (
              <motion.div key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={18} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {!sidebarOpen && (
          <div className="flex items-center gap-2 ml-1">
            <OrchardLogo size={20} className="text-[var(--accent)]" />
            <span className={`text-sm font-serif font-medium tracking-tight ${logoText}`}>
              Orchard AI
            </span>
          </div>
        )}
      </div>

      {/* Right: thinking indicator + theme toggle + share */}
      <div className="flex items-center gap-2">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="hidden sm:flex items-center gap-1.5 mr-1"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${thinkingDot}`} />
            <span className={`text-xs font-mono ${thinkingText}`}>thinking…</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleTheme}
          className={`p-1.5 rounded-lg transition-all ${themeBtn}`}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div key="sun" initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }} transition={{ duration: 0.18 }}>
                <Sun size={17} />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -30, opacity: 0 }} transition={{ duration: 0.18 }}>
                <Moon size={17} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all border ${shareBtn}`}
        >
          <Share2 size={13} />
          <span className="hidden sm:inline">Share</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default ChatHeader;