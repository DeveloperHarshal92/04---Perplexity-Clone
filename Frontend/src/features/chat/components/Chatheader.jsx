import React from "react";
import toast from "react-hot-toast";
import { PerplexusIcon } from "../../../components/PerplexusLogo.jsx";

const ChatHeader = ({ title, isLoading, onToggleSidebar }) => {
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const formattedTitle = title
    ? title.replace(/\*\*/g, "").replace(/__/g, "").replace(/^#+\s*/, "").replace(/^Title:\s*/i, "").trim()
    : null;

  return (
    <header className="flex justify-between items-center px-4 w-full sticky top-0 z-30 h-[52px] bg-[#faf8f5]/95 backdrop-blur-xs border-b border-[#d1d1cd]">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-[6px] text-[#72706b] hover:text-[#27251e] hover:bg-[#eae7e1] transition-colors cursor-pointer mr-1"
          aria-label="Open sidebar menu"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        {formattedTitle ? (
          <span className="text-[14px] text-[#72706b] font-normal truncate max-w-[360px] tracking-normal">
            {formattedTitle}
          </span>
        ) : (
          <div className="flex items-center gap-1.5 md:hidden">
            <PerplexusIcon size={16} />
            <span
              className="text-[15px] font-medium tracking-tight text-[#27251e]"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            >
              Perplexus
            </span>
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-[#fdfbfa] border border-[#d1d1cd] rounded-full">
            <span className="text-[11px] text-[#016a71] font-mono tracking-wider uppercase font-medium">SEARCHING</span>
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fdfbfa] border border-[#d1d1cd] text-[#72706b] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#016a71]" />
            <span>Ready</span>
          </div>
        )}

        {/* Ghost Button: 1px Warm Mist border, 6px radius, Graphite text, 14px weight 400 */}
        <button 
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#d1d1cd] bg-transparent text-[#72706b] hover:text-[#27251e] hover:bg-[#f0ede6] active:scale-[0.98] transition-all text-[13px] font-normal cursor-pointer"
          title="Share thread"
        >
          <span className="material-symbols-outlined text-[16px] text-[#72706b]">share</span>
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;