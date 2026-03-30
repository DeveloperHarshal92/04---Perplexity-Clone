import React from "react";

/**
 * Pure decorative layer — very subtle for near-black Perplexity-style UI.
 * Low opacity blobs keep depth without fighting the minimal aesthetic.
 */
const AmbientBackground = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
    {/* Subtle top-center radial bloom */}
    <div
      className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.06] blur-3xl"
      style={{
        background: "radial-gradient(ellipse, rgba(255,255,255,0.4), transparent 70%)",
      }}
    />

    {/* Barely-there bottom right */}
    <div
      className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-[0.04] blur-3xl"
      style={{
        background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)",
      }}
    />
  </div>
);

export default AmbientBackground;