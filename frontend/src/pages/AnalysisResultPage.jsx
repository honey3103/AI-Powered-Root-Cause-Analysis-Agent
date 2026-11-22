import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { FiveWhysAccordion } from '../components/FiveWhysAccordion';
import { CauseRankingCard } from '../components/CauseRankingCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  Printer, 
  Trash2, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Activity,
  Layers,
  Terminal,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const AnalysisResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking', 'fivewhys', 'recommendations', 'evidence', 'future_scope'
  const [uploading, setUploading] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/analysis/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load incident analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      await api.patch(`/analysis/${id}/status`, { status: newStatus });
      setData((prev) => ({
        ...prev,
        analysis: { ...prev.analysis, status: newStatus },
      }));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleUploadEvidence = async (e) => {
    e.preventDefault();
    if (!newFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', newFile);

      await api.post(`/analysis/${id}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNewFile(null);
      handleReanalyze();
    } catch (err) {
      console.error('Evidence upload failed:', err);
      setUploading(false);
    }
  };

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);
      const res = await api.post(`/analysis/${id}/reanalyze`);
      setData(res.data);
    } catch (err) {
      console.error('Re-analysis failed:', err);
    } finally {
      setReanalyzing(false);
      setUploading(false);
    }
  };

  const handleDeleteEvidence = async (evidenceId) => {
    if (!window.confirm('Delete this evidence file?')) return;
    try {
      await api.delete(`/evidence/${evidenceId}`);
      fetchAnalysis();
    } catch (err) {
      console.error('Failed to delete evidence:', err);
    }
  };

  const handleDeleteAnalysis = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this incident record?')) return;
    try {
      await api.delete(`/analysis/${id}`);
      navigate('/history');
    } catch (err) {
      console.error('Failed to delete analysis:', err);
    }
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
          <span className="text-xs text-zinc-500">Executing Coroot root cause analysis...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.analysis) {
    return (
      <div className="p-8 text-center text-xs font-mono text-zinc-400">
        <h2>Investigation not found.</h2>
        <Link to="/dashboard" className="text-emerald-400 hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, result, evidenceList } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5 font-mono text-zinc-100">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg border border-zinc-800 bg-[#0c0c11] text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                {analysis.category}
              </span>
              <SeverityBadge severity={analysis.severity} />
              <StatusBadge status={analysis.status} />
              <span className="text-[10px] text-zinc-500">
                REF: {analysis._id.substring(0, 8)}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {analysis.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            disabled={statusUpdating}
            value={analysis.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-2 py-1 rounded-md border border-zinc-800 bg-[#0c0c11] text-xs font-medium text-zinc-200"
          >
            <option value="Open">Status: Open</option>
            <option value="In Progress">Status: In Progress</option>
            <option value="Resolved">Status: Resolved</option>
          </select>

          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-zinc-800 bg-[#0c0c11] hover:border-zinc-700 text-zinc-300 transition"
            title="Re-run Coroot Engine"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-emerald-400' : ''}`} />
            {reanalyzing ? 'Diagnosing...' : 'Re-Run'}
          </button>

          <Link
            to={`/analysis/${analysis._id}/report`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-zinc-800 bg-[#0c0c11] hover:border-zinc-700 text-zinc-300 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Report
          </Link>

          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            PDF Export
          </button>

          <button
            onClick={handleDeleteAnalysis}
            className="p-1 rounded-md text-zinc-500 hover:text-rose-400 transition"
            title="Delete investigation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Coroot Diagnostic Overview Box */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] text-xs space-y-2">
        <div className="flex items-center justify-between text-[10px] text-zinc-500">
          <span>DIAGNOSTIC TELEMETRY SUMMARY</span>
          <span className="text-emerald-400 font-semibold">Engine: {result?.modelUsed || 'Coroot Heuristic v0.8.2'}</span>
        </div>
        <p className="text-zinc-200 leading-relaxed font-sans text-xs sm:text-sm">
          {result?.problemSummary || analysis.description}
        </p>

        {/* Symptoms tags */}
        {result?.identifiedSymptoms && result.identifiedSymptoms.length > 0 && (
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 mr-1">CORRELATED SYMPTOMS:</span>
            {result.identifiedSymptoms.map((sym, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]"
              >
                {sym}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto space-x-1 text-xs">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ranking'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Root Cause Ranking ({result?.possibleCauses?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('fivewhys')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'fivewhys'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Five Whys Diagnostic ({result?.fiveWhys?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Remediation Plan
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'evidence'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Logs &amp; Evidence ({evidenceList?.length || 0})
        </button>
      </div>

      {/* Tab 1: Causes */}
      {activeTab === 'ranking' && (
        <div className="space-y-4">
          {result?.mostLikelyCause && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-xs space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                PRIMARY ROOT CAUSE IDENTIFIED (HIGHEST PROBABILITY)
              </span>
              <p className="font-bold text-white text-sm font-sans">
                {result.mostLikelyCause}
              </p>
              {result.confidenceAssessment && (
                <p className="text-[11px] text-zinc-400 font-sans mt-1">
                  {result.confidenceAssessment}
                </p>
              )}
            </div>
          )}

          <CauseRankingCard possibleCauses={result?.possibleCauses} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                Recommended Verification Steps
              </span>
              <ul className="list-disc list-inside text-zinc-400 space-y-1 text-[11px] font-sans">
                {(result?.investigationSteps || []).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Missing Information to Confirm
              </span>
              <ul className="list-disc list-inside text-zinc-400 space-y-1 text-[11px] font-sans">
                {(result?.missingInformation || []).map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 5 Whys */}
      {activeTab === 'fivewhys' && (
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-3">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            Five Whys Problem-Solving Chain
          </span>
          <FiveWhysAccordion
            fiveWhys={result?.fiveWhys}
            finalRootCause={result?.finalRootCause || result?.mostLikelyCause}
          />
        </div>
      )}

      {/* Tab 3: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-3">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            Remediation Action Plan &amp; Countermeasures
          </span>
          <RecommendationCard recommendations={result?.recommendations} />
        </div>
      )}

      {/* Tab 4: Evidence Upload & Preview */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] text-xs space-y-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Attach Server Logs or Telemetry Dump
            </span>
            <form onSubmit={handleUploadEvidence} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="file"
                accept=".txt,.log,.csv,.pdf"
                onChange={(e) => setNewFile(e.target.files[0] || null)}
                className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200"
              />
              <button
                type="submit"
                disabled={!newFile || uploading}
                className="w-full sm:w-auto px-4 py-1.5 rounded-md text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition"
              >
                {uploading ? 'Extracting...' : 'Upload & Correlate'}
              </button>
            </form>
          </div>

          {/* List of Evidence Files */}
          {evidenceList && evidenceList.length > 0 ? (
            <div className="space-y-3">
              {evidenceList.map((file) => (
                <div
                  key={file._id}
                  className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">
                        {file.fileName}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        ({(file.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteEvidence(file._id)}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      Delete
                    </button>
                  </div>

                  {file.detectedErrors && file.detectedErrors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-400">
                        DETECTED ERROR PATTERNS ({file.detectedErrors.length}):
                      </span>
                      <div className="bg-rose-950/20 border border-rose-500/20 rounded-lg p-2.5 max-h-32 overflow-y-auto text-[10px] text-rose-300 space-y-1">
                        {file.detectedErrors.map((err, eIdx) => (
                          <div key={eIdx}>{err}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-[10px] text-zinc-500 block mb-0.5">CONTENT SNIPPET:</span>
                    <pre className="p-2.5 rounded-lg bg-[#060609] border border-zinc-800/80 text-zinc-400 text-[10px] max-h-28 overflow-y-auto whitespace-pre-wrap">
                      {file.extractedContent?.substring(0, 600) || 'No readable text extracted.'}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              No evidence files attached to this investigation.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
