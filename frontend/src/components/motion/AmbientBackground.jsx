import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * AmbientBackground - Living ambient background with subtle drifting nodes,
 * pointer spotlight, and parallax grid matrix.
 */
export default function AmbientBackground() {
  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Scroll-Reacting Parallax Cyber Grid */}
      <motion.div
        style={{ y: gridY }}
        className="absolute inset-0 cyber-grid opacity-60"
      />

      {/* Dynamic Cursor-Following Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-700 opacity-40 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(6, 182, 212, 0.07), transparent 80%)`,
        }}
      />

      {/* Ambient Drifting Glow Nodes */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]"
      />

      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[45%] right-[-100px] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[160px]"
      />

      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[150px]"
      />
    </div>
  );
}
