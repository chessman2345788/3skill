import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, Upload, Download, RefreshCw, AlertTriangle, 
  ShieldCheck, ShieldAlert, Search, Filter, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Layers
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { apiService } from '../services/api';

const SAMPLE_BATCH = [
  { id: 1, title: 'Senior Software Engineer', company: 'Apex Cloud Systems', description: 'Seeking a Senior Backend Engineer with 4+ years in Python, FastAPI, and PostgreSQL. Benefits include 401(k), health insurance, flexible remote work.' },
  { id: 2, title: 'Cash Assistant / Money Handler', company: 'QuickPay Services', description: 'Urgent hiring! Work from home. Earn $5000 a week processing wire transfers from your personal bank account. No experience needed. Immediate start!' },
  { id: 3, title: 'Product Marketing Manager', company: 'Stripe Partners', description: 'Lead global product marketing initiatives for B2B fintech solutions. Requires Bachelor degree and 5 years SaaS marketing background.' },
  { id: 4, title: 'Online Package Inspector', company: 'Global Logistics Net', description: 'Package handler needed urgently. Receive boxes at your home, check items, and re-ship them. Massive weekly income paid daily in Bitcoin or CashApp.' },
  { id: 5, title: 'Data Entry Clerk', company: 'Unclaimed Asset Dept', description: 'Earn fast cash working 1-2 hours a day. No interview required, immediate start. Guaranteed placement and sign-on bonus.' },
  { id: 6, title: 'Frontend React Developer', company: 'Innovate UI Labs', description: 'Build glassmorphic web dashboards using React 19 and Tailwind CSS. Full-time position with dental, medical, and paid time off.' }
];

export default function BatchScanner({ showToast }) {
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL' | 'FAKE' | 'GENUINE' | 'HIGH'
  const [expandedRow, setExpandedRow] = useState(null);

  const handleLoadSampleBatch = () => {
    runBatchAnalysis(SAMPLE_BATCH);
    showToast('Loaded and scanned sample 6-job dataset.', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        showToast(`Imported ${parsedJobs.length} jobs. Running batch AI analysis...`, 'info');
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
    showToast('Batch CSV report downloaded.', 'success');
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
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 mb-1">
            <Layers size={13} />
            Enterprise Bulk Audit
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bulk Batch Job Scanner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload CSV/JSON datasets with dozens of job postings to perform parallel AI risk assessments.
          </p>
        </div>

        {/* Toolbar actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoadSampleBatch}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 transition-all"
          >
            <Sparkles size={14} />
            Load Sample 6-Job Batch
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white cursor-pointer transition-all shadow-sm">
            <Upload size={14} />
            Upload CSV / JSON
            <input
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {batchData.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
            >
              <Download size={14} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards if batch is loaded */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <GlassCard className="p-4">
            <span className="text-[11px] uppercase font-bold text-slate-400">Total Processed</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{batchData.length} Jobs</div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Dataset row volume</span>
          </GlassCard>

          <GlassCard className="p-4 border-red-500/20 bg-red-500/5">
            <span className="text-[11px] uppercase font-bold text-red-500">Fraud Rate</span>
            <div className="text-2xl font-black text-red-500 mt-1">{summary.fake_percentage}%</div>
            <span className="text-[11px] text-red-400">{summary.fake_count} listings flagged</span>
          </GlassCard>

          <GlassCard className="p-4 border-emerald-500/20 bg-emerald-500/5">
            <span className="text-[11px] uppercase font-bold text-emerald-500">Genuine Rate</span>
            <div className="text-2xl font-black text-emerald-500 mt-1">
              {((summary.genuine_count / batchData.length) * 100).toFixed(1)}%
            </div>
            <span className="text-[11px] text-emerald-400">{summary.genuine_count} listings verified</span>
          </GlassCard>

          <GlassCard className="p-4 border-amber-500/20 bg-amber-500/5">
            <span className="text-[11px] uppercase font-bold text-amber-500">High Risk Alerts</span>
            <div className="text-2xl font-black text-amber-500 mt-1">{summary.high_risk_count}</div>
            <span className="text-[11px] text-amber-400">Urgent candidate danger</span>
          </GlassCard>
        </motion.div>
      )}

      {/* Main Table View */}
      {loading ? (
        <GlassCard className="text-center py-20 space-y-3">
          <RefreshCw size={36} className="animate-spin text-brand-500 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Analyzing Job Batch Dataset...</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Extracting NLP vector features and calculating risk scores across all submissions.
          </p>
        </GlassCard>
      ) : batchData.length > 0 ? (
        <GlassCard className="space-y-4 p-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title or company..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-dark-900/30 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterRisk('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterRisk === 'ALL' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All ({batchData.length})
              </button>
              <button
                onClick={() => setFilterRisk('FAKE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterRisk === 'FAKE' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Fake Only ({summary?.fake_count || 0})
              </button>
              <button
                onClick={() => setFilterRisk('HIGH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterRisk === 'HIGH' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                High Risk ({summary?.high_risk_count || 0})
              </button>
              <button
                onClick={() => setFilterRisk('GENUINE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterRisk === 'GENUINE' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Genuine ({summary?.genuine_count || 0})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">#</th>
                  <th className="pb-3 px-2">Job Title</th>
                  <th className="pb-3 px-2">Company</th>
                  <th className="pb-3 px-2">AI Prediction</th>
                  <th className="pb-3 px-2">Confidence</th>
                  <th className="pb-3 px-2">Risk Level</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredJobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <tr 
                      onClick={() => setExpandedRow(expandedRow === job.id ? null : job.id)}
                      className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-2 font-mono text-slate-400">{job.id}</td>
                      <td className="py-3 px-2 font-bold text-slate-900 dark:text-slate-100">{job.title}</td>
                      <td className="py-3 px-2 text-slate-600 dark:text-slate-300">{job.company}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          job.prediction === 'Fake Job'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>
                          {job.prediction === 'Fake Job' ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
                          {job.prediction}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-700 dark:text-slate-300">{job.confidence}%</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          job.risk_level === 'High' ? 'bg-red-500/10 text-red-500' : job.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {job.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-slate-400">
                        {expandedRow === job.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </td>
                    </tr>

                    {/* Expanded Row Detail */}
                    {expandedRow === job.id && (
                      <tr className="bg-slate-50/70 dark:bg-dark-900/50">
                        <td colSpan={7} className="p-4">
                          <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                              <span>Inference Latency: {job.processing_time}</span>
                              <span>Red Flag Tokens: {job.flag_count} matched</span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {job.prediction === 'Fake Job' 
                                ? '⚠️ Fraud Warning: This job posting contains high-risk patterns such as atypical compensation promises, payment handling, or informal interview pathways.' 
                                : '✅ Verification Pass: This job posting demonstrates authentic corporate hiring language, specific domain qualifications, and structured benefit offerings.'}
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
        </GlassCard>
      ) : (
        <GlassCard className="text-center py-16 space-y-4 border-dashed border-2 border-slate-200 dark:border-slate-800">
          <FileSpreadsheet size={48} className="text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">No Dataset Uploaded Yet</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
              Upload a .CSV, .JSON file or click "Load Sample 6-Job Batch" to run an automated high-throughput audit.
            </p>
          </div>
          <button
            onClick={handleLoadSampleBatch}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all"
          >
            <Sparkles size={14} />
            Test with Sample Batch
          </button>
        </GlassCard>
      )}

    </div>
  );
}
