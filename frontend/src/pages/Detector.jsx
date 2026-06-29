import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Copy, Download, Trash2, ShieldAlert, ShieldCheck, Clock, RefreshCw, ClipboardList, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { apiService } from '../services/api';
import { SAMPLE_GENUINE_JOB, SAMPLE_FAKE_JOB } from '../utils/samples';

export default function Detector({ addHistoryItem, history, clearHistory, showToast }) {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: { job_description: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const jobDescription = watch('job_description') || '';
  const charCount = jobDescription.length;
  const maxLimit = 100000;

  const handlePasteSample = (type) => {
    const text = type === 'genuine' ? SAMPLE_GENUINE_JOB : SAMPLE_FAKE_JOB;
    setValue('job_description', text);
    showToast(`Loaded sample ${type} job description.`, 'success');
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
      setValue('job_description', event.target.result);
      showToast('File content loaded successfully.', 'success');
    };
    reader.onerror = () => {
      showToast('Error reading the uploaded file.', 'error');
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    reset();
    setResult(null);
    showToast('Cleared input fields.', 'info');
  };

  const onSubmit = async (data) => {
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
      showToast('Text analysis completed.', 'success');
    } catch (err) {
      showToast(err.message || 'Server error occurred during prediction.', 'error');
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
Verified using Machine Learning & NLP.`;

    navigator.clipboard.writeText(text);
    showToast('Trust report copied to clipboard.', 'success');
  };

  const handleDownload = () => {
    if (!result) return;
    const text = `VERIWORK DETECTOR TRUST REPORT\n` +
      `=============================\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Prediction: ${result.prediction}\n` +
      `Confidence: ${result.confidence}%\n` +
      `Risk Assessment: ${result.risk_level}\n` +
      `Probability Model Vector: Genuine=${(result.probability[0]*100).toFixed(2)}%, Fake=${(result.probability[1]*100).toFixed(2)}%\n` +
      `Inference Latency: ${result.processing_time}\n\n` +
      `JOB ADVERTISEMENT DESCRIPTION:\n` +
      `-----------------------------\n` +
      `${jobDescription}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veriwork_analysis_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Trust file downloaded.', 'success');
  };

  const loadHistoryItem = (item) => {
    // Allows loading a past history item result display state directly
    setResult({
      prediction: item.prediction,
      confidence: item.confidence,
      risk_level: item.risk_level,
      processing_time: item.processing_time,
      probability: item.prediction === 'Fake Job' ? [1 - item.confidence/100, item.confidence/100] : [item.confidence/100, 1 - item.confidence/100]
    });
    showToast('Loaded prediction from history logs.', 'info');
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Detector Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste job listings to execute Natural Language Processing and verify authenticity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Input Card Container */}
        <GlassCard className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Toolbar Buttons */}
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

              {/* Upload & Clear buttons */}
              <div className="flex items-center gap-2">
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

            {/* Input Form area */}
            <div className="relative">
              <textarea
                {...register('job_description')}
                placeholder="Paste the job posting description here (e.g. Roles, Responsibilities, Requirements)..."
                className="w-full h-64 sm:h-80 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-dark-900/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 dark:focus:border-brand-400 transition-all font-sans resize-none leading-relaxed"
                maxLength={maxLimit}
              />
              
              {/* Character Limit Info */}
              <div className={`absolute bottom-3 right-4 text-[10px] font-bold tracking-wider ${charCount >= maxLimit ? 'text-red-500' : 'text-slate-400'}`}>
                {charCount.toLocaleString()} / {maxLimit.toLocaleString()} chars
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !jobDescription.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              id="btn-analyze"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Analyzing Text Features...
                </>
              ) : (
                'Run AI Analysis'
              )}
            </button>

          </form>
        </GlassCard>

        {/* Results Sidebar Display */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Predict Details Card */}
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className={`border-2 ${result.prediction === 'Fake Job' ? 'border-red-500/20 dark:border-red-400/20 bg-red-50/5 dark:bg-red-950/5' : 'border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-50/5 dark:bg-emerald-950/5'}`}>
                  
                  {/* Card Header Alert Badge */}
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

                  {/* Confidence Gauge Component */}
                  <ConfidenceMeter percentage={result.confidence} isFake={result.prediction === 'Fake Job'} />

                  {/* Prediction Statistics */}
                  <div className="space-y-3.5 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                    
                    {/* Risk Badge */}
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

                    {/* Latency */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 dark:text-slate-500 font-bold">Inference Latency</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Clock size={12} />
                        {result.processing_time}
                      </span>
                    </div>

                    {/* Probability Vector details */}
                    {result.probability && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">Probability Vectors</span>
                        <div className="flex gap-2">
                          <div className="flex-1 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200/20 text-center">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Genuine</div>
                            <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{(result.probability[0]*100).toFixed(2)}%</div>
                          </div>
                          <div className="flex-1 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200/20 text-center">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fake</div>
                            <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{(result.probability[1]*100).toFixed(2)}%</div>
                          </div>
                        </div>
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
                      Download Report
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
                {/* Empty State placeholder */}
                <GlassCard className="text-center py-10 flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-slate-800/80">
                  <ShieldCheck size={36} className="text-slate-300 dark:text-slate-700 mb-3" />
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">Awaiting Description Input</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Once you hit "Run AI Analysis", the NLP evaluation engine outputs will map here.
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
