import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SidebarChatItem = ({ chatItem, isActive, onClick, onDelete }) => (
  <div 
    onClick={onClick}
    className="chat-row relative group cursor-pointer flex items-center justify-between px-sm py-xs hover:bg-white/5 rounded-lg transition-all"
  >
    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-primary rounded-full"></div>}
    <div className="flex items-center gap-sm overflow-hidden flex-1 min-w-0">
      <span className="material-symbols-outlined text-[18px] text-outline shrink-0">chat_bubble</span>
      <div className={`truncate flex-1 ${isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
        {chatItem.title ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <span className="truncate">{children}</span>,
              strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => <code className="px-1 py-0.5 rounded bg-white/5 text-primary text-[11px] font-label-mono">{children}</code>
            }}
          >
            {chatItem.title}
          </ReactMarkdown>
        ) : (
          "New Chat"
        )}
      </div>
    </div>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onDelete(chatItem.id);
      }}
      className="trash-icon opacity-0 transition-opacity text-outline hover:text-error shrink-0 ml-2"
    >
      <span className="material-symbols-outlined text-[18px]">delete</span>
    </button>
  </div>
);

const Sidebar = ({ chats, currentChatId, onOpenChat, onNewChat, onDeleteChat, isOpen, onClose }) => {
  const chatList = Object.values(chats);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  const handleProfileClick = () => {
    onClose();
    navigate("/profile");
  };

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 ${isOpen ? 'flex' : 'hidden'} flex-col p-sm w-[260px] bg-surface-container/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-300 ease-in-out`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-lg px-xs">
        <div className="flex items-center gap-xs">
          <img alt="Orchard AI Logo" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLttygO57vcpMbS9IhQtnYFUvW0rthLyZ1JFio4pieRXM4j6x7I7RycZVyPX3lP94t347N6RqmNdMybWfYy4EfUBiMB6qguKHJf9nkIcAIMuTTUZraYC1uM7VNL_AgoTeUd4ADRwBm72B55QlOiy2G_ISHI4CMBwK0eT_vU6LM_9qVl4RoO8yVJ0U4OdqtdoXRMG9bQNcHuv8qV8dcqNQ3jIHNqb4cScQv-H_9kgWEiS2_z1G9DPgPc2KQ"/>
          <span className="font-h2 text-h2 text-primary font-semibold">Orchard AI</span>
        </div>
        <button className="text-on-surface-variant hover:bg-white/5 p-unit rounded-lg transition-colors md:hidden" onClick={onClose}>
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Action: New Thread */}
      <button 
        onClick={onNewChat}
        className="flex items-center justify-between w-full p-sm mb-md rounded-xl border border-white/10 hover:bg-white/5 transition-all group"
      >
        <span className="font-body-md text-on-surface-variant group-hover:text-on-surface">New Thread</span>
        <span className="material-symbols-outlined text-primary">add</span>
      </button>

      {/* Main Nav */}
      <nav className="space-y-unit mb-lg">
        <a className="flex items-center gap-sm px-sm py-xs bg-primary-container text-on-primary-container rounded-lg font-medium transition-all cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span>Home</span>
        </a>
        <a className="flex items-center gap-sm px-sm py-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-all cursor-pointer">
          <span className="material-symbols-outlined">explore</span>
          <span>Discover</span>
        </a>
        <a className="flex items-center gap-sm px-sm py-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-all cursor-pointer">
          <span className="material-symbols-outlined">folder_shared</span>
          <span>Spaces</span>
        </a>
      </nav>

      {/* History Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h3 className="font-label-mono text-[11px] uppercase tracking-widest text-outline mb-sm px-sm">History</h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-unit pr-xs">
          {chatList.length === 0 ? (
            <div className="px-sm text-on-surface-variant text-sm">No threads yet</div>
          ) : (
            chatList.map((chatItem) => (
              <SidebarChatItem
                key={chatItem.id}
                chatItem={chatItem}
                isActive={chatItem.id === currentChatId}
                onClick={() => onOpenChat(chatItem.id)}
                onDelete={onDeleteChat}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom User Info */}
      <div className="mt-auto pt-sm border-t border-white/5">
        <div className="flex items-center justify-between p-xs hover:bg-white/5 rounded-xl cursor-pointer transition-all" onClick={handleProfileClick}>
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-semibold text-[14px]">
              {avatarLetter}
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface font-medium truncate max-w-[120px]">{user?.username || "My Account"}</span>
            </div>
          </div>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors" onClick={(e) => { e.stopPropagation(); handleProfileClick(); }}>
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;