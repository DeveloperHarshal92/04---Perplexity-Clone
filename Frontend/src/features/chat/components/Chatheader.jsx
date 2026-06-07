import React from "react";

const ChatHeader = ({ isLoading, isDark, onToggleTheme, onMenuToggle, sidebarOpen }) => {
  return (
    <header className="flex justify-between items-center px-md w-full sticky top-0 z-50 h-[52px] bg-surface/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-sm">
        <button 
          className="flex items-center justify-center p-1 rounded-lg hover:bg-white/5 transition-colors" 
          onClick={onMenuToggle}
          title="Toggle Sidebar"
        >
          <img alt="Orchard AI Logo" className="w-7 h-7 object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLttygO57vcpMbS9IhQtnYFUvW0rthLyZ1JFio4pieRXM4j6x7I7RycZVyPX3lP94t347N6RqmNdMybWfYy4EfUBiMB6qguKHJf9nkIcAIMuTTUZraYC1uM7VNL_AgoTeUd4ADRwBm72B55QlOiy2G_ISHI4CMBwK0eT_vU6LM_9qVl4RoO8yVJ0U4OdqtdoXRMG9bQNcHuv8qV8dcqNQ3jIHNqb4cScQv-H_9kgWEiS2_z1G9DPgPc2KQ"/>
        </button>
        <div className={`font-h2 text-h2 font-semibold text-primary ${sidebarOpen ? 'md:hidden' : ''}`}>Orchard AI</div>
      </div>
      <div className="flex items-center gap-sm">
        {/* Thinking Dots Animation */}
        {isLoading && (
          <div className="flex items-center gap-[4px] px-sm py-1 bg-white/5 rounded-full mr-md">
            <span className="font-label-mono text-[10px] text-outline tracking-wider">THINKING</span>
            <div className="flex gap-[3px]">
              <div className="w-[3px] h-[3px] rounded-full bg-primary animate-pulse"></div>
              <div className="w-[3px] h-[3px] rounded-full bg-primary animate-pulse [animation-delay:200ms]"></div>
              <div className="w-[3px] h-[3px] rounded-full bg-primary animate-pulse [animation-delay:400ms]"></div>
            </div>
          </div>
        )}
        {!isLoading && (
          <div className="flex items-center gap-[4px] px-sm py-1 bg-white/5 rounded-full mr-md">
            <span className="font-label-mono text-[10px] text-outline tracking-wider">AI READY</span>
          </div>
        )}
        
        <button 
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-on-surface-variant"
          onClick={onToggleTheme}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;