import React from "react";

const AmbientBackground = ({ isDark = true }) => {
  const blob1 = isDark
    ? "radial-gradient(ellipse, rgba(255,255,255,0.4), transparent 70%)"
    : "radial-gradient(ellipse, rgba(0,0,0,0.12), transparent 70%)";
  const blob2 = isDark
    ? "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)"
    : "radial-gradient(circle, rgba(0,0,0,0.08), transparent 70%)";
  const opacity1 = isDark ? "0.06" : "0.04";
  const opacity2 = isDark ? "0.04" : "0.03";

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
        style={{ background: blob1, opacity: opacity1 }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl"
        style={{ background: blob2, opacity: opacity2 }}
      />
    </div>
  );
};

export default AmbientBackground;