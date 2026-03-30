import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

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
  const [attachedFiles, setAttachedFiles] = useState([]);
  const activeChatRef = useRef(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    const chatIdToUse = activeChatRef.current || currentChatId;

    const data = await chat.handleSendMessage({
      message: trimmedMessage,
      chatId: chatIdToUse,
    });

    if (!activeChatRef.current && data?.chat?._id) {
      activeChatRef.current = data.chat._id;
    }

    setChatInput("");
    setAttachedFiles([]);
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

  const handleFileAttach = (files) => {
    const newFiles = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const currentMessages = chats[currentChatId]?.messages || [];
  const currentTitle = chats[currentChatId]?.title;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display  { font-family: 'Fraunces', serif; }
        .font-mono-dm  { font-family: 'DM Mono', monospace; }
        .font-sans-dm  { font-family: 'DM Sans', sans-serif; }

        .messages-feed::-webkit-scrollbar { display: none; }
        .scrollbar-thin::-webkit-scrollbar        { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track  { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb  { background: rgba(255,255,255,0.08); border-radius: 99px; }

        .sidebar-overlay {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
      `}</style>

      <div
        className="font-sans-dm flex h-screen overflow-hidden relative"
        style={{ background: "#080808", color: "rgba(255,255,255,0.85)" }}
      >
        <AmbientBackground />

        {/* Sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — always overlay, slides in from left */}
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onOpenChat={openChat}
          onNewChat={handleNewChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main */}
        <main className="relative z-10 flex-1 flex flex-col min-w-0 w-full">
          <ChatHeader
            title={currentTitle}
            isLoading={isLoading}
            isDark={isDark}
            onToggleTheme={() => setIsDark((d) => !d)}
            onMenuToggle={() => setSidebarOpen((o) => !o)}
            sidebarOpen={sidebarOpen}
          />

          <ChatFeed messages={currentMessages} isLoading={isLoading} />

          <ChatInput
            value={chatInput}
            onChange={setChatInput}
            onSubmit={handleSubmitMessage}
            attachedFiles={attachedFiles}
            onFileAttach={handleFileAttach}
            onRemoveFile={handleRemoveFile}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;