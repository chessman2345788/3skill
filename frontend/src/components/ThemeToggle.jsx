import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0, scale: [0.8, 1.1, 1] }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {theme === 'dark' ? (
          <Sun size={18} className="text-amber-500" />
        ) : (
          <Moon size={18} className="text-brand-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
