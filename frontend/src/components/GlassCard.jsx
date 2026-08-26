import React from 'react';
import { motion } from 'framer-motion';

/**
 * High-Precision Obsidian Card component.
 * Features subtle hairline borders, glassmorphic backdrop blur, and optional top glow beam.
 */
export default function GlassCard({ 
  children, 
  className = '', 
  hoverEffect = false, 
  glowBeam = false,
  delay = 0, 
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`relative rounded-2xl border border-white/[0.08] bg-[#0b0f17]/75 backdrop-blur-xl shadow-2xl p-6 md:p-8 transition-colors duration-300 ${
        glowBeam ? 'glow-top-beam' : ''
      } ${className}`}
      {...props}
    >
      {/* Subtle top edge specular highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
