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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    if (event && event.preventDefault) event.preventDefault();
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
            background: "#2a2a28",
            color: "#e4e2de",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />

      <div className={`bg-background text-on-surface font-body-md selection:bg-primary/30 min-h-screen overflow-hidden flex ${isDark ? "dark" : ""}`}>
        <AmbientBackground />

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm sm:hidden"
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

        <main className={`flex-1 flex flex-col h-screen ${sidebarOpen ? 'md:ml-[260px]' : ''} relative z-10 w-full min-w-0 transition-all duration-300`}>
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
            onSuggestedPrompt={(prompt) => {
              setChatInput(prompt);
            }}
          />

          <ChatInput
            value={chatInput}
            onChange={setChatInput}
            onSubmit={handleSubmitMessage}
            attachedFiles={attachedFiles}
            onFileAttach={handleFileAttach}
            onRemoveFile={handleRemoveFile}
            isDark={isDark}
            isLoading={isLoading}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;