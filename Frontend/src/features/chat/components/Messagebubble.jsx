import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTypewriter } from "../hooks/useTypewriter";

// Inject blink keyframe once
const blinkStyle =
  typeof document !== "undefined" && !document.getElementById("tw-blink-style")
    ? (() => {
        const s = document.createElement("style");
        s.id = "tw-blink-style";
        s.textContent = "@keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }";
        document.head.appendChild(s);
      })()
    : null;

const MessageBubble = ({ message, index, isDark, isLatest = false }) => {
  const [copied, setCopied] = useState(false);

  const { displayed, isDone } = useTypewriter(
    message.content,
    message.role !== "user" && isLatest,
    14
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── User bubble ──────────────────────────────────────────────────────────
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.02 }}
        className="flex justify-end mb-6"
      >
        <div
          className="px-5 py-3.5 rounded-2xl rounded-br-sm text-[15px] leading-relaxed max-w-[80%]"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  // ── AI bubble — pure prose ──────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="group mb-8"
    >
      <div className="relative">
        <div className="prose prose-sm max-w-none leading-[1.75]" style={{ fontFamily: "'Inter', sans-serif", color: "var(--text-primary)" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p:          ({ children }) => <p className="mb-4 last:mb-0" style={{ color: "var(--text-primary)", fontSize: "15px", lineHeight: "1.6" }}>{children}</p>,
              ul:         ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-2" style={{ color: "var(--text-primary)" }}>{children}</ul>,
              ol:         ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-2" style={{ color: "var(--text-primary)" }}>{children}</ol>,
              li:         ({ children }) => <li style={{ color: "var(--text-primary)", fontSize: "15px" }}>{children}</li>,
              strong:     ({ children }) => <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{children}</strong>,
              em:         ({ children }) => <em style={{ color: "var(--text-secondary)" }}>{children}</em>,
              h1:         ({ children }) => <h1 className="font-serif font-medium text-2xl mb-3 mt-6" style={{ color: "var(--text-primary)" }}>{children}</h1>,
              h2:         ({ children }) => <h2 className="font-serif font-medium text-xl mb-3 mt-5" style={{ color: "var(--text-primary)" }}>{children}</h2>,
              h3:         ({ children }) => <h3 className="font-serif font-medium text-lg mb-2 mt-4" style={{ color: "var(--text-primary)" }}>{children}</h3>,
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 rounded text-[13px] font-mono bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--accent)] border" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {children}
                  </code>
                ) : (
                  <pre className="p-4 rounded-xl overflow-x-auto mb-4 text-[13px] bg-[var(--bg-elevated)] border border-[var(--border)]">
                    <code className="font-mono text-[var(--text-secondary)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{children}</code>
                  </pre>
                ),
              blockquote: ({ children }) => <blockquote className="pl-4 my-4 italic border-l-2 border-[var(--border)] text-[var(--text-secondary)]">{children}</blockquote>,
              hr:         ()             => <hr className="my-6 border-[var(--border)]" />,
              table:      ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
              th:         ({ children }) => <th className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider border-b border-[var(--border)] text-[var(--text-secondary)]">{children}</th>,
              td:         ({ children }) => <td className="px-3 py-2 text-[15px] border-b border-[var(--border)] text-[var(--text-primary)]">{children}</td>,
            }}
          >
            {displayed}
          </ReactMarkdown>

          {/* Blinking cursor */}
          {!isDone && (
            <span
              className="inline-block w-[2px] h-[0.85em] align-middle ml-[2px] rounded-sm bg-[var(--accent)]"
              style={{ animation: "tw-blink 0.9s step-end infinite" }}
            />
          )}
        </div>

        {/* Copy button */}
        {isDone && (
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
            title="Copy"
            aria-label="Copy message"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                  <Check size={14} className="text-[var(--accent)]" />
                  <span className="text-xs font-sans">Copied</span>
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                  <Copy size={14} />
                  <span className="text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;