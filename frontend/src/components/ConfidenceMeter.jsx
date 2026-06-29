import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * High-quality radial SVG gauge representing model confidence.
 */
export default function ConfidenceMeter({ percentage, isFake }) {
  const [value, setValue] = useState(0);

  // Trigger animation after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(percentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const activeColor = isFake ? '#ef4444' : '#10b981'; // red-500 vs emerald-500
  const colorTextClass = isFake ? 'text-red-500' : 'text-emerald-500';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        
        {/* SVG Gauge */}
        <svg className="w-32 h-32 -rotate-90">
          
          {/* Background circle track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />
          
          {/* Animated Foreground circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center label values */}
        <div className="absolute text-center flex flex-col">
          <motion.span 
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
            className={`text-2xl font-extrabold tracking-tight ${colorTextClass}`}
          >
            {value}%
          </motion.span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
            Match
          </span>
        </div>

      </div>
    </div>
  );
}
