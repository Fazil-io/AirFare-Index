import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  Database,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Plane,
  Landmark,
  Radio,
  Lightbulb,
  Clock,
  History,
  ShieldCheck,
  CheckCircle2,
  X,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';
import { HeroBanner } from '../components/common/HeroBanner';
import { IndiaMapHeatmap } from '../components/common/BrandAssets';
import { useTheme } from '../context/ThemeContext';
import { useLiveTracking } from '../context/LiveTrackingContext';
import { apiClient } from '../services/apiClient';
import { AnomalyReviewModal } from '../components/alerts/AnomalyReviewModal';
import { getStoredAnomalies, updateAnomalyStatus } from '../services/storage';
import { AnomalyRecord, AnomalyStatus } from '../types';

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const { totalObservations, isLive } = useLiveTracking();
  const [trendTab, setTrendTab] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(getStoredAnomalies());
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);
  const [summary, setSummary] = useState<{
    national_index: number;
    mom_change_pct: number;
    yoy_change_pct: number;
    routes_monitored: number;
    observations_24h: number;
    open_anomalies: number;
    high_alerts: number;
    data_freshness_minutes: number;
  }>({
    national_index: 128.45,
    mom_change_pct: 2.8,
    yoy_change_pct: 8.7,
    routes_monitored: 1248,
    observations_24h: 184520,
    open_anomalies: 37,
    high_alerts: 4,
    data_freshness_minutes: 4,
  });

  useEffect(() => {
    const fetchLiveSummary = async () => {
      try {
        const data = await apiClient.dashboard.getSummary();
        if (data) {
          setSummary(data);
        }
      } catch (e) {
        // Retain fallback
      }
    };
    fetchLiveSummary();
    if (isLive) {
      const interval = setInterval(fetchLiveSummary, 8000);
      return () => clearInterval(interval);
    }
  }, [isLive]);
  const sparkline1 = [{ v: 121 }, { v: 122 }, { v: 124 }, { v: 123 }, { v: 125 }, { v: 127 }, { v: 128.45 }];
  const sparkline2 = [{ v: 1100 }, { v: 1140 }, { v: 1180 }, { v: 1210 }, { v: 1230 }, { v: 1248 }];
  const sparkline3 = [{ v: 3.8 }, { v: 4.1 }, { v: 4.0 }, { v: 4.3 }, { v: 4.6 }, { v: 4.8 }];
  const sparkline4 = [{ v: 4 }, { v: 7 }, { v: 6 }, { v: 11 }, { v: 14 }, { v: 18.6 }];

  // Airfare Inflation Trend datasets per tab
  const trendDatasets: Record<string, { date: string; national: number; avgFare: number; cpi: number }[]> = {
    '7D': [
      { date: 'Sep 08', national: 125.1, avgFare: 116.0, cpi: 103.2 },
      { date: 'Sep 09', national: 125.8, avgFare: 116.5, cpi: 103.4 },
      { date: 'Sep 10', national: 126.4, avgFare: 117.2, cpi: 103.6 },
      { date: 'Sep 11', national: 127.1, avgFare: 117.9, cpi: 103.8 },
      { date: 'Sep 12', national: 127.6, avgFare: 118.2, cpi: 103.9 },
      { date: 'Sep 13', national: 128.1, avgFare: 118.8, cpi: 104.0 },
      { date: 'Sep 14', national: 128.45, avgFare: 119.0, cpi: 104.0 }
    ],
    '30D': [
      { date: 'Aug 10', national: 108.0, avgFare: 95.0, cpi: 88.0 },
      { date: 'Aug 17', national: 114.0, avgFare: 102.0, cpi: 91.0 },
      { date: 'Aug 24', national: 111.0, avgFare: 99.0, cpi: 90.0 },
      { date: 'Aug 31', national: 120.0, avgFare: 108.0, cpi: 95.0 },
      { date: 'Sep 07', national: 124.5, avgFare: 114.0, cpi: 100.0 },
      { date: 'Sep 14', national: 128.45, avgFare: 119.0, cpi: 104.0 }
    ],
    '90D': [
      { date: 'Jun 15', national: 104.2, avgFare: 92.4, cpi: 91.0 },
      { date: 'Jul 01', national: 106.5, avgFare: 95.1, cpi: 92.4 },
      { date: 'Jul 15', national: 109.0, avgFare: 98.2, cpi: 93.8 },
      { date: 'Aug 01', national: 112.4, avgFare: 102.5, cpi: 95.0 },
      { date: 'Aug 15', national: 115.8, avgFare: 107.0, cpi: 96.5 },
      { date: 'Sep 01', national: 122.0, avgFare: 113.4, cpi: 100.2 },
      { date: 'Sep 14', national: 128.45, avgFare: 119.0, cpi: 104.0 }
    ],
    '1Y': [
      { date: 'Oct 25', national: 96.0, avgFare: 88.0, cpi: 89.0 },
      { date: 'Dec 25', national: 104.0, avgFare: 94.0, cpi: 91.5 },
      { date: 'Feb 26', national: 102.0, avgFare: 91.0, cpi: 92.0 },
      { date: 'Apr 26', national: 108.5, avgFare: 97.2, cpi: 94.1 },
      { date: 'Jun 26', national: 114.0, avgFare: 103.5, cpi: 96.0 },
      { date: 'Aug 26', national: 121.2, avgFare: 111.0, cpi: 99.8 },
      { date: 'Sep 26', national: 128.45, avgFare: 119.0, cpi: 104.0 }
    ]
  };

  const trendData = trendDatasets[trendTab] || trendDatasets['30D'];

  const handleUpdateStatus = async (id: string, status: AnomalyStatus, notes: string) => {
    const updated = updateAnomalyStatus(id, status, notes);
    setAnomalies(updated);
    try {
      await apiClient.anomalies.review(id, status, notes);
    } catch {
      // Offline fallback already updated in local storage
    }
  };

  // Lead-Time grouped bars data
  const leadTimeData = [
    { route: 'DEL → BOM', t0: 165, t7: 112, t15: 85, t30: 60 },
    { route: 'BLR → HYD', t0: 110, t7: 95, t15: 125, t30: 80 },
    { route: 'MAA → CCU', t0: 108, t7: 122, t15: 98, t30: 65 },
    { route: 'BOM → DEL', t0: 85, t7: 75, t15: 110, t30: 92 },
    { route: 'CCU → BLR', t0: 102, t7: 95, t15: 135, t30: 88 }
  ];

  // Top Contributing Routes
  const topContributors = [
    { route: 'DEL → BOM', share: 18.4 },
    { route: 'BLR → HYD', share: 14.7 },
    { route: 'MAA → CCU', share: 11.2 },
    { route: 'BOM → DEL', share: 9.8 },
    { route: 'CCU → BLR', share: 7.6 }
  ];

  // Alerts & Anomalies
  const alertsList = [
    {
      route: 'BLR → IXC',
      change: '+18.6%',
      time: '2h ago',
      desc: 'Unusual spike (Holiday season)',
      color: 'bg-rose-500',
      isHigh: true
    },
    {
      route: 'DEL → BOM',
      change: '+15.2%',
      time: '4h ago',
      desc: 'Higher than historical range',
      color: 'bg-rose-500',
      isHigh: true
    },
    {
      route: 'MAA → CCU',
      change: '-12.4%',
      time: '6h ago',
      desc: 'Abnormally low fare',
      color: 'bg-emerald-500',
      isHigh: false
    },
    {
      route: 'CCU → DEL',
      change: '+11.8%',
      time: '8h ago',
      desc: 'High demand (Festival period)',
      color: 'bg-amber-500',
      isHigh: true
    }
  ];

  const handleExport = (fmt: string) => {
    const filename = `MoSPI_Airfare_Intelligence_${new Date().toISOString().slice(0, 10)}.${fmt === 'Excel' ? 'xlsx' : fmt === 'PDF' ? 'pdf' : 'csv'}`;
    const dummyContent = fmt === 'CSV'
      ? "Corridor,National Index,Average Fare (INR),7d Change,Status\nBLR-IXC,128.45,7450,+18.6%,Holiday Spike\nDEL-BOM,122.40,6480,+15.2%,High Historical\nMAA-CCU,116.20,5950,-12.4%,Abnormally Low\nCCU-DEL,121.80,6120,+11.8%,Festival Demand"
      : `MoSPI Official Airfare Intelligence Platform\nGenerated Dossier (${fmt})\nReference: 14-Sep-2026\nNational Airfare Price Index: 128.45 (+2.8% MoM)\nTotal Corridors: 1,248\nIntegrity: Verified Official Release`;
    const mime = fmt === 'CSV' ? 'text/csv' : fmt === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([dummyContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadMsg(`Downloaded ${filename}!`);
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Hero Banner */}
      <HeroBanner isDark={isDark} />

      {/* 2. Four Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: National Airfare Index */}
        <div
          onClick={() => navigate('/index-analysis')}
          className="ui-card p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
          title="Click to view full Airfare Index Analysis"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                National Airfare Index
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {summary.national_index}
              </span>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                ↗ +{summary.mom_change_pct}%
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">vs. last month</span>
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Base Period (2024-Q4) = 100</span>
            <div className="w-20 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkline1}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Routes Monitored */}
        <div
          onClick={() => navigate('/routes')}
          className="ui-card p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
          title="Click to explore Route Intelligence"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Total Routes Monitored
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {summary.routes_monitored.toLocaleString()}
              </span>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                ↗ +12%
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">vs. last month</span>
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Domestic City-Pairs</span>
            <div className="w-20 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkline2}>
                  <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Fare Observations */}
        <div
          onClick={() => navigate('/data-explorer')}
          className="ui-card p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
          title="Click to view Raw Observations Explorer"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Total Fare Observations
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {(summary.observations_24h || totalObservations).toLocaleString()}
              </span>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                ↗ Live Ingestion
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">24h Ingestion Volume</span>
            <div className="w-20 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkline3}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 4: Open Anomalies & Volatility */}
        <div
          onClick={() => navigate('/anomalies')}
          className="ui-card p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
          title="Click to review flagged anomalies"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Open Price Anomalies
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-400">
                {summary.open_anomalies}
              </span>
              <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                {summary.high_alerts} High Alerts
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-400">Pending Officer Review</span>
            <div className="w-20 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkline4}>
                  <Line type="monotone" dataKey="v" stroke="#e11d48" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Inflation Trend (col 1), Heatmap (col 2), Alerts (col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Airfare Inflation Trend (5 cols) */}
        <div className="lg:col-span-5 ui-card p-4.5 flex flex-col justify-between">
          <div>
            {/* Header + Tabs */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Airfare Inflation Trend
                </h3>
              </div>

              {/* Time Horizon Pills */}
              <div className="flex items-center rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#060b17] text-[11px]">
                {(['7D', '30D', '90D', '1Y'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setTrendTab(tab)}
                    className={`px-2 py-0.5 rounded font-mono font-medium transition-all cursor-pointer ${
                      trendTab === tab
                        ? 'bg-blue-600 text-white shadow-2xs font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend Dots matching reference design */}
            <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span> National Index
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span> Domestic Avg. Fare
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> CPI (Transport)
              </span>
            </div>

            {/* Recharts Area Chart with Tooltip Pin */}
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendNat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="trendAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="trendCpi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1a2745' : '#eef2f8'} vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis domain={[80, 160]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#091022' : '#ffffff',
                      borderColor: isDark ? '#1e3258' : '#e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: isDark ? '#ffffff' : '#0f172a'
                    }}
                  />
                  <Area type="monotone" dataKey="national" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#trendNat)" name="National Index" isAnimationActive={false} />
                  <Area type="monotone" dataKey="avgFare" stroke="#06b6d4" strokeWidth={2} fill="url(#trendAvg)" name="Domestic Avg. Fare" isAnimationActive={false} />
                  <Area type="monotone" dataKey="cpi" stroke="#10b981" strokeWidth={1.5} fill="url(#trendCpi)" name="CPI (Transport)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>

              {/* Exact Floating Tooltip Pin over Sep 14 from image */}
              <div className="absolute right-6 top-1 pointer-events-none flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-lg bg-[#0d1c3a] border border-blue-500/50 shadow-md text-center text-white select-none">
                  <div className="text-[9px] text-slate-400 uppercase font-mono">Latest Index</div>
                  <div className="text-xs font-black font-mono text-blue-300">128.45</div>
                  <div className="text-[9px] text-emerald-400 font-bold">+2.8%</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] ring-2 ring-white dark:ring-[#091022] mt-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Route Heatmap (4 cols) with exact reference design */}
        <div
          onClick={() => navigate('/routes')}
          className="lg:col-span-4 ui-card p-3 flex flex-col justify-between relative cursor-pointer hover:border-blue-500/40 transition-all overflow-hidden"
          title="Click to view interactive Route Intelligence"
        >
          <img
            src={isDark ? '/assets/heatmap_card_dark.png' : '/assets/heatmap_card_light.png'}
            alt="Regional Route Heatmap of India"
            className="w-full h-full max-h-[290px] object-contain rounded-xl select-none"
          />
        </div>

        {/* Card 3: Alerts & Anomalies (3 cols) */}
        <div className="lg:col-span-3 ui-card p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Alerts & Anomalies
                </h3>
              </div>
              <Link
                to="/anomalies"
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All →
              </Link>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {alertsList.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const match = anomalies.find(a => a.routeCode.includes(item.route.split(' ')[0])) || anomalies[0];
                    setSelectedAnomaly(match);
                  }}
                  className="flex items-start justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-1 rounded-lg transition-colors"
                  title="Click to inspect anomaly details"
                >
                  <div className="flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${item.color}`}></span>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800 dark:text-slate-200">
                        <span>{item.route}</span>
                        <span className={item.isHigh ? 'text-rose-500' : 'text-emerald-500'}>
                          {item.change}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Interactive Review Modal */}
      {selectedAnomaly && (
        <AnomalyReviewModal
          anomaly={selectedAnomaly}
          onClose={() => setSelectedAnomaly(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

