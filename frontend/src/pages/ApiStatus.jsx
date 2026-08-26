import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, WifiOff, RefreshCw, Server, CheckCircle2, AlertOctagon, Terminal, Cpu, Database } from 'lucide-react';
import TiltCard from '../components/motion/TiltCard';
import MagneticButton from '../components/motion/MagneticButton';
import AnimatedNumber from '../components/motion/AnimatedNumber';
import RevealText from '../components/motion/RevealText';
import { apiService } from '../services/api';

export default function ApiStatus({ showToast }) {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [latencyHistory, setLatencyHistory] = useState([38, 42, 35, 40, 39, 44, 37]);

  const pingApi = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    const start = performance.now();
    try {
      const data = await apiService.checkHealth();
      const end = performance.now();
      const measuredLatency = Math.round(end - start);
      setLatency(measuredLatency);
      setLatencyHistory(prev => [...prev.slice(-10), measuredLatency]);
      setDetails(data);
      setStatus('connected');
      if (isManual) {
        showToast('Successfully connected to the API telemetry server.', 'success');
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
    const interval = setInterval(() => {
      pingApi();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-3xl mx-auto font-mono">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
            <Activity size={13} />
            <span>SYSTEM TELEMETRY MONITOR</span>
          </div>
          <RevealText
            text="API Health & Latency Diagnostics"
            as="h1"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display"
          />
          <p className="text-xs text-slate-400 font-sans">
            Real-time server heartbeats, model cache integrity, and endpoint latency.
          </p>
        </div>

        <MagneticButton
          size="sm"
          variant="secondary"
          onClick={() => pingApi(true)}
          disabled={refreshing || status === 'checking'}
          className="p-2.5"
          title="Refresh Heartbeat"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </MagneticButton>
      </div>

      {/* Main Status Display */}
      <TiltCard baseRotation={0} enableMouseTilt={false} className="text-center py-8 px-6 sm:px-10 space-y-6">
        
        {/* Dynamic Beacon Icon with Spring Animation */}
        <div className="flex justify-center">
          {status === 'checking' ? (
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400">
              <RefreshCw size={26} className="animate-spin text-cyan-400" />
            </div>
          ) : status === 'connected' ? (
            <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <Wifi size={28} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <WifiOff size={28} />
            </div>
          )}
        </div>

        {/* State Banner */}
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black tracking-tight text-white">
            {status === 'checking' 
              ? 'Verifying Server Uptime...' 
              : status === 'connected' 
              ? 'All Systems Operational' 
              : 'Backend Service Offline'}
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            FLASK REST INFERENCE ENGINE // ACTIVE
          </p>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4 border-t border-white/[0.08] text-left">
          
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Round-Trip Latency</span>
            <span className="text-base font-extrabold text-white flex items-center gap-1.5">
              <Activity size={14} className="text-cyan-400" />
              {latency !== null ? (
                <AnimatedNumber value={latency} suffix=" ms" className="text-base font-extrabold text-white" />
              ) : (
                '--'
              )}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Model Asset Cache</span>
            <span className="text-base font-extrabold text-white flex items-center gap-1.5">
              {details?.model_loaded ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Cached in RAM</span>
                </>
              ) : (
                <>
                  <AlertOctagon size={14} className="text-rose-400" />
                  <span className="text-rose-400">Unloaded</span>
                </>
              )}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 sm:col-span-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Endpoint Host URI</span>
            <span className="text-xs text-cyan-300 flex items-center gap-1.5 truncate">
              <Server size={12} className="text-cyan-400 flex-shrink-0" />
              {import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}
            </span>
          </div>

        </div>

        {/* Live Latency Bar Visualization */}
        <div className="max-w-lg mx-auto p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 text-left">
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>Latency Stream History</span>
            <span>Avg: ~{Math.round(latencyHistory.reduce((a,b)=>a+b,0)/latencyHistory.length)}ms</span>
          </div>
          <div className="flex items-end gap-1.5 h-12 pt-2">
            {latencyHistory.map((val, i) => (
              <motion.div 
                key={i} 
                className="flex-1 rounded-t bg-cyan-500/30 hover:bg-cyan-400 transition-colors"
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(100, Math.max(20, (val / 100) * 100))}%` }}
                transition={{ duration: 0.4 }}
                title={`${val}ms`}
              />
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 italic">
          Last heartbeat checked at: {lastChecked || '--'}
        </div>

      </TiltCard>
    </div>
  );
}
