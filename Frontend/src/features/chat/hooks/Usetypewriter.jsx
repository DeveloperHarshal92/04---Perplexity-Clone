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
export const useTypewriter = (text, isActive, speed = 18) => {
  const cacheKey = `typed_${text.slice(0, 50).replace(/\s+/g, '')}`;
  const hasTyped = localStorage.getItem(cacheKey);
  const shouldAnimate = isActive && !hasTyped;

  const [displayed, setDisplayed] = useState(shouldAnimate ? "" : text);
  const [isDone, setIsDone] = useState(!shouldAnimate);
  const indexRef = useRef(shouldAnimate ? 0 : text.length);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    // If not active or already typed, show full text immediately
    if (!shouldAnimate) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }

    // Reset for new animation
    indexRef.current = 0;
    setDisplayed("");
    setIsDone(false);
    lastTimeRef.current = null;

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= speed) {
        lastTimeRef.current = timestamp;
        indexRef.current += 1;

        // Advance by 1-2 chars per frame for natural feel
        const charsToAdd = Math.ceil(Math.random() * 2);
        const nextIndex = Math.min(indexRef.current + charsToAdd - 1, text.length);
        indexRef.current = nextIndex;

        setDisplayed(text.slice(0, indexRef.current));

        if (indexRef.current >= text.length) {
          setIsDone(true);
          localStorage.setItem(cacheKey, '1');
          return;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, shouldAnimate, speed, cacheKey]);

  return { displayed, isDone };
};