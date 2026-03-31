import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Share2, Menu, X } from "lucide-react";

// ─── Perplexity SVG Logo ──────────────────────────────────────────────────────
const PerplexityLogo = ({ size = 17, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M5.73486 2L11.4299 7.24715V7.24595V2.01211H12.5385V7.27063L18.2591 2V7.98253H20.6078V16.6118H18.2663V21.9389L12.5385 16.9066V21.9967H11.4299V16.9896L5.74131 22V16.6118H3.39258V7.98253H5.73486V2ZM10.5942 9.0776H4.50118V15.5167H5.73992V13.4856L10.5942 9.0776ZM6.84986 13.9715V19.5565L11.4299 15.5225V9.81146L6.84986 13.9715ZM12.5704 15.4691L17.1577 19.4994V16.6118H17.1518V13.9663L12.5704 9.80608V15.4691ZM18.2663 15.5167H19.4992V9.0776H13.4516L18.2663 13.4399V15.5167ZM17.1505 7.98253V4.51888L13.3911 7.98253H17.1505ZM10.6028 7.98253L6.84346 4.51888V7.98253H10.6028Z" />
  </svg>
);

const ChatHeader = ({ title, isLoading, isDark, onToggleTheme, onMenuToggle, sidebarOpen }) => {
  const headerBg      = isDark ? "rgba(8,8,8,0.88)"          : "rgba(248,248,246,0.88)";
  const headerBorder  = isDark ? "rgba(255,255,255,0.05)"    : "rgba(0,0,0,0.07)";
  const menuBtn       = isDark ? "text-white/40 hover:text-white/80 hover:bg-white/6"   : "text-black/40 hover:text-black/80 hover:bg-black/6";
  const logoText      = isDark ? "text-white/60"             : "text-black/55";
  const thinkingDot   = isDark ? "bg-white/40"               : "bg-black/30";
  const thinkingText  = isDark ? "text-white/25"             : "text-black/30";
  const themeBtn      = isDark ? "text-white/35 hover:text-amber-300 hover:bg-white/6"  : "text-black/40 hover:text-indigo-500 hover:bg-black/6";
  const shareBtn      = isDark ? "text-white/35 hover:text-white/65 hover:bg-white/6 border-white/8"  : "text-black/35 hover:text-black/65 hover:bg-black/6 border-black/10";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
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
                <PerplexityLogo size={18} className={logoText} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium tracking-tight ${logoText}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Perplexity
          </span>
        </div>
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
            <span className={`text-xs font-mono-dm ${thinkingText}`}>thinking…</span>
          </motion.div>
        )}

        {/* Theme toggle — Sun in dark mode, Moon in light mode */}
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