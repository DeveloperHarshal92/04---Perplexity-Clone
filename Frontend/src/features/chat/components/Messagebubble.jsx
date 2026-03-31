import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageBubble = ({ message, index, isDark }) => {
  const [copied, setCopied] = useState(false);

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
        className="flex justify-end"
      >
        <div
          className="px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed max-w-[80%]"
          style={{
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
            border:     `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)"}`,
            color:      isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)",
          }}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  // ── AI bubble — clean prose, no avatar ──────────────────────────────────
  const prose     = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.72)";
  const proseMid  = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.60)";
  const proseWeak = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)";
  const codeInlineBg     = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const codeInlineBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const codeBlockBg      = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const codeBlockBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const blockquoteBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const hrColor          = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const tdBorder         = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const thBorder         = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const copyBtnBg        = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const copyBtnBorder    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="group"
    >
      <div className="relative">
        <div className="prose prose-sm max-w-none leading-[1.75]" style={{ fontFamily: "'DM Sans', sans-serif", color: prose }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p:          ({ children }) => <p className="mb-3 last:mb-0" style={{ color: prose }}>{children}</p>,
              ul:         ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1" style={{ color: proseMid }}>{children}</ul>,
              ol:         ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1" style={{ color: proseMid }}>{children}</ol>,
              li:         ({ children }) => <li style={{ color: proseMid }}>{children}</li>,
              strong:     ({ children }) => <strong style={{ color: isDark ? "rgba(255,255,255,0.90)" : "rgba(0,0,0,0.85)", fontWeight: 600 }}>{children}</strong>,
              em:         ({ children }) => <em style={{ color: proseWeak }}>{children}</em>,
              h1:         ({ children }) => <h1 className="font-semibold text-lg mb-2 mt-4" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.82)" }}>{children}</h1>,
              h2:         ({ children }) => <h2 className="font-semibold text-base mb-2 mt-3" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.82)" }}>{children}</h2>,
              h3:         ({ children }) => <h3 className="font-medium mb-1.5 mt-3" style={{ color: isDark ? "rgba(255,255,255,0.80)" : "rgba(0,0,0,0.78)" }}>{children}</h3>,
              code: ({ inline, children }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: codeInlineBg, color: prose, border: `1px solid ${codeInlineBorder}`, fontFamily: "'DM Mono', monospace" }}>
                    {children}
                  </code>
                ) : (
                  <pre className="p-4 rounded-xl overflow-x-auto mb-3 text-xs" style={{ background: codeBlockBg, border: `1px solid ${codeBlockBorder}` }}>
                    <code className="font-mono" style={{ color: proseMid, fontFamily: "'DM Mono', monospace" }}>{children}</code>
                  </pre>
                ),
              blockquote: ({ children }) => <blockquote className="pl-4 my-3 italic" style={{ borderLeft: `2px solid ${blockquoteBorder}`, color: proseWeak }}>{children}</blockquote>,
              hr:         ()             => <hr className="my-4" style={{ borderColor: hrColor }} />,
              table:      ({ children }) => <div className="overflow-x-auto mb-3"><table className="w-full text-sm border-collapse">{children}</table></div>,
              th:         ({ children }) => <th className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider" style={{ borderBottom: `1px solid ${thBorder}`, color: proseWeak }}>{children}</th>,
              td:         ({ children }) => <td className="px-3 py-2 text-sm" style={{ borderBottom: `1px solid ${tdBorder}`, color: proseMid }}>{children}</td>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Copy button */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg flex items-center gap-1.5"
          style={{ background: copyBtnBg, border: `1px solid ${copyBtnBorder}` }}
          title="Copy"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                <Check size={11} style={{ color: proseWeak }} />
                <span className="text-xs font-mono-dm" style={{ color: proseWeak }}>Copied</span>
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                <Copy size={11} style={{ color: proseWeak }} />
                <span className="text-xs font-mono-dm" style={{ color: `${proseWeak}99` }}>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MessageBubble;