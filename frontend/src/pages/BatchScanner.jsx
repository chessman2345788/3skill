import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, Upload, Download, RefreshCw, AlertTriangle, 
  ShieldCheck, ShieldAlert, Search, Sparkles, CheckCircle2, 
  ChevronDown, ChevronUp, Layers, Terminal, ArrowRight
} from 'lucide-react';
import TiltCard from '../components/motion/TiltCard';
import MagneticButton from '../components/motion/MagneticButton';
import AnimatedNumber from '../components/motion/AnimatedNumber';
import RevealText from '../components/motion/RevealText';
import { apiService } from '../services/api';

const SAMPLE_BATCH = [
  { id: 1, title: 'Senior Backend Engineer (FastAPI)', company: 'Apex Cloud Systems', description: 'Seeking a Senior Backend Engineer with 4+ years in Python, FastAPI, and PostgreSQL. Benefits include 401(k), health insurance, flexible remote work.' },
  { id: 2, title: 'Cash Assistant / Money Handler', company: 'QuickPay Services', description: 'Urgent hiring! Work from home. Earn $5000 a week processing wire transfers from your personal bank account. No experience needed. Immediate start!' },
  { id: 3, title: 'Product Marketing Manager', company: 'Stripe Partners', description: 'Lead global product marketing initiatives for B2B fintech solutions. Requires Bachelor degree and 5 years SaaS marketing background.' },
  { id: 4, title: 'Online Package Inspector', company: 'Global Logistics Net', description: 'Package handler needed urgently. Receive boxes at your home, check items, and re-ship them. Massive weekly income paid daily in Bitcoin or CashApp.' },
  { id: 5, title: 'Data Entry Clerk', company: 'Unclaimed Asset Dept', description: 'Earn fast cash working 1-2 hours a day. No interview required, immediate start. Guaranteed placement and sign-on bonus.' },
  { id: 6, title: 'Frontend React 19 Developer', company: 'Innovate UI Labs', description: 'Build glassmorphic web dashboards using React 19 and Tailwind CSS. Full-time position with dental, medical, and paid time off.' }
];

