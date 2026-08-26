import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress - Hairline laser progress bar tracking viewport scroll.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 origin-left z-[100] shadow-[0_0_8px_rgba(6,182,212,0.6)]"
    />
  );
}
