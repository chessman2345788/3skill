import React, { useState } from 'react';
import { ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ currentPage, setCurrentPage, theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'detector', label: 'Detector' },
    { id: 'batch', label: 'Batch Scanner' },
    { id: 'radar', label: 'Scam Radar' },
    { id: 'status', label: 'API Status' },
    { id: 'about', label: 'About' },
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/70 dark:bg-dark-900/70 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 cursor-pointer group"
          id="logo-brand"
        >
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400 group-hover:bg-brand-500/20 transition-colors duration-200">
            <ShieldCheck size={22} className="group-hover:scale-110 transition-transform duration-200" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Veri<span className="text-brand-500 dark:text-brand-400">Work</span>
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentPage(link.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentPage === link.id
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button 
            onClick={() => setCurrentPage('detector')}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-brand-500 dark:bg-brand-600 text-white font-semibold text-sm hover:bg-brand-600 dark:hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 active:scale-95 transition-all duration-150"
          >
            Analyze Job
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden border-b border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/95 dark:bg-dark-900/95 backdrop-blur-lg px-4 py-4 space-y-2 animate-fade-in-up shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentPage(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                currentPage === link.id
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => {
              setCurrentPage('detector');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-brand-500 text-white font-semibold text-base hover:bg-brand-600 shadow-md shadow-brand-500/10"
          >
            Analyze Job
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
