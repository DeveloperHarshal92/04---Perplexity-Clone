import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageBubble = ({ message, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── User bubble ────────────────────────────────────────────────────────────
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.02 }}
        className="flex justify-end"
      >
        <div
          className="text-white/85 px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed max-w-[80%]"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  // ── AI bubble — no avatar ──────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="group"
    >
      <div className="relative">
        {/* Markdown content — no bubble border, just clean prose */}
        <div
          className="prose prose-invert prose-sm max-w-none text-white/75 leading-[1.75]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="mb-3 last:mb-0 text-white/75">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1 text-white/65">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 mb-3 space-y-1 text-white/65">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-white/65">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-white/90 font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-white/60 italic">{children}</em>
              ),
              h1: ({ children }) => (
                <h1 className="text-white/85 font-semibold text-lg mb-2 mt-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-white/85 font-semibold text-base mb-2 mt-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-white/80 font-medium mb-1.5 mt-3">{children}</h3>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code
                    className="px-1.5 py-0.5 rounded text-xs font-mono"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.75)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {children}
                  </code>
                ) : (
                  <pre
                    className="p-4 rounded-xl overflow-x-auto mb-3 text-xs"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <code
                      className="font-mono text-white/60"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {children}
                    </code>
                  </pre>
                ),
              blockquote: ({ children }) => (
                <blockquote
                  className="pl-4 my-3 italic text-white/45"
                  style={{ borderLeft: "2px solid rgba(255,255,255,0.15)" }}
                >
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.07)" }} />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-sm border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th
                  className="text-left px-3 py-2 text-white/50 font-medium text-xs uppercase tracking-wider"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td
                  className="px-3 py-2 text-white/60 text-sm"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {children}
                </td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Copy button — appears on hover */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg flex items-center gap-1.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          title="Copy"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1"
              >
                <Check size={11} className="text-white/50" />
                <span className="text-xs text-white/35 font-mono-dm">Copied</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1"
              >
                <Copy size={11} className="text-white/30" />
                <span className="text-xs text-white/25 font-mono-dm">Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MessageBubble;