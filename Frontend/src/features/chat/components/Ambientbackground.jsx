import React from "react";

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#faf8f5]">
      {/* Subtle warm paper lighting */}
      <div 
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-40 blur-[140px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(1, 106, 113, 0.04) 0%, rgba(209, 209, 205, 0.12) 60%, transparent 100%)"
        }}
      />
    </div>
  );
};

export default AmbientBackground;