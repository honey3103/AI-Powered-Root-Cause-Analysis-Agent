import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const CauseRankingCard = ({ possibleCauses }) => {
  if (!possibleCauses || possibleCauses.length === 0) {
    return (
      <div className="p-4 rounded border border-[#dfe1e6] bg-white text-xs text-[#5e6c84]">
        No possible causes identified yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {possibleCauses.map((cause, idx) => {
        let barColor = 'bg-[#36b37e]';
        let badgeColor = 'bg-[#e3fcef] text-[#006644] border-[#abf5d1]';

        if (cause.confidence >= 80) {
          barColor = 'bg-[#de350b]';
          badgeColor = 'bg-[#ffebe6] text-[#de350b] border-[#ffbdad]';
        } else if (cause.confidence >= 60) {
          barColor = 'bg-[#ff8b00]';
          badgeColor = 'bg-[#fffae6] text-[#ff8b00] border-[#ffe380]';
        }

        return (
          <div
            key={idx}
            className="p-3.5 rounded border border-[#dfe1e6] bg-white space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#ebecf0] text-[#172b4d] font-bold text-[10px] flex items-center justify-center">
                  #{idx + 1}
                </span>
                <h4 className="font-bold text-[#172b4d] text-xs sm:text-sm">
                  {cause.cause}
                </h4>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${badgeColor} self-start sm:self-auto`}>
                {cause.confidence}% Confidence
              </span>
            </div>

            {/* Jira Clean Progress Bar */}
            <div className="w-full bg-[#ebecf0] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full`}
                style={{ width: `${cause.confidence}%` }}
              ></div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#42526e] leading-relaxed">
              {cause.description}
            </p>

            {/* Evidence items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#ebecf0]">
              {cause.supportingEvidence && cause.supportingEvidence.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-[#006644] flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Supporting Evidence:
                  </span>
                  <ul className="list-disc list-inside text-[#5e6c84] space-y-0.5 text-[11px]">
                    {cause.supportingEvidence.map((s, sIdx) => (
                      <li key={sIdx} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cause.contradictingEvidence && cause.contradictingEvidence.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-[#de350b] flex items-center gap-1 text-[11px]">
                    <XCircle className="w-3.5 h-3.5" /> Alternative Points:
                  </span>
                  <ul className="list-disc list-inside text-[#5e6c84] space-y-0.5 text-[11px]">
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
