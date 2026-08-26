import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Menu, X, ArrowRight, Activity, Terminal, Layers, Radar, Info } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ currentPage, setCurrentPage, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Overview', icon: <Terminal size={14} /> },
    { id: 'detector', label: 'Neural Detector', icon: <Sparkles size={14} /> },
    { id: 'batch', label: 'Batch Scanner', icon: <Layers size={14} /> },
    { id: 'radar', label: 'Scam Radar', icon: <Radar size={14} /> },
    { id: 'status', label: 'Telemetry', icon: <Activity size={14} /> },
    { id: 'about', label: 'Architecture', icon: <Info size={14} /> },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-[#07090e]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/40' 
        : 'py-5 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Telemetry Beacon */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="logo-brand"
          >
            <div className="relative p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 transition-all duration-300">
              <Shield size={20} className="group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1">
                Veri<span className="text-cyan-400">Work</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white/[0.06] text-slate-400 border border-white/[0.08]">
                  v2.4
                </span>
              </span>
            </div>
          </div>

          {/* Engine Status Beacon (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MODEL READY</span>
          </div>
        </div>

        {/* Desktop Navigation Island */}
        <nav className="hidden md:flex items-center p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 rounded-xl bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right CTA & Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('detector')}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all duration-200"
          >
            <span>Scan Job</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/25 text-[9px] font-mono text-cyan-100 border border-white/15">
              ↵
            </kbd>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/[0.08] bg-[#07090e]/95 backdrop-blur-2xl px-4 py-4 space-y-2"
          >
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === link.id
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-white/[0.04] text-left'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                setCurrentPage('detector');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              <Sparkles size={14} />
              Launch Neural Detector
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
