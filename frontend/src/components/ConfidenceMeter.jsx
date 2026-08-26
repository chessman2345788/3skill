import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Cinematic Telemetry Confidence HUD Gauge.
 * Dual-ring concentric design with animated glow arcs and precision typography.
 */
export default function ConfidenceMeter({ percentage, isFake }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(percentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 54;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const innerRadius = 42;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const activeColor = isFake ? '#f43f5e' : '#10b981'; // rose-500 vs emerald-500
  const activeGlow = isFake ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)';
  const colorTextClass = isFake ? 'text-rose-400' : 'text-emerald-400';
  const badgeClass = isFake 
    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        
        {/* Glow filter definition */}
        <svg className="w-0 h-0 absolute">
          <defs>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* SVG Gauge */}
        <svg className="w-36 h-36 -rotate-90">
          
          {/* Outer Track */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="text-slate-800/80"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />

          {/* Inner Dashed Track */}
          <circle
            cx="72"
            cy="72"
            r={innerRadius}
            className="text-slate-800/50"
            strokeWidth="1.5"
            stroke="currentColor"
            strokeDasharray="4 4"
            fill="transparent"
          />

          {/* Foreground Animated Gauge */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px ' + activeGlow + ')' }}
          />
        </svg>

        {/* Center telemetry readout */}
        <div className="absolute text-center flex flex-col items-center justify-center">
          <motion.span 
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 140 }}
            className={`text-3xl font-mono font-extrabold tracking-tight ${colorTextClass}`}
          >
            {value}%
          </motion.span>
          <span className={`mt-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${badgeClass}`}>
            {isFake ? 'Threat Prob' : 'Authenticity'}
          </span>
        </div>

      </div>
    </div>
  );
}
