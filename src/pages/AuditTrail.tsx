import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Terminal,
  Hash,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { mockAuditTrail } from '../services/mockData';
import { AuditRecord } from '../types';

export const AuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  const filtered = mockAuditTrail.filter(item => {
    const matchesSearch =
      item.runId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'ALL' || item.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              IMMUTABLE APPEND-ONLY LINEAGE
            </span>
            <span className="text-xs text-slate-400">Cryptographic Integrity Ledger</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Data Lineage & Pipeline Audit Trail
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-1">
            Every airfare observation, normalization pass, lead-time classification, and index aggregation run is recorded with cryptographic SHA-256 hashes and schema versions to guarantee statistical reproducibility.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <span className="font-bold text-slate-100 block">Ledger Status: Verified</span>
            <span className="text-[10px] text-slate-400 font-mono">Chain Height: #99,120</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Run ID, Hash (sha256:...), or notes..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto no-scrollbar flex-nowrap w-full md:w-auto shrink-0 select-none pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-mono shrink-0">Stage:</span>
          {[
            'ALL',
            'Data Collection',
            'Cleaning & Normalization',
            'Lead-Time Classification',
            'Anomaly Scoring',
            'Statistical Index Engine'
          ].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedStage === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All Stages' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Trail Timeline */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Chronological Execution Records</h3>
            <p className="text-xs text-slate-400">Traceable pipeline lifecycle from raw collection to published index value</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Run: RUN-20260914-1700 (Latest Batch)</span>
        </div>

        <div className="relative border-l-2 border-slate-800 ml-2 sm:ml-4 space-y-6">
          {filtered.map(record => (
            <div key={record.id} className="relative pl-4 sm:pl-6">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              </div>

              {/* Record Content Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3">
                {/* Top Row: Stage + Time + Run ID */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                      {record.stage}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {record.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {record.timestamp}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {record.runId}
                    </span>
                  </div>
                </div>

                {/* Middle: Notes & Operation Details */}
                <p className="text-xs text-slate-200">{record.notes}</p>

                {/* Bottom Row: Metadata Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono pt-1 text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Schema Version</span>
                    <span className="text-slate-300 truncate block">{record.schemaVersion}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Formula Logic</span>
                    <span className="text-slate-300 truncate block">{record.formulaVersion}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Records Processed</span>
                    <span className="text-slate-300">
                      {record.inputRecords.toLocaleString('en-IN')} → {record.outputRecords.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Operator / Service</span>
                    <span className="text-blue-400 truncate block">{record.operator}</span>
                  </div>
                </div>

                {/* Cryptographic Hash */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-slate-400 font-semibold shrink-0">Integrity:</span>
                    <span className="text-slate-300 truncate text-[9px] sm:text-[10px]">{record.hash}</span>
                  </div>
                  <span className="text-emerald-400 shrink-0 flex items-center gap-1 self-end sm:self-auto">
                    <CheckCircle2 className="w-3 h-3" /> Signed & Audited
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
