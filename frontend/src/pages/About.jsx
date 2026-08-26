import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Layers, HelpCircle, FileText, Compass, Terminal, Shield, CheckCircle2, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 py-4 sm:py-6 max-w-4xl mx-auto"
    >
      
      {/* Title */}
      <motion.div variants={itemVariants} className="space-y-2 border-b border-white/[0.08] pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
          <Terminal size={13} />
          <span>WHITE PAPER & TECHNICAL SPECIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          Architecture & ML Methodology
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          How our natural language processing pipeline vectorizes and validates recruitment text.
        </p>
      </motion.div>

      {/* Problem Statement & Corpus */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-3 p-6">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <BookOpen size={16} />
            <span>01. PROBLEM FORMULATION</span>
          </div>
          <h2 className="font-extrabold text-base text-white">The Asymmetric Threat of Recruitment Fraud</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            With the rapid rise of remote employment, malicious actors deploy deceptive listings to harvest banking credentials, social security identifiers, or extract advance fees. VeriWork uses high-throughput feature attribution to detect structural anomalies prior to candidate application submission.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3 p-6">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
            <FileText size={16} />
            <span>02. DATASET CORPUS</span>
          </div>
          <h2 className="font-extrabold text-base text-white">EMNLP 17,880 Training Benchmark</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The core supervised classifier is trained on the benchmark EMNLP recruitment dataset comprising 17,880 verified advertisements. The training corpus highlights standard structural differentials, including inflated compensation promises, informal interview routes, and payment laundering indicators.
          </p>
        </GlassCard>
      </motion.div>

      {/* NLP text pre-processing pipeline diagram */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
          <Layers size={16} />
          <span>03. LEXICAL PREPROCESSING PIPELINE</span>
        </div>
        
        <GlassCard className="space-y-5 p-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            Before text matrices are ingested by the Scikit-Learn inference engine, the payload undergoes deterministic token cleaning to eliminate noise and adversarial obfuscation:
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-center">
            {[
              { title: 'Lowercasing', desc: 'Uniform case normalization' },
              { title: 'HTML Stripping', desc: 'Removal of tags (<p>, <b>)' },
              { title: 'URL Removal', desc: 'Strips web link prefixes' },
              { title: 'Punctuation', desc: 'Removes symbols & tokens' },
              { title: 'Whitespace', desc: 'Collapses double spacing' },
            ].map((step, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 ${idx === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <span className="text-xs font-bold text-white block">{step.title}</span>
                <p className="text-[10px] text-slate-500 font-sans">{step.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Algorithms comparison */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
          <Cpu size={16} />
          <span>04. MATHEMATICAL MODELING</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'TF-IDF Feature Space',
              desc: 'Term Frequency-Inverse Document Frequency. Transforms raw text into numerical sparse feature vectors by scoring word frequencies and down-weighting terms common across standard job descriptions.'
            },
            {
              title: 'Logistic Regression',
              desc: 'Our primary classification model. Evaluates log-odds probabilities to label advertisements. Extremely fast inference speeds (<0.04s) and high regularized accuracy on text features.'
            },
            {
              title: 'Explainable Attribution',
              desc: 'Extracts exact weights contributing positively or negatively to the class boundary, enabling complete transparency and in-text red-flag phrase highlighting.'
            }
          ].map((alg, index) => (
            <GlassCard key={index} className="flex flex-col h-56 space-y-3 justify-between p-6">
              <h3 className="font-extrabold text-sm text-white font-display">{alg.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{alg.desc}</p>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Future Roadmap */}
      <motion.div variants={itemVariants}>
        <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-cyan-500/20 bg-gradient-to-r from-cyan-500/[0.06] to-transparent p-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
              <Compass size={16} />
              <span>05. SYSTEM ROADMAP</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Upcoming milestones include lightweight transformer fine-tuning (DistilRoBERTa), direct LinkedIn/Indeed Chrome extension sidecar integration, and automated corporate registry API checks.
            </p>
          </div>
        </GlassCard>
      </motion.div>

    </motion.div>
  );
}
