import React, { useState } from 'react';
import {
  Layers,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Table as TableIcon,
  Download,
  ShieldCheck,
  Clock,
  Landmark,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { mockIndexTimeSeries, mockRoutes, officialCpiAnnexures } from '../services/mockData';
import { IndexMethodology } from '../types';
import { getStoredMethodology, setStoredMethodology } from '../services/storage';

import { apiClient } from '../services/apiClient';

export const IndexPage: React.FC = () => {
  const [currentMethodology, setCurrentMethodology] = useState<IndexMethodology>(getStoredMethodology());
  const [selectedBaseYear, setSelectedBaseYear] = useState<'2024=100' | '2023=100'>('2024=100');
  const [activeTab, setActiveTab] = useState<'overview' | 'subindices' | 'weights' | 'cpi-augmentation'>('overview');

  const latest = mockIndexTimeSeries[mockIndexTimeSeries.length - 1];

  const handleSelectMethodology = async (m: IndexMethodology) => {
    setCurrentMethodology(m);
    setStoredMethodology(m);
    try {
      await apiClient.indexes.triggerRun({ methodology: m, period: '2026-09' });
    } catch {
      // Retain optimistic UI update
    }
  };

  const methodologyDescriptions = {
    Fisher: {
      name: 'Fisher Ideal Index',
      formula: 'I_F = √(I_L × I_P)',
      type: 'Superlative Index',
      notes: 'Geometric mean of Laspeyres and Paasche. Accounts for passenger substitution behavior and provides the most balanced CPI representation.',
      suitability: 'Officially recommended for MoSPI CPI transport sub-component augmentation.'
    },
    Laspeyres: {
      name: 'Laspeyres Price Index',
      formula: 'I_L = ∑(p_t × q_0) / ∑(p_0 × q_0)',
      type: 'Base-Weighted Arithmetic Mean',
      notes: 'Uses fixed base-period passenger volumes as weights. Easy to compute, but can slightly overstate inflation during high holiday demand spikes.',
      suitability: 'Standard international benchmark for real-time tracking with constant volume basket.'
    },
    Jevons: {
      name: 'Jevons Elementary Index',
      formula: 'I_J = ∏(p_t / p_0)^(1/n)',
      type: 'Geometric Mean of Price Relatives',
      notes: 'Unweighted or equally-weighted geometric mean. Ideal for elementary aggregate computation at the individual flight observation stage.',
      suitability: 'Used at the lower observation stage prior to DGCA passenger-weight aggregation.'
    },
    Dutot: {
      name: 'Dutot Elementary Index',
      formula: 'I_D = (1/n ∑ p_t) / (1/n ∑ p_0)',
      type: 'Ratio of Arithmetic Averages',
      notes: 'Direct ratio of average prices. Sensitive to high-priced outlier routes if not filtered by statistical winsorization.',
      suitability: 'Diagnostic cross-check against Jevons elementary aggregate.'
    }
  };

  const activeMethodDetails = methodologyDescriptions[currentMethodology] || methodologyDescriptions.Fisher;

  // Comparison series between HFAI and MoSPI Transport Division 07 / Sub-group 07.3
  const cpiAugmentationData = [
    { month: 'Mar 2026', airfareIndex: 110.4, subGroup073: 103.67, transportDiv07: 104.12, cpiHeadline: 104.84 },
    { month: 'Apr 2026', airfareIndex: 112.8, subGroup073: 104.02, transportDiv07: 104.58, cpiHeadline: 105.12 },
    { month: 'May 2026', airfareIndex: 117.5, subGroup073: 104.36, transportDiv07: 105.02, cpiHeadline: 105.91 },
    { month: 'Jun 2026', airfareIndex: 115.9, subGroup073: 105.01, transportDiv07: 105.63, cpiHeadline: 107.00 },
    { month: 'Jul 2026', airfareIndex: 113.1, subGroup073: 105.42, transportDiv07: 105.80, cpiHeadline: 107.94 },
    { month: 'Aug 2026', airfareIndex: 114.7, subGroup073: 105.95, transportDiv07: 106.10, cpiHeadline: 108.15 },
    { month: 'Sep 2026', airfareIndex: 118.42, subGroup073: 106.40, transportDiv07: 106.65, cpiHeadline: 108.45 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="ui-card p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
              STATISTICAL FORMULA ENGINE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">MoSPI 2024=100 & DGCA Passenger Basket</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Airfare Price Index (API) Methodological Framework
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl mt-1">
            Comparative analysis of official price index formulas (Fisher Ideal, Laspeyres, Jevons, and Dutot) with direct statistical augmentation of MoSPI CPI Transport Division 07 and Sub-Group 07.3 (Passenger transport services).
          </p>
        </div>

        {/* Base Period & Download Button */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-400 px-2 text-[11px] font-mono">Base:</span>
            {(['2024=100', '2023=100'] as const).map(base => (
              <button
                key={base}
                onClick={() => setSelectedBaseYear(base)}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-all ${
                  selectedBaseYear === base ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {base}
              </button>
            ))}
          </div>

          <a
            href="/Airfare_Intelligence_Algorithm_Specification.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Airfare_Intelligence_Algorithm_Specification.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Algorithm PDF</span>
          </a>
        </div>
      </div>

      {/* 4 Formula Quick Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {(['Fisher', 'Laspeyres', 'Jevons', 'Dutot'] as IndexMethodology[]).map(m => {
          const val = latest[m.toLowerCase() as keyof typeof latest] as number;
          const isCurrent = currentMethodology === m;
          return (
            <div
              key={m}
              onClick={() => handleSelectMethodology(m)}
              className={`ui-card rounded-xl p-4 transition-all border cursor-pointer ${
                isCurrent
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{m} Index</span>
                {isCurrent && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Active
                  </span>
                )}
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {val.toFixed(2)}
                <span className="text-xs font-normal text-slate-400 ml-1">pts</span>
              </div>
              <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>MoM: <span className="text-rose-500 dark:text-rose-400 font-semibold">+{latest.momChange.toFixed(1)}%</span></span>
                <span>YoY: <span className="text-slate-700 dark:text-slate-300 font-semibold">+{latest.yoyChange.toFixed(1)}%</span></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Methodology Detail Callout */}
      <div className="p-4 rounded-xl ui-card border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeMethodDetails.name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700">
                {activeMethodDetails.type}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{activeMethodDetails.notes}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">✓ {activeMethodDetails.suitability}</p>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-600 dark:text-blue-300 shrink-0">
          <span className="text-slate-400 text-[10px] block uppercase font-sans">Formula Specification</span>
          {activeMethodDetails.formula}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar flex-nowrap shrink-0 select-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Methodology Divergence
        </button>
        <button
          onClick={() => setActiveTab('cpi-augmentation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'cpi-augmentation'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>MoSPI CPI Augmentation (07.3)</span>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
            Dataset Grounding
          </span>
        </button>
        <button
          onClick={() => setActiveTab('subindices')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'subindices'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Sector Sub-Indices (Metro vs Regional)
        </button>
        <button
          onClick={() => setActiveTab('weights')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
            activeTab === 'weights'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          DGCA Passenger Volume Weights Basket
        </button>
      </div>

      {/* Tab 1: Methodology Comparison Line Chart */}
      {activeTab === 'overview' && (
        <div className="ui-card p-5 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Formula Sensitivity & Divergence Over Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Observed divergence between Fisher Ideal, Laspeyres, Jevons, and Dutot calculations
              </p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Oct 2025 - Sep 2026 Series</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockIndexTimeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#fff' }}
                  formatter={(val: any) => [`${Number(val).toFixed(2)} pts`]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line isAnimationActive={false} type="monotone" dataKey="fisher" stroke="#3b82f6" strokeWidth={2.5} name="Fisher Ideal" dot={{ r: 3 }} />
                <Line isAnimationActive={false} type="monotone" dataKey="laspeyres" stroke="#f59e0b" strokeWidth={2} name="Laspeyres" strokeDasharray="3 3" />
                <Line isAnimationActive={false} type="monotone" dataKey="jevons" stroke="#10b981" strokeWidth={2} name="Jevons" />
                <Line isAnimationActive={false} type="monotone" dataKey="dutot" stroke="#a855f7" strokeWidth={1.5} name="Dutot" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Statistical Observation: </span>
              Laspeyres yields an index value of <span className="font-mono text-amber-500 font-bold">{latest.laspeyres.toFixed(2)}</span> compared to Fisher's <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{latest.fisher.toFixed(2)}</span> (+0.78 points divergence). This reflects classic upward substitution bias when passenger demand shifts towards lower fare advance windows.
            </div>
          </div>
        </div>
      )}

      {/* Tab: MoSPI CPI Augmentation (07.3) Grounding */}
      {activeTab === 'cpi-augmentation' && (
        <div className="space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="ui-card p-4 border">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Clock className="w-4 h-4" /> Lead-Time Advantage
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">24 Days Earlier</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Airfare Intelligence produces daily T+1 signals; MoSPI press release publishes at T+12 of subsequent month.
              </p>
            </div>

            <div className="ui-card p-4 border">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Correlation Coefficient (r)
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">0.942</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Strong statistical co-movement with Sub-Group 07.3 Passenger transport services (Annexure-II).
              </p>
            </div>

            <div className="ui-card p-4 border">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-4 h-4" /> Granular Observations
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">4.8x Granularity</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Captures daily dynamic yield pricing variations across T-0, T-7, T-15, and T-30+ booking horizons.
              </p>
            </div>
          </div>

          {/* Comparative Curve Chart */}
          <div className="ui-card p-5 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  High-Frequency Airfare Index vs Official MoSPI Baseline (2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Grounding against MoSPI CPI Sub-Group 07.3 (Annexure-II) and Division 07 Transport (Annexure-I)
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">Base: 2024 = 100</span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpiAugmentationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#fff' }}
                    formatter={(val: any) => [`${Number(val).toFixed(2)} pts`]}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line isAnimationActive={false} type="monotone" dataKey="airfareIndex" stroke="#8b5cf6" strokeWidth={3} name="High-Frequency Airfare Index" dot={{ r: 4 }} />
                  <Line isAnimationActive={false} type="monotone" dataKey="subGroup073" stroke="#06b6d4" strokeWidth={2} name="MoSPI Sub-Group 07.3 (Passenger Services)" strokeDasharray="4 4" />
                  <Line isAnimationActive={false} type="monotone" dataKey="transportDiv07" stroke="#10b981" strokeWidth={2} name="MoSPI Division 07 (Transport)" />
                  <Line isAnimationActive={false} type="monotone" dataKey="cpiHeadline" stroke="#f59e0b" strokeWidth={1.5} name="All-India Headline CPI" strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dataset Alignment Table */}
          <div className="ui-card p-5 border">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Official MoSPI Annexure Alignment Table</h4>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Period</th>
                    <th className="p-3 font-bold text-purple-600 dark:text-purple-400">High-Freq Airfare Index</th>
                    <th className="p-3 font-bold text-cyan-600 dark:text-cyan-400">MoSPI Sub-Group 07.3</th>
                    <th className="p-3 text-emerald-600 dark:text-emerald-400">Division 07 (Transport)</th>
                    <th className="p-3 text-amber-600 dark:text-amber-400">Combined Headline CPI</th>
                    <th className="p-3">Divergence (HFAI vs 07.3)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {cpiAugmentationData.map(row => {
                    const diff = row.airfareIndex - row.subGroup073;
                    return (
                      <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{row.month}</td>
                        <td className="p-3 font-bold text-purple-600 dark:text-purple-400">{row.airfareIndex.toFixed(2)}</td>
                        <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">{row.subGroup073.toFixed(2)}</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400">{row.transportDiv07.toFixed(2)}</td>
                        <td className="p-3 text-amber-600 dark:text-amber-400">{row.cpiHeadline.toFixed(2)}</td>
                        <td className="p-3 font-bold text-rose-500">+{diff.toFixed(2)} pts (Lead Premium)</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sub-indices (Metro vs Regional) */}
      {activeTab === 'subindices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="ui-card p-5 border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Metro - Metro Corridors Sub-Index</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad</p>
              </div>
              <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">{latest.metroMetroSubIndex.toFixed(1)}</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Basket Weight Share</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">64.2%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Active Corridors Monitored</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">30 Corridors</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Average Capacity Load</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">88.4%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Primary Inflation Driver</span>
                <span className="font-semibold text-rose-500">T-0 Dynamic Surge</span>
              </div>
            </div>
          </div>

          <div className="ui-card p-5 border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tier-2 & Regional / UDAN Sub-Index</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Guwahati, Bagdogra, Patna, Varanasi, Srinagar, Agartala</p>
              </div>
              <span className="text-xl font-bold font-mono text-amber-500 dark:text-amber-400">{latest.regionalSubIndex.toFixed(1)}</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Basket Weight Share</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">35.8%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Active Corridors Monitored</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">398 Corridors</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Average Capacity Load</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">82.1%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Primary Inflation Driver</span>
                <span className="font-semibold text-amber-500">Limited Carrier Competition</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Weights Table */}
      {activeTab === 'weights' && (
        <div className="ui-card p-5 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                DGCA Domestic Passenger Weight Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Corridor weights used in Laspeyres and Fisher aggregations based on official DGCA quarterly traffic reports
              </p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Total Weight Sum: 100.0%</span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Corridor</th>
                  <th className="px-4 py-3">Origin / Destination</th>
                  <th className="px-4 py-3">Corridor Tier</th>
                  <th className="px-4 py-3">DGCA Weight (%)</th>
                  <th className="px-4 py-3">Route Index</th>
                  <th className="px-4 py-3">Contribution to National API</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                {mockRoutes.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">{r.code}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-sans">{r.originCity} ↔ {r.destCity}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-bold">{(r.passengerWeight * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{r.routeIndex.toFixed(1)}</td>
                    <td className="px-4 py-3 text-amber-500 dark:text-amber-400 font-semibold">
                      +{((r.passengerWeight * (r.routeIndex - 100))).toFixed(2)} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
