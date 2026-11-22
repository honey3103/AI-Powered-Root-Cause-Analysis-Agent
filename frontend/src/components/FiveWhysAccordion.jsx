import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, CheckCircle2, ArrowDown } from 'lucide-react';

export const FiveWhysAccordion = ({ fiveWhys, finalRootCause }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!fiveWhys || fiveWhys.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-500">
        No Five Whys steps generated.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fiveWhys.map((why, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="relative">
              {/* Connector line between steps */}
              {idx < fiveWhys.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-sky-200 dark:bg-sky-900/60 z-0"></div>
              )}

              <div
                className={`relative z-10 rounded-xl border transition-all ${
                  isOpen
                    ? 'border-sky-500/40 bg-sky-50/40 dark:bg-sky-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-sm flex items-center justify-center border border-sky-500/20">
                      W{why.step || idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {why.question}
                      </h4>
                      {!isOpen && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md sm:max-w-xl">
                          {why.answer}
                        </p>
                      )}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-sky-100 dark:border-sky-900/30 text-xs space-y-2 mt-1">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Answer: </span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {why.answer}
                      </span>
                    </div>
                    {why.reasoning && (
                      <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-500 dark:text-slate-400">Underlying reasoning: </span>
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

      {/* Final Identified Root Cause Card */}
      {finalRootCause && (
        <div className="mt-4 p-4 rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Root Cause Deduced from 5 Whys
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed pl-7">
            {finalRootCause}
          </p>
        </div>
      )}
    </div>
  );
};
