import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const CauseRankingCard = ({ possibleCauses }) => {
  if (!possibleCauses || possibleCauses.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-500">
        No possible causes identified yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {possibleCauses.map((cause, idx) => {
        // Color coding based on confidence
        let barColor = 'bg-sky-500';
        let textColor = 'text-sky-600 dark:text-sky-400';
        if (cause.confidence >= 80) {
          barColor = 'bg-rose-500';
          textColor = 'text-rose-600 dark:text-rose-400';
        } else if (cause.confidence >= 60) {
          barColor = 'bg-amber-500';
          textColor = 'text-amber-600 dark:text-amber-400';
        }

        return (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {cause.cause}
                </h4>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`text-xs font-bold ${textColor}`}>
                  {cause.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                style={{ width: `${cause.confidence}%` }}
              ></div>
            </div>

            {/* Cause description */}
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {cause.description}
            </p>

            {/* Supporting & Contradicting Evidence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {cause.supportingEvidence && cause.supportingEvidence.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Supporting Evidence:
                  </span>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                    {cause.supportingEvidence.map((s, sIdx) => (
                      <li key={sIdx} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cause.contradictingEvidence && cause.contradictingEvidence.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Alternative / Contradicting:
                  </span>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                    {cause.contradictingEvidence.map((c, cIdx) => (
                      <li key={cIdx} className="truncate">{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
