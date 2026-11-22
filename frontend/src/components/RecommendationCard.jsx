import React, { useState } from 'react';
import { Zap, Clock, ShieldCheck, CheckSquare, Square } from 'lucide-react';

export const RecommendationCard = ({ recommendations }) => {
  const [completed, setCompleted] = useState({});

  const toggleCheck = (key) => {
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const immediate = recommendations?.immediate || [];
  const shortTerm = recommendations?.shortTerm || [];
  const longTerm = recommendations?.longTerm || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Immediate */}
      <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" /> Immediate Actions (0-2h)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Urgent containment steps to stop service degradation immediately.
          </p>
          <ul className="space-y-2">
            {immediate.map((item, idx) => {
              const key = `imm-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded-lg text-xs transition ${
                    isDone
                      ? 'bg-emerald-500/10 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-rose-300'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Short Term */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4" /> Short-Term Fixes (1-3d)
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Fix configuration, patch logic bugs, and harden runtime boundaries.
          </p>
          <ul className="space-y-2">
            {shortTerm.map((item, idx) => {
              const key = `short-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded-lg text-xs transition ${
                    isDone
                      ? 'bg-emerald-500/10 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-amber-300'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Long Term */}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> Long-Term Prevention
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Prevent recurrence with automated testing, CI gating, and APM alerting.
          </p>
          <ul className="space-y-2">
            {longTerm.map((item, idx) => {
              const key = `long-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded-lg text-xs transition ${
                    isDone
                      ? 'bg-emerald-500/10 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
