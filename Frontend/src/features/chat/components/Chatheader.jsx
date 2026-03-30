import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Share2, Menu, X } from "lucide-react";

// ─── Perplexity SVG Logo ──────────────────────────────────────────────────────
const PerplexityLogo = ({ size = 17, className = "" }) => (
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

const ChatHeader = ({ title, isLoading, isDark, onToggleTheme, onMenuToggle, sidebarOpen }) => {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="h-13 flex items-center justify-between px-4 shrink-0"
      style={{
        background: "rgba(8,8,8,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        height: "52px",
      }}
    >
      {/* Left: Menu toggle + Logo */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onMenuToggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/6 transition-all"
          aria-label="Toggle sidebar"
        >
          <AnimatePresence mode="wait" initial={false}>
            {sidebarOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={17} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={17} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex items-center gap-2">
          <PerplexityLogo size={16} className="text-white/60" />
          <span
            className="text-white/60 text-sm font-medium tracking-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            perplexity
          </span>
        </div>
      </div>

      {/* Right: loading hint + theme toggle */}
      <div className="flex items-center gap-2">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="hidden sm:flex items-center gap-1.5 mr-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-xs text-white/25 font-mono-dm">thinking…</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/6 transition-all"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/35 hover:text-white/65 hover:bg-white/6 transition-all border border-white/8"
        >
          <Share2 size={12} />
          <span className="hidden sm:inline">Share</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default ChatHeader;