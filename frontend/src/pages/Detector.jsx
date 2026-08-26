import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Copy, Download, Trash2, ShieldAlert, ShieldCheck, Clock, 
  RefreshCw, ClipboardList, Sparkles, AlertTriangle, CheckCircle2, 
  Building2, Globe, Mail, DollarSign, FileText, Eye, Edit3, Info, 
  ChevronRight, Terminal, Activity, ArrowRight, Zap, Play
} from 'lucide-react';
import TiltCard from '../components/motion/TiltCard';
import MagneticButton from '../components/motion/MagneticButton';
import AnimatedNumber from '../components/motion/AnimatedNumber';
import RevealText from '../components/motion/RevealText';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { apiService } from '../services/api';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';

export default function Detector({ addHistoryItem, history, clearHistory, showToast }) {
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'structured'
  const [viewMode, setViewMode] = useState('input'); // 'input' | 'highlight'
  const [loading, setLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [result, setResult] = useState(null);

  // Quick form
  const { register: registerQuick, handleSubmit: handleSubmitQuick, setValue: setValueQuick, watch: watchQuick, reset: resetQuick } = useForm({
    defaultValues: { job_description: '' }
  });

  // Structured form
  const { register: registerStruct, handleSubmit: handleSubmitStruct, setValue: setValueStruct, watch: watchStruct, reset: resetStruct } = useForm({
    defaultValues: {
      title: '',
      company: '',
      website: '',
      recruiter_email: '',
      salary: '',
      job_description: ''
    }
  });

  const jobDescriptionQuick = watchQuick('job_description') || '';
  const jobDescriptionStruct = watchStruct('job_description') || '';
  const currentJobText = activeTab === 'quick' ? jobDescriptionQuick : jobDescriptionStruct;
  const charCount = currentJobText.length;
  const maxLimit = 100000;

  const handlePasteSample = (type) => {
    const text = type === 'genuine' ? SAMPLE_GENUINE_JOB : SAMPLE_FAKE_JOB;
    if (activeTab === 'quick') {
      setValueQuick('job_description', text);
    } else {
      setValueStruct('job_description', text);
      if (type === 'fake') {
        setValueStruct('title', 'Data Entry Assistant');
        setValueStruct('company', 'Global Express Logistics');
        setValueStruct('website', 'globalexpress.com');
        setValueStruct('recruiter_email', 'hr.globalrecruitment2025@gmail.com');
        setValueStruct('salary', '$5,000 / week');
      } else {
        setValueStruct('title', 'Senior Frontend Engineer');
        setValueStruct('company', 'Global Tech Solutions');
        setValueStruct('website', 'https://globaltechsolutions.io');
        setValueStruct('recruiter_email', 'careers@globaltechsolutions.io');
        setValueStruct('salary', '$145,000 - $165,000 / year');
      }
    }
    showToast(`Loaded sample ${type} job listing.`, 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      showToast('Please upload a plain text (.txt) file.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (activeTab === 'quick') {
        setValueQuick('job_description', event.target.result);
      } else {
        setValueStruct('job_description', event.target.result);
      }
      showToast('File content loaded successfully.', 'success');
    };
    reader.onerror = () => {
      showToast('Error reading the uploaded file.', 'error');
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (activeTab === 'quick') {
      resetQuick();
    } else {
      resetStruct();
    }
    setResult(null);
    setViewMode('input');
    showToast('Cleared input fields.', 'info');
  };

  // Run quick scan with simulated pipeline telemetry stages
  const onSubmitQuick = async (data) => {
    const textTrimmed = data.job_description.trim();
    if (!textTrimmed) {
      showToast('Job description cannot be blank.', 'warning');
      return;
    }

    setLoading(true);
    setResult(null);
    setAnalysisStage(1);

    const s1 = setTimeout(() => setAnalysisStage(2), 220);
    const s2 = setTimeout(() => setAnalysisStage(3), 480);

    try {
      const res = await apiService.predictJob(textTrimmed);
      clearTimeout(s1);
      clearTimeout(s2);
      setAnalysisStage(4);
      setResult(res);
      addHistoryItem({
        snippet: textTrimmed.length > 55 ? textTrimmed.substring(0, 55) + '...' : textTrimmed,
        prediction: res.prediction,
        confidence: res.confidence,
        risk_level: res.risk_level,
        processing_time: res.processing_time
      });
      showToast('AI analysis completed with Explainability signals.', 'success');
    } catch (err) {
      showToast(err.message || 'Server error occurred during prediction.', 'error');
    } finally {
      setLoading(false);
      setAnalysisStage(0);
    }
  };

  // Run structured scan
  const onSubmitStructured = async (data) => {
    const textTrimmed = data.job_description.trim();
    if (!textTrimmed) {
      showToast('Job description cannot be blank.', 'warning');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await apiService.predictStructuredJob(data);
      setResult(res);
      addHistoryItem({
        snippet: `${data.company ? data.company + ': ' : ''}${data.title || textTrimmed.substring(0, 45)}...`,
        prediction: res.prediction,
        confidence: res.confidence,
        risk_level: res.risk_level,
        processing_time: res.processing_time
      });
      showToast('Structured entity audit completed.', 'success');
    } catch (err) {
      showToast(err.message || 'Server error occurred during audit.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `VeriWork Job Verification Report:
----------------------------------------
Prediction: ${result.prediction}
Confidence: ${result.confidence}%
Risk Assessment: ${result.risk_level}
Process Time: ${result.processing_time}
Flags Detected: ${result.red_flags ? result.red_flags.length : 0}
Verified using Machine Learning & Explainable AI.`;

    navigator.clipboard.writeText(text);
    showToast('Trust report copied to clipboard.', 'success');
  };

  const handleDownload = () => {
    if (!result) return;
    let redFlagsText = 'None detected.';
    if (result.red_flags && result.red_flags.length > 0) {
      redFlagsText = result.red_flags.map((f, i) => `  ${i+1}. [${f.category}] "${f.phrase}" (${f.severity} Risk) - ${f.explanation}`).join('\n');
    }

    let structuredText = '';
    if (result.structured_findings && result.structured_findings.length > 0) {
      structuredText = `\nSTRUCTURED AUDIT FINDINGS:\n` + result.structured_findings.map((f, i) => `  ${i+1}. [${f.field}] ${f.issue} (Rec: ${f.recommendation})`).join('\n');
    }

    const text = `VERIWORK DETECTOR TRUST REPORT\n` +
      `=============================\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Prediction: ${result.prediction}\n` +
      `Confidence: ${result.confidence}%\n` +
      `Risk Assessment: ${result.risk_level}\n` +
      `Inference Latency: ${result.processing_time}\n\n` +
      `EXPLAINABLE AI SIGNALS:\n` +
      `-----------------------------\n` +
      `${redFlagsText}\n` +
      `${structuredText}\n\n` +
      `JOB ADVERTISEMENT DESCRIPTION:\n` +
      `-----------------------------\n` +
      `${currentJobText}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veriwork_audit_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Detailed audit report downloaded.', 'success');
  };

  const loadHistoryItem = (item) => {
    setResult({
      prediction: item.prediction,
      confidence: item.confidence,
      risk_level: item.risk_level,
      processing_time: item.processing_time,
      probability: item.prediction === 'Fake Job' ? [1 - item.confidence/100, item.confidence/100] : [item.confidence/100, 1 - item.confidence/100],
      red_flags: []
    });
    showToast('Loaded prediction from history logs.', 'info');
  };

  // Render Highlighted Text with Red Flags
  const renderHighlightedText = (text, flags) => {
    if (!flags || flags.length === 0) {
      return <p className="whitespace-pre-wrap text-slate-300 font-mono text-xs leading-relaxed">{text}</p>;
    }

    const escapedPhrases = flags.map(f => f.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
    if (escapedPhrases.length === 0) return <p className="whitespace-pre-wrap text-slate-300 font-mono text-xs leading-relaxed">{text}</p>;

    const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <div className="whitespace-pre-wrap leading-relaxed text-xs font-mono text-slate-300">
        {parts.map((part, i) => {
          const matchFlag = flags.find(f => f.phrase.toLowerCase() === part.toLowerCase());
          if (matchFlag) {
            const isHigh = matchFlag.severity === 'High';
            return (
              <span
                key={i}
                className={`inline-block px-1.5 py-0.5 mx-0.5 rounded font-bold transition-transform hover:scale-105 cursor-help ${
                  isHigh 
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40' 
                    : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                }`}
                title={`[${matchFlag.category}] ${matchFlag.explanation}`}
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 py-4 sm:py-6">
      
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
            <Terminal size={13} />
            <span>NEURAL AUDIT ENGINE // V2.4</span>
          </div>
          <RevealText
            text="Job Authenticity Detector"
            as="h1"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display"
          />
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Natural language processing, explainable n-gram attribution, and recruiter DNS inspection.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('quick'); setResult(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'quick'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>Quick Text Stream</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('structured'); setResult(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'structured'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={13} />
            <span>Enterprise Entity Audit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* Left Form / Visualizer Column */}
        <TiltCard 
          baseRotation={0} 
          enableMouseTilt={false}
          className="lg:col-span-2 space-y-5 p-5 sm:p-7"
        >
          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <MagneticButton
                size="sm"
                variant="secondary"
                onClick={() => handlePasteSample('genuine')}
                className="text-emerald-400 border-emerald-500/20"
              >
                <Sparkles size={12} />
                <span>Paste Genuine Sample</span>
              </MagneticButton>

              <MagneticButton
                size="sm"
                variant="danger"
                onClick={() => handlePasteSample('fake')}
              >
                <Sparkles size={12} />
                <span>Paste Wire Scam Sample</span>
              </MagneticButton>
            </div>

            <div className="flex items-center gap-2">
              {result && result.red_flags && result.red_flags.length > 0 && (
                <div className="inline-flex p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setViewMode('input')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                      viewMode === 'input'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 size={11} />
                    <span>Raw Input</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('highlight')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                      viewMode === 'highlight'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye size={11} />
                    <span>XAI Highlights ({result.red_flags.length})</span>
                  </button>
                </div>
              )}

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 cursor-pointer transition-all">
                <Upload size={12} />
                <span>Upload TXT</span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear All Inputs"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Quick Scan Form */}
          {activeTab === 'quick' ? (
            <form onSubmit={handleSubmitQuick(onSubmitQuick)} className="space-y-4">
              {viewMode === 'highlight' && result && result.red_flags ? (
                <div className="w-full h-64 sm:h-80 p-4 rounded-xl border border-white/[0.08] bg-black/40 overflow-y-auto">
                  {renderHighlightedText(jobDescriptionQuick, result.red_flags)}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    {...registerQuick('job_description')}
                    placeholder="Paste the job posting description here (e.g. Roles, Responsibilities, Requirements)..."
                    className="w-full h-64 sm:h-80 p-4 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 resize-none leading-relaxed transition-all"
                    maxLength={maxLimit}
                  />
                  <div className={`absolute bottom-3 right-4 text-[10px] font-mono font-bold tracking-wider ${charCount >= maxLimit ? 'text-rose-400' : 'text-slate-500'}`}>
                    {charCount.toLocaleString()} / {maxLimit.toLocaleString()} CHARS
                  </div>
                </div>
              )}

              {/* Analysis Pipeline Progress Ticker if loading */}
              {loading && (
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300">
                    <span className="flex items-center gap-2">
                      <Activity size={14} className="animate-spin" />
                      <span>ANALYZING TEXT VECTOR STREAM</span>
                    </span>
                    <span>STAGE {analysisStage}/4</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${analysisStage * 25}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <MagneticButton
                type="submit"
                disabled={loading || !jobDescriptionQuick.trim()}
                className="w-full"
                id="btn-analyze"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Executing Bayesian Vector Analysis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Run Neural & Explainability Scan</span>
                  </>
                )}
              </MagneticButton>
            </form>
          ) : (
            /* Structured Company Audit Form */
            <form onSubmit={handleSubmitStruct(onSubmitStructured)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mb-1">
                    <FileText size={12} className="text-cyan-400" />
                    <span>Job Title</span>
                  </label>
                  <input
                    {...registerStruct('title')}
                    type="text"
                    placeholder="e.g. Senior Data Analyst"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mb-1">
                    <Building2 size={12} className="text-cyan-400" />
                    <span>Company Entity</span>
                  </label>
                  <input
                    {...registerStruct('company')}
                    type="text"
                    placeholder="e.g. Microsoft Corporation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mb-1">
                    <Globe size={12} className="text-cyan-400" />
                    <span>Official Domain URL</span>
                  </label>
                  <input
                    {...registerStruct('website')}
                    type="text"
                    placeholder="e.g. https://microsoft.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mb-1">
                    <Mail size={12} className="text-cyan-400" />
                    <span>Recruiter Contact Email</span>
                  </label>
                  <input
                    {...registerStruct('recruiter_email')}
                    type="text"
                    placeholder="e.g. recruiter@microsoft.com or gmail"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mb-1">
                    <DollarSign size={12} className="text-cyan-400" />
                    <span>Stated Compensation / Hourly</span>
                  </label>
                  <input
                    {...registerStruct('salary')}
                    type="text"
                    placeholder="e.g. $4,500/week or $120,000/yr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 mb-1">
                  <FileText size={12} className="text-cyan-400" />
                  <span>Job Posting Description Text *</span>
                </label>
                <textarea
                  {...registerStruct('job_description')}
                  placeholder="Paste the complete job description details, qualifications, and role requirements..."
                  className="w-full h-44 p-3.5 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none leading-relaxed"
                  maxLength={maxLimit}
                />
              </div>

              <MagneticButton
                type="submit"
                disabled={loading || !jobDescriptionStruct.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Executing Recruiter DNS & Salary Audit...</span>
                  </>
                ) : (
                  <>
                    <Building2 size={14} />
                    <span>Run Complete Structured Entity Audit</span>
                  </>
                )}
              </MagneticButton>
            </form>
          )}

          {/* Explainable Signals & Red Flags Section */}
          {result && result.red_flags && result.red_flags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-white/[0.08] pt-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                  <AlertTriangle size={15} />
                  <span>EXPLAINABLE THREAT ATTRIBUTIONS ({result.red_flags.length} TRIGGERS)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Click highlights to inspect</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.red_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-rose-500/[0.06] border border-rose-500/25 space-y-1.5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300">
                        {flag.category}
                      </span>
                      <span className="text-[10px] font-mono font-extrabold text-rose-400 uppercase">
                        {flag.severity} RISK
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-white">
                      "{flag.phrase}"
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* High-Weight Trigger Tokens */}
              {result.contributing_keywords && result.contributing_keywords.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    High-Weight NLP Trigger Tokens:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.contributing_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold ${
                          kw.impact === 'fake'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {kw.term} ({kw.score > 0 ? `+${kw.score}` : kw.score})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Structured Domain Findings */}
          {result && result.structured_findings && result.structured_findings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-white/[0.08] pt-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                <Building2 size={15} />
                <span>RECRUITER DOMAIN & ENTITY FINDINGS</span>
              </div>
              <div className="space-y-2">
                {result.structured_findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3"
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 ${f.severity === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      <Info size={15} />
                    </div>
                    <div className="space-y-0.5 text-left flex-1 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{f.field}</span>
                        <span className={`text-[10px] font-extrabold uppercase ${f.severity === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>{f.severity}</span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs">{f.issue}</p>
                      <p className="text-[11px] text-slate-400 italic">💡 {f.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </TiltCard>

        {/* Right Telemetry & History Column */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard 
                  baseRotation={0}
                  className={`p-6 space-y-4 border ${
                    result.prediction === 'Fake Job'
                      ? 'border-rose-500/30 bg-gradient-to-b from-rose-500/10 to-[#0b0f17]'
                      : 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-[#0b0f17]'
                  }`}
                >
                  
                  {/* Verdict Badge */}
                  <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                    <div className={`p-2.5 rounded-xl ${result.prediction === 'Fake Job' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}>
                      {result.prediction === 'Fake Job' ? <ShieldAlert size={22} /> : <ShieldCheck size={22} />}
                    </div>
                    <div>
                      <h3 className={`text-xl font-mono font-black ${result.prediction === 'Fake Job' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {result.prediction}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        VERDICT ASSESSMENT
                      </p>
                    </div>
                  </div>

                  {/* Concentric HUD Confidence Meter */}
                  <ConfidenceMeter percentage={result.confidence} isFake={result.prediction === 'Fake Job'} />

                  {/* Telemetry Metrics */}
                  <div className="space-y-3 border-t border-white/[0.08] pt-4 font-mono text-xs">
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Risk Assessment:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        result.risk_level === 'High' 
                          ? 'bg-rose-500/15 text-rose-400' 
                          : result.risk_level === 'Medium' 
                          ? 'bg-amber-500/15 text-amber-400' 
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}>
                        {result.risk_level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inference Latency:</span>
                      <span className="text-slate-200 font-bold">{result.processing_time}</span>
                    </div>

                    {result.red_flags && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Scam Vector Flags:</span>
                        <span className="text-rose-400 font-bold">{result.red_flags.length} Triggers</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-white/[0.08]">
                    <MagneticButton
                      size="sm"
                      variant="secondary"
                      onClick={handleCopy}
                      className="flex-1"
                    >
                      <Copy size={13} />
                      <span>Copy</span>
                    </MagneticButton>

                    <MagneticButton
                      size="sm"
                      variant="secondary"
                      onClick={handleDownload}
                      className="flex-1"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </MagneticButton>
                  </div>

                </TiltCard>
              </motion.div>
            ) : (
              <TiltCard 
                baseRotation={0}
                className="text-center py-12 flex flex-col items-center justify-center border-dashed border border-white/[0.08]"
              >
                <ShieldCheck size={36} className="text-slate-600 mb-3" />
                <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider">Awaiting Vector Stream</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                  Submit a job description to trigger real-time ML + XAI verification.
                </p>
              </TiltCard>
            )}
          </AnimatePresence>

          {/* History Panel */}
          <TiltCard baseRotation={0} className="space-y-3 p-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ClipboardList size={14} className="text-cyan-400" />
                Audit Logs
              </span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[10px] font-bold text-slate-500 hover:text-rose-400 uppercase transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-cyan-500/30 text-left cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-300 truncate">
                        {item.snippet}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {item.timestamp} &bull; {item.processing_time}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      item.prediction === 'Fake Job' ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {item.prediction === 'Fake Job' ? 'Fake' : 'Genuine'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 font-mono">
                No recent predictions logged.
              </div>
            )}
          </TiltCard>
        </div>

      </div>
    </div>
  );
}
