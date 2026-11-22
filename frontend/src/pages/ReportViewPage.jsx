import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CheckCircle2, 
  FileText
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
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#dfe1e6] border-t-[#0052cc] rounded-full animate-spin"></div>
          <span className="text-xs text-[#5e6c84]">Formatting post-mortem report...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.analysis) {
    return (
      <div className="p-8 text-center text-xs text-[#5e6c84]">
        <h2>Report document not found.</h2>
        <Link to="/dashboard" className="text-[#0052cc] hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, result, evidenceList, generatedAt } = data;
  const issueKey = `RCA-${analysis._id.substring(analysis._id.length - 4).toUpperCase()}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4 text-[#172b4d]">
      
      {/* Top action controls (hidden on print) */}
      <div className="no-print flex items-center justify-between gap-3 border-b border-[#dfe1e6] pb-3">
        <Link
          to={`/analysis/${analysis._id}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#5e6c84] hover:text-[#172b4d]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Issue ({issueKey})
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dfe1e6] bg-white hover:bg-[#fafbfc] text-[#172b4d] font-medium transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#5e6c84]" />
            Print Report
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0052cc] hover:bg-[#0065ff] text-white font-medium transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="p-6 sm:p-8 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-6">
        
        {/* Document Header */}
        <div className="border-b border-[#dfe1e6] pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-xs bg-[#deebff] text-[#0052cc] px-2 py-0.5 rounded">
                {issueKey}
              </span>
              <span className="text-xs text-[#5e6c84]">POST-MORTEM ROOT CAUSE ANALYSIS</span>
            </div>
            <h1 className="text-xl font-bold text-[#172b4d]">
              {analysis.title}
            </h1>
          </div>

          <div className="text-right text-xs text-[#5e6c84]">
            <div>Generated: {new Date(generatedAt).toLocaleDateString()}</div>
            <div className="font-semibold text-[#172b4d]">Status: {analysis.status}</div>
          </div>
        </div>

        {/* Executive Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded bg-[#f4f5f7] border border-[#dfe1e6] text-xs">
          <div>
            <span className="text-[#5e6c84] block text-[11px]">Category</span>
            <span className="font-semibold text-[#172b4d]">{analysis.category}</span>
          </div>
          <div>
            <span className="text-[#5e6c84] block text-[11px]">Severity</span>
            <span className="font-semibold text-[#de350b]">{analysis.severity}</span>
          </div>
          <div>
            <span className="text-[#5e6c84] block text-[11px]">Investigator</span>
            <span className="font-semibold text-[#172b4d]">{analysis.user?.name || 'Harsh'}</span>
          </div>
          <div>
            <span className="text-[#5e6c84] block text-[11px]">Occurrence</span>
            <span className="font-semibold text-[#172b4d]">{analysis.timeOfOccurrence || 'Unspecified'}</span>
          </div>
        </div>

        {/* Section 1: Incident Description */}
        <div className="space-y-2 text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5e6c84] border-b border-[#ebecf0] pb-1">
            1. Problem Summary &amp; Symptoms
          </h2>
          <p className="text-xs text-[#172b4d] leading-relaxed whitespace-pre-wrap">
            {analysis.description}
          </p>
          {analysis.symptoms && analysis.symptoms.length > 0 && (
            <div className="pt-1">
              <span className="font-semibold text-[#5e6c84]">Symptoms: </span>
              <span className="text-[#172b4d]">{analysis.symptoms.join(' • ')}</span>
            </div>
          )}
        </div>

        {/* Section 2: Five Whys Deductive Analysis */}
        <div className="space-y-3 text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5e6c84] border-b border-[#ebecf0] pb-1">
            2. Five Whys Deductive Chain
          </h2>
          
          <div className="space-y-2">
            {(result?.fiveWhys || []).map((step, idx) => (
              <div key={idx} className="p-3 rounded bg-[#f4f5f7] border border-[#dfe1e6]">
                <div className="font-bold text-[#0052cc] text-xs">
                  Why {step.step}: {step.question}
                </div>
                <div className="text-xs text-[#172b4d] mt-1">
                  {step.answer}
                </div>
              </div>
            ))}
          </div>

          {result?.finalRootCause && (
            <div className="p-3.5 rounded bg-[#deebff] border border-[#b3d4ff] text-xs space-y-1">
              <div className="font-bold text-[#0052cc]">DEDUCED ROOT CAUSE:</div>
              <p className="text-[#172b4d] font-medium leading-relaxed">
                {result.finalRootCause}
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Ranked Root Causes */}
        {result?.possibleCauses && result.possibleCauses.length > 0 && (
          <div className="space-y-2 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5e6c84] border-b border-[#ebecf0] pb-1">
              3. Ranked Potential Causes &amp; Confidence
            </h2>
            <div className="space-y-1.5">
              {result.possibleCauses.map((cause, cIdx) => (
                <div key={cIdx} className="p-2.5 rounded border border-[#dfe1e6] flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <span className="font-semibold text-[#172b4d] block">{cause.cause}</span>
                    <span className="text-[11px] text-[#5e6c84]">{cause.evidence}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0052cc]">
                      {Math.round((cause.likelihood || 0.8) * 100)}%
                    </span>
                    <span className="block text-[10px] text-[#5e6c84]">Confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Remediation Plan */}
        {result?.recommendations && (
          <div className="space-y-3 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5e6c84] border-b border-[#ebecf0] pb-1">
              4. Corrective &amp; Preventive Action Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded border border-[#dfe1e6] bg-[#fafbfc] space-y-1.5">
                <span className="font-bold text-[#de350b] text-[11px] uppercase block">
                  Immediate (0 - 2 Hours)
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#172b4d]">
                  {(result.recommendations.immediate || []).map((rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded border border-[#dfe1e6] bg-[#fafbfc] space-y-1.5">
                <span className="font-bold text-[#0052cc] text-[11px] uppercase block">
                  Short-Term (1 - 3 Days)
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#172b4d]">
                  {(result.recommendations.shortTerm || []).map((rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded border border-[#dfe1e6] bg-[#fafbfc] space-y-1.5">
                <span className="font-bold text-[#006644] text-[11px] uppercase block">
                  Long-Term Architecture
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#172b4d]">
                  {(result.recommendations.longTerm || []).map((rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Document Footer */}
        <div className="pt-4 border-t border-[#dfe1e6] flex justify-between items-center text-[11px] text-[#5e6c84]">
          <span>Generated by RCA Agent — AI Root Cause Analysis</span>
          <span>Investigator: {analysis.user?.name || 'Harsh'}</span>
        </div>

      </div>
    </div>
  );
};
