import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Layers, HelpCircle, FileText, Compass } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      className="space-y-12 py-6 max-w-4xl mx-auto"
    >
      
      {/* Title */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">NLP & Pipeline Architecture</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Learn how our machine learning models verify job advertisements.
        </p>
      </motion.div>

      {/* Problem Statement & Dataset */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2.5 text-brand-500">
            <BookOpen size={20} />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Problem Statement</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Employment scams have surged with remote work opportunities. Scammers publish fraudulent listings to extract bank details, social security numbers, or fees. VeriWork uses text analysis to spot patterns common to these listings before candidate applications are submitted.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-500">
            <FileText size={20} />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Dataset & Corpus</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The classifier is trained on the EMNLP job recruitment dataset containing 17,880 unique advertisements labeled as genuine or fake. The training data showcases standard structural differences, including an over-representation of daily wages and personal banking requests in scam listings.
          </p>
        </GlassCard>
      </motion.div>

      {/* NLP text pre-processing pipeline diagram */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
          <Layers size={20} className="text-indigo-500" />
          <h2 className="font-extrabold text-base">Natural Language Preprocessing (NLP)</h2>
        </div>
        
        <GlassCard className="space-y-6">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Before job details are evaluated by the machine learning algorithm, the text undergoes strict cleaning in our python backend to remove noise:
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { title: 'Lowercasing', desc: 'Sets uniform capitalization' },
              { title: 'HTML Strip', desc: 'Removes web markup (<p>, <b>)' },
              { title: 'URL Clear', desc: 'Strips out domain strings' },
              { title: 'Punctuation', desc: 'Clears symbols and tokens' },
              { title: 'Whitespace', desc: 'Removes double spacing' },
            ].map((step, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 text-center space-y-1 ${idx === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Algorithms comparison */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
          <Cpu size={20} className="text-amber-500" />
          <h2 className="font-extrabold text-base">Model Algorithms Explored</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'TF-IDF Vectorization',
              desc: 'Term Frequency-Inverse Document Frequency. Transforms job descriptions into numerical feature vectors by scoring word frequencies and down-weighting terms common across all documents.'
            },
            {
              title: 'Logistic Regression',
              desc: 'Our primary classification model. Evaluates log-odds probabilities to label advertisements. Extremely fast inference speeds (<0.04s) and high regularized accuracy on text features.'
            },
            {
              title: 'Naive Bayes & Trees',
              desc: 'Baseline models evaluated during benchmarking. Multi-nominal Naive Bayes is suitable for fast text sorting, whereas Random Forests provide ensemble split comparisons.'
            }
          ].map((alg, index) => (
            <GlassCard key={index} className={`flex flex-col h-56 space-y-3 justify-between ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{alg.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{alg.desc}</p>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Future Scope */}
      <motion.div variants={itemVariants}>
        <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-dashed border-2 border-brand-500/20 bg-brand-500/5">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-brand-500">
              <Compass size={18} />
              <h2 className="font-extrabold text-sm uppercase tracking-wider">Future Enhancements</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We plan to explore transformer model embeddings (BERT/DistilBERT) to analyze contextual details, integrate third-party company registration API checks, and build a browser extension to verify listings on LinkedIn and Indeed.
            </p>
          </div>
        </GlassCard>
      </motion.div>

    </motion.div>
  );
}
