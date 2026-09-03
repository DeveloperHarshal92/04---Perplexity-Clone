import React from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { PerplexusIcon } from "../../../components/PerplexusLogo";

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
    className={`group relative flex items-center justify-between px-3 py-2 rounded-[12px] text-[14px] cursor-pointer transition-colors duration-150 ${
      isActive
        ? "bg-[#eae7e1] text-[#27251e] font-normal"
        : "text-[#72706b] hover:text-[#27251e] hover:bg-[#f0ede6]"
    }`}
  >
    <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
      <span className="material-symbols-outlined text-[16px] text-[#72706b] shrink-0">
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
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#92918b] hover:text-[#93000a] shrink-0 ml-1 rounded-[6px]"
      title="Delete thread"
      aria-label="Delete thread"
    >
      <span className="material-symbols-outlined text-[15px]">delete</span>
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
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  const handleProfileClick = () => {
    onClose?.();
    navigate("/profile");
  };

  const navItems = [
    { label: "Home", path: "/", icon: "home", active: location.pathname === "/" },
    { label: "Discover", path: "/discover", icon: "explore", active: location.pathname === "/discover" },
    { label: "Spaces", path: "/spaces", icon: "grid_view", active: location.pathname === "/spaces" },
    { label: "Library", path: "/library", icon: "folder_open", active: location.pathname === "/library" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 ${isOpen ? "flex" : "hidden"} md:flex flex-col w-[260px] bg-[#f6f4f0] border-r border-[#d1d1cd] p-3 select-none transition-all duration-200`}
    >
      {/* Brand Header: Perplexus Monogram & Editorial Serif Wordmark */}
      <div className="flex items-center justify-between px-2 pt-1.5 pb-3">
        <button
          type="button"
          onClick={() => {
            onNewChat();
            navigate("/");
          }}
          className="flex items-center gap-2 text-[#27251e] hover:opacity-85 transition-opacity cursor-pointer"
        >
          <div className="w-5 h-5 text-[#27251e] flex items-center justify-center">
            <PerplexusIcon size={18} />
          </div>
          <span
            className="text-[18px] font-medium tracking-tight text-[#27251e] leading-none"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
          >
            Perplexus
          </span>
        </button>

        <button
          type="button"
          className="text-[#72706b] hover:text-[#27251e] p-1.5 rounded-[6px] hover:bg-[#eae7e1] transition-colors md:hidden cursor-pointer"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Action: New Thread Button */}
      <button
        type="button"
        onClick={() => {
          onNewChat();
          if (location.pathname !== "/") navigate("/");
        }}
        className="flex items-center justify-between w-full px-3 py-2 mb-3 rounded-[12px] border border-[#d1d1cd] bg-[#faf8f5] text-[#27251e] hover:bg-[#f0ede6] active:scale-[0.99] transition-all group text-[13px] font-normal card-subtle-shadow cursor-pointer"
      >
        <span className="text-[#27251e]">New Thread</span>
        <div className="flex items-center gap-1.5">
          <kbd className="text-[10px] text-[#92918b] font-mono border border-[#d1d1cd] px-1 py-0.5 rounded-[4px] bg-[#fdfbfa]">
            Ctrl K
          </kbd>
          <span className="material-symbols-outlined text-[16px] text-[#72706b] group-hover:text-[#27251e]">
            add
          </span>
        </div>
      </button>

      {/* Main Nav Items: DESIGN.md: Transparent background, Graphite icon + label; active state: Deep Teal background with white text, 12px radius */}
      <nav className="space-y-1 mb-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-[12px] text-[14px] font-normal transition-colors cursor-pointer text-left ${
              item.active
                ? "bg-[#016a71] text-white"
                : "bg-transparent text-[#72706b] hover:text-[#27251e] hover:bg-[#eae7e1]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Hairline Divider */}
      <div className="h-px bg-[#d1d1cd] my-2 mx-1" />

      {/* History / Library Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Sidebar Section Label: Graphite text, weight 400 at 12px, uppercase */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-[12px] uppercase tracking-wider text-[#72706b] font-mono font-normal">
            Library
          </span>
          <span className="text-[11px] text-[#92918b] font-mono">
            {chatList.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
          {chatList.length === 0 ? (
            <div className="px-3 py-6 text-center text-[#92918b] text-[12px] font-normal">
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
          className="flex items-center justify-between p-2 hover:bg-[#eae7e1] rounded-[12px] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#27251e] text-[#faf8f5] flex items-center justify-center text-[12px] font-medium shrink-0">
              {avatarLetter}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[#27251e] text-[13px] font-normal truncate max-w-[130px]">
                {user?.username || "Researcher"}
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
