import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTypewriter } from "../hooks/useTypewriter";
import toast from "react-hot-toast";

const PerplexityIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2V22M12 12L20 4M12 12L4 4M12 12L20 20M12 12L4 20M2 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MessageBubble = ({ message, index, isLatest = false, onRetry }) => {
  const [copied, setCopied] = useState(false);

  const { displayed, isDone } = useTypewriter(
    message.content || "",
    message.role !== "user" && isLatest,
    16,
  );

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Answer copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content || window.location.href);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
      className="flex flex-col items-start w-full group py-2"
    >
      <div className="w-full text-[#27251e] space-y-4">
        {/* Header: Perplexity Answer */}
        <div className="flex items-center justify-between border-b border-[#d1d1cd]/50 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#27251e] text-[#faf8f5] flex items-center justify-center">
              <PerplexityIcon size={13} />
            </div>
            <span className="text-[15px] font-medium text-[#27251e] tracking-tight">
              Answer
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#016a71]/10 text-[#016a71]">
              Verified
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[#f0ede6] text-[#72706b] hover:text-[#27251e] text-[12px] transition-colors"
              title="Copy answer"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? "check" : "content_copy"}
              </span>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1 rounded-md hover:bg-[#f0ede6] text-[#72706b] hover:text-[#27251e] transition-colors"
              title="Share"
            >
              <span className="material-symbols-outlined text-[16px]">
                share
              </span>
            </button>
          </div>
        </div>

        {/* Scholarly Markdown Content */}
        <div className="text-[15px] leading-relaxed text-[#27251e] space-y-3 font-normal">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed text-[#27251e]">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-1.5 list-none pl-1 mb-3">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-1.5 list-decimal pl-5 mb-3 text-[#27251e]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="flex gap-2.5 items-start">
                  <span className="text-[#016a71] mt-1.5 text-[10px] shrink-0 font-mono">
                    ■
                  </span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-medium text-[#000000]">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-[#72706b]">{children}</em>
              ),
              h1: ({ children }) => (
                <h1 className="text-[20px] font-normal text-[#27251e] pt-3 pb-1 border-b border-[#d1d1cd] mb-2 tracking-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-[17px] font-normal text-[#27251e] pt-2 mb-1.5 tracking-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-[15px] font-medium text-[#27251e] pt-1 mb-1 tracking-tight">
                  {children}
                </h3>
              ),
              code: ({ inline, className, children }) => {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";

                if (inline) {
                  return (
                    <code className="px-1.5 py-0.5 rounded-[4px] text-[13px] font-mono bg-[#f0ede6] text-[#27251e] border border-[#d1d1cd]">
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="relative group/code my-4 rounded-[12px] overflow-hidden border border-[#d1d1cd] bg-[#fdfbfa] card-subtle-shadow">
                    <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#f0ede6] border-b border-[#d1d1cd]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#72706b]">
                        {language || "Code"}
                      </span>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[11px] text-[#72706b] hover:text-[#27251e] transition-colors cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            String(children).replace(/\n$/, ""),
                          );
                          toast.success("Code copied");
                        }}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          content_copy
                        </span>
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-[13px] font-mono text-[#27251e] leading-relaxed bg-[#fbf9f6]">
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="pl-3.5 my-3 italic border-l-2 border-[#016a71] text-[#72706b] bg-[#f0ede6]/40 py-1 rounded-r-[6px]">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-4 border-[#d1d1cd]" />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-3 border border-[#d1d1cd] rounded-[12px] bg-[#fdfbfa]">
                  <table className="w-full text-[13px] border-collapse">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="text-left px-3.5 py-2 font-medium text-[12px] uppercase tracking-wider border-b border-[#d1d1cd] bg-[#f0ede6] text-[#27251e]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3.5 py-2 border-b border-[#d1d1cd]/50 text-[#27251e] last:border-0 font-normal">
                  {children}
                </td>
              ),
            }}
          >
            {displayed}
          </ReactMarkdown>

          {/* Typing blink cursor */}
          {!isDone && (
            <span className="inline-block w-[2px] h-[1em] align-middle ml-[2px] bg-[#016a71] animate-pulse" />
          )}
        </div>

        {/* Prose Bottom Ghost Actions (6px radius per DESIGN.md) */}
        {isDone && (
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[#72706b] hover:text-[#27251e] text-[12px] px-3 py-1.5 rounded-[6px] border border-[#d1d1cd] bg-transparent hover:bg-[#f0ede6] active:scale-[0.98] transition-all cursor-pointer"
              title="Copy response"
            >
              <span className="material-symbols-outlined text-[15px]">
                {copied ? "check" : "content_copy"}
              </span>
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-[#72706b] hover:text-[#27251e] text-[12px] px-3 py-1.5 rounded-[6px] border border-[#d1d1cd] bg-transparent hover:bg-[#f0ede6] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">
                share
              </span>
              <span>Share</span>
            </button>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 text-[#72706b] hover:text-[#27251e] text-[12px] px-3 py-1.5 rounded-[6px] border border-[#d1d1cd] bg-transparent hover:bg-[#f0ede6] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  refresh
                </span>
                <span>Rewrite</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
