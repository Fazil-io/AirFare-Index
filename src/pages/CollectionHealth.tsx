import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Server,
  RefreshCw,
  Cpu,
  Wifi,
  Play,
  Lock
} from 'lucide-react';
import { mockSourceHealth } from '../services/mockData';
import { useLiveTracking } from '../context/LiveTrackingContext';
import { isGuestRole } from '../services/storage';

export const CollectionHealth: React.FC = () => {
  const { totalObservations, isScrapingNow, triggerLiveScrape, lastScrapedTime, activeWorkers, lastJobStatus } = useLiveTracking();
  const [isGuest, setIsGuest] = useState(isGuestRole());

  useEffect(() => {
    const handleRoleChanged = () => setIsGuest(isGuestRole());
    window.addEventListener('role_changed', handleRoleChanged);
    window.addEventListener('storage', handleRoleChanged);
    return () => {
      window.removeEventListener('role_changed', handleRoleChanged);
      window.removeEventListener('storage', handleRoleChanged);
    };
  }, []);

  const operationalCount = mockSourceHealth.filter(s => s.status === 'OPERATIONAL').length;
  const degradedCount = mockSourceHealth.filter(s => s.status === 'DEGRADED').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              REAL-TIME PIPELINE TELEMETRY
            </span>
            <span className="text-xs text-slate-400">Playwright & Multi-OTA Ingestion Tier</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Collection Source Health & Adapter Infrastructure
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-1">
            Monitors real-time scraping connectivity, latency, throughput, and error rates across MakeMyTrip, EaseMyTrip, IndiGo Direct, and Air India Direct.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={isGuest ? undefined : triggerLiveScrape}
            disabled={isScrapingNow || isGuest}
            title={isGuest ? 'Guest mode: Real-time scraping is restricted to VayuSuchak Statistical Officers' : 'Trigger real-time multi-OTA web scrapers'}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
              isGuest
                ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-not-allowed'
                : isScrapingNow
                ? 'bg-blue-600/70 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 cursor-pointer'
            }`}
          >
            {isGuest ? (
              <Lock className="w-4 h-4 text-amber-400" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${isScrapingNow ? 'animate-spin' : ''}`} />
            )}
            <span>{isGuest ? 'Scraping Restricted (Guest)' : isScrapingNow ? 'Scraping Live OTA...' : 'Trigger Real-time Scraping'}</span>
          </button>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 self-stretch sm:self-auto">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="font-bold text-slate-100 block">{operationalCount} Sources Active</span>
              <span className="text-[10px] text-emerald-400 font-mono">Status: {lastJobStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>24h Ingestion Volume</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-100 mt-2">{totalObservations.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Real-time Ingested Records</span>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average API Latency</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-2">342 ms</div>
          <span className="text-[10px] text-slate-400 mt-1 block">GDS Direct: 260ms avg</span>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Adapters</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-100 mt-2">8 / 8</div>
          <span className="text-[10px] text-slate-400 mt-1 block">4 Direct GDS • 4 OTAs</span>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Adapter Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-2">{degradedCount}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Cleartrip rate-limited</span>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Adapter Operational Status</h3>
            <p className="text-xs text-slate-400">High-frequency collection agent status and error telemetry</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Cadence: Every 15 minutes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockSourceHealth.map(src => {
            const isDegraded = src.status === 'DEGRADED';
            return (
              <div
                key={src.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDegraded
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{src.sourceName}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {src.adapterVersion}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{src.type}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      isDegraded
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isDegraded ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                    {src.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">24h Success</span>
                    <span className="font-bold text-slate-200">{src.successRate24h}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Latency</span>
                    <span className="font-bold text-slate-200">{src.avgLatencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Last Run</span>
                    <span className="font-bold text-slate-300">{src.lastScraped}</span>
                  </div>
                </div>

                {isDegraded && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Rate limiting detected on search worker node #04. Backoff algorithm applied.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
