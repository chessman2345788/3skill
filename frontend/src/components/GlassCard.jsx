import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable glassmorphic wrapper card.
 * Uses Framer Motion for premium transition entrances and hover physics.
 */
export default function GlassCard({ children, className = '', hoverEffect = false, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={hoverEffect ? { y: -4 } : undefined}
      className={`glass-panel rounded-2xl p-6 md:p-8 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
