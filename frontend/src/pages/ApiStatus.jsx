import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, WifiOff, RefreshCw, Server, CheckCircle2, AlertOctagon } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { apiService } from '../services/api';

export default function ApiStatus({ showToast }) {
  const [status, setStatus] = useState('checking'); // 'connected', 'offline', 'checking'
  const [details, setDetails] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const pingApi = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    const start = performance.now();
    try {
      const data = await apiService.checkHealth();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setDetails(data);
      setStatus('connected');
      if (isManual) {
        showToast('Successfully connected to the API server.', 'success');
      }
    } catch (err) {
      setStatus('offline');
      setDetails(null);
      setLatency(null);
      if (isManual) {
        showToast('API server offline or unreachable.', 'error');
      }
    } finally {
      setLastChecked(new Date().toLocaleTimeString());
      setRefreshing(false);
    }
  };

  useEffect(() => {
    pingApi();
    
    // Setup automatic ping every 10 seconds
    const interval = setInterval(() => {
      pingApi();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 py-6 max-w-2xl mx-auto">
      
      {/* Title & Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">API System Monitor</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time server heartbeats and classification model availability.
          </p>
        </div>
        <motion.button
          onClick={() => pingApi(true)}
          disabled={refreshing || status === 'checking'}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
          title="Refresh Status"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </motion.button>
      </div>

      {/* Main Status Display */}
      <GlassCard className="text-center py-10 space-y-6">
        
        {/* Dynamic Uptime Badge */}
        <div className="flex justify-center">
          {status === 'checking' ? (
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <RefreshCw size={28} className="animate-spin" />
            </div>
          ) : status === 'connected' ? (
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 animate-pulse">
              <Wifi size={28} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-500/10 dark:bg-red-400/10 flex items-center justify-center text-red-500 dark:text-red-400">
              <WifiOff size={28} />
            </div>
          )}
        </div>

        {/* State Title Banner */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {status === 'checking' 
              ? 'Verifying Server Uptime...' 
              : status === 'connected' 
              ? 'Backend Connected' 
              : 'Backend Offline'}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            API Health status
          </p>
        </div>

        {/* Status Parameters list */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-left">
          
          {/* Latency parameters */}
          <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Latency Check</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Activity size={14} className="text-brand-500" />
              {latency ? `${latency} ms` : '--'}
            </span>
          </div>

          {/* Model cache parameters */}
          <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Model Asset Status</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              {details?.model_loaded ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Loaded
                </>
              ) : (
                <>
                  <AlertOctagon size={14} className="text-slate-400" />
                  Unloaded
                </>
              )}
            </span>
          </div>

          {/* Uptime Host parameters */}
          <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-1 col-span-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Endpoint Host URI</span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
              <Server size={12} className="text-indigo-500 flex-shrink-0" />
              {import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}
            </span>
          </div>

        </div>

        {/* Sync timestamps info */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold italic">
          Last heartbeat checked at: {lastChecked || '--'}
        </div>

      </GlassCard>
    </div>
  );
}
