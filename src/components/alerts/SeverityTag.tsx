import React from 'react';
import { AnomalySeverity, AnomalyStatus } from '../../types';

export const SeverityTag: React.FC<{ severity: AnomalySeverity }> = ({ severity }) => {
  switch (severity) {
    case 'HIGH':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30">
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30">
          MED
        </span>
      );
    case 'LOW':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
          LOW
        </span>
      );
  }
};

export const StatusBadge: React.FC<{ status: AnomalyStatus }> = ({ status }) => {
  switch (status) {
    case 'PENDING_REVIEW':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Pending Review
        </span>
      );
    case 'VALIDATED':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          Validated Anomaly
        </span>
      );
    case 'REJECTED':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          Rejected (Scrape Noise)
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Resolved
        </span>
      );
  }
};
