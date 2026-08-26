import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, GitCompare, ShieldAlert, ShieldCheck, AlertOctagon, 
  HelpCircle, ArrowRight, CheckCircle2, XCircle, Sparkles, RefreshCw, BookmarkCheck
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { apiService } from '../services/api';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';

const SCAM_TAXONOMY = [
  {
    title: 'Fake Check & Equipment Advance',
    badge: 'Financial Trap',
    color: 'red',
    summary: 'The "employer" sends a counterfeit cashier check to purchase home office hardware from a "preferred vendor".',
    redFlags: ['Checks sent prior to employment start', 'Instructions to wire money to third-party vendors', 'Overpayment requests'],
    advice: 'Never wire money or return funds from a deposited check until your bank fully clears it (up to 14 days).'
  },
  {
    title: 'Telegram / WhatsApp Task Scams',
    badge: 'Micro-Task Scheme',
    color: 'amber',
    summary: 'Recruiters approach via SMS or messaging apps offering high pay for liking videos, rating products, or simple clicks.',
    redFlags: ['Interviews exclusively over Telegram or WhatsApp', 'Deposit requirements to unlock higher-tier tasks', 'Crypto payouts only'],
    advice: 'Legitimate corporations never conduct formal onboarding or hiring via unverified instant messaging groups.'
  },
  {
    title: 'Money Mule & Wire Transferring',
    badge: 'Criminal Liability',
    color: 'red',
    summary: 'Positions disguised as "Payment Processing Assistant" where you receive stolen funds and wire them out.',
    redFlags: ['Using personal bank accounts for company transactions', 'Retaining 5-10% commission on transfers', 'No background check'],
    advice: 'Transferring illicit money makes you legally liable as a money mule under banking fraud laws.'
  },
  {
    title: 'Reshipping & Package Forwarding',
    badge: 'Stolen Goods',
    color: 'amber',
    summary: 'Receiving packages bought with stolen credit cards at your personal residence and repackaging them overseas.',
    redFlags: ['Work-from-home "package inspector" or "quality manager"', 'Re-shipping goods internationally', 'Unverified company address'],
    advice: 'Legitimate logistics firms operate out of insured commercial hubs, never residential homes.'
  },
  {
    title: 'Phishing Onboarding & Identity Theft',
    badge: 'Data Harvest',
    color: 'purple',
    summary: 'Fake job offers designed solely to harvest SSN, passport copies, and banking details during "onboarding".',
    redFlags: ['Demanding direct deposit & tax forms before an official signed contract', 'Free email recruiter contacts (@gmail)', 'No verified company domain'],
    advice: 'Verify employer legitimacy with state registries and never supply SSN/SIN without verified contracts.'
  },
  {
    title: 'Upfront Training & Placement Fees',
    badge: 'Advance Fee',
    color: 'indigo',
    summary: 'Guaranteed placement promises that demand payment for proprietary training, certification, or background checks.',
    redFlags: ['Pay for mandatory training modules', 'Guaranteed high-six-figure placement', 'Upfront software fee'],
    advice: 'Real employers pay for required training and onboarding expenses themselves.'
  }
];

