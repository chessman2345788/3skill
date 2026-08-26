import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition - Fast, smooth route transition wrapper (300ms).
 */
export default function PageTransition({ children, routeKey }) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}
