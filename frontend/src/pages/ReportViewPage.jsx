import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ShieldCheck,
  Terminal,
  Activity
} from 'lucide-react';

export const ReportViewPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="p-8 flex items-center justify-center min-h-[400px] font-mono">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-emerald-400 rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-500">Formatting Coroot post-mortem report...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.analysis) {
    return (
      <div className="p-8 text-center text-xs font-mono text-zinc-400">
        <h2>Report document not found.</h2>
        <Link to="/dashboard" className="text-emerald-400 hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, result, evidenceList, generatedAt } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5 font-mono text-zinc-100">
      {/* Top action controls (hidden on print) */}
      <div className="no-print flex items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <Link
          to={`/analysis/${analysis._id}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Incident
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-800 bg-[#0c0c11] hover:border-zinc-700 text-zinc-300 font-medium transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document (Static Black on screen, White on print) */}
      <div className="p-6 sm:p-10 rounded-2xl border border-zinc-800 bg-[#09090f] shadow-2xl space-y-6 text-zinc-200 text-xs">
        {/* Document Header */}
        <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                COROOT INCIDENT ROOT CAUSE AUDIT REPORT
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Ref: INC-{analysis._id.substring(0, 8).toUpperCase()} • Engine: Coroot RCA v0.8.2
            </p>
          </div>
          <div className="text-right text-[10px] text-zinc-500 space-y-0.5">
            <div>Date: {new Date(generatedAt || Date.now()).toLocaleDateString()}</div>
            <div>Severity: <span className="font-bold text-rose-400">{analysis.severity}</span></div>
            <div>State: {analysis.status}</div>
          </div>
        </div>

        {/* Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-[#060609] border border-zinc-800 text-[11px]">
          <div>
            <span className="text-zinc-500 block text-[10px]">CATEGORY</span>
            <span className="font-bold text-white">{analysis.category}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">TIMESTAMP</span>
            <span className="font-bold text-white truncate block">{analysis.timeOfOccurrence || 'N/A'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">RECENT DEPLOY</span>
            <span className="font-bold text-white truncate block">{analysis.recentChanges || 'None'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">EVIDENCE FILES</span>
            <span className="font-bold text-emerald-400">{evidenceList?.length || 0} attached</span>
          </div>
        </div>

        {/* 1. Problem Summary */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
            1. Incident Statement &amp; Symptoms
          </span>
          <h2 className="text-base font-bold text-white font-sans">
            {analysis.title}
          </h2>
          <p className="text-zinc-300 font-sans leading-relaxed text-xs">
            {result?.problemSummary || analysis.description}
          </p>
        </div>

        {/* 2. Confirmed Root Cause */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
            2. Confirmed Primary Root Cause
          </span>
          <p className="text-xs font-bold text-white font-sans">
            {result?.finalRootCause || result?.mostLikelyCause}
          </p>
          {result?.confidenceAssessment && (
            <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
              {result.confidenceAssessment}
            </p>
          )}
        </div>

        {/* 3. Ranked Causes */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
            3. Evaluated Root Causes
          </span>
          <table className="w-full text-left text-xs border border-zinc-800 rounded-lg overflow-hidden">
            <thead className="bg-zinc-900/80 text-[10px] text-zinc-400">
              <tr>
                <th className="p-2 w-8 text-center">#</th>
                <th className="p-2">Potential Cause</th>
                <th className="p-2 w-24 text-center">Confidence</th>
                <th className="p-2">Supporting Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {(result?.possibleCauses || []).map((cause, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/30">
                  <td className="p-2 text-center text-zinc-500">{idx + 1}</td>
                  <td className="p-2 font-sans">
                    <div className="font-bold text-white text-xs">{cause.cause}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{cause.description}</div>
                  </td>
                  <td className="p-2 text-center font-bold text-emerald-400">
                    {cause.confidence}%
                  </td>
                  <td className="p-2 text-[10px] text-zinc-400 font-sans">
                    {(cause.supportingEvidence || []).join('; ') || 'Observed symptom correlation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Five Whys */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
            4. Five Whys Deductive Sequence
          </span>
          <div className="space-y-1.5">
            {(result?.fiveWhys || []).map((why, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-zinc-800 bg-[#060609] space-y-0.5"
              >
                <div className="font-bold text-emerald-400 text-[11px]">
                  Why {why.step || idx + 1}: {why.question}
                </div>
                <div className="text-zinc-200 pl-3 font-sans">
                  ↳ {why.answer}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Remediation Plan */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
            5. Action Plan &amp; Preventive Countermeasures
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-rose-500/30 bg-[#060609] space-y-1">
              <span className="text-[10px] font-bold text-rose-400 block">
                IMMEDIATE (0-2h)
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-400 text-[10px] font-sans">
                {(result?.recommendations?.immediate || []).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-amber-500/30 bg-[#060609] space-y-1">
              <span className="text-[10px] font-bold text-amber-400 block">
                SHORT-TERM (1-3d)
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-400 text-[10px] font-sans">
                {(result?.recommendations?.shortTerm || []).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-emerald-500/30 bg-[#060609] space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 block">
                LONG-TERM PREVENTION
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-400 text-[10px] font-sans">
                {(result?.recommendations?.longTerm || []).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center">
          <span>RCA Incident Architecture • Confidential Post-Mortem Report</span>
          <span>Lead Investigator: {data?.analysis?.user?.name || 'SRE Lead'}</span>
        </div>
      </div>
    </div>
  );
};
