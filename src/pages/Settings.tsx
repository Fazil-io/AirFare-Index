import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Server,
  Save,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  Lock
} from 'lucide-react';
import {
  getStoredMethodology,
  setStoredMethodology,
  getStoredRole,
  setStoredRole,
  isGuestRole
} from '../services/storage';
import { IndexMethodology } from '../types';

export const Settings: React.FC = () => {
  const [methodology, setMethodology] = useState<IndexMethodology>(getStoredMethodology());
  const [role, setRole] = useState(getStoredRole());
  const [sigmaThreshold, setSigmaThreshold] = useState('2.5');
  const [winsorizationPercentile, setWinsorizationPercentile] = useState('99.0');
  const [refreshInterval, setRefreshInterval] = useState('15');
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8000/api/v1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const handleRoleChanged = () => setRole(getStoredRole());
    window.addEventListener('role_changed', handleRoleChanged);
    window.addEventListener('storage', handleRoleChanged);
    return () => {
      window.removeEventListener('role_changed', handleRoleChanged);
      window.removeEventListener('storage', handleRoleChanged);
    };
  }, []);

  const isGuest = isGuestRole(role);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGuest) {
      setStoredMethodology(methodology);
    }
    setStoredRole(role);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
              CONFIGURATION CONSOLE
            </span>
            <span className="text-xs text-slate-400">MoSPI Methodology Control</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            System Preferences & Statistical Parameters
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-1">
            Configure default price index aggregation parameters, outlier winsorization thresholds, and future FastAPI backend endpoints.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {isGuest && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300 text-xs">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Guest Mode Active (Read-Only): </span>
              <span>Statistical formulas, sigma thresholds, and winsorization cutoffs cannot be modified. Switch your perspective to VayuSuchak Statistical Officer below to edit parameters.</span>
            </div>
          </div>
        )}

        {/* Section 1: Statistical Engine Configuration */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">Statistical Index Calculation Engine</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Default Aggregation Formula</label>
              <select
                value={methodology}
                disabled={isGuest}
                onChange={e => setMethodology(e.target.value as IndexMethodology)}
                className={`w-full border rounded-xl p-2.5 text-xs ${
                  isGuest
                    ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-950 border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500'
                }`}
              >
                <option value="Fisher">Fisher Ideal Composite (Officially Recommended)</option>
                <option value="Laspeyres">Laspeyres (Base Passenger Volume Weighted)</option>
                <option value="Jevons">Jevons (Elementary Geometric Mean)</option>
                <option value="Dutot">Dutot (Ratio of Arithmetic Averages)</option>
              </select>
              <span className="text-[11px] text-slate-500 block">Controls the primary headline metric in executive views.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Statistical Base Period</label>
              <input
                type="text"
                disabled
                value="Calendar Year 2024 = 100.0"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 cursor-not-allowed font-mono"
              />
              <span className="text-[11px] text-slate-500 block">Base year aligned with DGCA domestic annual passenger survey.</span>
            </div>
          </div>
        </div>

        {/* Section 2: Anomaly Detection & Outlier Parameters */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <Shield className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Anomaly Detection & Trimming Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Standard Deviation Threshold (σ)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="1.5"
                  max="5.0"
                  disabled={isGuest}
                  value={sigmaThreshold}
                  onChange={e => setSigmaThreshold(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-xs font-mono ${
                    isGuest
                      ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-950 border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500'
                  }`}
                />
                <span className="text-xs text-slate-400 font-mono">sigma</span>
              </div>
              <span className="text-[11px] text-slate-500 block">Quotes exceeding ±{sigmaThreshold}σ are automatically sent to triage.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Winsorization Upper Cut-off</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="95.0"
                  max="99.9"
                  disabled={isGuest}
                  value={winsorizationPercentile}
                  onChange={e => setWinsorizationPercentile(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-xs font-mono ${
                    isGuest
                      ? 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-950 border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500'
                  }`}
                />
                <span className="text-xs text-slate-400 font-mono">percentile</span>
              </div>
              <span className="text-[11px] text-slate-500 block">Extreme quotes beyond the {winsorizationPercentile}th percentile are capped for sub-indices.</span>
            </div>
          </div>
        </div>

        {/* Section 3: User Role & API Endpoint */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <Server className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">User Role & FastAPI Connection</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Active Officer Profile</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="VayuSuchak Statistical Officer">VayuSuchak Statistical Officer (Full Adjudication & Statistical Sign-off)</option>
                <option value="Guest (Read-Only)">Guest (Read-Only • View Only Access)</option>
              </select>
              <span className="text-[11px] text-slate-500 block">Switches permission level and audit sign-off headers.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">FastAPI Base URL</label>
              <input
                type="text"
                value={apiBaseUrl}
                onChange={e => setApiBaseUrl(e.target.value)}
                placeholder="http://localhost:8000/api/v1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
              <span className="text-[11px] text-slate-500 block">Configured for seamless backend integration once backend service launches.</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
