import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

const OrchardLogo = ({ size = 48, className = "" }) => (
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

const EmptyState = ({ isDark }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="flex flex-col items-center justify-center h-full text-center px-6 select-none"
    style={{ minHeight: "60vh" }}
  >
    <div className="flex flex-col items-center justify-center mb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4 text-[var(--accent)]"
      >
        <OrchardLogo size={64} />
      </motion.div>
    </div>

    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="font-serif font-medium text-3xl sm:text-4xl text-[var(--text-primary)]"
    >
      Think deeper. Ask anything.
    </motion.h1>
  </motion.div>
);

const TypingIndicator = ({ isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-3 pl-1 mb-8"
  >
    <div
      className="flex gap-1.5 px-4 py-3 rounded-full border border-[var(--border)] bg-[var(--glass-bg)]"
      style={{ backdropFilter: "blur(24px) saturate(180%)" }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [-3, 3, -3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
          className="w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]"
        />
      ))}
    </div>
  </motion.div>
);

const getFileIcon = (type) => {
  if (!type) return "📎";
  if (type.startsWith("image/")) return "🖼️";
  if (type === "application/pdf") return "📄";
  if (type.includes("word")) return "📝";
  if (type === "text/plain") return "📃";
  return "📎";
};

const FileAttachment = ({ userFile, isDark }) => {
  if (!userFile) return null;

  if (userFile.type?.startsWith("image/") && userFile.url) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-[85%] self-end mb-2"
      >
        <img
          src={userFile.url}
          alt={userFile.name}
          className="rounded-2xl max-h-64 max-w-full object-cover shadow-lg border border-[var(--border)]"
        />
        <p className="text-right mt-1 text-xs truncate max-w-full font-mono text-[var(--text-tertiary)]">
          {userFile.name}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="self-end mb-2"
    >
      {userFile.url ? (
        <a
          href={userFile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm transition-opacity hover:opacity-80 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-sans max-w-[280px]"
        >
          <span className="text-base shrink-0">{getFileIcon(userFile.type)}</span>
          <span className="truncate">{userFile.name}</span>
          <span className="ml-auto shrink-0 text-xs text-[var(--text-tertiary)]">↗</span>
        </a>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-sans max-w-[280px]">
          <span className="text-base shrink-0">{getFileIcon(userFile.type)}</span>
          <span className="truncate">{userFile.name}</span>
          <span className="ml-auto shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[var(--border)] text-[var(--text-secondary)] font-mono">
            read
          </span>
        </div>
      )}
    </motion.div>
  );
};

const UserMessage = ({ message, index, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
    className="flex flex-col items-end gap-1 mb-6"
  >
    <FileAttachment userFile={message.userFile} isDark={isDark} />

    {message.content && (
      <div
        className="px-5 py-3.5 rounded-2xl rounded-br-sm shadow-sm max-w-[80%] text-[15px] leading-relaxed bg-[var(--bg-elevated)] text-[var(--text-primary)] font-sans"
      >
        {message.content}
      </div>
    )}
  </motion.div>
);

const ChatFeed = ({ messages, isLoading, isDark }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const lastAiIndex = messages.reduce(
    (last, msg, i) => (msg.role === "ai" ? i : last),
    -1
  );

  return (
    <div className="messages-feed flex-1 overflow-y-auto px-4 sm:px-6 py-8">
      <div className="max-w-[672px] mx-auto space-y-6 pb-40">
        {messages.length === 0 && !isLoading ? (
          <EmptyState isDark={isDark} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) =>
              message.role === "user" ? (
                <UserMessage
                  key={index}
                  message={message}
                  index={index}
                  isDark={isDark}
                />
              ) : (
                <MessageBubble
                  key={index}
                  message={message}
                  index={index}
                  isDark={isDark}
                  isLatest={index === lastAiIndex}
                />
              )
            )}
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