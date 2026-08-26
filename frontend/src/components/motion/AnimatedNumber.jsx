import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedNumber - Smoothly interpolates numeric values with spring physics.
 */
export default function AnimatedNumber({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const targetValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const totalDurationMs = duration * 1000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / totalDurationMs, 1);
      
      // Smooth cubic ease out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeOut;
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration]);

  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={`font-mono font-black tracking-tight ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
