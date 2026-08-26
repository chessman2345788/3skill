import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, ArrowRight, Zap, Cpu, Database, 
  Sparkles, CheckCircle2, AlertTriangle, Terminal, ChevronRight,
  Radar, Layers, Lock, Search, Eye, Activity, Play
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';
import { apiService } from '../services/api';

export default function Home({ setCurrentPage }) {
  // Quick mini-demo simulator state inside the landing page
  const [demoInput, setDemoInput] = useState(SAMPLE_FAKE_JOB);
  const [demoResult, setDemoResult] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleRunDemoScan = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    try {
      const res = await apiService.predictJob(demoInput.trim());
      setDemoResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-24 md:space-y-36 py-6 md:py-12"
    >
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-6 md:pt-12 text-center max-w-5xl mx-auto space-y-8">
        
        {/* Clearance Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>AI TRUST INTELLIGENCE · FRAUD AUDIT PLATFORM</span>
        </motion.div>

        {/* Monumental Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
        >
          Detect deceptive job listings <br />
          <span className="text-gradient-cyan">before you apply.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          VeriWork uses natural language processing, semantic n-gram extraction, and recruiter domain verification to expose fraudulent employment schemes in milliseconds.
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => setCurrentPage('detector')}
            className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all duration-200"
            id="hero-analyze-cta"
          >
            <Sparkles size={16} />
            <span>Launch Neural Detector</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentPage('batch')}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-slate-300 hover:text-white font-bold text-sm transition-all"
          >
            <Layers size={15} />
            <span>Bulk Batch Scanner</span>
          </button>
        </motion.div>

        {/* Hero Interactive Telemetry Mockup */}
        <motion.div 
          variants={itemVariants}
          className="pt-6 relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/[0.1] bg-[#0c1017]/90 backdrop-blur-2xl shadow-2xl p-4 sm:p-6 text-left overflow-hidden">
            
            {/* Top window bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 text-[11px] text-slate-400">AUDIT_SESSION // ID_94827</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  HIGH THREAT DETECTED
                </span>
                <span>LATENCY: 0.038s</span>
              </div>
            </div>

            {/* Mock scanning preview content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Left snippet */}
              <div className="md:col-span-2 space-y-2 p-3 rounded-xl bg-black/40 border border-white/[0.04] text-xs font-mono leading-relaxed text-slate-300">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Ingested Description Snippet:</p>
                <p>
                  "Urgently hiring! Work from home part-time. <span className="bg-rose-500/25 text-rose-300 px-1 py-0.5 rounded border border-rose-500/40">Earn $5,000 a week</span>. <span className="bg-rose-500/25 text-rose-300 px-1 py-0.5 rounded border border-rose-500/40">No experience needed</span>. Process bank transfers & keep <span className="bg-rose-500/25 text-rose-300 px-1 py-0.5 rounded border border-rose-500/40">10% commission</span>. Contact on Telegram..."
                </p>
              </div>

              {/* Right telemetry pill */}
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2 text-center">
                <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                  Verdict Assessment
                </div>
                <div className="text-2xl font-mono font-black text-rose-400">
                  98.7% FAKE
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  3 Critical Scam Vectors Triggered
                </div>
              </div>

            </div>

            {/* Glowing active scanning beam */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />
          </div>
        </motion.div>

      </section>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME TELEMETRY STATS STRIP */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Corpus Dataset', value: '17,880', desc: 'EMNLP Verified Job Postings', icon: <Database className="text-cyan-400" size={18} /> },
          { label: 'Model Precision', value: '97.2%', desc: 'Cross-Entropy F1 Accuracy', icon: <Cpu className="text-emerald-400" size={18} /> },
          { label: 'Inference Speed', value: '< 0.04s', desc: 'Real-time vectorized scoring', icon: <Zap className="text-amber-400" size={18} /> },
          { label: 'Privacy Standard', value: '0.00%', desc: 'Zero Candidate PII Retained', icon: <Lock className="text-indigo-400" size={18} /> },
        ].map((stat, i) => (
          <GlassCard key={i} glowBeam={true} className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
              <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">{stat.icon}</div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{stat.desc}</div>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* ========================================================================= */}
      {/* 3. ANATOMY OF MODERN EMPLOYMENT SCAMS */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Threat Intelligence</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Anatomy of Modern Job Fraud</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Employment scams have evolved into high-pressure social engineering operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: '01',
              title: 'Advance Equipment Traps',
              desc: 'Counterfeit cashier checks sent for home office hardware, followed by demands to wire surplus funds back.',
              badge: 'Financial Fraud',
              color: 'border-rose-500/20 text-rose-400'
            },
            {
              id: '02',
              title: 'Telegram Task Schemes',
              desc: 'Micro-tasks (rating apps, watching videos) requiring deposits to "unlock" higher compensation tiers.',
              badge: 'Social Engineering',
              color: 'border-amber-500/20 text-amber-400'
            },
            {
              id: '03',
              title: 'Money Mule Routing',
              desc: 'Positions disguised as "Payment Assistants" to receive stolen funds and convert them into untraceable crypto.',
              badge: 'Criminal Liability',
              color: 'border-rose-500/20 text-rose-400'
            },
            {
              id: '04',
              title: 'Executive Impersonation',
              desc: 'Spoofed corporate recruiter emails (@gmail.com) targeting applicants for high-salary entry roles.',
              badge: 'Domain Spoofing',
              color: 'border-purple-500/20 text-purple-400'
            }
          ].map((item, i) => (
            <GlassCard key={i} hoverEffect={true} className="flex flex-col justify-between space-y-4 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-slate-400">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/[0.04] border ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-cyan-400 font-semibold cursor-pointer" onClick={() => setCurrentPage('radar')}>
                <span>Inspect in Scam Radar</span>
                <ChevronRight size={13} />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 4-STAGE NEURAL PIPELINE */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Detection Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">The Neural Inspection Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            How raw text coordinates transform into probabilistic risk classifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: 'STAGE 01',
              title: 'Lexical Cleansing',
              detail: 'Strips HTML tags, regex URL patterns, punctuation, digits, and converts text into uniform lowercased arrays.'
            },
            {
              step: 'STAGE 02',
              title: 'TF-IDF Feature Space',
              detail: 'Vectorizes descriptions across 1,000 statistical n-gram dimensions, down-weighting standard corporate filler words.'
            },
            {
              step: 'STAGE 03',
              title: 'Domain Cross-Match',
              detail: 'Examines recruiter email hostnames against official company DNS records and audits salary-to-role realism.'
            },
            {
              step: 'STAGE 04',
              title: 'Bayesian Verdict',
              detail: 'Calculates log-odds probabilities with Scikit-Learn weights and attributes exact in-text red-flag triggers.'
            }
          ].map((pipeline, idx) => (
            <GlassCard key={idx} className="space-y-3 p-5 relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                {pipeline.step}
              </div>
              <h3 className="font-extrabold text-base text-white">{pipeline.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pipeline.detail}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE LIVE SIMULATOR PLAYGROUND */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <GlassCard className="p-6 md:p-8 space-y-6 border-cyan-500/20 bg-gradient-to-b from-[#0b0f17] to-[#080b12]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 mb-1">
                <Play size={12} />
                <span>INTERACTIVE SCANNER PLAYGROUND</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">Test Real-Time Classification</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setDemoInput(SAMPLE_FAKE_JOB); setDemoResult(null); }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
              >
                Load Scam Sample
              </button>
              <button
                onClick={() => { setDemoInput(SAMPLE_GENUINE_JOB); setDemoResult(null); }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all"
              >
                Load Genuine Sample
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Input text */}
            <div className="lg:col-span-2 space-y-3">
              <textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="Paste any job description to test instant neural classification..."
                className="w-full h-44 p-3.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none leading-relaxed"
              />
              
              <button
                onClick={handleRunDemoScan}
                disabled={demoLoading || !demoInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
              >
                {demoLoading ? (
                  <>
                    <Activity size={14} className="animate-spin" />
                    <span>Processing Vectors...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Run Instant Evaluation</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Result Box */}
            <div className="p-5 rounded-xl bg-black/50 border border-white/[0.08] space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Telemetry Readout
              </span>

              {demoResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-black uppercase ${
                      demoResult.prediction === 'Fake Job' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {demoResult.prediction}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {demoResult.confidence}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pt-1 font-mono">
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className={demoResult.risk_level === 'High' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{demoResult.risk_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span className="text-white">{demoResult.processing_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Red Flags:</span>
                      <span className="text-rose-400">{demoResult.red_flags ? demoResult.red_flags.length : 0} triggers</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentPage('detector')}
                    className="w-full mt-2 py-2 rounded-lg text-xs font-bold bg-white/[0.06] hover:bg-white/[0.1] text-cyan-300 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Full XAI Analysis</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 space-y-1">
                  <p>Awaiting input...</p>
                  <p className="text-[10px]">Click "Run Instant Evaluation" to see model telemetry.</p>
                </div>
              )}
            </div>

          </div>

        </GlassCard>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMPARISON MATRIX: MANUAL VS KEYWORD VS VERIWORK */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Evaluation Benchmarks</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Neural Screening Outperforms Basic Rules</h2>
        </div>

        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-4 sm:px-6">Security Dimension</th>
                  <th className="py-4 px-4">Manual Review</th>
                  <th className="py-4 px-4">Keyword Blocklists</th>
                  <th className="py-4 px-4 sm:px-6 text-cyan-400 font-bold bg-cyan-500/[0.04]">VeriWork Neural Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  { feature: 'Latency per advertisement', manual: '5 - 15 minutes', keyword: '< 0.01s', veri: '< 0.04s' },
                  { feature: 'Deceptive synonym detection', manual: 'Subject to bias', keyword: '❌ Easily bypassed', veri: '✅ TF-IDF Feature Mapping' },
                  { feature: 'Recruiter corporate domain check', manual: 'Manual DNS lookup', keyword: '❌ None', veri: '✅ Automated Regex Engine' },
                  { feature: 'Explainable AI In-Text Highlights', manual: '❌ Subjective', keyword: '❌ Basic word matches', veri: '✅ Categorized Risk Attribution' },
                  { feature: 'High-volume batch processing', manual: '❌ Infeasible', keyword: '⚠️ High false positives', veri: '✅ 200+ Jobs / CSV in 1-Click' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-200">{row.feature}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.manual}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.keyword}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-cyan-300 font-semibold bg-cyan-500/[0.04]">{row.veri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section>
        <GlassCard className="text-center py-12 px-6 relative overflow-hidden bg-gradient-to-b from-[#0e1422] to-[#07090e] border-cyan-500/25">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to verify a suspicious vacancy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Scan individual job posts or bulk CSV datasets with our end-to-end Explainable AI suite.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('detector')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all"
              >
                <span>Launch Detector Suite</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </GlassCard>
      </section>

    </motion.div>
  );
}
