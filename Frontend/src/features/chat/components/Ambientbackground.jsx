import React from "react";

const AmbientBackground = ({ isDark = true }) => {
  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-0 ${isDark ? 'dark' : ''}`}>
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(ellipse, var(--accent), transparent 70%)", opacity: 0.15 }}
      />
      <div
        className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, #22C55E, transparent 70%)", opacity: 0.1 }}
      />
    </div>
  );
};

export default AmbientBackground;