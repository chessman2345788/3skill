import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, ArrowRight, Zap, Cpu, Database, 
  Sparkles, CheckCircle2, AlertTriangle, Terminal, ChevronDown,
  Radar, Layers, Lock, Search, Eye, Activity, Play, ArrowDown,
  AlertOctagon, CornerDownRight, RefreshCw, Crosshair, ChevronRight,
  TrendingUp, Globe, FileText
} from 'lucide-react';
import TiltCard from '../components/motion/TiltCard';
import MagneticButton from '../components/motion/MagneticButton';
import AnimatedNumber from '../components/motion/AnimatedNumber';
import RevealText from '../components/motion/RevealText';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';
import { apiService } from '../services/api';

export default function Home({ setCurrentPage }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20, restDelta: 0.001 });

  // Parallax and kinetic scroll transforms
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -80]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.96]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0]);

  // Story scroll transforms
  const compCardLeftX = useTransform(smoothProgress, [0.08, 0.25], [-120, 0]);
  const compCardRightX = useTransform(smoothProgress, [0.08, 0.25], [120, 0]);
  const compCardOpacity = useTransform(smoothProgress, [0.08, 0.22], [0, 1]);

  // Asymmetric block entrance vectors
  const block1Y = useTransform(smoothProgress, [0.22, 0.42], [100, 0]);
  const block2Y = useTransform(smoothProgress, [0.25, 0.45], [140, 0]);
  const block3Y = useTransform(smoothProgress, [0.28, 0.48], [80, 0]);
  const block4Y = useTransform(smoothProgress, [0.3, 0.5], [120, 0]);

  // Interactive Live Simulator State
  const [demoInput, setDemoInput] = useState(SAMPLE_FAKE_JOB);
  const [demoResult, setDemoResult] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

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
    <div ref={containerRef} className="relative space-y-36 sm:space-y-48 py-4 sm:py-8 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. CHOREOGRAPHED JITTER-INSPIRED HERO WITH LIVING TILTED CARDS */}
      {/* ========================================================================= */}
      <motion.section 
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="min-h-[85vh] flex flex-col justify-center relative pt-4 pb-12"
      >
        {/* Eyebrow entrance */}
        <div className="flex items-center gap-2 mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>VERIWORK PROTOCOL // NEURAL TRUST ENGINE</span>
          </motion.div>
        </div>

        {/* Oversized Kinetic Headline Sequence */}
        <div className="relative z-10 select-none space-y-1">
          
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

          {/* Line 2: JOB (Electric Neon Glow) */}
          <div className="overflow-hidden flex items-center gap-4 sm:gap-6">
            <motion.span 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display font-black tracking-tighter text-cyan-400 text-glow leading-none"
            >
              JOB
            </motion.span>

            {/* Kinetic animated scanning line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="hidden sm:block flex-1 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-transparent origin-left shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            />
          </div>

          {/* Line 3: REAL? */}
          <div className="overflow-hidden flex items-center justify-between">
            <motion.h1 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-white/95 leading-none"
            >
              REAL?
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="hidden lg:flex items-center gap-3 font-mono text-xs text-slate-300 bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 rounded-2xl backdrop-blur-xl shadow-xl"
            >
              <Activity size={14} className="text-cyan-400 animate-pulse" />
              <span>TF-IDF STATISTICAL MATRIX // ONLINE</span>
            </motion.div>
          </div>

        </div>

        {/* Subtitle & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 sm:mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-20"
        >
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl leading-relaxed font-sans">
            AI-driven natural language processing and recruiter domain cross-verification. Expose employment phishing, money mule routing, and advance fee scams in milliseconds.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton
              size="md"
              onClick={() => setCurrentPage('detector')}
              className="shadow-2xl shadow-cyan-500/30"
            >
              <Sparkles size={15} />
              <span>LAUNCH DETECTOR</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-cyan-200 border border-white/20">↵</kbd>
            </MagneticButton>

            <MagneticButton
              size="md"
              variant="secondary"
              onClick={() => handleRunDemoScan('fake')}
            >
              <Zap size={13} className="text-amber-400" />
              <span>TEST WIRE SCAM</span>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Living Breathing Floating Threat Artifacts Orbiting Hero */}
        <div className="absolute top-2 right-0 hidden lg:block pointer-events-auto">
          <TiltCard
            baseRotation={-3}
            floatRange={{ y: 8, x: 4, rot: 1.8 }}
            floatDuration={7}
            className="p-4 border-rose-500/30 bg-[#0c1017]/90 font-mono text-[11px] text-rose-300 space-y-1 w-64 shadow-2xl shadow-rose-500/10"
          >
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertTriangle size={13} />
              <span>THREAT VECTOR DETECTED</span>
            </div>
            <p className="text-slate-400 text-xs">"Wire transfer via personal bank account"</p>
            <div className="text-[10px] text-rose-400 font-bold pt-1 flex items-center justify-between">
              <span>RISK SCORE:</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20">98.4% ANOMALY</span>
            </div>
          </TiltCard>
        </div>

        <div className="absolute bottom-6 right-1/4 hidden xl:block pointer-events-auto">
          <TiltCard
            baseRotation={2.5}
            floatRange={{ y: 7, x: -3, rot: 1.5 }}
            floatDuration={8}
            floatDelay={1.5}
            className="p-4 border-emerald-500/30 bg-[#0c1017]/90 font-mono text-[11px] text-emerald-300 space-y-1 w-64 shadow-2xl shadow-emerald-500/10"
          >
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 size={13} />
              <span>DNS DOMAIN VERIFIED</span>
            </div>
            <p className="text-slate-400 text-xs">Official corporate career portal match</p>
            <div className="text-[10px] text-emerald-400 font-bold pt-1 flex items-center justify-between">
              <span>INTEGRITY:</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20">AUTHENTIC</span>
            </div>
          </TiltCard>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase tracking-widest"
        >
          <ArrowDown size={12} className="animate-bounce text-cyan-400" />
          <span>Scroll to uncover the forensic story</span>
        </motion.div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 2. STORY SEQUENCE 1: "Fake jobs are no longer obvious." */}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="border-t border-white/[0.08] pt-12">
          <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider uppercase block mb-3">
            01 // THE GROWING DECEPTION
          </span>
          <RevealText 
            text="Fake jobs are no longer obvious typos. They are engineered social traps."
            as="h2"
            className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl"
          />
        </div>

        {/* Parallax Comparative Inspection Cards Entering from Opposite Trajectories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          <motion.div style={{ x: compCardLeftX, opacity: compCardOpacity }}>
            <TiltCard 
              baseRotation={-1.5}
              floatRange={{ y: 5, x: 2, rot: 1 }}
              floatDuration={6.5}
              className="p-7 sm:p-8 space-y-4 border-rose-500/30 bg-gradient-to-b from-rose-500/10 to-transparent"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 font-mono text-xs">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <ShieldAlert size={15} /> FRAUDULENT PATTERN
                </span>
                <span className="text-slate-400 font-bold">98.4% ANOMALY</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
                "We are urgently hiring a Remote Clerk. Earn <span className="text-rose-300 font-bold bg-rose-500/20 px-1 py-0.5 rounded border border-rose-500/30">$5,000 a week</span> with zero experience. Equipment check will be mailed for home setup. Contact recruiter on <span className="text-rose-300 font-bold bg-rose-500/20 px-1 py-0.5 rounded border border-rose-500/30">Telegram @careers_urgent</span>."
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Fake Check Scheme</span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Unverified Channel</span>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div style={{ x: compCardRightX, opacity: compCardOpacity }}>
            <TiltCard 
              baseRotation={1.5}
              floatRange={{ y: 5, x: -2, rot: 1 }}
              floatDuration={7}
              floatDelay={0.8}
              className="p-7 sm:p-8 space-y-4 border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 font-mono text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={15} /> LEGITIMATE PATTERN
                </span>
                <span className="text-slate-400 font-bold">AUTHENTIC CORPUS</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
                "Senior Frontend Engineer wanted at Global Cloud Services. Requirements: 3+ years experience with React and TypeScript. Full benefits include <span className="text-emerald-300 font-bold bg-emerald-500/20 px-1 py-0.5 rounded border border-emerald-500/30">401(k) matching, health insurance, and PTO</span>. Apply via corporate portal."
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Standard Compensation</span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Structured Qualifications</span>
              </div>
            </TiltCard>
          </motion.div>

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
          <RevealText 
            text="Look beyond the job description."
            as="h2"
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          />
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            VeriWork evaluates 5 distinct forensic dimensions to isolate deceptive listings.
          </p>
        </div>

        {/* Asymmetric Editorial Masonry with Living Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Card 1: SALARY (Span 7) */}
          <motion.div style={{ y: block1Y }} className="md:col-span-7">
            <TiltCard 
              baseRotation={-2}
              floatRange={{ y: 7, x: 3, rot: 1.2 }}
              glowBeam={true}
              className="p-8 space-y-4 border-white/[0.12] bg-[#0c1017]"
            >
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
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] font-mono text-xs text-slate-300 flex items-center justify-between">
                <span>Anomaly Multiplier:</span>
                <span className="text-rose-400 font-bold text-sm">4.8x Market Rate</span>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 2: CONTACT (Span 5) */}
          <motion.div style={{ y: block2Y }} className="md:col-span-5">
            <TiltCard 
              baseRotation={2}
              floatRange={{ y: 6, x: -3, rot: 1.5 }}
              className="p-8 space-y-4 border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-amber-400 font-bold tracking-wider uppercase">02 // DOMAIN MISMATCH</span>
                <span className="text-amber-400 font-bold">DNS CHECK</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                "Recruiter using @gmail.com for Enterprise roles."
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Authentic enterprise recruiters utilize verified corporate domains rather than free consumer email providers or unverified Telegram channels.
              </p>
            </TiltCard>
          </motion.div>

          {/* Card 3: URGENCY (Span 4) */}
          <motion.div style={{ y: block3Y }} className="md:col-span-4">
            <TiltCard 
              baseRotation={-1}
              floatRange={{ y: 5, x: 2, rot: 1 }}
              className="p-7 space-y-3 border-rose-500/20"
            >
              <span className="font-mono text-xs text-rose-400 font-bold tracking-wider uppercase">
                03 // BYPASSED SCREENING
              </span>
              <h4 className="text-lg font-bold text-white">"No interview. Start today."</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eliminating background checks and live 2-way interviews is a direct signature of identity theft and task scams.
              </p>
            </TiltCard>
          </motion.div>

          {/* Card 4: PAYMENT (Span 8) */}
          <motion.div style={{ y: block4Y }} className="md:col-span-8">
            <TiltCard 
              baseRotation={1.5}
              floatRange={{ y: 6, x: -3, rot: 1.2 }}
              glowBeam={true}
              className="p-8 space-y-4 border-cyan-500/25 bg-gradient-to-r from-[#0c1017] to-cyan-500/5"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-400 font-bold tracking-wider uppercase">04 // PAYMENT REDIRECTION</span>
                <span className="text-cyan-400 font-bold">MONEY MULE TRAP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                "Process incoming transfers & keep 10% commission."
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Transferring funds from personal bank accounts exposes victims to severe criminal prosecution under federal money laundering statutes.
              </p>
            </TiltCard>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STORY SEQUENCE 3: ANIMATED COMPUTATIONAL PIPELINE */}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="border-t border-white/[0.08] pt-12 space-y-2 text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider uppercase block">
            03 // NEURAL ARCHITECTURE
          </span>
          <RevealText 
            text="Your job is analyzed from multiple angles."
            as="h2"
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight justify-center"
          />
          <p className="text-xs sm:text-sm text-slate-400">
            Raw text streams converge into four modular computational pipelines.
          </p>
        </div>

        {/* Animated Computational Nodes with Connecting Data Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {[
            {
              step: 'VECTOR 01',
              name: 'Lexical Cleansing',
              detail: 'Strips HTML, URLs, symbols and normalizes case.',
              badge: 'Preprocessing',
              rot: -1
            },
            {
              step: 'VECTOR 02',
              name: 'TF-IDF Extraction',
              detail: 'Maps tokens across 1,000 statistical n-gram dimensions.',
              badge: 'NLP Model',
              rot: 1
            },
            {
              step: 'VECTOR 03',
              name: 'Recruiter DNS Match',
              detail: 'Audits corporate hostname against verified web domains.',
              badge: 'Entity Audit',
              rot: -1.5
            },
            {
              step: 'VECTOR 04',
              name: 'Bayesian Verdict',
              detail: 'Synthesizes log-odds probabilities into threat confidence.',
              badge: 'Classification',
              rot: 1.5
            }
          ].map((v, i) => (
            <TiltCard 
              key={i} 
              baseRotation={v.rot}
              floatRange={{ y: 5, x: 2, rot: 1 }}
              floatDuration={6 + i}
              floatDelay={i * 0.4}
              className="p-6 space-y-3 text-left relative overflow-hidden group border-white/[0.1]"
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-cyan-400 font-bold">{v.step}</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">{v.badge}</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display">{v.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{v.detail}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. STORY SEQUENCE 4: INTERACTIVE ANALYSIS PLAYGROUND */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="border-t border-white/[0.08] pt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider uppercase block mb-1">
              04 // LIVE VERIFICATION INSTRUMENT
            </span>
            <RevealText 
              text="Know before you apply."
              as="h2"
              className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight"
            />
          </div>

          <div className="flex items-center gap-2">
            <MagneticButton
              size="sm"
              variant="danger"
              onClick={() => handleRunDemoScan('fake')}
            >
              <span>Test Wire Scam</span>
            </MagneticButton>

            <MagneticButton
              size="sm"
              variant="secondary"
              onClick={() => handleRunDemoScan('genuine')}
            >
              <span>Test Authentic Job</span>
            </MagneticButton>
          </div>
        </div>

        {/* Live Workspace Container */}
        <TiltCard 
          baseRotation={0}
          enableMouseTilt={false}
          className="p-6 sm:p-8 space-y-6 border-cyan-500/25 bg-[#0b0f17]"
        >
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

              <MagneticButton
                onClick={() => handleRunDemoScan()}
                disabled={demoLoading || !demoInput.trim()}
                className="w-full"
              >
                {demoLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>EXTRACTING N-GRAM VECTORS & SCORING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>RUN LIVE NEURAL CLASSIFICATION</span>
                  </>
                )}
              </MagneticButton>
            </div>

            {/* Live Telemetry Readout */}
            <div className="p-6 rounded-2xl bg-black/50 border border-white/[0.08] space-y-4 text-left font-mono">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                TELEMETRY HUD
              </span>

              {demoResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                      demoResult.prediction === 'Fake Job' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {demoResult.prediction}
                    </span>
                    <AnimatedNumber 
                      value={demoResult.confidence}
                      suffix="%"
                      className="text-base text-white font-bold"
                    />
                  </div>

                  <div className="space-y-2 text-xs text-slate-400 border-t border-white/[0.06] pt-3">
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

                  <MagneticButton
                    size="sm"
                    variant="secondary"
                    onClick={() => setCurrentPage('detector')}
                    className="w-full mt-2"
                  >
                    <span>OPEN FULL DETECTOR SUITE</span>
                    <ArrowRight size={13} />
                  </MagneticButton>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 space-y-2">
                  <Terminal size={24} className="mx-auto text-slate-600 mb-1" />
                  <p>Awaiting Vector Payload...</p>
                  <p className="text-[10px] text-slate-600">Click "Run Live Neural Classification" above.</p>
                </div>
              )}
            </div>

          </div>
        </TiltCard>
      </section>

      {/* ========================================================================= */}
      {/* 6. FINAL MONUMENTAL LAUNCH BANNER */}
      {/* ========================================================================= */}
      <section className="text-center py-16 px-6 relative rounded-3xl border border-cyan-500/25 bg-gradient-to-b from-[#0e1422] to-[#07090e] shadow-2xl overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            VERIWORK AI INTELLIGENCE // READY
          </span>
          <RevealText
            text="Never fall for a deceptive job listing again."
            as="h2"
            className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight justify-center"
          />
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Verify single job descriptions or bulk CSV candidate placement datasets with complete Explainable AI transparency.
          </p>
          <div className="pt-2 flex justify-center">
            <MagneticButton
              size="lg"
              onClick={() => setCurrentPage('detector')}
            >
              <Sparkles size={16} />
              <span>LAUNCH FULL DETECTOR</span>
              <ArrowRight size={15} />
            </MagneticButton>
          </div>
        </div>
      </section>

    </div>
  );
}
