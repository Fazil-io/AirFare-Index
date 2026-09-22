import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Plane,
  TrendingUp,
  Clock,
  Landmark,
  Compass,
  Briefcase,
  Sun,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { mockRoutes } from '../services/mockData';
import { DomesticRoute } from '../types';

export const RouteIntelligence: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedRoute, setSelectedRoute] = useState<DomesticRoute | null>(mockRoutes[0]);

  // Filter routes
  const filteredRoutes = mockRoutes.filter(route => {
    const matchesSearch =
      route.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'ALL' || route.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getNssoProfile = (code: string) => {
    switch (code) {
      case 'DEL-BOM':
      case 'BLR-DEL':
        return {
          category: 'Corporate / Business',
          share: '12.9% national urban share',
          benchmarkSpend: '₹8,420',
          icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" />,
          notes: 'High inelastic demand with steep price premium in T-0 to T-3 advance window.'
        };
      case 'BOM-GOI':
      case 'DEL-IXL':
        return {
          category: 'Holidaying & Leisure',
          share: '58.9% national urban share',
          benchmarkSpend: '₹13,026',
          icon: <Sun className="w-3.5 h-3.5 text-indigo-500" />,
          notes: 'Strong seasonal price elasticity. Peak fare surges align with tourist holidays and long weekends.'
        };
      case 'DEL-PAT':
        return {
          category: 'VFR / Family Social',
          share: '25.0% national urban share',
          benchmarkSpend: '₹3,820',
          icon: <Users className="w-3.5 h-3.5 text-emerald-500" />,
          notes: 'High volume, stable baseline load factor with festive festival spikes.'
        };
      default:
        return {
          category: 'Inter-State Commercial',
          share: 'Mixed Purpose',
          benchmarkSpend: '₹7,200',
          icon: <Compass className="w-3.5 h-3.5 text-amber-500" />,
          notes: 'Standard multi-purpose regional traffic with moderate seasonal variation.'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="ui-card p-4 border flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by route (DEL-BOM) or city (Goa, Delhi)..."
            className="w-full bg-slate-50 dark:bg-[#060b17] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tier filter pill buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5" /> Tier:
          </span>
          {['ALL', 'Metro-Metro', 'Metro-NonMetro', 'UDAN-Regional'].map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedTier === tier
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Routes Table (Left 2 cols) + Route Inspector Drawer (Right 1 col) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Corridor Table */}
        <div className="xl:col-span-2 ui-card p-5 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Domestic Route Directory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click any corridor to inspect carrier breakdown, NSSO travel profile, and lead-time curves</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Showing {filteredRoutes.length} of {mockRoutes.length} corridors
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase font-mono text-[11px]">
                <tr>
                  <th className="px-3.5 py-3">Corridor</th>
                  <th className="px-3.5 py-3">Cities</th>
                  <th className="px-3.5 py-3">Avg Fare</th>
                  <th className="px-3.5 py-3">7d Δ</th>
                  <th className="px-3.5 py-3">Index</th>
                  <th className="px-3.5 py-3">Volatility</th>
                  <th className="px-3.5 py-3">Lead Carrier</th>
                  <th className="px-3.5 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
                {filteredRoutes.map(route => {
                  const isSelected = selectedRoute?.id === route.id;
                  const isSurge = route.pctChange7d > 0;
                  return (
                    <tr
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-2 border-l-blue-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-3.5 py-3 text-blue-600 dark:text-blue-400 font-bold">{route.code}</td>
                      <td className="px-3.5 py-3 font-sans text-slate-900 dark:text-slate-200">
                        {route.originCity} → {route.destCity}
                      </td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">
                        ₹{route.currentFare.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3.5 py-3">
                        <span
                          className={`font-semibold flex items-center gap-0.5 ${
                            isSurge ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isSurge ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isSurge ? '+' : ''}{route.pctChange7d.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-slate-800 dark:text-slate-200 font-bold">{route.routeIndex.toFixed(1)}</td>
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold ${route.volatilityScore > 70 ? 'text-rose-500' : route.volatilityScore > 50 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {route.volatilityScore}
                          </span>
                          <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${route.volatilityScore > 70 ? 'bg-rose-500' : route.volatilityScore > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${route.volatilityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-sans">{route.dominantAirline}</td>
                      <td className="px-3.5 py-3 text-right font-sans">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-semibold">
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Route Detailed Inspector */}
        {selectedRoute ? (
          <div className="ui-card p-5 border space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-mono text-slate-900 dark:text-white">{selectedRoute.code}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold">
                    {selectedRoute.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                  {selectedRoute.originCity} ({selectedRoute.originIata}) ↔ {selectedRoute.destCity} ({selectedRoute.destIata})
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-mono">Basket Weight</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {(selectedRoute.passengerWeight * 100).toFixed(1)}% Share
                </span>
              </div>
            </div>

            {/* NSSO Tourism Survey Profile Badge */}
            {(() => {
              const profile = getNssoProfile(selectedRoute.code);
              return (
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {profile.icon} NSSO Profile: {profile.category}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Spend: {profile.benchmarkSpend}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                    {profile.notes} ({profile.share})
                  </p>
                </div>
              );
            })()}

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Current Mean Fare</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  ₹{selectedRoute.currentFare.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Corridor Index</span>
                <span className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
                  {selectedRoute.routeIndex.toFixed(1)} pts
                </span>
              </div>
            </div>

            {/* 30-Day Historical Fare Trend */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                30-Day Fare Movement (₹)
              </span>
              <div className="h-36 w-full bg-slate-50 dark:bg-slate-950/60 rounded-xl p-2 border border-slate-200 dark:border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedRoute.trend30d} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px', color: '#fff' }}
                      formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Fare']}
                    />
                    <Line isAnimationActive={false} type="monotone" dataKey="fare" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lead-Time Curve */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Lead-Time Pricing Profile
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                {Object.entries(selectedRoute.leadTimeFares).map(([window, fare]) => (
                  <div key={window} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-600 dark:text-slate-400 font-sans">{window}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">₹{fare.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Airline Market Share on Route */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Carrier Competition & Pricing Spread
              </span>
              <div className="space-y-2">
                {selectedRoute.airlines.map((carrier, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-200 block">{carrier.airline}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {carrier.flightCount} daily flights • {(carrier.marketShare * 100).toFixed(0)}% share
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">₹{carrier.avgFare.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400 block">avg fare</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="ui-card p-8 border flex flex-col items-center justify-center text-center text-slate-400">
            <Plane className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs">Select a corridor to view detailed intelligence</p>
          </div>
        )}
      </div>
    </div>
  );
};
