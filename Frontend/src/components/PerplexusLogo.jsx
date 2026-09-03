import React from "react";

/**
 * PerplexusIcon
 * The signature monogram 'P' with the characteristic horizontal ligature flourish
 * cutting across the vertical stem, faithfully recreating the editorial serif brand identity.
 */
export const PerplexusIcon = ({ size = 20, className = "", color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
    aria-label="Perplexus"
  >
    {/* Main Vertical Stem with Top & Bottom Bracketed Serifs */}
    <path
      d="M13 10H21V12.5H18.5V35.5H21V38H13V35.5H15.5V12.5H13V10Z"
      fill={color}
    />

    {/* Elegant High-Contrast Serif Bowl */}
    <path
      d="M18.5 10.5C22.5 10.5 30 11.2 30 18.5C30 25.8 22.5 26.5 18.5 26.5H18V10.5H18.5ZM21.5 24C24.8 24 27.2 22.6 27.2 18.5C27.2 14.4 24.8 13 21.5 13V24Z"
      fill={color}
    />

    {/* Distinctive Horizontal Curved Ligature Flourish extending to the left */}
    <path
      d="M6 25.5C9.5 25.5 14.5 26.5 18.5 26.8C20.5 27 23 27 25 27C21 28.5 16 28.5 13 28C8.5 27.2 6.5 25.8 6 25.5Z"
      fill={color}
    />
  </svg>
);

/**
 * PerplexusWordmark
 * Full editorial serif wordmark matching the reference image.
 * Uses the custom flourished 'P' glyph coupled with high-contrast serif letterforms.
 */
export const PerplexusWordmark = ({ className = "", textClassName = "", iconSize = 22 }) => (
  <span className={`inline-flex items-center gap-2 select-none ${className}`}>
    <PerplexusIcon size={iconSize} className="text-current" />
    <span
      className={`font-editorial tracking-tight font-medium text-[21px] leading-none ${textClassName}`}
      style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
    >
      Perplexus
    </span>
  </span>
);

/**
 * PerplexusBrand
 * Unified brand component supporting compact, icon, and full hero variants.
 */
export const PerplexusBrand = ({
  variant = "full",
  size = 22,
  className = "",
  showBadge = false,
  badgeText = "RESEARCH",
}) => {
  if (variant === "icon") {
    return <PerplexusIcon size={size} className={className} />;
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-6 h-6 rounded-[6px] bg-[#27251e] text-[#faf8f5] flex items-center justify-center">
          <PerplexusIcon size={14} color="#faf8f5" />
        </div>
        <span
          className="text-[17px] font-medium tracking-tight text-[#27251e]"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
        >
          Perplexus
        </span>
        {showBadge && (
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[4px] bg-[#016a71]/10 text-[#016a71] border border-[#016a71]/20">
            {badgeText}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-[8px] bg-[#27251e] text-[#faf8f5] flex items-center justify-center shadow-xs">
        <PerplexusIcon size={18} color="#faf8f5" />
      </div>
      <div className="flex flex-col">
        <span
          className="text-[20px] font-medium tracking-tight text-[#27251e] leading-tight"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
        >
          Perplexus
        </span>
      </div>
      {showBadge && (
        <span className="ml-1 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[4px] bg-[#016a71]/10 text-[#016a71] border border-[#016a71]/20">
          {badgeText}
        </span>
      )}
    </div>
  );
};

export default PerplexusBrand;
