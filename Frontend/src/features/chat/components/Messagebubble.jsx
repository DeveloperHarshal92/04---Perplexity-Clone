import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const MessageBubble = ({ message, index, isLatest = false }) => {
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

  // ── AI bubble — pure prose ──────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="flex flex-col items-start w-full group"
    >
      <div className="w-full text-on-surface space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-sm">auto_awesome</span>
          </div>
          <span className="font-headline-md text-headline-md text-primary">Orchard AI</span>
        </div>
        
        <div className="font-body-lg text-body-lg space-y-4 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-4">{children}</p>,
              ul: ({ children }) => <ul className="space-y-3 list-none pl-1 mb-4">{children}</ul>,
              ol: ({ children }) => <ol className="space-y-3 list-decimal pl-5 mb-4">{children}</ol>,
              li: ({ children }) => (
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => <strong className="text-primary font-medium">{children}</strong>,
              em: ({ children }) => <em className="text-on-surface-variant">{children}</em>,
              h1: ({ children }) => <h1 className="text-display font-display text-on-surface/90 pt-2 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-headline-lg font-headline-lg text-on-surface/90 pt-2 mb-4">{children}</h2>,
              h3: ({ children }) => <h3 className="text-headline-md font-headline-md text-on-surface/90 pt-2 mb-4">{children}</h3>,
              code: ({ inline, className, children }) => {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                
                if (inline) {
                  return (
                    <code className="px-1.5 py-0.5 rounded text-[13px] font-label-md bg-surface-container-high border border-outline-variant/30 text-primary">
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="relative group/code mt-6 rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low mb-6">
                    <div className="flex items-center justify-between px-4 py-2 bg-surface-container-high/50 border-b border-outline-variant/30">
                      <span className="text-label-sm font-label-sm text-on-surface-variant">{language || "code"}</span>
                      <span 
                        className="material-symbols-outlined text-sm text-on-surface-variant cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                      >
                        content_copy
                      </span>
                    </div>
                    <pre className="p-6 overflow-x-auto text-label-md font-label-md text-secondary leading-relaxed">
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              },
              blockquote: ({ children }) => <blockquote className="pl-4 my-4 italic border-l-2 border-outline-variant/30 text-on-surface-variant">{children}</blockquote>,
              hr: () => <hr className="my-6 border-outline-variant/30" />,
              table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
              th: ({ children }) => <th className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider border-b border-outline-variant/30 text-on-surface-variant">{children}</th>,
              td: ({ children }) => <td className="px-3 py-2 text-[15px] border-b border-outline-variant/30 text-on-surface">{children}</td>,
            }}
          >
            {displayed}
          </ReactMarkdown>

          {/* Blinking cursor */}
          {!isDone && (
            <span
              className="inline-block w-[2px] h-[0.85em] align-middle ml-[2px] rounded-sm bg-primary"
              style={{ animation: "tw-blink 0.9s step-end infinite" }}
            />
          )}
        </div>

        {/* Prose Actions */}
        {isDone && (
          <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors py-1 pr-3" 
              title="Copy response"
            >
              <span className="material-symbols-outlined text-lg">{copied ? "check" : "content_copy"}</span>
              <span className="text-label-sm font-label-sm">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">thumb_up</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;