export default function BatchScanner({ showToast }) {
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleLoadSampleBatch = () => {
    runBatchAnalysis(SAMPLE_BATCH);
    showToast('Loaded and evaluated sample 6-job dataset.', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        let parsedJobs = [];

        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          parsedJobs = Array.isArray(json) ? json : json.jobs || [];
        } else {
          // CSV Parser
          const lines = text.split(/\r?\n/).filter(line => line.trim());
          if (lines.length <= 1) {
            showToast('CSV must contain a header and at least one row.', 'warning');
            return;
          }
          
          const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
          const descIndex = header.findIndex(h => h.includes('desc') || h.includes('job') || h.includes('text') || h.includes('content'));
          const titleIndex = header.findIndex(h => h.includes('title') || h.includes('role') || h.includes('position'));
          const companyIndex = header.findIndex(h => h.includes('company') || h.includes('org'));

          for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row.length > 0) {
              parsedJobs.push({
                id: i,
                title: titleIndex >= 0 ? row[titleIndex]?.replace(/['"]/g, '') : `Job #${i}`,
                company: companyIndex >= 0 ? row[companyIndex]?.replace(/['"]/g, '') : 'N/A',
                description: descIndex >= 0 ? row.slice(descIndex).join(',').replace(/['"]/g, '') : row.join(' ')
              });
            }
          }
        }

        if (parsedJobs.length === 0) {
          showToast('Could not find valid job listings in the uploaded file.', 'error');
          return;
        }

        runBatchAnalysis(parsedJobs);
        showToast(`Imported ${parsedJobs.length} jobs. Executing batch analysis...`, 'info');
      } catch (err) {
        showToast('Failed to parse file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const runBatchAnalysis = async (jobsList) => {
    setLoading(true);
    setExpandedRow(null);

    try {
      const res = await apiService.predictBatchJobs(jobsList);
      setBatchData(res.results);
      setSummary(res.summary);
      showToast(`Batch processing completed for ${res.total_jobs} postings.`, 'success');
    } catch (err) {
      showToast(err.message || 'Error occurred during batch prediction.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (batchData.length === 0) return;

    const headers = ['ID', 'Job Title', 'Company', 'Prediction', 'Confidence (%)', 'Risk Level', 'Flag Count', 'Latency'];
    const rows = batchData.map(j => [
      j.id,
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      j.prediction,
      j.confidence,
      j.risk_level,
      j.flag_count,
      j.processing_time
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veriwork_batch_audit_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Batch CSV audit report downloaded.', 'success');
  };

  // Filtered dataset
  const filteredJobs = batchData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterRisk === 'FAKE') return job.prediction === 'Fake Job';
    if (filterRisk === 'GENUINE') return job.prediction === 'Genuine Job';
    if (filterRisk === 'HIGH') return job.risk_level === 'High';
    return true;
  });

  return (
    <div className="space-y-8 py-4 sm:py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
            <Layers size={13} />
            <span>BULK AUDIT TERMINAL</span>
          </div>
          <RevealText
            text="Bulk Batch Job Scanner"
            as="h1"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display"
          />
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Parallel AI threat vector evaluation for campus recruitment, placement cells, and job portals.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <MagneticButton
            size="sm"
            variant="secondary"
            onClick={handleLoadSampleBatch}
            disabled={loading}
            className="text-cyan-300 border-cyan-500/30"
          >
            <Sparkles size={13} />
            <span>Load Sample 6-Job Batch</span>
          </MagneticButton>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white cursor-pointer transition-all">
            <Upload size={13} />
            <span>Upload CSV / JSON</span>
            <input
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {batchData.length > 0 && (
            <MagneticButton
              size="sm"
              variant="primary"
              onClick={handleExportCSV}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400/30 shadow-emerald-500/20"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </MagneticButton>
          )}
        </div>
      </div>

      {/* Summary KPI Cards with AnimatedNumber */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <TiltCard baseRotation={-0.5} floatDuration={6} className="p-4 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Total Evaluated</span>
            <AnimatedNumber value={batchData.length} className="text-2xl sm:text-3xl font-mono font-black text-white" />
            <span className="text-[11px] text-slate-500 block">Postings processed</span>
          </TiltCard>

          <TiltCard baseRotation={0.5} floatDuration={7} className="p-4 space-y-1 border-rose-500/30 bg-rose-500/5">
            <span className="text-[10px] font-mono font-bold uppercase text-rose-400">Fraud Ratio</span>
            <AnimatedNumber value={summary.fake_percentage} decimals={1} suffix="%" className="text-2xl sm:text-3xl font-mono font-black text-rose-400" />
            <span className="text-[11px] text-rose-400/80 block">{summary.fake_count} deceptive listings</span>
          </TiltCard>

          <TiltCard baseRotation={-0.5} floatDuration={6.5} className="p-4 space-y-1 border-emerald-500/30 bg-emerald-500/5">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Genuine Ratio</span>
            <AnimatedNumber 
              value={((summary.genuine_count / batchData.length) * 100)} 
              decimals={1} 
              suffix="%" 
              className="text-2xl sm:text-3xl font-mono font-black text-emerald-400" 
            />
            <span className="text-[11px] text-emerald-400/80 block">{summary.genuine_count} verified authentic</span>
          </TiltCard>

          <TiltCard baseRotation={0.5} floatDuration={7.5} className="p-4 space-y-1 border-amber-500/30 bg-amber-500/5">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-400">Critical Alerts</span>
            <AnimatedNumber value={summary.high_risk_count} className="text-2xl sm:text-3xl font-mono font-black text-amber-400" />
            <span className="text-[11px] text-amber-400/80 block">High severity score</span>
          </TiltCard>
        </motion.div>
      )}

      {/* Main Table Interface */}
      {loading ? (
        <TiltCard baseRotation={0} enableMouseTilt={false} className="text-center py-20 space-y-4">
          <RefreshCw size={36} className="animate-spin text-cyan-400 mx-auto" />
          <div className="space-y-1 font-mono">
            <h3 className="text-base font-bold text-white">EXECUTING BATCH VECTOR INFERENCE...</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
              Parallel evaluation of n-gram weights and semantic risk triggers.
            </p>
          </div>
        </TiltCard>
      ) : batchData.length > 0 ? (
        <TiltCard baseRotation={0} enableMouseTilt={false} className="space-y-4 p-5 sm:p-6">
          
          {/* Table Header Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or company entity..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/[0.08] bg-black/35 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono text-[11px]">
              <button
                onClick={() => setFilterRisk('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterRisk === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                ALL ({batchData.length})
              </button>
              <button
                onClick={() => setFilterRisk('FAKE')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterRisk === 'FAKE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                FAKE ({summary?.fake_count || 0})
              </button>
              <button
                onClick={() => setFilterRisk('HIGH')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterRisk === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                HIGH RISK ({summary?.high_risk_count || 0})
              </button>
              <button
                onClick={() => setFilterRisk('GENUINE')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterRisk === 'GENUINE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                GENUINE ({summary?.genuine_count || 0})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-3">#</th>
                  <th className="pb-3 px-3">Job Title</th>
                  <th className="pb-3 px-3">Company</th>
                  <th className="pb-3 px-3">Prediction</th>
                  <th className="pb-3 px-3">Confidence</th>
                  <th className="pb-3 px-3">Risk Level</th>
                  <th className="pb-3 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredJobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <tr 
                      onClick={() => setExpandedRow(expandedRow === job.id ? null : job.id)}
                      className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 text-slate-500">{job.id}</td>
                      <td className="py-3 px-3 font-bold text-white">{job.title}</td>
                      <td className="py-3 px-3 text-slate-300">{job.company}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          job.prediction === 'Fake Job'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {job.prediction === 'Fake Job' ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
                          {job.prediction}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-200">{job.confidence}%</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          job.risk_level === 'High' ? 'bg-rose-500/15 text-rose-400' : job.risk_level === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                        }`}>
                          {job.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500">
                        {expandedRow === job.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </td>
                    </tr>

                    {/* Expanded Row Detail */}
                    {expandedRow === job.id && (
                      <tr className="bg-black/40">
                        <td colSpan={7} className="p-4">
                          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 font-sans">
                            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                              <span>Latency: {job.processing_time}</span>
                              <span>Red Flag Tokens: {job.flag_count} matched</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {job.prediction === 'Fake Job' 
                                ? '⚠️ Threat Assessment: Elevated risk profile detected. Language features exhibit atypical compensation models, urgent placement tactics, or payment redirection.' 
                                : '✅ Verification Pass: The linguistic profile aligns with legitimate corporate recruitment conventions, structured duties, and standard benefit packages.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </TiltCard>
      ) : (
        /* Empty Dropzone Card */
        <TiltCard 
          baseRotation={0}
          enableMouseTilt={false}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processFile(e.dataTransfer.files[0]);
            }
          }}
          className={`text-center py-16 space-y-4 border-dashed border-2 transition-all ${
            isDragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/[0.1]'
          }`}
        >
          <FileSpreadsheet size={44} className="text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-white font-display">No Dataset Uploaded</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
              Drag and drop a .CSV, .JSON file here, or test immediately with our pre-loaded batch dataset.
            </p>
          </div>
          <div className="flex justify-center">
            <MagneticButton
              size="sm"
              onClick={handleLoadSampleBatch}
            >
              <Sparkles size={13} />
              <span>Load Sample 6-Job Dataset</span>
            </MagneticButton>
          </div>
        </TiltCard>
      )}

    </div>
  );
}
