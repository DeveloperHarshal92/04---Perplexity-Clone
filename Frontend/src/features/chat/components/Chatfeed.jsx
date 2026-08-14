import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

const PerplexityIcon = ({ size = 32, className = "" }) => (
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

const SuggestionCard = ({ icon, title, description, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-[#fdfbfa] border border-[#d1d1cd] p-4 rounded-[16px] text-left hover:bg-[#f5f3ee] hover:border-[#92918b]/60 transition-all duration-150 card-subtle-shadow flex flex-col justify-between group cursor-pointer"
  >
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="material-symbols-outlined text-[#27251e] text-[20px]">
          {icon}
        </span>
        {badge && (
          <span className="bg-[#016a71] text-white text-[11px] font-medium px-2 py-0.5 rounded-full font-mono">
            {badge}
          </span>
        )}
      </div>
      <h4 className="text-[15px] font-medium text-[#27251e] mb-1 group-hover:text-[#016a71] transition-colors">
        {title}
      </h4>
      <p className="text-[13px] text-[#72706b] leading-relaxed">
        {description}
      </p>
    </div>
  </button>
);

const EmptyState = ({ onSuggestedPrompt }) => {
  const suggestions = [
    {
      icon: "travel_explore",
      title: "Academic synthesis",
      description:
        "Compare recent breakthroughs in quantum computing and error mitigation.",
      prompt:
        "Compare recent breakthroughs in quantum computing and error mitigation.",
      badge: "NEW",
    },
    {
      icon: "analytics",
      title: "Market overview",
      description:
        "Analyze semiconductor supply chains and global foundry capacity.",
      prompt:
        "Analyze semiconductor supply chains and global foundry capacity.",
    },
    {
      icon: "code",
      title: "Architecture design",
      description:
        "Explain distributed consensus algorithms like Raft versus Paxos.",
      prompt:
        "Explain distributed consensus algorithms like Raft versus Paxos.",
    },
    {
      icon: "menu_book",
      title: "Literature analysis",
      description:
        "Trace the evolution of magical realism in twentieth century literature.",
      prompt:
        "Trace the evolution of magical realism in twentieth century literature.",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center p-4 max-w-[900px] mx-auto w-full my-auto select-none"
    >
      <div className="w-full max-w-[760px] flex flex-col items-center text-center">
        {/* Brand Icon & Wordmark */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#27251e] text-[#faf8f5] flex items-center justify-center shadow-sm">
            <PerplexityIcon size={26} />
          </div>
          <span className="text-[32px] font-medium tracking-tight text-[#27251e]">
            perplexity
          </span>
        </div>

        <h1 className="text-[26px] md:text-[30px] font-medium text-[#27251e] tracking-tight mb-2">
          Where knowledge begins.
        </h1>
        <p className="text-[15px] text-[#72706b] max-w-[500px] mb-8 leading-relaxed">
          Ask questions, research papers, explore citations, and analyze complex
          topics with verified sources.
        </p>

        {/* Suggestion Cards 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              description={s.description}
              badge={s.badge}
              onClick={() => onSuggestedPrompt(s.prompt)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-3 w-full py-3"
  >
    <div className="bg-[#f0ede6] border border-[#d1d1cd] px-3.5 py-2 rounded-full flex gap-1.5 items-center">
      <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
    </div>
    <span className="text-[12px] text-[#72706b] font-mono">
      Searching and compiling sources...
    </span>
  </motion.div>
);

const getFileIcon = (type) => {
  if (!type) return "attach_file";
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf") return "picture_as_pdf";
  if (type.includes("word")) return "description";
  if (type === "text/plain") return "subject";
  return "attach_file";
};

const FileAttachment = ({ userFile }) => {
  if (!userFile) return null;

  if (userFile.type?.startsWith("image/") && userFile.url) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="max-w-[85%] self-end mb-2"
      >
        <img
          src={userFile.url}
          alt={userFile.name}
          className="rounded-[16px] max-h-60 max-w-full object-cover border border-[#d1d1cd] card-subtle-shadow"
        />
        <p className="text-right mt-1 text-[11px] truncate max-w-full font-mono text-[#92918b]">
          {userFile.name}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="self-end mb-2"
    >
      <a
        href={userFile.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] bg-[#fdfbfa] border border-[#d1d1cd] text-[#27251e] hover:bg-[#f0ede6] transition-colors card-subtle-shadow max-w-[280px]"
      >
        <span className="material-symbols-outlined text-[16px] text-[#72706b] shrink-0">
          {getFileIcon(userFile.type)}
        </span>
        <span className="truncate">{userFile.name}</span>
        <span className="ml-auto shrink-0 material-symbols-outlined text-[14px] text-[#92918b]">
          north_east
        </span>
      </a>
    </motion.div>
  );
};

const UserMessage = ({ message, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: index * 0.02 }}
    className="flex flex-col items-end w-full py-2"
  >
    <FileAttachment userFile={message.userFile} />

    {message.content && (
      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
        <div className="bg-[#f0ede6] text-[#27251e] px-4 py-2.5 rounded-2xl rounded-tr-sm border border-[#d1d1cd]">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-normal">
            {message.content}
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#92918b] mt-1 px-1">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    )}
  </motion.div>
);

const ChatFeed = ({ messages, isLoading, onSuggestedPrompt }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const lastAiIndex = messages.reduce(
    (last, msg, i) => (msg.role === "ai" ? i : last),
    -1,
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-6 pb-12 flex flex-col items-center custom-scrollbar w-full">
      <div className="w-full max-w-[900px] flex-1 flex flex-col space-y-6">
        {messages.length === 0 && !isLoading ? (
          <EmptyState onSuggestedPrompt={onSuggestedPrompt} />
        ) : (
          <div className="space-y-6 py-2">
            <AnimatePresence initial={false}>
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <UserMessage key={index} message={message} index={index} />
                ) : (
                  <MessageBubble
                    key={index}
                    message={message}
                    index={index}
                    isLatest={index === lastAiIndex}
                  />
                ),
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ChatFeed;
