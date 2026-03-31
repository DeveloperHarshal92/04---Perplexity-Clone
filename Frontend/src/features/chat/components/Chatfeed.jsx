import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

// ─── Perplexity SVG Logo ──────────────────────────────────────────────────────
const PerplexityLogo = ({ size = 40, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M5.73486 2L11.4299 7.24715V7.24595V2.01211H12.5385V7.27063L18.2591 2V7.98253H20.6078V16.6118H18.2663V21.9389L12.5385 16.9066V21.9967H11.4299V16.9896L5.74131 22V16.6118H3.39258V7.98253H5.73486V2ZM10.5942 9.0776H4.50118V15.5167H5.73992V13.4856L10.5942 9.0776ZM6.84986 13.9715V19.5565L11.4299 15.5225V9.81146L6.84986 13.9715ZM12.5704 15.4691L17.1577 19.4994V16.6118H17.1518V13.9663L12.5704 9.80608V15.4691ZM18.2663 15.5167H19.4992V9.0776H13.4516L18.2663 13.4399V15.5167ZM17.1505 7.98253V4.51888L13.3911 7.98253H17.1505ZM10.6028 7.98253L6.84346 4.51888V7.98253H10.6028Z" />
  </svg>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ isDark }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="flex flex-col items-center justify-center h-full text-center px-6 select-none"
    style={{ minHeight: "60vh" }}
  >
    <div className="flex gap-3 sm:gap-4 items-center mb-4" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <PerplexityLogo size={52} className={isDark ? "text-white/20" : "text-black/15"} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={`font-medium select-none ${isDark ? "text-white/80" : "text-black/75"}`}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2rem, 6vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: 1 }}
      >
        Perplexity
      </motion.h1>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className={`mt-4 text-sm ${isDark ? "text-white/20" : "text-black/30"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      Ask anything
    </motion.p>
  </motion.div>
);

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = ({ isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-3 pl-1"
  >
    <div
      className="flex gap-1.5 px-4 py-3 rounded-2xl"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [-2, 2, -2], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
          className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/30" : "bg-black/25"}`}
        />
      ))}
    </div>
  </motion.div>
);

// ─── ChatFeed ─────────────────────────────────────────────────────────────────
const ChatFeed = ({ messages, isLoading, isDark }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="messages-feed flex-1 overflow-y-auto px-4 sm:px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-6 pb-40">
        {messages.length === 0 && !isLoading ? (
          <EmptyState isDark={isDark} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} index={index} isDark={isDark} />
            ))}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {isLoading && <TypingIndicator isDark={isDark} />}
        </AnimatePresence>

        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ChatFeed;