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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
      {/* 1. Immediate */}
      <div className="p-3.5 rounded border border-[#dfe1e6] bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[#de350b] font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-[#de350b]" /> Immediate Actions (0-2h)
          </div>
          <p className="text-[11px] text-[#5e6c84] mb-2.5">
            Emergency containment steps.
          </p>
          <ul className="space-y-1.5">
            {immediate.map((item, idx) => {
              const key = `imm-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded text-xs border ${
                    isDone
                      ? 'bg-[#f4f5f7] border-[#dfe1e6] text-[#8993a4] line-through'
                      : 'bg-[#fafbfc] border-[#dfe1e6] text-[#172b4d] hover:bg-white'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#006644] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-[#5e6c84] flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 2. Short Term */}
      <div className="p-3.5 rounded border border-[#dfe1e6] bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[#ff8b00] font-bold text-xs uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-[#ff8b00]" /> Short-Term Fixes (1-3d)
          </div>
          <p className="text-[11px] text-[#5e6c84] mb-2.5">
            Hardening and configuration tuning.
          </p>
          <ul className="space-y-1.5">
            {shortTerm.map((item, idx) => {
              const key = `short-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded text-xs border ${
                    isDone
                      ? 'bg-[#f4f5f7] border-[#dfe1e6] text-[#8993a4] line-through'
                      : 'bg-[#fafbfc] border-[#dfe1e6] text-[#172b4d] hover:bg-white'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#006644] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-[#5e6c84] flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 3. Long Term */}
      <div className="p-3.5 rounded border border-[#dfe1e6] bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[#006644] font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006644]" /> Long-Term Prevention
          </div>
          <p className="text-[11px] text-[#5e6c84] mb-2.5">
            CI validation gates &amp; architecture.
          </p>
          <ul className="space-y-1.5">
            {longTerm.map((item, idx) => {
              const key = `long-${idx}`;
              const isDone = completed[key];
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(key)}
                  className={`cursor-pointer flex items-start gap-2 p-2 rounded text-xs border ${
                    isDone
                      ? 'bg-[#f4f5f7] border-[#dfe1e6] text-[#8993a4] line-through'
                      : 'bg-[#fafbfc] border-[#dfe1e6] text-[#172b4d] hover:bg-white'
                  }`}
                >
                  {isDone ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#006644] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-[#5e6c84] flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
