import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

export const FiveWhysAccordion = ({ fiveWhys, finalRootCause }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!fiveWhys || fiveWhys.length === 0) {
    return (
      <div className="p-4 rounded border border-[#dfe1e6] bg-white text-xs text-[#5e6c84]">
        No Five Whys steps generated.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {fiveWhys.map((why, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded border ${
                isOpen ? 'border-[#4c9aff] bg-[#f4f5f7]' : 'border-[#dfe1e6] bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-[#deebff] text-[#0052cc] font-bold text-xs flex items-center justify-center">
                    {why.step || idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#172b4d]">
                      {why.question}
                    </h4>
                    {!isOpen && (
                      <p className="text-[11px] text-[#5e6c84] truncate max-w-md mt-0.5">
                        {why.answer}
                      </p>
                    )}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-[#5e6c84] flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#5e6c84] flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-3.5 pb-3 pt-1 border-t border-[#dfe1e6] text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-[#5e6c84] text-[11px] uppercase">Answer: </span>
                    <span className="text-[#172b4d] font-medium">{why.answer}</span>
                  </div>
                  {why.reasoning && (
                    <div className="p-2 rounded bg-white border border-[#dfe1e6] text-[#5e6c84] text-[11px]">
                      <span className="font-semibold text-[#172b4d]">Reasoning: </span>
                      {why.reasoning}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Primary Root Cause Highlight Card */}
      {finalRootCause && (
        <div className="p-3.5 rounded border border-[#abf5d1] bg-[#e3fcef] space-y-1">
          <div className="flex items-center gap-2 text-[#006644] font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Root Cause Deducted via 5 Whys
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#172b4d] pl-6 leading-relaxed">
            {finalRootCause}
          </p>
        </div>
      )}
    </div>
  );
};
