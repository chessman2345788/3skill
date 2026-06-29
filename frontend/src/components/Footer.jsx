import React from 'react';
import { ShieldCheck, Cpu, Database, Mail } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-dark-900 transition-colors duration-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 dark:text-brand-400">
              <ShieldCheck size={20} />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Veri<span className="text-brand-500 dark:text-brand-400">Work</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Leveraging natural language processing and machine learning models to analyze job descriptions and detect fraudulent employment scams in real time.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Platform
          </h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('detector')}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                Detector Panel
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('about')}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                About NLP Pipeline
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('status')}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                API Status Checks
              </button>
            </li>
          </ul>
        </div>

        {/* Technical stack tags */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Model Details
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
              <Cpu size={12} /> TF-IDF
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
              <Database size={12} /> Logistic Regression
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
              <Mail size={12} /> Regex Preprocessing
            </span>
          </div>
          <div className="pt-4 text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} VeriWork. Built for safety.
          </div>
        </div>

      </div>
    </footer>
  );
}
