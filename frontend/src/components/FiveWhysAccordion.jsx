import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

export const FiveWhysAccordion = ({ fiveWhys, finalRootCause }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!fiveWhys || fiveWhys.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0d0d12] text-xs font-mono text-zinc-400">
        No Five Whys steps generated.
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="space-y-2.5">
        {fiveWhys.map((why, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="relative">
              {/* Vertical connector line */}
              {idx < fiveWhys.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-[1px] bg-zinc-800 z-0"></div>
              )}

              <div
                className={`relative z-10 rounded-xl border ${
                  isOpen
                    ? 'border-emerald-500/40 bg-[#0f0f16]'
                    : 'border-zinc-800 bg-[#0d0d12]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 font-bold text-xs flex items-center justify-center">
                      W{why.step || idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">
                        {why.question}
                      </h4>
                      {!isOpen && (
                        <p className="text-[11px] text-zinc-400 truncate max-w-md sm:max-w-xl font-sans mt-0.5">
                          {why.answer}
                        </p>
                      )}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-800/80 text-xs space-y-2 mt-1">
                    <div>
                      <span className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider">Answer: </span>
                      <span className="text-zinc-100 font-sans font-medium">
                        {why.answer}
                      </span>
                    </div>
                    {why.reasoning && (
                      <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-[11px] font-sans">
                        <span className="font-semibold text-zinc-500 font-mono">Underlying Reasoning: </span>
                        {why.reasoning}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Root Cause Highlight Card */}
      {finalRootCause && (
        <div className="mt-4 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Primary Root Cause Pinpointed (via 5 Whys Deduction)
          </div>
          <p className="text-xs sm:text-sm font-sans font-semibold text-zinc-100 pl-6 leading-relaxed">
            {finalRootCause}
          </p>
        </div>
      )}
    </div>
  );
};
