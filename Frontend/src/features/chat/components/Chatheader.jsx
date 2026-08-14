import React from "react";
import toast from "react-hot-toast";

const ChatHeader = ({ title, isLoading }) => {
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
    <header className="flex justify-between items-center px-4 w-full sticky top-0 z-30 h-[52px] bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#d1d1cd]/60">
      <div className="flex items-center gap-2">
        {formattedTitle ? (
          <span className="text-[13px] text-[#72706b] font-normal truncate max-w-[320px]">
            {formattedTitle}
          </span>
        ) : (
          <div className="w-4" />
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0ede6] border border-[#d1d1cd] rounded-full">
            <span className="text-[11px] text-[#016a71] font-mono font-medium">SEARCHING</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#016a71] dot-bounce" />
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0ede6] text-[#72706b] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#016a71]" />
            <span>Ready</span>
          </div>
        )}

        <button 
          onClick={handleShare}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#d1d1cd] hover:bg-[#eae7e1] text-[#72706b] hover:text-[#27251e] transition-colors text-[12px]"
          title="Share thread"
        >
          <span className="material-symbols-outlined text-[16px]">share</span>
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;