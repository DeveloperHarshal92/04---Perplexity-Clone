import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
  console.log("DASHBOARD RENDERED");
  const chat = useChat();

  const [chatInput, setChatInput] = useState("");
  // const [userMessage, setUserMessage] = useState("");

  // const { user } = useSelector((state) => state.auth);
  // console.log("User in Dashboard: ", user);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    console.log("HANDLE SUBMIT CALLED");

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      console.log("EMPTY MESSAGE");
      return;
    }
    console.log("SENDING:", trimmedMessage);

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#1E1E24] text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      {/* LEFT SIDEBAR - Persistent Dark Theme */}
      <aside className="w-64 bg-[#111827] text-white hidden md:flex flex-col shrink border-r border-gray-800">
        <div className="p-5 flex items-center gap-3 font-bold text-xl border-b border-gray-800/50">
          Perplexity
        </div>

        <div className="p-4">
          <button className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all border border-gray-700 text-sm font-semibold flex items-center justify-center gap-2">
            <span>+</span> New Chat
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 text-sm text-gray-400 overflow-y-auto">
          <div className="px-3 py-2 rounded-lg bg-gray-800 text-white cursor-pointer">
            Quantum Computing 101
          </div>
          <div className="px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer transition-colors">
            React Architecture
          </div>
          <div className="px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer transition-colors">
            Tailwind Best Practices
          </div>
        </nav>

        {/* User Profile mapped from Redux */}
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
              {/* {user?.name?.charAt(0) || "U"} */}
            </div>
            <span className="text-sm font-medium text-gray-200 truncate">
              {/* {user?.name || "User"} */}
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative w-full">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/50 dark:bg-[#1E1E24]/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-lg">Quantum Computing 101</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Static Theme Toggle Button (Requires state to function dynamically) */}
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Share
            </button>
          </div>
        </header>

        {/* CHAT FEED */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-10 pb-32">
          <div className="max-w-3xl mx-auto space-y-10">
            {chats[currentChatId]?.messages.map((message) =>
              message.role === "user" ? (
                /* USER MESSAGE */
                <div key={message.id} className="flex justify-end">
                  <div className="bg-blue-950 text-white px-5 py-3 rounded-2xl rounded-br-none shadow-md max-w-[85%] text-sm md:text-base">
                    {message.content}
                  </div>
                </div>
              ) : (
                /* AI MESSAGE */
                <div key={message.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="text-white/90 text-sm md:text-base leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* INPUT BOX - Pinned to bottom with gradient fade */}
        <div className="absolute bottom-0 w-full bg-linear-to-t from-white dark:from-[#1E1E24] via-white dark:via-[#1E1E24] to-transparent pt-12 pb-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                console.log("Form submitted.");
                handleSubmitMessage(e);
              }}
              className="relative border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#2A2A35] p-2 shadow-lg focus-within:ring-2 focus-within:ring-blue-500/50 transition-all"
            >
              <textarea
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);

                  // auto-resize logic
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                className="w-full bg-transparent p-3 outline-none resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 scrollbar-hide"
                placeholder="Ask follow-up..."
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitMessage(e);
                  }
                }}
              />

              <div className="flex justify-between items-center px-2 pb-1 border-t border-gray-100 dark:border-gray-700/50 pt-2">
                <div className="flex gap-2 text-gray-500">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    📎
                  </button>

                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    🌐
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl px-6 font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>

            <div className="text-center text-xs text-gray-400 mt-3">
              HybridMaster can make mistakes. Consider verifying important
              information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
