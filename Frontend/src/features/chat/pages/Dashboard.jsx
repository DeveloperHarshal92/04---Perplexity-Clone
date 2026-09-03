import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { Toaster } from "react-hot-toast";

import AmbientBackground from "../components/Ambientbackground";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/Chatheader";
import ChatFeed from "../components/Chatfeed";
import ChatInput from "../components/Chatinput";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [selectedMode, setSelectedMode] = useState("Search");
  const [selectedModel, setSelectedModel] = useState(null);
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
            background: "#fdfbfa",
            color: "#27251e",
            border: "1px solid #d1d1cd",
            borderRadius: "12px",
            fontSize: "13px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
            fontFamily: "var(--font-pplxsans)",
          },
        }}
      />

      <div className="bg-[#faf8f5] text-[#27251e] min-h-[100dvh] overflow-hidden flex selection:bg-[#016a71]/15">
        <AmbientBackground />

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#27251e]/20 backdrop-blur-xs md:hidden"
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
        />

        <main className="flex-1 flex flex-col h-[100dvh] md:ml-[260px] relative z-10 w-full min-w-0 bg-[#faf8f5] transition-all duration-200">
          <ChatHeader
            title={currentTitle}
            isLoading={isLoading}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />

          <ChatFeed
            messages={currentMessages}
            isLoading={isLoading}
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
            isLoading={isLoading}
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            onModelChange={setSelectedModel}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;