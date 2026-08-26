import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, GitCompare, ShieldAlert, ShieldCheck, AlertOctagon, 
  HelpCircle, ArrowRight, CheckCircle2, XCircle, Sparkles, RefreshCw, BookmarkCheck, Terminal
} from 'lucide-react';
import TiltCard from '../components/motion/TiltCard';
import MagneticButton from '../components/motion/MagneticButton';
import RevealText from '../components/motion/RevealText';
import { apiService } from '../services/api';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';

const SCAM_TAXONOMY = [
  {
    title: 'Fake Check & Hardware Advance',
    badge: 'Financial Scam',
    color: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    summary: 'The "employer" sends a counterfeit cashier check to purchase home office hardware from a "preferred vendor".',
    redFlags: ['Checks sent prior to employment start', 'Demands to wire surplus funds back to third parties', 'Overpayment checks'],
    advice: 'Never wire money or return funds from a deposited check until your bank fully clears it (up to 14 business days).',
    rot: -1
  },
  {
    title: 'Telegram / WhatsApp Task Scams',
    badge: 'Micro-Task Trap',
    color: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    summary: 'Recruiters approach via SMS or messaging apps offering daily wages for rating apps, liking videos, or simple clicks.',
    redFlags: ['Interviews conducted exclusively via Telegram or WhatsApp', 'Mandatory deposits to unlock higher task tiers', 'Crypto-only payouts'],
    advice: 'Legitimate corporations never conduct formal employee onboarding or interviews via instant messaging channels.',
    rot: 1
  },
  {
    title: 'Money Mule & Wire Routing',
    badge: 'Criminal Liability',
    color: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    summary: 'Positions disguised as "Payment Processing Assistant" where you receive stolen funds and wire them out.',
    redFlags: ['Using personal bank accounts for company transactions', 'Retaining 5-10% commission per transfer', 'Zero screening or interview'],
    advice: 'Transferring illicit money makes you legally liable as a money mule under federal banking fraud laws.',
    rot: -1.5
  },
  {
    title: 'Package Reshipping Schemes',
    badge: 'Stolen Goods',
    color: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    summary: 'Receiving packages bought with stolen credit cards at your personal residence and repackaging them overseas.',
    redFlags: ['Work-from-home "package inspector" or "merchandise handler"', 'Re-shipping goods internationally', 'No commercial hub address'],
    advice: 'Legitimate logistics firms operate out of insured commercial fulfillment centers, never residential homes.',
    rot: 1.2
  },
  {
    title: 'Phishing Onboarding & ID Theft',
    badge: 'Data Harvest',
    color: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    summary: 'Fake job offers designed solely to harvest SSN, passport scans, and banking credentials during "pre-employment onboarding".',
    redFlags: ['Demanding direct deposit & tax forms before an official signed contract', 'Free email recruiter contacts (@gmail)', 'No verified corporate domain'],
    advice: 'Verify employer legitimacy with state registries and never supply SSN/SIN without verified contracts.',
    rot: -0.8
  },
  {
    title: 'Upfront Training & Placement Fees',
    badge: 'Advance Fee',
    color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    summary: 'Guaranteed placement promises that demand payment for proprietary training, certification, or background checks.',
    redFlags: ['Pay for mandatory training modules', 'Guaranteed high-six-figure placement', 'Upfront software license fees'],
    advice: 'Real employers pay for required training and onboarding expenses themselves.',
    rot: 0.8
  }
];

