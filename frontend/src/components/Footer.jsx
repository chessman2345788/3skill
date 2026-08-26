import React from 'react';
import { Shield, Cpu, Database, Terminal, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl py-12 mt-auto relative z-10 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Shield size={18} />
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-white">
              Veri<span className="text-cyan-400">Work</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-sm leading-relaxed">
            High-throughput recruitment fraud intelligence suite powered by Scikit-Learn natural language processing and Explainable AI.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MODEL WEIGHTS LOADED // LATENCY &lt; 0.04S</span>
          </div>
        </div>

        {/* Platform Links */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Suite Modules
          </h4>
          <ul className="space-y-2 text-xs font-sans">
            <li>
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>Platform Overview</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('detector')}
                className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>Neural Detector</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('batch')}
                className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>Batch CSV Scanner</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('radar')}
                className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>Scam Radar & A/B Diff</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Technical stack tags */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Core Architecture
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 rounded-md text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.06]">
              TF-IDF Vectorizer
            </span>
            <span className="px-2 py-1 rounded-md text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.06]">
              Logistic Regression
            </span>
            <span className="px-2 py-1 rounded-md text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.06]">
              React 19 + Framer Motion
            </span>
            <span className="px-2 py-1 rounded-md text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.06]">
              Flask REST API
            </span>
          </div>
          <div className="pt-4 text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} VeriWork AI. Open security benchmark.
          </div>
        </div>

      </div>
    </footer>
  );
}
