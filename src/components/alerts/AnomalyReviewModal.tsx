import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Info, Calendar, User, ShieldAlert, Lock } from 'lucide-react';
import { AnomalyRecord, AnomalyStatus } from '../../types';
import { SeverityTag, StatusBadge } from './SeverityTag';
import { isGuestRole } from '../../services/storage';

interface AnomalyReviewModalProps {
  anomaly: AnomalyRecord | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: AnomalyStatus, notes: string) => void;
}

export const AnomalyReviewModal: React.FC<AnomalyReviewModalProps> = ({
  anomaly,
  onClose,
  onUpdateStatus
}) => {
  if (!anomaly) return null;

  const isGuest = isGuestRole();
  const [notes, setNotes] = useState(anomaly.reviewNotes || '');

  const handleAction = (status: AnomalyStatus) => {
    if (isGuest) return;
    onUpdateStatus(anomaly.id, status, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 font-mono">{anomaly.id}</h3>
                <SeverityTag severity={anomaly.severity} />
                <StatusBadge status={anomaly.status} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Route: <span className="text-slate-200 font-semibold">{anomaly.routeCode}</span> ({anomaly.origin} → {anomaly.destination})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Comparison Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Observed Fare</span>
              <span className="text-xl font-bold font-mono text-rose-400">
                ₹{anomaly.observedFare.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">From: {anomaly.source}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Expected Corridor Range</span>
              <span className="text-base font-bold font-mono text-slate-300">
                ₹{anomaly.expectedMin.toLocaleString('en-IN')} - ₹{anomaly.expectedMax.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">30d Normative Band</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Statistical Z-Score</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {anomaly.zScore > 0 ? `+${anomaly.zScore}` : anomaly.zScore}σ
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Historical Median: ₹{anomaly.historicalMedian.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Rule Triggered */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/50 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-blue-300">Detection Logic: </span>
              <span className="text-slate-300">{anomaly.ruleTriggered}</span>
            </div>
          </div>

          {/* Peer Airlines Comparison Table */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Cross-Airline Peer Comparison (Same Departure Window)
            </span>
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800/60 text-slate-400 text-[11px] uppercase">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Airline / Flight</th>
                    <th className="px-4 py-2 font-semibold">Observed Quote</th>
                    <th className="px-4 py-2 font-semibold">Divergence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {anomaly.peerComparison.map((peer, idx) => {
                    const diff = peer.fare - anomaly.historicalMedian;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="px-4 py-2.5 text-slate-300 font-sans font-medium">{peer.airline}</td>
                        <td className="px-4 py-2.5 text-slate-100 font-bold">₹{peer.fare.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2.5">
                          <span className={diff > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                            {diff > 0 ? `+₹${diff.toLocaleString('en-IN')}` : `-₹${Math.abs(diff).toLocaleString('en-IN')}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contextual Intelligence / External Drivers */}
          {anomaly.calendarContext && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Calendar & Regional Context: </span>
                <span className="text-slate-400">{anomaly.calendarContext}</span>
              </div>
            </div>
          )}

          {/* Reviewer Notes Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Officer Adjudication Notes & Justification
              </span>
              {isGuest && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                  <Lock className="w-3 h-3" /> Read-Only
                </span>
              )}
            </label>
            <textarea
              rows={3}
              value={notes}
              disabled={isGuest}
              onChange={e => setNotes(e.target.value)}
              placeholder={isGuest ? "Guest Mode (Read-Only): Adjudication notes and comments cannot be modified." : "Enter statistical reasoning before committing validation, rejection or resolution..."}
              className={`w-full border rounded-xl p-3 text-xs font-sans resize-none transition-all ${
                isGuest
                  ? 'bg-slate-950/60 border-slate-800 text-slate-400 cursor-not-allowed placeholder:text-slate-600'
                  : 'bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Modal Footer / Review Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            {isGuest ? (
              <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                <Lock className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>Guest Mode: Adjudication, noise rejection, and outlier confirmation restricted to VayuSuchak Officers.</span>
              </span>
            ) : (
              '*Review creates an append-only audit event in the VayuSuchak registry.'
            )}
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isGuest ? (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
              >
                Close View
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleAction('REJECTED')}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  Reject as Scrape Noise
                </button>
                <button
                  onClick={() => handleAction('RESOLVED')}
                  className="px-3 py-1.5 rounded-lg border border-emerald-700/60 bg-emerald-950/60 text-xs text-emerald-300 hover:bg-emerald-900/80 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Resolve (Market Surge)
                </button>
                <button
                  onClick={() => handleAction('VALIDATED')}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-xs font-semibold text-white hover:bg-rose-500 shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Validate as Outlier
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
