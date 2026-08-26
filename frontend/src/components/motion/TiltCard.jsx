import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * TiltCard - A living, breathing interactive 3D card.
 * 
 * Features:
 * 1. Continuous Organic Floating: Subtle continuous oscillation in rotation, X, and Y (so cards never sit dead-static).
 * 2. Pointer Physics (Desktop): Smooth spring-based 3D tilt (rotateX/rotateY) and specular highlight tracking.
 * 3. Layered Depth: Parallax response for child content.
 * 4. Accessibility: Automatically disables heavy 3D transforms on touch devices or if prefers-reduced-motion is active.
 */
export default function TiltCard({
  children,
  className = '',
  baseRotation = 0,
  glowBeam = false,
  glowColor = 'rgba(6, 182, 212, 0.15)',
  floatRange = { y: 6, x: 3, rot: 1.5 },
  floatDuration = 6,
  floatDelay = 0,
  enableMouseTilt = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse tilt motion values with smooth spring dampening
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (!enableMouseTilt || isTouchDevice || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized coordinate from -1 to 1
    const xPct = ((e.clientX - rect.left) / width - 0.5) * 2;
    const yPct = ((e.clientY - rect.top) / height - 0.5) * 2;

    // Max 3.5 deg tilt for subtle, refined feel
    rotateX.set(-yPct * 3.5);
    rotateY.set(xPct * 3.5);
    mouseX.set((e.clientX - rect.left) / width);
    mouseY.set((e.clientY - rect.top) / height);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice && !prefersReducedMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Continuous organic breathing animation config
  const organicAnimation = prefersReducedMotion
    ? {}
    : {
        y: [0, -floatRange.y, 0, floatRange.y * 0.5, 0],
        x: [0, floatRange.x, -floatRange.x * 0.6, floatRange.x * 0.3, 0],
        rotate: [
          baseRotation,
          baseRotation + floatRange.rot,
          baseRotation - floatRange.rot * 0.8,
          baseRotation + floatRange.rot * 0.4,
          baseRotation
        ]
      };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1000,
        rotateX: isHovered && !isTouchDevice ? rotateX : 0,
        rotateY: isHovered && !isTouchDevice ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      animate={organicAnimation}
      transition={{
        duration: floatDuration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: floatDelay,
      }}
      className={`relative rounded-2xl border border-white/[0.08] bg-[#0b0f17]/80 backdrop-blur-xl shadow-2xl transition-colors duration-300 will-change-transform ${
        glowBeam ? 'glow-top-beam' : ''
      } ${className}`}
      {...props}
    >
      {/* Specular Top Edge Highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none rounded-t-2xl z-10" />

      {/* Dynamic Cursor Light Spotting on Hover */}
      {isHovered && !isTouchDevice && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 240px at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, ${glowColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Child Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
