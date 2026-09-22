import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Landmark,
  Compass,
  Briefcase,
  Users,
  Sun
} from 'lucide-react';
import { mockExplainabilityTree, officialNssoTravel } from '../services/mockData';
import { IndexContributionNode } from '../types';

export const Explainability: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'National Airfare Price Index': true,
    'Delhi - Mumbai (DEL-BOM)': true,
    'IndiGo (Market Share: 54%)': true
  });

  const toggleNode = (name: string) => {
    setExpandedNodes(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const renderNode = (node: IndexContributionNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.name];

    return (
      <div key={node.name} className="flex flex-col">
        {/* Node Bar */}
        <div
          onClick={() => hasChildren && toggleNode(node.name)}
          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all my-1 gap-2 ${
            hasChildren ? 'cursor-pointer hover:border-blue-500/50' : ''
          } ${
            depth === 0
              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/50 shadow-sm'
              : depth === 1
              ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 ml-2 sm:ml-6'
              : depth === 2
              ? 'bg-slate-50/80 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800/80 ml-4 sm:ml-12'
              : 'bg-slate-100/50 dark:bg-slate-950/60 border-slate-200/50 dark:border-slate-800/50 ml-6 sm:ml-16'
          }`}
        >
          {/* Left: Expander & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {hasChildren ? (
              <button className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{node.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                  Weight: {(node.weight * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                Val: ₹{node.currentValue.toLocaleString('en-IN')} (Prev: ₹{node.previousValue.toLocaleString('en-IN')})
              </div>
            </div>
          </div>

          {/* Right: Contribution Points and Share */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 text-right font-mono self-end sm:self-auto border-t sm:border-t-0 pt-1.5 sm:pt-0 w-full sm:w-auto border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center sm:justify-end gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{node.contributionPoints.toFixed(2)} pts
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Contribution</span>
            </div>

            <div className="w-20 text-right">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {node.percentageShare.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">of Rise</span>
            </div>
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col border-l-2 border-slate-200 dark:border-slate-800 ml-2 sm:ml-4 pl-1">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="ui-card p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
              AUDITABLE EXPLAINABILITY ENGINE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Laspeyres / Fisher Decomposition & NSSO Weighting
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Index Movement Decomposition & Factor Attribution
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl mt-1">
            Deconstructs the headline National Airfare Index movement (+3.24 points MoM) down to individual corridor contributions, advance booking windows, airline pricing shifts, and NSSO travel expenditure patterns.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right font-mono self-start md:self-auto">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-sans">Total Net Movement</span>
          <span className="text-base font-bold text-rose-500 dark:text-rose-400">+3.24 Index Points (+2.81%)</span>
        </div>
      </div>

      {/* NSSO Domestic Tourism Survey Attribution Grid */}
      <div className="ui-card p-5 border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              NSSO Domestic Tourism Survey (79th Round) Travel Basket Weights
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Dataset: Table 2 & Table 5 Grounding</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          In MoSPI's official methodology, route baskets are weighted using NSSO consumption and travel survey expenditure profiles across major travel purposes:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" /> Holiday / Leisure
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-200/60 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded text-indigo-800 dark:text-indigo-300">
                58.9%
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">₹13,026</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Avg expenditure per trip. Contributes <strong className="text-slate-700 dark:text-slate-200">+1.18 pts</strong> via Goa, Srinagar, and Bagdogra routes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Corporate / Business
              </span>
              <span className="text-[10px] font-mono font-bold bg-blue-200/60 dark:bg-blue-900/60 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-300">
                12.9%
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">₹8,420</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              High-yield inelastic travel. Contributes <strong className="text-slate-700 dark:text-slate-200">+1.42 pts</strong> via last-minute T-0 surge on DEL-BOM.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Social / VFR Trips
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300">
                25.0%
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">₹3,820</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Visiting family / relatives. Stable base demand. Contributes <strong className="text-slate-700 dark:text-slate-200">+0.48 pts</strong> nationwide.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Pilgrimage & Medical
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-300">
                3.2%
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1">₹5,100</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Tier-2 devotional routes (Varanasi, Amritsar). Contributes <strong className="text-slate-700 dark:text-slate-200">+0.16 pts</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Drill-down Flow Diagram Path */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1.5 shrink-0">
          <Layers className="w-3.5 h-3.5" /> 1. National Index
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold shrink-0">
          2. Corridor Contribution
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold shrink-0">
          3. Airline / Source Weight
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold shrink-0">
          4. Booking Lead-Time Window
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold shrink-0">
          5. Observation Audit ID
        </span>
      </div>

      {/* Interactive Drill-down Tree */}
      <div className="ui-card p-5 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hierarchical Attribution Tree</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click arrows to expand and trace contributions down to individual booking windows</p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Formula: Fisher Composite v2.4</span>
        </div>

        <div className="space-y-1">
          {renderNode(mockExplainabilityTree, 0)}
        </div>
      </div>

      {/* Bottom Methodology & Lineage Verification Box */}
      <div className="p-4 rounded-xl ui-card border grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Formula Version</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">mospi.cpi.airfare.engine.v2.4.1</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Mathematical Verification</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Decomposition Sum = 100.0% Exact</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Baseline Version</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">MoSPI 2024=100 & NSSO 79th Round Basket</span>
          </div>
        </div>
      </div>
    </div>
  );
};
