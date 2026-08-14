import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const PerplexityIcon = ({ size = 20, className = "" }) => (
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatTitle = (title) => {
  if (!title) return "New Thread";
  return title
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/^#+\s*/, "")
    .replace(/^Title:\s*/i, "")
    .trim();
};

const SidebarChatItem = ({ chatItem, isActive, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-[14px] cursor-pointer transition-colors duration-150 ${
      isActive
        ? "bg-[#eae7e1] text-[#27251e] font-medium"
        : "text-[#72706b] hover:text-[#27251e] hover:bg-[#f0ede6]"
    }`}
  >
    <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
      <span className="material-symbols-outlined text-[18px] text-[#92918b] group-hover:text-[#72706b] shrink-0">
        chat_bubble_outline
      </span>
      <span className="truncate flex-1 text-[13px] leading-tight">
        {formatTitle(chatItem.title)}
      </span>
    </div>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(chatItem.id);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#92918b] hover:text-[#93000a] shrink-0 ml-1 rounded-md"
      title="Delete thread"
    >
      <span className="material-symbols-outlined text-[16px]">delete</span>
    </button>
  </div>
);

const Sidebar = ({
  chats,
  currentChatId,
  onOpenChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
}) => {
  const chatList = Object.values(chats);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  const handleProfileClick = () => {
    onClose?.();
    navigate("/profile");
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 ${isOpen ? "flex" : "hidden"} md:flex flex-col w-[260px] bg-[#f6f4f0] border-r border-[#d1d1cd] p-3 select-none transition-all duration-200`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 pt-1 pb-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 text-[#27251e] hover:opacity-85 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-[#27251e] text-[#faf8f5] flex items-center justify-center">
            <PerplexityIcon size={16} />
          </div>
          <span className="text-[17px] font-medium tracking-tight text-[#27251e]">
            perplexity
          </span>
        </button>

        <button
          className="text-[#72706b] hover:text-[#27251e] p-1.5 rounded-lg hover:bg-[#eae7e1] transition-colors md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Action: New Thread */}
      <button
        onClick={onNewChat}
        className="flex items-center justify-between w-full px-3 py-2 mb-3 rounded-xl border border-[#d1d1cd] bg-[#faf8f5] text-[#27251e] hover:bg-[#f0ede6] transition-colors group text-[13px] font-normal card-subtle-shadow"
      >
        <span className="text-[#27251e]">New Thread</span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#92918b] font-mono border border-[#d1d1cd] px-1 py-0.2 rounded">
            Ctrl K
          </span>
          <span className="material-symbols-outlined text-[18px] text-[#72706b] group-hover:text-[#27251e]">
            add
          </span>
        </div>
      </button>

      {/* Main Nav */}
      <nav className="space-y-1 mb-4">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl bg-[#016a71] text-white text-[14px] font-normal transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Home</span>
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[#72706b] hover:text-[#27251e] hover:bg-[#eae7e1] text-[14px] font-normal transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">explore</span>
          <span>Discover</span>
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[#72706b] hover:text-[#27251e] hover:bg-[#eae7e1] text-[14px] font-normal transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">
            folder_open
          </span>
          <span>Library</span>
        </button>
      </nav>

      {/* Divider */}
      <div className="h-px bg-[#d1d1cd] my-2 mx-1 opacity-70" />

      {/* History Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-[11px] uppercase tracking-wider text-[#92918b] font-mono">
            Library
          </span>
          <span className="text-[11px] text-[#92918b] font-mono">
            {chatList.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
          {chatList.length === 0 ? (
            <div className="px-3 py-4 text-center text-[#92918b] text-[12px]">
              No threads yet
            </div>
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
      <div className="mt-auto pt-2 border-t border-[#d1d1cd]">
        <div
          onClick={handleProfileClick}
          className="flex items-center justify-between p-2 hover:bg-[#eae7e1] rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#016a71] text-white flex items-center justify-center font-medium text-[12px] shrink-0">
              {avatarLetter}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[#27251e] text-[13px] font-normal truncate max-w-[130px]">
                {user?.username || "Account"}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#72706b] hover:text-[#27251e]">
            settings
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
