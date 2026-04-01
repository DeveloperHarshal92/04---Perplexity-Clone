import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { Toaster } from "react-hot-toast";

import AmbientBackground from "../components/AmbientBackground";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatFeed from "../components/ChatFeed";
import ChatInput from "../components/ChatInput";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]); // ← single array, single source of truth
  const activeChatRef = useRef(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  // ── Add files to the array ──
  const handleFileAttach = (files) => {
    const newFiles = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
      // Generate preview URL only for images
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      isImage: f.type.startsWith("image/"),
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  // ── Remove a single file by id, revoke its blob URL if present ──
  const handleRemoveFile = (id) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview); // free memory
      return prev.filter((f) => f.id !== id);
    });
  };

  // ── Clear all files (called after successful send) ──
  const clearAttachedFiles = () => {
    attachedFiles.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setAttachedFiles([]);
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();

    // Allow send if there's text OR at least one file
    if (!trimmedMessage && attachedFiles.length === 0) return;

    const chatIdToUse = activeChatRef.current || currentChatId;

    // Pass only the first file to the API for now
    // (multi-file support can be added later on the backend)
    const data = await chat.handleSendMessage({
      message: trimmedMessage,
      chatId: chatIdToUse,
      file: attachedFiles[0]?.file || null,
    });

    if (!activeChatRef.current && data?.chat?._id) {
      activeChatRef.current = data.chat._id;
    }

    setChatInput("");
    clearAttachedFiles();
  };

  const openChat = (chatId) => {
    activeChatRef.current = chatId;
    chat.handleOpenChat(chatId, chats);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    activeChatRef.current = null;
    chat.handleNewChat();
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId) => {
    if (activeChatRef.current === chatId) {
      activeChatRef.current = null;
    }
    chat.handleDeleteChat(chatId);
  };

  const currentMessages = chats[currentChatId]?.messages || [];
  const currentTitle = chats[currentChatId]?.title;

  const rootBg = isDark ? "#080808" : "#f5f5f2";
  const rootColor = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.80)";

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isDark ? "#1a1a1a" : "#ffffff",
            color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"}`,
            borderRadius: "10px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
          },
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display  { font-family: 'Fraunces', serif; }
        .font-mono-dm  { font-family: 'DM Mono', monospace; }
        .font-sans-dm  { font-family: 'DM Sans', sans-serif; }

        .messages-feed::-webkit-scrollbar { display: none; }
        .scrollbar-thin::-webkit-scrollbar        { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track  { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb  { background: rgba(128,128,128,0.2); border-radius: 99px; }

        .sidebar-overlay {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
        }
      `}</style>

      <div
        className="font-sans-dm flex h-screen overflow-hidden relative"
        style={{
          background: rootBg,
          color: rootColor,
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <AmbientBackground isDark={isDark} />

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onOpenChat={openChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isDark={isDark}
        />

        <main className="relative z-10 flex-1 flex flex-col min-w-0 w-full">
          <ChatHeader
            title={currentTitle}
            isLoading={isLoading}
            isDark={isDark}
            onToggleTheme={() => setIsDark((d) => !d)}
            onMenuToggle={() => setSidebarOpen((o) => !o)}
            sidebarOpen={sidebarOpen}
          />

          <ChatFeed
            messages={currentMessages}
            isLoading={isLoading}
            isDark={isDark}
          />

          <ChatInput
            value={chatInput}
            onChange={setChatInput}
            onSubmit={handleSubmitMessage}
            attachedFiles={attachedFiles}       // array
            onFileAttach={handleFileAttach}     // (files) => void
            onRemoveFile={handleRemoveFile}     // (id) => void
            isDark={isDark}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;