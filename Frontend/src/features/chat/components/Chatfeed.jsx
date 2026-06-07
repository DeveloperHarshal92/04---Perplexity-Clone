import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

const EmptyState = ({ onSuggestedPrompt }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="flex-1 flex flex-col items-center justify-center p-md overflow-y-auto custom-scrollbar min-h-[60vh] select-none"
  >
    <div className="max-w-[800px] w-full flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-lg opacity-80"
      >
        <img alt="Orchard Logo Large" className="w-24 h-24 object-contain grayscale brightness-125" src="https://lh3.googleusercontent.com/aida/AP1WRLttygO57vcpMbS9IhQtnYFUvW0rthLyZ1JFio4pieRXM4j6x7I7RycZVyPX3lP94t347N6RqmNdMybWfYy4EfUBiMB6qguKHJf9nkIcAIMuTTUZraYC1uM7VNL_AgoTeUd4ADRwBm72B55QlOiy2G_ISHI4CMBwK0eT_vU6LM_9qVl4RoO8yVJ0U4OdqtdoXRMG9bQNcHuv8qV8dcqNQ3jIHNqb4cScQv-H_9kgWEiS2_z1G9DPgPc2KQ" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-h1 text-h1 text-on-surface mb-xs"
      >
        Think deeper.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="text-on-surface-variant text-body-lg"
      >
        Ask anything. Explore new perspectives with Orchard's intelligence.
      </motion.p>
      
      {/* Prompt Suggestions Grid (Bento Style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-xl w-full"
      >
        <button 
          onClick={() => onSuggestedPrompt("Synthesize the latest papers on climate tech.")}
          className="glass-bg p-md rounded-xl text-left hover:bg-white/5 transition-all group"
        >
          <span className="material-symbols-outlined text-primary mb-xs block">science</span>
          <h4 className="font-medium text-on-surface">Scientific Research</h4>
          <p className="font-caption text-caption text-on-surface-variant">Synthesize the latest papers on climate tech.</p>
        </button>
        <button 
          onClick={() => onSuggestedPrompt("Help me outline a sci-fi novel set in 2077.")}
          className="glass-bg p-md rounded-xl text-left hover:bg-white/5 transition-all group"
        >
          <span className="material-symbols-outlined text-primary mb-xs block">edit_note</span>
          <h4 className="font-medium text-on-surface">Creative Writing</h4>
          <p className="font-caption text-caption text-on-surface-variant">Help me outline a sci-fi novel set in 2077.</p>
        </button>
      </motion.div>
    </div>
  </motion.section>
);

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-3 w-full"
  >
    <div className="glass-bg px-4 py-3 rounded-full flex gap-1.5 items-center">
      <div className="w-1.5 h-1.5 rounded-full bg-primary/70 dot-bounce"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-primary/70 dot-bounce"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-primary/70 dot-bounce"></div>
    </div>
    <span className="text-label-sm text-on-surface-variant font-label-sm italic">Orchard is processing...</span>
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
        transition={{ duration: 0.3 }}
        className="max-w-[85%] self-end mb-2"
      >
        <img
          src={userFile.url}
          alt={userFile.name}
          className="rounded-2xl max-h-64 max-w-full object-cover shadow-lg border border-outline-variant/30"
        />
        <p className="text-right mt-1 text-xs truncate max-w-full font-label-mono text-outline">
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
      <a
        href={userFile.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm transition-opacity hover:opacity-80 bg-surface-container border border-outline-variant/30 text-on-surface font-body-md max-w-[280px]"
      >
        <span className="material-symbols-outlined shrink-0">{getFileIcon(userFile.type)}</span>
        <span className="truncate">{userFile.name}</span>
        {userFile.url ? (
          <span className="ml-auto shrink-0 material-symbols-outlined text-[16px] text-outline">north_east</span>
        ) : (
          <span className="ml-auto shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-on-surface-variant font-label-mono">
            read
          </span>
        )}
      </a>
    </motion.div>
  );
};

const UserMessage = ({ message, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.04 }}
    className="flex flex-col items-end w-full animate-fade-in-up"
  >
    <FileAttachment userFile={message.userFile} />

    {message.content && (
      <>
        <div className="bg-surface-container-highest text-on-surface px-6 py-4 rounded-3xl rounded-tr-sm max-w-[85%] md:max-w-[70%] border border-outline-variant/20 shadow-sm">
          <p className="font-body-md text-body-md leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 px-2">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </>
    )}
  </motion.div>
);

const ChatFeed = ({ messages, isLoading, isDark, onSuggestedPrompt }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const lastAiIndex = messages.reduce(
    (last, msg, i) => (msg.role === "ai" ? i : last),
    -1
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-0 pt-24 pb-32 flex flex-col items-center custom-scrollbar w-full">
      <div className="w-full max-w-3xl space-y-12">
        {messages.length === 0 && !isLoading ? (
          <EmptyState onSuggestedPrompt={onSuggestedPrompt} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) =>
              message.role === "user" ? (
                <UserMessage
                  key={index}
                  message={message}
                  index={index}
                />
              ) : (
                <MessageBubble
                  key={index}
                  message={message}
                  index={index}
                  isLatest={index === lastAiIndex}
                />
              )
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {isLoading && <TypingIndicator />}
        </AnimatePresence>

        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ChatFeed;