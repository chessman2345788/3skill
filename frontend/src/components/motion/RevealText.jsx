import React from 'react';
import { motion } from 'framer-motion';

/**
 * RevealText - Choreographed kinetic text reveal with clipping mask and stagger.
 */
export default function RevealText({
  text,
  className = '',
  as = 'h2',
  delay = 0,
  stagger = 0.04,
  mode = 'word', // 'word' | 'char' | 'line'
}) {
  const Component = motion[as] || motion.div;

  if (mode === 'word') {
    const words = text.split(' ');

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
          delayChildren: delay,
        },
      },
    };

    const wordVariants = {
      hidden: { y: '100%', opacity: 0 },
      visible: {
        y: '0%',
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    };

    return (
      <Component
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block py-0.5">
            <motion.span variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </Component>
    );
  }

  // Default line reveal
  return (
    <div className="overflow-hidden py-0.5">
      <Component
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
        className={className}
      >
        {text}
      </Component>
    </div>
  );
}
