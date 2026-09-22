import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar
} from 'recharts';

export const LeadTimeAnalysis: React.FC = () => {
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');

  // Realistic escalation data: Day -30 to Day 0
  const escalationCurveData = [
    { daysOut: '30d+', allCarriers: 4350, indigo: 4200, airIndia: 4600, akasa: 3950 },
    { daysOut: '25d', allCarriers: 4420, indigo: 4250, airIndia: 4700, akasa: 4000 },
    { daysOut: '20d', allCarriers: 4600, indigo: 4450, airIndia: 4900, akasa: 4150 },
    { daysOut: '15d', allCarriers: 5450, indigo: 5300, airIndia: 5800, akasa: 4900 },
    { daysOut: '10d', allCarriers: 6100, indigo: 5950, airIndia: 6450, akasa: 5500 },
    { daysOut: '7d', allCarriers: 6950, indigo: 6800, airIndia: 7350, akasa: 6300 },
    { daysOut: '5d', allCarriers: 7800, indigo: 7650, airIndia: 8200, akasa: 7100 },
    { daysOut: '3d', allCarriers: 8950, indigo: 8800, airIndia: 9400, akasa: 8200 },
    { daysOut: '2d', allCarriers: 9800, indigo: 9650, airIndia: 10400, akasa: 9100 },
    { daysOut: '1d (T-1)', allCarriers: 10600, indigo: 10400, airIndia: 11200, akasa: 9900 },
    { daysOut: '0d (T-0)', allCarriers: 11250, indigo: 11100, airIndia: 11950, akasa: 10400 }
  ];

  // Corridor lead-time grouped bar data
  const routeLeadTimeData = [
    { route: 'DEL → BOM', t0: 165, t7: 112, t15: 85, t30: 60 },
    { route: 'BLR → HYD', t0: 110, t7: 95, t15: 125, t30: 80 },
    { route: 'MAA → CCU', t0: 108, t7: 122, t15: 98, t30: 65 },
    { route: 'BOM → DEL', t0: 85, t7: 75, t15: 110, t30: 92 },
    { route: 'CCU → BLR', t0: 102, t7: 95, t15: 135, t30: 88 }
  ];

  // Lead-time window comparison cards
  const windowMetrics = [
    {
      window: 'T-0 (Same Day)',
      range: '0 - 24 Hours to Departure',
      avgFare: 11250,
      volatility: '88/100',
      surgeMultiplier: '2.58x vs T-30+',
      observationShare: '18% of observations',
      color: 'border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
    },
    {
      window: 'T-7 (1-Week Advance)',
      range: '2 - 7 Days to Departure',
      avgFare: 6950,
      volatility: '64/100',
      surgeMultiplier: '1.60x vs T-30+',
      observationShare: '31% of observations',
      color: 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
    },
    {
      window: 'T-15 (2-Weeks Advance)',
      range: '8 - 15 Days to Departure',
      avgFare: 5450,
      volatility: '42/100',
      surgeMultiplier: '1.25x vs T-30+',
      observationShare: '27% of observations',
      color: 'border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
    },
    {
      window: 'T-30+ (Advance Booking)',
      range: '16 - 30+ Days to Departure',
      avgFare: 4350,
      volatility: '21/100',
      surgeMultiplier: '1.00x Baseline',
      observationShare: '24% of observations',
      color: 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="ui-card p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
              YIELD MANAGEMENT SURVEILLANCE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Booking Horizon Deconstruction</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Dynamic Pricing & Lead-Time Decay Curves
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl mt-1">
            Separates fares across booking advance windows (T-0, T-7, T-15, and T-30+) to distinguish structural airline inflation from aggressive short-term revenue-management yield surges.
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar flex-nowrap shrink-0 self-start md:self-auto w-full md:w-auto">
          <span className="text-slate-500 dark:text-slate-400 px-1.5 sm:px-2 font-mono text-[10px] sm:text-[11px] shrink-0">Carrier:</span>
          {['ALL', 'IndiGo', 'Air India', 'Akasa Air'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedAirline(c)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 text-xs ${
                selectedAirline === c
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Window Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {windowMetrics.map(item => (
          <div key={item.window} className={`ui-card rounded-xl p-4.5 border ${item.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase">{item.window}</span>
              <Clock className="w-4 h-4 opacity-75" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.range}</p>

            <div className="mt-3">
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                ₹{item.avgFare.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] font-semibold block mt-0.5">{item.surgeMultiplier}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Vol: {item.volatility}</span>
              <span>{item.observationShare}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dynamic Escalation Curve */}
      <div className="ui-card p-5 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Price Escalation Velocity Curve (30 Days Out to Departure)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Empirical fare trajectory as seats fill and booking window contracts
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">National Weighted Composite</span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={escalationCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="daysOut" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v/1000}k`} domain={[3000, 13000]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#fff' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line isAnimationActive={false} type="monotone" dataKey="allCarriers" stroke="#3b82f6" strokeWidth={3} name="All Domestic Carriers" dot={{ r: 4 }} />
              <Line isAnimationActive={false} type="monotone" dataKey="indigo" stroke="#06b6d4" strokeWidth={2} name="IndiGo" strokeDasharray="3 3" />
              <Line isAnimationActive={false} type="monotone" dataKey="airIndia" stroke="#ef4444" strokeWidth={2} name="Air India" />
              <Line isAnimationActive={false} type="monotone" dataKey="akasa" stroke="#f97316" strokeWidth={2} name="Akasa Air" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Inflation Policy Note: </span>
            A spike in <span className="text-rose-500 font-mono font-semibold">T-0</span> fares without a commensurate rise in <span className="text-emerald-500 font-mono font-semibold">T-30+</span> fares indicates short-term capacity pinch or revenue-management yield maximization rather than generalized baseline airline cost inflation. MoSPI CPI augmentation incorporates lead-time weights to ensure structural signals are preserved.
          </div>
        </div>
      </div>

      {/* Multi-Corridor Lead-Time Comparison Bar Chart */}
      <div className="ui-card p-5 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Corridor-Wise Lead-Time Window Index Comparison
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparison of price indices across T-0, T-7, T-15, and T-30+ booking horizons for top Indian routes
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> T-0
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> T-7
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> T-15
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span> T-30+
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeLeadTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
              <XAxis dataKey="route" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 200]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="t0" fill="#6366f1" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="t7" fill="#3b82f6" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="t15" fill="#c084fc" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="t30" fill="#2dd4bf" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
