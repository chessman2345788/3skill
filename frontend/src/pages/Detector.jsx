import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Copy, Download, Trash2, ShieldAlert, ShieldCheck, Clock, 
  RefreshCw, ClipboardList, Sparkles, AlertTriangle, CheckCircle2, 
  Building2, Globe, Mail, DollarSign, FileText, Eye, Edit3, Info, ChevronRight
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { apiService } from '../services/api';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';

export default function Detector({ addHistoryItem, history, clearHistory, showToast }) {
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'structured'
  const [viewMode, setViewMode] = useState('input'); // 'input' | 'highlight'
  const [loading, setLoading] = useState(false);
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

  const onSubmitQuick = async (data) => {
    const textTrimmed = data.job_description.trim();
    if (!textTrimmed) {
      showToast('Job description cannot be blank.', 'warning');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await apiService.predictJob(textTrimmed);
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
    }
  };

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
      showToast('Structured company & role audit completed.', 'success');
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
      return <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{text}</p>;
    }

    // Build regex pattern for all phrases
    const escapedPhrases = flags.map(f => f.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
    if (escapedPhrases.length === 0) return <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{text}</p>;

    const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <div className="whitespace-pre-wrap leading-relaxed text-sm text-slate-700 dark:text-slate-300">
        {parts.map((part, i) => {
          const matchFlag = flags.find(f => f.phrase.toLowerCase() === part.toLowerCase());
          if (matchFlag) {
            const isHigh = matchFlag.severity === 'High';
            return (
              <span
                key={i}
                className={`inline-block px-1.5 py-0.5 mx-0.5 rounded font-bold transition-transform hover:scale-105 cursor-help ${
                  isHigh 
                    ? 'bg-red-500/20 text-red-700 dark:text-red-300 border-b-2 border-red-500' 
                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-b-2 border-amber-500'
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
    <div className="space-y-10 py-6">
      
      {/* Page Header with Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Detector & Explainability Suite
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Natural Language Processing, in-text red flag detection, and domain verification.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 backdrop-blur-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('quick'); setResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quick'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            Quick Text Scan
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('structured'); setResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'structured'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 size={14} />
            Structured Company Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Input Form & Visualizer */}
        <GlassCard className="lg:col-span-2 space-y-6">
          
          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handlePasteSample('genuine')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 transition-colors"
              >
                <Sparkles size={12} />
                Paste Genuine Job
              </button>
              <button
                type="button"
                onClick={() => handlePasteSample('fake')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/10 transition-colors"
              >
                <Sparkles size={12} />
                Paste Fake Job
              </button>
            </div>

            <div className="flex items-center gap-2">
              {result && result.red_flags && result.red_flags.length > 0 && (
                <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => setViewMode('input')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      viewMode === 'input'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('highlight')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      viewMode === 'highlight'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Eye size={12} />
                    XAI Highlights ({result.red_flags.length})
                  </button>
                </div>
              )}

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-colors">
                <Upload size={12} />
                Upload TXT
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          </div>

          {/* Quick Scan Mode Form */}
          {activeTab === 'quick' ? (
            <form onSubmit={handleSubmitQuick(onSubmitQuick)} className="space-y-4">
              {viewMode === 'highlight' && result && result.red_flags ? (
                <div className="w-full h-64 sm:h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-dark-900/40 overflow-y-auto">
                  {renderHighlightedText(jobDescriptionQuick, result.red_flags)}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    {...registerQuick('job_description')}
                    placeholder="Paste the job posting description here (e.g. Roles, Responsibilities, Requirements)..."
                    className="w-full h-64 sm:h-80 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 dark:focus:border-brand-400 transition-all font-sans resize-none leading-relaxed text-slate-800 dark:text-slate-100"
                    maxLength={maxLimit}
                  />
                  <div className={`absolute bottom-3 right-4 text-[10px] font-bold tracking-wider ${charCount >= maxLimit ? 'text-red-500' : 'text-slate-400'}`}>
                    {charCount.toLocaleString()} / {maxLimit.toLocaleString()} chars
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !jobDescriptionQuick.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                id="btn-analyze"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Analyzing Text & Explainability Signals...
                  </>
                ) : (
                  'Run AI Text & XAI Analysis'
                )}
              </button>
            </form>
          ) : (
            /* Structured Company Audit Form */
            <form onSubmit={handleSubmitStruct(onSubmitStructured)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <FileText size={13} className="text-brand-500" />
                    Job Title
                  </label>
                  <input
                    {...registerStruct('title')}
                    type="text"
                    placeholder="e.g. Senior Data Analyst"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/25 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <Building2 size={13} className="text-brand-500" />
                    Company Name
                  </label>
                  <input
                    {...registerStruct('company')}
                    type="text"
                    placeholder="e.g. Microsoft Corporation"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/25 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <Globe size={13} className="text-brand-500" />
                    Company Official Website
                  </label>
                  <input
                    {...registerStruct('website')}
                    type="text"
                    placeholder="e.g. https://microsoft.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/25 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <Mail size={13} className="text-brand-500" />
                    Recruiter Email Address
                  </label>
                  <input
                    {...registerStruct('recruiter_email')}
                    type="text"
                    placeholder="e.g. recruiter@microsoft.com or gmail"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/25 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <DollarSign size={13} className="text-brand-500" />
                    Offered Salary / Compensation
                  </label>
                  <input
                    {...registerStruct('salary')}
                    type="text"
                    placeholder="e.g. $4,500/week or $120,000/yr"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/25 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <FileText size={13} className="text-brand-500" />
                  Full Job Description Body *
                </label>
                <div className="relative">
                  <textarea
                    {...registerStruct('job_description')}
                    placeholder="Paste the job description details, qualifications, and benefits..."
                    className="w-full h-44 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 text-slate-800 dark:text-slate-100 resize-none leading-relaxed"
                    maxLength={maxLimit}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !jobDescriptionStruct.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Executing Structured Entity & Domain Audit...
                  </>
                ) : (
                  'Run Complete Structured Job Audit'
                )}
              </button>
            </form>
          )}

          {/* Explainable Signals & Red Flags Section if Result is available */}
          {result && result.red_flags && result.red_flags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-slate-200/50 dark:border-slate-800/50 pt-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-500" size={18} />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Explainable AI Signals ({result.red_flags.length} Red Flags Detected)
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Click highlights above to inspect</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.red_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/20 space-y-1.5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-400">
                        {flag.category}
                      </span>
                      <span className="text-[10px] font-extrabold text-red-500 uppercase">
                        {flag.severity} Risk
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      "{flag.phrase}"
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contributing Keywords Impact */}
              {result.contributing_keywords && result.contributing_keywords.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    High-Weight NLP Trigger Words:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.contributing_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                          kw.impact === 'fake'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
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

          {/* Structured Domain Findings if available */}
          {result && result.structured_findings && result.structured_findings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-slate-200/50 dark:border-slate-800/50 pt-6 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Building2 className="text-brand-500" size={18} />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Company & Recruiter Verification Findings
                </h4>
              </div>
              <div className="space-y-2">
                {result.structured_findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-start gap-3"
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 ${f.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      <Info size={16} />
                    </div>
                    <div className="space-y-0.5 text-left flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.field}</span>
                        <span className={`text-[10px] font-black uppercase ${f.severity === 'High' ? 'text-red-500' : 'text-amber-500'}`}>{f.severity}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{f.issue}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">💡 {f.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trust Markers if Genuine */}
          {result && result.trust_markers && result.trust_markers.length > 0 && (
            <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} /> Trust Markers Found:
              </span>
              {result.trust_markers.map((tm, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {tm}
                </span>
              ))}
            </div>
          )}

        </GlassCard>

        {/* Right Column: Results & History Sidebar */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className={`border-2 ${result.prediction === 'Fake Job' ? 'border-red-500/20 dark:border-red-400/20 bg-red-50/5 dark:bg-red-950/5' : 'border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-50/5 dark:bg-emerald-950/5'}`}>
                  
                  {/* Header Badge */}
                  <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                    {result.prediction === 'Fake Job' ? (
                      <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
                        <ShieldAlert size={20} />
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <ShieldCheck size={20} />
                      </div>
                    )}
                    <div>
                      <h3 className={`text-lg font-black ${result.prediction === 'Fake Job' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {result.prediction}
                      </h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                        Verification Output
                      </p>
                    </div>
                  </div>

                  {/* Confidence Meter */}
                  <ConfidenceMeter percentage={result.confidence} isFake={result.prediction === 'Fake Job'} />

                  {/* Prediction Statistics */}
                  <div className="space-y-3.5 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500 font-bold">Risk Assessment</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase ${
                        result.risk_level === 'High' 
                          ? 'bg-red-500/10 text-red-500'
                          : result.risk_level === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {result.risk_level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500 font-bold">Inference Latency</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Clock size={12} />
                        {result.processing_time}
                      </span>
                    </div>

                    {result.red_flags && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 dark:text-slate-500 font-bold">Scam Signals</span>
                        <span className="font-bold text-red-500 text-xs">
                          {result.red_flags.length} Flagged Snippets
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions copy/download */}
                  <div className="flex flex-col sm:flex-row gap-2.5 mt-5 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                    <button
                      onClick={handleCopy}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 transition-colors"
                      type="button"
                    >
                      <Copy size={13} />
                      Copy Report
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 transition-colors"
                      type="button"
                    >
                      <Download size={13} />
                      Download Audit
                    </button>
                  </div>

                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard className="text-center py-10 flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-slate-800/80">
                  <ShieldCheck size={36} className="text-slate-300 dark:text-slate-700 mb-3" />
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">Awaiting Input Scan</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Paste a job description or provide company details to trigger ML + XAI verification.
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Panel */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900 dark:text-white">
                <ClipboardList size={16} className="text-brand-500" />
                Recent Queries
              </div>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer transition-all duration-200 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {item.snippet}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.timestamp} &bull; Latency: {item.processing_time}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      item.prediction === 'Fake Job'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {item.prediction === 'Fake Job' ? 'Fake' : 'Genuine'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
                No recent predictions logged.
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
