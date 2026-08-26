import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, ArrowRight, Zap, Cpu, Database, 
  Sparkles, CheckCircle2, AlertTriangle, Terminal, ChevronDown,
  Radar, Layers, Lock, Search, Eye, Activity, Play, ArrowDown,
  AlertOctagon, CornerDownRight, RefreshCw, Crosshair, ChevronRight
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';
import { apiService } from '../services/api';

export default function Home({ setCurrentPage }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Smooth scroll springs
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20, restDelta: 0.001 });

  // Parallax and kinetic scroll transforms
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -100]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0]);

  const signalCard1Y = useTransform(smoothProgress, [0.1, 0.35], [80, -40]);
  const signalCard2Y = useTransform(smoothProgress, [0.1, 0.35], [140, -70]);
  const signalCard3Y = useTransform(smoothProgress, [0.1, 0.35], [60, -20]);

  const pipelineRotate = useTransform(smoothProgress, [0.3, 0.55], [0, 6]);
  const pipelineScale = useTransform(smoothProgress, [0.3, 0.55], [0.95, 1.02]);

  // Interactive Live Simulator State inside the story
  const [demoInput, setDemoInput] = useState(SAMPLE_FAKE_JOB);
  const [demoResult, setDemoResult] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [activeSignalHover, setActiveSignalHover] = useState(null);

  const handleRunDemoScan = async (sampleType = null) => {
    const text = sampleType === 'genuine' ? SAMPLE_GENUINE_JOB : sampleType === 'fake' ? SAMPLE_FAKE_JOB : demoInput;
    if (sampleType) setDemoInput(text);
    if (!text.trim()) return;

    setDemoLoading(true);
    setDemoResult(null);

    try {
      const res = await apiService.predictJob(text.trim());
      setDemoResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-32 sm:space-y-48 py-4 sm:py-8 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. CHOREOGRAPHED JITTER-INSPIRED HERO */}
      {/* ========================================================================= */}
      <motion.section 
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="min-h-[88vh] flex flex-col justify-center relative pt-4 pb-12"
      >
        {/* Eyebrow entrance */}
        <div className="flex items-center gap-2 mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>VERIWORK PROTOCOL // NEURAL TRUST ENGINE</span>
          </motion.div>
        </div>

        {/* Oversized Kinetic Headline Sequence */}
        <div className="relative z-10 select-none">
          
          {/* Line 1: IS THIS */}
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-slate-100 leading-none"
            >
              IS THIS
            </motion.h1>
          </div>

          {/* Line 2: JOB (Oversized electric text) */}
          <div className="overflow-hidden flex items-center gap-4 sm:gap-6">
            <motion.span 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display font-black tracking-tighter text-cyan-400 text-glow leading-none"
            >
              JOB
            </motion.span>

            {/* Kinetic animated scanning line indicator */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="hidden sm:block flex-1 h-px bg-gradient-to-r from-cyan-400 via-sky-500 to-transparent"
            />
          </div>

          {/* Line 3: REAL? */}
          <div className="overflow-hidden flex items-center justify-between">
            <motion.h1 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-white/90 leading-none"
            >
              REAL?
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="hidden lg:flex items-center gap-3 font-mono text-xs text-slate-400 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-2xl backdrop-blur-xl"
            >
              <Activity size={14} className="text-cyan-400 animate-pulse" />
              <span>TF-IDF FEATURE MATRIX // ACTIVE</span>
            </motion.div>
          </div>

        </div>

        {/* Floating Telemetry Artifacts Orbiting Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 sm:mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-20"
        >
          {/* Subtitle & Narrative */}
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl leading-relaxed font-sans">
            AI-driven natural language processing and recruiter domain cross-verification. Expose employment phishing, money mule routing, and advance fee scams in milliseconds.
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('detector')}
              className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-2xl shadow-cyan-500/25 active:scale-95 transition-all duration-200 font-mono"
            >
              <Sparkles size={14} />
              <span>LAUNCH DETECTOR</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-cyan-200 border border-white/20">↵</kbd>
            </button>

            <button
              onClick={() => handleRunDemoScan('fake')}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white font-mono text-xs transition-all"
            >
              <Zap size={13} className="text-amber-400" />
              <span>TEST WIRE SCAM</span>
            </button>
          </div>
        </motion.div>

        {/* Floating Asymmetric Threat Chips in Hero */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="absolute -top-4 right-0 hidden lg:block p-3.5 rounded-2xl bg-[#0c1017]/90 border border-rose-500/30 backdrop-blur-xl shadow-2xl font-mono text-[11px] text-rose-300 space-y-1 pointer-events-none"
        >
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertTriangle size={13} />
            <span>SUSPICIOUS VECTOR DETECTED</span>
          </div>
          <p className="text-slate-400">"Wire transfer via personal bank account"</p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
          className="absolute bottom-4 right-1/4 hidden xl:block p-3.5 rounded-2xl bg-[#0c1017]/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl font-mono text-[11px] text-emerald-300 space-y-1 pointer-events-none"
        >
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle2 size={13} />
            <span>DNS DOMAIN VERIFIED</span>
          </div>
          <p className="text-slate-400">Official corporate career portal match</p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase tracking-widest"
        >
          <ArrowDown size={12} className="animate-bounce text-cyan-400" />
          <span>Scroll to uncover the threat vectors</span>
        </motion.div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 2. STORY SEQUENCE 1: "Fake jobs are getting harder to recognize." */}
      {/* ========================================================================= */}
      <section className="relative space-y-10">
        <div className="border-t border-white/[0.08] pt-12">
          <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider uppercase block mb-3">
            01 // THE GROWING DECEPTION
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl">
            "Fake jobs are no longer obvious typos. They are engineered social traps."
          </h2>
        </div>

        {/* Interactive Comparison Split Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          <GlassCard className="p-6 sm:p-8 space-y-4 border-rose-500/20 bg-gradient-to-b from-rose-500/5 to-transparent">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 font-mono text-xs">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <ShieldAlert size={14} /> FRAUDULENT PATTERN
              </span>
              <span className="text-slate-500">98.4% ANOMALY</span>
            </div>
            <p className="text-sm font-mono text-slate-300 leading-relaxed">
              "We are urgently hiring a Remote Clerk. Earn <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded">$5,000 a week</span> with zero experience. Equipment check will be mailed for home setup. Contact recruiter on <span className="text-rose-400 font-bold bg-rose-500/10 px-1 rounded">Telegram @careers_urgent</span>."
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">Fake Check Scheme</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">Unverified Channel</span>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8 space-y-4 border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 font-mono text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} /> LEGITIMATE PATTERN
              </span>
              <span className="text-slate-500">AUTHENTIC CORPUS</span>
            </div>
            <p className="text-sm font-mono text-slate-300 leading-relaxed">
              "Senior Frontend Engineer wanted at Global Cloud Services. Requirements: 3+ years experience with React and TypeScript. Full benefits include <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">401(k) matching, health insurance, and PTO</span>. Apply via corporate portal."
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Standard Compensation</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Structured Qualifications</span>
            </div>
          </GlassCard>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STORY SEQUENCE 2: "Look beyond the job description." (ASYMMETRIC BLOCKS) */}
      {/* ========================================================================= */}
      <section className="space-y-12">
        <div className="border-t border-white/[0.08] pt-12 space-y-2">
          <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider uppercase block">
            02 // MULTI-VECTOR INSPECTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Look beyond the job description.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            VeriWork evaluates 5 distinct forensic dimensions to isolate deceptive listings.
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Card 1: SALARY (Span 7) */}
          <motion.div style={{ y: signalCard1Y }} className="md:col-span-7">
            <GlassCard glowBeam={true} className="p-8 space-y-4 border-white/[0.12] bg-[#0c1017]">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-400 font-bold tracking-wider uppercase">01 // COMPENSATION REALISM</span>
                <span className="text-rose-400 font-bold">SALARY ANOMALY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                "$5,000 / week with no qualifications required."
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Scammers inflate compensation ratios by over 400% above national benchmarks to lure vulnerable job seekers into money mule and advance fee schemes.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs text-slate-300 flex items-center justify-between">
                <span>Anomaly Ratio:</span>
                <span className="text-rose-400 font-bold">4.8x Market Standard</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Card 2: CONTACT (Span 5) */}
          <motion.div style={{ y: signalCard2Y }} className="md:col-span-5">
            <GlassCard className="p-8 space-y-4 border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-amber-400 font-bold tracking-wider uppercase">02 // DOMAIN MISMATCH</span>
                <span className="text-amber-400">DNS CHECK</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                "Recruiter using @gmail.com for Enterprise roles."
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Authentic enterprise recruiters utilize verified corporate domains rather than free consumer email providers or unverified Telegram channels.
              </p>
            </GlassCard>
          </motion.div>

          {/* Card 3: URGENCY (Span 4) */}
          <motion.div style={{ y: signalCard3Y }} className="md:col-span-4">
            <GlassCard className="p-7 space-y-3">
              <span className="font-mono text-xs text-rose-400 font-bold tracking-wider uppercase">
                03 // BYPASSED SCREENING
              </span>
              <h4 className="text-lg font-bold text-white">"No interview. Start today."</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eliminating background checks and live 2-way interviews is a direct signature of identity theft and task scams.
              </p>
            </GlassCard>
          </motion.div>

          {/* Card 4: PAYMENT (Span 8) */}
          <motion.div className="md:col-span-8">
            <GlassCard className="p-8 space-y-4 border-cyan-500/20 bg-gradient-to-r from-[#0c1017] to-cyan-500/5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-400 font-bold tracking-wider uppercase">04 // PAYMENT REDIRECTION</span>
                <span className="text-cyan-400">MONEY MULE TRAP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                "Process incoming transfers & keep 10% commission."
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Transferring funds from personal bank accounts exposes victims to severe criminal prosecution under federal money laundering statutes.
              </p>
            </GlassCard>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STORY SEQUENCE 3: "Your job is analyzed from multiple angles." */}
      {/* ========================================================================= */}
      <motion.section 
        style={{ rotate: pipelineRotate, scale: pipelineScale }}
        className="space-y-10"
      >
        <div className="border-t border-white/[0.08] pt-12 space-y-2 text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider uppercase block">
            03 // NEURAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Your job is analyzed from multiple angles.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Raw text streams converge into four modular computational pipelines.
          </p>
        </div>

        {/* Animated Visual Pipeline Assembly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {[
            {
              step: 'VECTOR 01',
              name: 'Lexical Cleansing',
              detail: 'Strips HTML, URLs, symbols and normalizes case.',
              badge: 'Preprocessing'
            },
            {
              step: 'VECTOR 02',
              name: 'TF-IDF Extraction',
              detail: 'Maps tokens across 1,000 statistical n-gram dimensions.',
              badge: 'NLP Model'
            },
            {
              step: 'VECTOR 03',
              name: 'Recruiter DNS Match',
              detail: 'Audits corporate hostname against verified web domains.',
              badge: 'Entity Audit'
            },
            {
              step: 'VECTOR 04',
              name: 'Bayesian Verdict',
              detail: 'Synthesizes log-odds probabilities into threat confidence.',
              badge: 'Classification'
            }
          ].map((v, i) => (
            <GlassCard key={i} className="p-6 space-y-3 text-left relative overflow-hidden group">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-cyan-400 font-bold">{v.step}</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">{v.badge}</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{v.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{v.detail}</p>
            </GlassCard>
          ))}
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 5. STORY SEQUENCE 4: INTERACTIVE ANALYSIS PLAYGROUND */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="border-t border-white/[0.08] pt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider uppercase block mb-1">
              04 // LIVE VERIFICATION INSTRUMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Know before you apply.
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunDemoScan('fake')}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
            >
              Test Wire Scam
            </button>
            <button
              onClick={() => handleRunDemoScan('genuine')}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
            >
              Test Authentic Job
            </button>
          </div>
        </div>

        {/* Live Workspace Container */}
        <GlassCard className="p-6 sm:p-8 space-y-6 border-cyan-500/25 bg-[#0b0f17]">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Input Instrument */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Paste any job listing to test real-time neural classification..."
                  className="w-full h-52 p-4 rounded-2xl border border-white/[0.08] bg-black/40 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none leading-relaxed transition-all"
                />
              </div>

              <button
                onClick={() => handleRunDemoScan()}
                disabled={demoLoading || !demoInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all"
              >
                {demoLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>EXTRACTING N-GRAM VECTORS & SCORING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>RUN LIVE NEURAL CLASSIFICATION</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Telemetry Readout */}
            <div className="p-6 rounded-2xl bg-black/50 border border-white/[0.08] space-y-4 text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">
                TELEMETRY HUD
              </span>

              {demoResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-lg text-xs font-mono font-black uppercase ${
                      demoResult.prediction === 'Fake Job' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {demoResult.prediction}
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {demoResult.confidence}%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-slate-400 border-t border-white/[0.06] pt-3">
                    <div className="flex justify-between">
                      <span>Threat Risk:</span>
                      <span className={demoResult.risk_level === 'High' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{demoResult.risk_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inference Speed:</span>
                      <span className="text-white">{demoResult.processing_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Matched Triggers:</span>
                      <span className="text-rose-400">{demoResult.red_flags ? demoResult.red_flags.length : 0} flags</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentPage('detector')}
                    className="w-full mt-2 py-2.5 rounded-xl text-xs font-mono font-bold bg-white/[0.06] hover:bg-white/[0.1] text-cyan-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>OPEN FULL DETECTOR SUITE</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 space-y-2 font-mono">
                  <Terminal size={24} className="mx-auto text-slate-600 mb-1" />
                  <p>Awaiting Vector Payload...</p>
                  <p className="text-[10px] text-slate-600">Click "Run Live Neural Classification" above.</p>
                </div>
              )}
            </div>

          </div>

        </GlassCard>
      </section>

      {/* ========================================================================= */}
      {/* 6. FINAL MONUMENTAL LAUNCH BANNER */}
      {/* ========================================================================= */}
      <section className="text-center py-16 px-6 relative rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-[#0e1422] to-[#07090e] shadow-2xl overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            VERIWORK AI INTELLIGENCE // READY
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Never fall for a deceptive job listing again.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Verify single job descriptions or bulk CSV candidate placement datasets with complete Explainable AI transparency.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentPage('detector')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-sm shadow-2xl shadow-cyan-500/30 active:scale-95 transition-all"
            >
              <Sparkles size={16} />
              <span>LAUNCH FULL DETECTOR</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
