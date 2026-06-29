import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';

/**
 * Toast popup alerts with auto-close and click dismissal.
 */
export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeConfig = {
    success: {
      border: 'border-emerald-500/20 dark:border-emerald-400/20',
      bg: 'bg-emerald-50/90 dark:bg-emerald-950/80',
      text: 'text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={18} />,
    },
    error: {
      border: 'border-red-500/20 dark:border-red-400/20',
      bg: 'bg-red-50/90 dark:bg-red-950/80',
      text: 'text-red-900 dark:text-red-200',
      icon: <XCircle className="text-red-500 dark:text-red-400" size={18} />,
    },
    warning: {
      border: 'border-amber-500/20 dark:border-amber-400/20',
      bg: 'bg-amber-50/90 dark:bg-amber-950/80',
      text: 'text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="text-amber-500 dark:text-amber-400" size={18} />,
    },
    info: {
      border: 'border-brand-500/20 dark:border-brand-400/20',
      bg: 'bg-brand-50/90 dark:bg-brand-950/80',
      text: 'text-brand-900 dark:text-brand-200',
      icon: <Info className="text-brand-500 dark:text-brand-400" size={18} />,
    },
  };

  const style = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] max-w-sm w-full px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl ${style.border} ${style.bg} ${style.text}`}
      >
        <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-1 p-0.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          aria-label="Close notification"
        >
          <X size={14} className="opacity-60 hover:opacity-100" />
        </button>
      </motion.div>
    </div>
  );
}
