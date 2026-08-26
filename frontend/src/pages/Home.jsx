import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Percent, Zap, Cpu, HelpCircle, CheckCircle2, Database } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function Home({ setCurrentPage }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const stats = [
    { label: 'Dataset Size', value: '17,880', desc: 'EMNLP job dataset postings', icon: <Database className="text-brand-500" size={20} /> },
    { label: 'Model Accuracy', value: '97.2%', desc: 'Cross-entropy accuracy', icon: <Percent className="text-emerald-500" size={20} /> },
    { label: 'Prediction Speed', value: '< 0.05s', desc: 'Vectorized classification latency', icon: <Zap className="text-amber-500" size={20} /> },
    { label: 'ML Algorithm', value: 'Logistic Reg', desc: 'Supervised text model', icon: <Cpu className="text-indigo-500" size={20} /> },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-20 py-8 md:py-12"
    >
      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10 mb-2"
        >
          <ShieldCheck size={13} />
          AI-Powered Trust Scanner
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none text-slate-900 dark:text-white"
        >
          Fake Job Posting <br />
          <span className="text-gradient">Detector</span>
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Detect fraudulent job postings and safeguard job seekers. Analyze employment listings in seconds using natural language processing.
        </motion.p>
        
        <motion.div variants={itemVariants} className="pt-4">
          <button
            onClick={() => setCurrentPage('detector')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 dark:bg-brand-600 text-white font-bold text-base hover:bg-brand-600 dark:hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/20 active:scale-95 transition-all duration-150"
            id="cta-analyze-job"
          >
            Analyze Job Posting
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <GlassCard key={i} hoverEffect={true} className="flex flex-col justify-between h-44">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
                {stat.label}
              </span>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                {stat.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {stat.desc}
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* How it Works Section */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">How It Works</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Four simple steps to verify the safety of any career listing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Paste Details', desc: 'Copy the job description text and paste it into the analyzer.' },
            { step: '02', title: 'NLP Text Cleansing', desc: 'Our engine strips out noisy URLs, HTML, punctuation, and digits.' },
            { step: '03', title: 'Inference Test', desc: 'The vectorized representation is queried against the Logistic Regression classifier.' },
            { step: '04', title: 'Get Trust Report', desc: 'Receive instant visual confidence scores, risk indexes, and predictions.' }
          ].map((item, idx) => (
            <GlassCard key={idx} className="relative overflow-hidden group h-48">
              <div className="absolute top-4 right-4 text-4xl sm:text-5xl font-black text-slate-200/60 dark:text-slate-800/30 group-hover:scale-110 transition-transform duration-300 select-none">
                {item.step}
              </div>
              <h3 className="font-extrabold text-lg mt-4 text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Features & Callout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">
            Key Features of <br />
            Our Verification Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Designed for speed, accessibility, and high performance. Ideal for candidate protection platforms and career hubs.
          </p>
          <div className="space-y-3.5">
            {[
              'Explainable AI (XAI) with real-time in-text red-flag phrase highlighting.',
              'Structured company, official domain, and recruiter email verification.',
              'Bulk Batch Job Scanner to audit CSV/JSON datasets with exportable reports.',
              'Interactive A/B Job Comparator and Modern Scam Taxonomy Radar.',
              'Secure local history log allows tracking of recent scans.',
              'Light/dark theme support with sleek glassmorphism aesthetic.'
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <CheckCircle2 className="text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="bg-gradient-to-br from-brand-500/5 to-indigo-500/5 dark:from-brand-500/10 dark:to-indigo-500/10 border-brand-500/10 flex flex-col justify-center items-center py-10 px-8 text-center space-y-4">
          <HelpCircle size={44} className="text-brand-500 dark:text-brand-400 animate-float" />
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Explore VeriWork Suite</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Choose between single-text explainable analysis, multi-field company verification, or bulk CSV dataset audits.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <button
              onClick={() => setCurrentPage('detector')}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs active:scale-95 transition-all shadow-md shadow-brand-500/15"
            >
              Detector & XAI
            </button>
            <button
              onClick={() => setCurrentPage('batch')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs active:scale-95 transition-all shadow-md"
            >
              Batch Scanner
            </button>
            <button
              onClick={() => setCurrentPage('radar')}
              className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs active:scale-95 transition-all"
            >
              Scam Radar
            </button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

