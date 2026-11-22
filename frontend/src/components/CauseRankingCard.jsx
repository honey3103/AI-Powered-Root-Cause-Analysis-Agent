import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const CauseRankingCard = ({ possibleCauses }) => {
  if (!possibleCauses || possibleCauses.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0d0d12] text-xs font-mono text-zinc-400">
        No possible causes identified yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono">
      {possibleCauses.map((cause, idx) => {
        let barColor = 'bg-emerald-400';
        let textColor = 'text-emerald-400';
        let borderColor = 'border-zinc-800';

        if (cause.confidence >= 80) {
          barColor = 'bg-rose-500';
          textColor = 'text-rose-400';
          borderColor = 'border-rose-500/30 bg-rose-950/10';
        } else if (cause.confidence >= 60) {
          barColor = 'bg-amber-400';
          textColor = 'text-amber-400';
          borderColor = 'border-amber-500/20 bg-amber-950/5';
        }

        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${borderColor} bg-[#0d0d12]`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[10px] flex items-center justify-center">
                  #{idx + 1}
                </span>
                <h4 className="font-bold text-zinc-100 text-xs sm:text-sm">
                  {cause.cause}
                </h4>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`text-xs font-bold ${textColor}`}>
                  {cause.confidence}% Confidence
                </span>
              </div>
            </div>

            {/* Solid Progress bar without animation */}
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-3 border border-zinc-800">
              <div
                className={`h-full ${barColor} rounded-full`}
                style={{ width: `${cause.confidence}%` }}
              ></div>
            </div>

            {/* Cause description */}
            <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-3">
              {cause.description}
            </p>

            {/* Supporting & Contradicting Evidence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-zinc-800/80">
              {cause.supportingEvidence && cause.supportingEvidence.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> SUPPORTING EVIDENCE:
                  </span>
                  <ul className="list-disc list-inside text-zinc-400 space-y-0.5 text-[10px]">
                    {cause.supportingEvidence.map((s, sIdx) => (
                      <li key={sIdx} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cause.contradictingEvidence && cause.contradictingEvidence.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-rose-400 flex items-center gap-1 text-[10px]">
                    <XCircle className="w-3 h-3" /> CONTRADICTING / ALTERNATIVE:
                  </span>
                  <ul className="list-disc list-inside text-zinc-400 space-y-0.5 text-[10px]">
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
