import { useState, useEffect, useRef } from "react";

/**
 * useTypewriter
 * Animates a string character by character.
 *
 * @param {string} text        - The full target string to animate.
 * @param {boolean} isActive   - Only animate when true (use for the latest AI message).
 * @param {number} speed       - Delay between characters in ms (default: 18ms).
 * @returns {{ displayed: string, isDone: boolean }}
 */
export const useTypewriter = (text = "", isActive = false, speed = 18) => {
  const safeText = typeof text === "string" ? text : "";
  const cacheKey = `typed_${safeText.slice(0, 50).replace(/\s+/g, '')}`;
  const hasTyped = typeof window !== "undefined" && Boolean(localStorage.getItem(cacheKey));
  const shouldAnimate = isActive && !hasTyped;

  const [displayed, setDisplayed] = useState(shouldAnimate ? "" : safeText);
  const [isDone, setIsDone] = useState(!shouldAnimate);
  const indexRef = useRef(shouldAnimate ? 0 : safeText.length);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    // If not active or already typed, show full text immediately
    if (!shouldAnimate) {
      setDisplayed(safeText);
      setIsDone(true);
      return;
    }

    // Reset for new animation
    indexRef.current = 0;
    setDisplayed("");
    setIsDone(false);

    // Ensure entire response finishes under 2 seconds (target 1.4s - 1.6s max)
    const targetDuration = Math.min(1500, Math.max(250, safeText.length * 3));
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / targetDuration, 1);

      // Smooth progression ensuring full string is reached under targetDuration
      const charIndex = Math.min(
        Math.floor(progress * safeText.length),
        safeText.length,
      );

      setDisplayed(safeText.slice(0, charIndex));

      if (progress >= 1 || charIndex >= safeText.length) {
        setDisplayed(safeText);
        setIsDone(true);
        localStorage.setItem(cacheKey, "1");
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [safeText, shouldAnimate, speed, cacheKey]);

  return { displayed, isDone };
};