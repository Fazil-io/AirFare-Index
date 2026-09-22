import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  changePct?: number;
  changePeriod?: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  icon: React.ElementType;
  iconColor?: string;
  periodRef: string;
  freshness: string;
  accentBorder?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  changePct,
  changePeriod = 'MoM',
  secondaryLabel,
  secondaryValue,
  icon: Icon,
  iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  periodRef,
  freshness,
  accentBorder
}) => {
  const isPositive = changePct !== undefined && changePct > 0;
  const isNeutral = changePct !== undefined && changePct === 0;

  return (
    <div
      className={`glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between transition-all hover:border-slate-700 ${
        accentBorder ? 'border-l-4 border-l-blue-500' : ''
      }`}
    >
      {/* Top row: Title + Icon */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              {value}
            </span>
            {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
          </div>
        </div>

        <div className={`p-2.5 rounded-lg border ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Middle row: Variations / Changes */}
      <div className="flex items-center gap-3 my-2 pt-1">
        {changePct !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded font-mono ${
              isNeutral
                ? 'bg-slate-800 text-slate-300'
                : isPositive
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {changePct.toFixed(2)}%
            </span>
            <span className="text-[10px] font-normal opacity-80 uppercase ml-0.5">{changePeriod}</span>
          </div>
        )}

        {secondaryLabel && (
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span className="text-slate-300 font-mono font-medium">{secondaryValue}</span>
            <span className="text-[11px]">({secondaryLabel})</span>
          </div>
        )}
      </div>

      {/* Bottom Metadata: Period reference and freshness */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate">Ref: {periodRef}</span>
        <span className="flex items-center gap-1 font-mono shrink-0 text-slate-400">
          <Clock className="w-3 h-3 text-slate-400" />
          {freshness}
        </span>
      </div>
    </div>
  );
};
