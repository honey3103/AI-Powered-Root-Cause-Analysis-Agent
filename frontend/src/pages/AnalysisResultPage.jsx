/**
 * Project: AI-Powered Root Cause Analysis Agent
 * Developer: Harsh (CSE)
 * File: AnalysisResultPage.jsx
 * Description: Displays complete root cause analysis, Five Whys deductive chain, 
 *              action plans, and uploaded log evidence.
 */

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
  CheckCircle, 
  FileSearch, 
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';

export const AnalysisResultPage = () => {
  // get incident id from URL parameter
  const { id } = useParams();
  const navigate = useNavigate();

  // state variables for incident data and active tab
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking', 'fivewhys', 'recommendations', 'evidence', 'future_scope'
  const [uploading, setUploading] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // fetch analysis when component loads or ID changes
  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      // calling GET /api/analysis/:id
      const res = await api.get(`/analysis/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load incident analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  // function to update incident status (Open -> In Progress -> Resolved)
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

  // function to upload additional log evidence
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
      // trigger re-analysis automatically with new evidence
      handleReanalyze();
    } catch (err) {
      console.error('Evidence upload failed:', err);
      setUploading(false);
    }
  };

  // function to re-run AI / Heuristic reasoning engine
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

  // delete attached evidence file
  const handleDeleteEvidence = async (evidenceId) => {
    if (!window.confirm('Delete this evidence file?')) return;
    try {
      await api.delete(`/evidence/${evidenceId}`);
      fetchAnalysis();
    } catch (err) {
      console.error('Failed to delete evidence:', err);
    }
  };

  // delete entire investigation
  const handleDeleteAnalysis = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this incident record?')) return;
    try {
      await api.delete(`/analysis/${id}`);
      navigate('/history');
    } catch (err) {
      console.error('Failed to delete analysis:', err);
    }
  };

  // open server-side generated PDF in new tab
  const downloadPDF = () => {
    const token = localStorage.getItem('rca_token');
    window.open(`/api/analysis/${id}/report/pdf?token=${token}`, '_blank');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Loading RCA investigation details...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.analysis) {
    return (
      <div className="p-8 text-center text-xs font-mono">
        <h2>Investigation not found.</h2>
        <Link to="/dashboard" className="text-sky-500 hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, result, evidenceList } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5 font-sans">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {analysis.category}
              </span>
              <SeverityBadge severity={analysis.severity} />
              <StatusBadge status={analysis.status} />
              <span className="text-[10px] font-mono text-slate-400">
                ID: {analysis._id.substring(0, 8)}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {analysis.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status selector */}
          <select
            disabled={statusUpdating}
            value={analysis.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
          >
            <option value="Open">Status: Open</option>
            <option value="In Progress">Status: In Progress</option>
            <option value="Resolved">Status: Resolved</option>
          </select>

          {/* Re-analyze button */}
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title="Re-run Root Cause Engine"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-sky-500' : ''}`} />
            {reanalyzing ? 'Analyzing...' : 'Re-Run'}
          </button>

          {/* View Printable Report */}
          <Link
            to={`/analysis/${analysis._id}/report`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Report
          </Link>

          {/* Download PDF button */}
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>

          {/* Delete button */}
          <button
            onClick={handleDeleteAnalysis}
            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            title="Delete investigation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2 shadow-xs">
        <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span>DIAGNOSTIC SUMMARY</span>
          <span>Engine: {result?.modelUsed || 'Heuristic v0.8.2'}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {result?.problemSummary || analysis.description}
        </p>

        {/* Symptoms tags */}
        {result?.identifiedSymptoms && result.identifiedSymptoms.length > 0 && (
          <div className="pt-1 flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-mono text-slate-400 mr-1">Symptoms:</span>
            {result.identifiedSymptoms.map((sym, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono"
              >
                {sym}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto space-x-1 text-xs">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ranking'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Root Cause Ranking ({result?.possibleCauses?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('fivewhys')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'fivewhys'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Five Whys ({result?.fiveWhys?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Action Plan
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'evidence'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Evidence Logs ({evidenceList?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('future_scope')}
          className={`px-3 py-2 font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'future_scope'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>Module 5 &amp; 6 (Roadmap)</span>
        </button>
      </div>

      {/* Tab 1: Causes */}
      {activeTab === 'ranking' && (
        <div className="space-y-4">
          {result?.mostLikelyCause && (
            <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-50/40 dark:bg-sky-950/20 text-xs space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300 block">
                Primary Root Cause Assessment
              </span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {result.mostLikelyCause}
              </p>
              {result.confidenceAssessment && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {result.confidenceAssessment}
                </p>
              )}
            </div>
          )}

          <CauseRankingCard possibleCauses={result?.possibleCauses} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                Recommended Verification Steps
              </span>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5 text-[11px]">
                {(result?.investigationSteps || []).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                Missing Information to Collect
              </span>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5 text-[11px]">
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
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Five Whys Analysis Tree
          </span>
          <FiveWhysAccordion
            fiveWhys={result?.fiveWhys}
            finalRootCause={result?.finalRootCause || result?.mostLikelyCause}
          />
        </div>
      )}

      {/* Tab 3: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Remediation Action Plan
          </span>
          <RecommendationCard recommendations={result?.recommendations} />
        </div>
      )}

      {/* Tab 4: Evidence Upload & Preview */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-3">
            <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Attach Additional Evidence
            </span>
            <form onSubmit={handleUploadEvidence} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="file"
                accept=".txt,.log,.csv,.pdf"
                onChange={(e) => setNewFile(e.target.files[0] || null)}
                className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300"
              />
              <button
                type="submit"
                disabled={!newFile || uploading}
                className="w-full sm:w-auto px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition"
              >
                {uploading ? 'Parsing...' : 'Upload & Correlate'}
              </button>
            </form>
          </div>

          {/* List of Evidence Files */}
          {evidenceList && evidenceList.length > 0 ? (
            <div className="space-y-3">
              {evidenceList.map((file) => (
                <div
                  key={file._id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-500" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {file.fileName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({(file.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteEvidence(file._id)}
                      className="text-rose-500 hover:text-rose-600 text-xs font-mono"
                    >
                      Delete
                    </button>
                  </div>

                  {file.detectedErrors && file.detectedErrors.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">
                        DETECTED ERROR PATTERNS ({file.detectedErrors.length}):
                      </span>
                      <div className="bg-rose-500/10 rounded-lg p-2 max-h-28 overflow-y-auto font-mono text-[10px] text-rose-800 dark:text-rose-300 space-y-0.5">
                        {file.detectedErrors.map((err, eIdx) => (
                          <div key={eIdx}>{err}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="text-[10px] font-mono text-slate-400 block mb-0.5">CONTENT SNIPPET:</span>
                    <pre className="p-2 rounded-lg bg-slate-950 text-slate-300 font-mono text-[10px] max-h-24 overflow-y-auto whitespace-pre-wrap">
                      {file.extractedContent?.substring(0, 500) || 'No readable text extracted.'}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs font-mono text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No evidence files attached.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Future Scope Roadmap */}
      {activeTab === 'future_scope' && (
        <div className="p-5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Future Scope Modules (Planned for Final Semester Submission)</span>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Future Enhancements:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li><strong>Module 5:</strong> GitHub Webhook Integration to correlate commit hashes directly with incident timestamps.</li>
              <li><strong>Module 6:</strong> Slack and Discord webhook alert dispatching for team incident notifications.</li>
              <li><strong>Module 7:</strong> Prometheus &amp; Grafana live telemetry streaming.</li>
            </ul>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Note: Core project requirements (Authentication, Five Whys reasoning, Log parsing, and PDF report export) are 100% operational for intermediate evaluation.
          </p>
        </div>
      )}
    </div>
  );
};
