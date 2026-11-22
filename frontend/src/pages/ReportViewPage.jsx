/**
 * Project: AI-Powered Root Cause Analysis Agent
 * Developer: Harsh (CSE)
 * File: ReportViewPage.jsx
 * Description: Formats an incident investigation into a formal printable 
 *              post-mortem report and audit sheet.
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CheckCircle, 
  Zap, 
  Clock, 
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const ReportViewPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // load report data
  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/analysis/${id}/report`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = () => {
    const token = localStorage.getItem('rca_token');
    window.open(`/api/analysis/${id}/report/pdf?token=${token}`, '_blank');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Formatting post-mortem audit report...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.analysis) {
    return (
      <div className="p-8 text-center text-xs font-mono">
        <h2>Report document not found.</h2>
        <Link to="/dashboard" className="text-sky-500 hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, result, evidenceList, generatedAt } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5 font-sans">
      {/* Top action controls (hidden on print) */}
      <div className="no-print flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Link
          to={`/analysis/${analysis._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Incident
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-6 text-slate-800 dark:text-slate-200 text-xs">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                INCIDENT ROOT CAUSE POST-MORTEM REPORT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Ref: INC-{analysis._id.substring(0, 8).toUpperCase()} • Project: AI-Powered RCA Agent
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-400 font-mono space-y-0.5">
            <div>Date: {new Date(generatedAt || Date.now()).toLocaleDateString()}</div>
            <div>Severity: <span className="font-bold text-rose-500">{analysis.severity}</span></div>
            <div>State: {analysis.status}</div>
          </div>
        </div>

        {/* Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">CATEGORY</span>
            <span className="font-semibold">{analysis.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">TIME OCCURRED</span>
            <span className="font-semibold truncate block">{analysis.timeOfOccurrence || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">RECENT DEPLOY</span>
            <span className="font-semibold truncate block">{analysis.recentChanges || 'None noted'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">EVIDENCE FILES</span>
            <span className="font-semibold">{evidenceList?.length || 0} attached</span>
          </div>
        </div>

        {/* 1. Problem Summary */}
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
            1. Incident Statement &amp; Symptoms
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {analysis.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {result?.problemSummary || analysis.description}
          </p>
        </div>

        {/* 2. Confirmed Root Cause */}
        <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-1">
          <span className="font-mono text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300 block">
            2. Determined Primary Root Cause
          </span>
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {result?.finalRootCause || result?.mostLikelyCause}
          </p>
          {result?.confidenceAssessment && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {result.confidenceAssessment}
            </p>
          )}
        </div>

        {/* 3. Ranked Causes */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
            3. Evaluated Root Causes
          </span>
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-2 w-8 text-center">#</th>
                <th className="p-2">Potential Cause</th>
                <th className="p-2 w-24 text-center">Confidence</th>
                <th className="p-2">Supporting Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:border-slate-800">
              {(result?.possibleCauses || []).map((cause, idx) => (
                <tr key={idx}>
                  <td className="p-2 text-center font-mono">{idx + 1}</td>
                  <td className="p-2">
                    <div className="font-semibold text-slate-900 dark:text-white">{cause.cause}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{cause.description}</div>
                  </td>
                  <td className="p-2 text-center font-mono font-bold text-sky-600 dark:text-sky-400">
                    {cause.confidence}%
                  </td>
                  <td className="p-2 text-[11px] text-slate-500">
                    {(cause.supportingEvidence || []).join('; ') || 'Observed symptom correlation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Five Whys */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
            4. Five Whys Deductive Sequence
          </span>
          <div className="space-y-1.5">
            {(result?.fiveWhys || []).map((why, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-0.5"
              >
                <div className="font-mono font-bold text-sky-600 dark:text-sky-400 text-[11px]">
                  Why {why.step || idx + 1}: {why.question}
                </div>
                <div className="text-slate-800 dark:text-slate-200 pl-3">
                  ↳ {why.answer}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Remediation Plan */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
            5. Action Plan &amp; Preventive Countermeasures
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
              <span className="font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400 block">
                IMMEDIATE (0-2h)
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                {(result?.recommendations?.immediate || []).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
              <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                SHORT-TERM (1-3d)
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                {(result?.recommendations?.shortTerm || []).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
              <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                LONG-TERM PREVENTION
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                {(result?.recommendations?.longTerm || []).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Student submission footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between items-center">
          <span>Project: Root Cause Analyser • Mini Project 2026</span>
          <span>Investigator / Student: Harsh (CSE)</span>
        </div>
      </div>
    </div>
  );
};
