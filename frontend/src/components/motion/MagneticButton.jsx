import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * MagneticButton - A high-precision tactile button with magnetic cursor attraction and light sweep.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  type = 'button',
  magneticStrength = 0.25,
  ...props
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 350, damping: 25 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * magneticStrength);
    y.set(distanceY * magneticStrength);
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Variants styling
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30',
    secondary:
      'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.08] hover:border-white/[0.2] backdrop-blur-md',
    danger:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 shadow-lg shadow-rose-500/15',
    ghost:
      'bg-transparent hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-transparent',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-bold',
    md: 'px-5 py-3 text-xs sm:text-sm rounded-xl font-bold',
    lg: 'px-7 py-4 text-sm sm:text-base rounded-2xl font-bold',
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={`relative group overflow-hidden font-mono tracking-tight transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none flex items-center justify-center gap-2 ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {/* Dynamic Sheen Sweep on Hover */}
      {isHovered && !disabled && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
        />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