export default function ScamRadar({ showToast }) {
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
      showToast('Side-by-side comparative analysis completed.', 'success');
    } catch (err) {
      showToast('Error comparing jobs: ' + err.message, 'error');
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <div className="space-y-12 py-4 sm:py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
            <Radar size={13} />
            <span>THREAT INTELLIGENCE & COMPARATOR</span>
          </div>
          <RevealText
            text="Job Scam Radar & A/B Diff Inspector"
            as="h1"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display"
          />
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Compare two postings side-by-side and examine modern recruitment fraud taxonomy.
          </p>
        </div>

        <MagneticButton
          size="sm"
          onClick={handleCompare}
          disabled={loadingCompare}
        >
          {loadingCompare ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
          <span>Run A/B Comparison</span>
        </MagneticButton>
      </div>

      {/* A/B Comparator Panes with living TiltCards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Job A Pane */}
        <TiltCard baseRotation={-0.8} className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 font-mono">
            <span className="text-xs font-bold text-cyan-400">CANDIDATE LISTING A</span>
            {resultA && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                resultA.prediction === 'Fake Job' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {resultA.prediction} ({resultA.confidence}%)
              </span>
            )}
          </div>

          <textarea
            value={jobA}
            onChange={(e) => setJobA(e.target.value)}
            placeholder="Paste Job A description..."
            className="w-full h-44 p-3.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none leading-relaxed"
          />

          {resultA && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Assessment:</span>
                <span className={resultA.risk_level === 'High' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{resultA.risk_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Red Flag Triggers:</span>
                <span className="text-white">{resultA.red_flags ? resultA.red_flags.length : 0} signals</span>
              </div>
            </div>
          )}
        </TiltCard>

        {/* Job B Pane */}
        <TiltCard baseRotation={0.8} className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 font-mono">
            <span className="text-xs font-bold text-indigo-400">CANDIDATE LISTING B</span>
            {resultB && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                resultB.prediction === 'Fake Job' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {resultB.prediction} ({resultB.confidence}%)
              </span>
            )}
          </div>

          <textarea
            value={jobB}
            onChange={(e) => setJobB(e.target.value)}
            placeholder="Paste Job B description..."
            className="w-full h-44 p-3.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none leading-relaxed"
          />

          {resultB && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Assessment:</span>
                <span className={resultB.risk_level === 'High' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{resultB.risk_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Red Flag Triggers:</span>
                <span className="text-white">{resultB.red_flags ? resultB.red_flags.length : 0} signals</span>
              </div>
            </div>
          )}
        </TiltCard>

      </section>

      {/* Modern Scam Taxonomy Library with TiltCards */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Tactical Intelligence</span>
          <RevealText 
            text="Modern Employment Scam Taxonomy"
            as="h2"
            className="text-2xl font-extrabold text-white font-display"
          />
          <p className="text-xs text-slate-400 font-sans">
            Real-world tactical breakdown of dominant recruitment fraud models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCAM_TAXONOMY.map((scam, i) => (
            <TiltCard 
              key={i} 
              baseRotation={scam.rot}
              floatDuration={6 + i * 0.5}
              floatDelay={i * 0.3}
              className="flex flex-col justify-between space-y-4 p-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${scam.color}`}>
                    {scam.badge}
                  </span>
                  <AlertOctagon size={15} className="text-rose-400" />
                </div>

                <h3 className="font-extrabold text-base text-white font-display">
                  {scam.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {scam.summary}
                </p>

                <div className="space-y-1.5 pt-2 font-mono text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Key Indicators:</span>
                  <ul className="space-y-1">
                    {scam.redFlags.map((rf, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <XCircle size={12} className="text-rose-400 mt-0.5 shrink-0" />
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-300 leading-snug">
                <span className="font-mono font-bold text-cyan-400 block mb-0.5">🛡️ PROTOCOL RULE:</span>
                {scam.advice}
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Candidate Pre-Signature Self Defense Protocol */}
      <TiltCard baseRotation={0} enableMouseTilt={false} className="p-6 md:p-8 space-y-4 border-cyan-500/20 bg-gradient-to-b from-[#0e1422] to-[#07090e]">
        <div className="flex items-center gap-2 text-cyan-400">
          <BookmarkCheck size={20} />
          <h3 className="font-extrabold text-lg text-white font-display">
            Job Seeker Self-Defense Protocol
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl font-sans">
          Complete these 4 verification checkpoints before submitting personal identifiers or signing offers:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-white block">1. DNS Domain Match</span>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">Verify that the recruiter's email domain directly matches the company's verified web address.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-white block">2. Live 2-Way Interview</span>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">Refuse offers extended solely via text, Telegram, or questionnaire without two-way live video interviews.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-white block">3. Zero Upfront Costs</span>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">Legitimate employers cover their own equipment, software licenses, and background check expenses.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1">
            <span className="text-xs font-bold text-white block">4. Cross-Reference ID</span>
            <p className="text-[11px] text-slate-400 font-sans leading-tight">Search the company's official "Careers" portal to confirm the exact Job ID exists.</p>
          </div>
        </div>
      </TiltCard>

    </div>
  );
}