export default function ScamRadar({ showToast }) {
  // A/B Job Comparator State
  const [jobA, setJobA] = useState(SAMPLE_GENUINE_JOB);
  const [jobB, setJobB] = useState(SAMPLE_FAKE_JOB);
  const [resultA, setResultA] = useState(null);
  const [resultB, setResultB] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const handleCompare = async () => {
    if (!jobA.trim() || !jobB.trim()) {
      showToast('Please provide text for both Job A and Job B.', 'warning');
      return;
    }

    setLoadingCompare(true);
    try {
      const [resA, resB] = await Promise.all([
        apiService.predictJob(jobA.trim()),
        apiService.predictJob(jobB.trim())
      ]);
      setResultA(resA);
      setResultB(resB);
      showToast('Side-by-side comparison completed.', 'success');
    } catch (err) {
      showToast('Error comparing jobs: ' + err.message, 'error');
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <div className="space-y-12 py-6">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
          <Radar size={13} />
          Scam Threat Intelligence & Comparative Scanner
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Job Scam Radar & A/B Comparator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Compare suspicious job postings side-by-side, inspect modern employment fraud vectors, and follow safety protocols.
        </p>
      </div>

      {/* A/B Comparator Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare size={20} className="text-brand-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Side-by-Side Job A/B Comparator
            </h2>
          </div>
          <button
            onClick={handleCompare}
            disabled={loadingCompare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all"
          >
            {loadingCompare ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
            Run Comparative Evaluation
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Job A Pane */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <span className="text-xs font-black uppercase text-brand-500 tracking-wider">Candidate Listing A</span>
              {resultA && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  resultA.prediction === 'Fake Job' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {resultA.prediction} ({resultA.confidence}%)
                </span>
              )}
            </div>

            <textarea
              value={jobA}
              onChange={(e) => setJobA(e.target.value)}
              placeholder="Paste Job A description..."
              className="w-full h-44 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 resize-none leading-relaxed"
            />

            {resultA && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className={resultA.risk_level === 'High' ? 'text-red-500' : 'text-emerald-500'}>{resultA.risk_level}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Red Flag Count:</span>
                  <span>{resultA.red_flags ? resultA.red_flags.length : 0} triggers</span>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Job B Pane */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <span className="text-xs font-black uppercase text-indigo-500 tracking-wider">Candidate Listing B</span>
              {resultB && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  resultB.prediction === 'Fake Job' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {resultB.prediction} ({resultB.confidence}%)
                </span>
              )}
            </div>

            <textarea
              value={jobB}
              onChange={(e) => setJobB(e.target.value)}
              placeholder="Paste Job B description..."
              className="w-full h-44 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 resize-none leading-relaxed"
            />

            {resultB && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className={resultB.risk_level === 'High' ? 'text-red-500' : 'text-emerald-500'}>{resultB.risk_level}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Red Flag Count:</span>
                  <span>{resultB.red_flags ? resultB.red_flags.length : 0} triggers</span>
                </div>
              </div>
            )}
          </GlassCard>

        </div>
      </section>

      {/* Modern Scam Taxonomy Library */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Modern Employment Scam Taxonomy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-world breakdown of the most prevalent recruitment fraud models and defense mechanisms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCAM_TAXONOMY.map((scam, i) => (
            <GlassCard key={i} className="flex flex-col justify-between space-y-4 p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    scam.color === 'red' ? 'bg-red-500/10 text-red-500' : scam.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                  }`}>
                    {scam.badge}
                  </span>
                  <AlertOctagon size={16} className={scam.color === 'red' ? 'text-red-500' : 'text-amber-500'} />
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {scam.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {scam.summary}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Key Indicators:</span>
                  <ul className="space-y-1">
                    {scam.redFlags.map((rf, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                        <XCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/40 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                <span className="font-bold text-brand-600 dark:text-brand-400 block mb-0.5">🛡️ Safety Rule:</span>
                {scam.advice}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Candidate Pre-Signature Safety Checklist */}
      <GlassCard className="p-6 space-y-4 bg-gradient-to-br from-brand-500/5 via-transparent to-indigo-500/5">
        <div className="flex items-center gap-2">
          <BookmarkCheck size={22} className="text-brand-500" />
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Job Seeker Self-Defense Protocol
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
          Always complete these 4 checks before providing personal identifiers, signing offer letters, or taking action:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">1. Domain Inspection</span>
            <p className="text-[11px] text-slate-500 leading-tight">Verify that the recruiter's email domain directly matches the company's verified web address.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">2. Formal Video/In-Person</span>
            <p className="text-[11px] text-slate-500 leading-tight">Refuse offers extended solely via text, Telegram, or questionnaire without two-way live interviews.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">3. Zero Upfront Costs</span>
            <p className="text-[11px] text-slate-500 leading-tight">Legitimate employers cover their own equipment, software licenses, and training onboarding costs.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">4. Cross-Reference Listing</span>
            <p className="text-[11px] text-slate-500 leading-tight">Search the company's official "Careers" portal to confirm the exact Job ID exists.</p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
}
