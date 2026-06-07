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
  const [attachedFiles, setAttachedFiles] = useState([]);
  const activeChatRef = useRef(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleFileAttach = (files) => {
    const newFiles = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      isImage: f.type.startsWith("image/"),
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAttachedFiles = () => {
    attachedFiles.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setAttachedFiles([]);
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage && attachedFiles.length === 0) return;

    const chatIdToUse = activeChatRef.current || currentChatId;

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

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Lora', Georgia, serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .sidebar-overlay {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
        }
      `}</style>

      <div
        className={`font-sans flex h-screen overflow-hidden relative ${isDark ? "dark" : ""}`}
        style={{
          background: "var(--bg-base)",
          color: "var(--text-primary)",
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <AmbientBackground isDark={isDark} />

        {sidebarOpen && (
          <div
            className="sidebar-overlay sm:hidden"
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
            attachedFiles={attachedFiles}
            onFileAttach={handleFileAttach}
            onRemoveFile={handleRemoveFile}
            isDark={isDark}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;