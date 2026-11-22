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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
      {/* 1. Immediate */}
      <div className="p-4 rounded-xl border border-rose-500/30 bg-[#0d0d12] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Zap className="w-4 h-4 text-rose-500" /> Immediate Actions (0-2h)
          </div>
          <p className="text-[10px] text-zinc-500 font-sans mb-3">
            Urgent containment steps to halt active downtime.
          </p>
          <ul className="space-y-1.5">
            {immediate.map((item, idx) => {
              const key = `imm-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded-lg text-xs border ${
                    isDone
                      ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500 line-through'
                      : 'bg-[#121217] border-zinc-800 text-zinc-200'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="font-sans text-[11px] leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 2. Short Term */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-[#0d0d12] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Clock className="w-4 h-4 text-amber-500" /> Short-Term Hardening (1-3d)
          </div>
          <p className="text-[10px] text-zinc-500 font-sans mb-3">
            Configuration tuning and localized patch deployment.
          </p>
          <ul className="space-y-1.5">
            {shortTerm.map((item, idx) => {
              const key = `short-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded-lg text-xs border ${
                    isDone
                      ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500 line-through'
                      : 'bg-[#121217] border-zinc-800 text-zinc-200'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="font-sans text-[11px] leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 3. Long Term */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#0d0d12] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Long-Term Prevention
          </div>
          <p className="text-[10px] text-zinc-500 font-sans mb-3">
            CI validation gates, alerts, and architectural resilience.
          </p>
          <ul className="space-y-1.5">
            {longTerm.map((item, idx) => {
              const key = `long-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded-lg text-xs border ${
                    isDone
                      ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500 line-through'
                      : 'bg-[#121217] border-zinc-800 text-zinc-200'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="font-sans text-[11px] leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
