import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * CustomCursor - Desktop-only refined ambient cyan halo tracking pointer.
 * Subtle, non-intrusive, automatically disabled on touch devices.
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const springConfig = { damping: 28, stiffness: 320, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touch || reduced) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isPointer ? 1.6 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full border border-cyan-400/40 bg-cyan-400/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center"
    >
      <div className="w-1 h-1 rounded-full bg-cyan-400" />
    </motion.div>
  );
}
