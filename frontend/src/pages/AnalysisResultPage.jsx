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
  ChevronDown,
  ChevronRight,
  User as UserIcon,
  Calendar,
  Clock,
  Layers,
  Share2
} from 'lucide-react';

export const AnalysisResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
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
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#dfe1e6] border-t-[#0052cc] rounded-full animate-spin"></div>
          <span className="text-xs text-[#5e6c84]">Loading issue details...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.analysis) {
    return (
      <div className="p-8 text-center text-xs text-[#5e6c84]">
        <h2>Incident not found.</h2>
        <Link to="/dashboard" className="text-[#0052cc] hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, result, evidenceList } = data;
  const issueKey = `RCA-${analysis._id.substring(analysis._id.length - 4).toUpperCase()}`;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 text-[#172b4d]">
      
      {/* Top Jira Breadcrumbs & Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-[#5e6c84]">
          <Link to="/dashboard" className="hover:underline">Projects</Link>
          <span>/</span>
          <Link to="/history" className="hover:underline">Sprint 3</Link>
          <span>/</span>
          <span className="font-semibold text-[#172b4d] bg-[#ebecf0] px-1.5 py-0.5 rounded text-[11px]">
            {issueKey}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#172b4d] tracking-tight">
          {analysis.title}
        </h1>
      </div>

      {/* Jira Action Toolbar (Edit, Status, More, Export) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfe1e6] pb-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              disabled={statusUpdating}
              value={analysis.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-2.5 py-1.5 rounded font-bold text-xs bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d] border border-[#dfe1e6] focus:outline-none cursor-pointer"
            >
              <option value="Open">TO DO</option>
              <option value="In Progress">IN PROGRESS</option>
              <option value="Resolved">DONE / RESOLVED</option>
            </select>
          </div>

          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="px-2.5 py-1.5 rounded bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d] font-medium flex items-center gap-1.5"
            title="Re-run analysis engine"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-[#0052cc]' : ''}`} />
            <span>{reanalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
          </button>

          <Link
            to={`/analysis/${analysis._id}/report`}
            className="px-2.5 py-1.5 rounded bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d] font-medium flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[#5e6c84]" />
            <span>Print View</span>
          </Link>

          <button
            onClick={downloadPDF}
            className="px-3 py-1.5 rounded bg-[#0052cc] hover:bg-[#0065ff] text-white font-medium flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>

        <div>
          <button
            onClick={handleDeleteAnalysis}
            className="p-1.5 rounded text-[#5e6c84] hover:text-[#de350b] hover:bg-[#ffebe6]"
            title="Delete issue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-Column Jira Issue Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Main Details, Description, 5 Whys, Root Causes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Details Table */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1">
              <ChevronDown className="w-3.5 h-3.5" /> Details
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#5e6c84] block text-[11px]">Type:</span>
                <span className="font-semibold text-[#de350b] flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-sm bg-[#de350b]"></span>
                  Incident / Bug
                </span>
              </div>

              <div>
                <span className="text-[#5e6c84] block text-[11px]">Priority:</span>
                <div className="mt-0.5">
                  <SeverityBadge severity={analysis.severity} />
                </div>
              </div>

              <div>
                <span className="text-[#5e6c84] block text-[11px]">Resolution:</span>
                <span className="font-semibold text-[#172b4d] block mt-0.5">
                  {analysis.status === 'Resolved' ? 'Resolved' : 'Unresolved'}
                </span>
              </div>

              <div>
                <span className="text-[#5e6c84] block text-[11px]">Category:</span>
                <span className="font-semibold text-[#172b4d] block mt-0.5">
                  {analysis.category}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Description & Symptoms */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1">
              <ChevronDown className="w-3.5 h-3.5" /> Description &amp; Incident Context
            </h3>

            <p className="text-xs sm:text-sm text-[#172b4d] leading-relaxed whitespace-pre-wrap">
              {analysis.description}
            </p>

            {analysis.symptoms && analysis.symptoms.length > 0 && (
              <div className="pt-2 border-t border-[#ebecf0]">
                <span className="font-semibold text-xs text-[#5e6c84] block mb-1">
                  Observed Symptoms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.symptoms.map((sym, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 rounded bg-[#f4f5f7] border border-[#dfe1e6] text-[#172b4d] text-xs">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.errorMessages && (
              <div className="pt-2 border-t border-[#ebecf0]">
                <span className="font-semibold text-xs text-[#5e6c84] block mb-1">
                  Error Log Traces:
                </span>
                <pre className="p-2.5 rounded bg-[#f4f5f7] border border-[#dfe1e6] text-[#de350b] font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {analysis.errorMessages}
                </pre>
              </div>
            )}
          </div>

          {/* Section: Five Whys Deductive Analysis */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#ebecf0] pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1">
                <ChevronDown className="w-3.5 h-3.5" /> Five Whys Deductive Reasoning
              </h3>
              <span className="text-[11px] text-[#0052cc] font-medium">5-Step Chain</span>
            </div>

            <FiveWhysAccordion 
              fiveWhys={result?.fiveWhys || []} 
              finalRootCause={result?.finalRootCause} 
            />
          </div>

          {/* Section: Ranked Possible Root Causes */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#ebecf0] pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1">
                <ChevronDown className="w-3.5 h-3.5" /> Ranked Root Causes &amp; Confidence
              </h3>
              <span className="text-[11px] text-[#5e6c84]">Weighted Analysis</span>
            </div>

            <CauseRankingCard possibleCauses={result?.possibleCauses || []} />
          </div>

          {/* Section: Three-Tier Remediation Plan */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#ebecf0] pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1">
                <ChevronDown className="w-3.5 h-3.5" /> Remediation Action Plan
              </h3>
              <span className="text-[11px] text-[#006644] font-medium">3-Tier Staging</span>
            </div>

            <RecommendationCard recommendations={result?.recommendations} />
          </div>

        </div>

        {/* Right 1 Column: People, Dates, Attachments, Metadata */}
        <div className="space-y-4">
          
          {/* People Box */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1 border-b border-[#ebecf0] pb-2">
              <UserIcon className="w-3.5 h-3.5" /> People
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#5e6c84]">Assignee:</span>
                <span className="font-semibold text-[#172b4d] flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#0052cc] text-white text-[10px] flex items-center justify-center font-bold">
                    H
                  </div>
                  {analysis.user?.name || 'Harsh'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5e6c84]">Reporter:</span>
                <span className="text-[#172b4d] truncate max-w-[150px]">
                  {analysis.user?.email || 'harsh@test.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Dates Box */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1 border-b border-[#ebecf0] pb-2">
              <Calendar className="w-3.5 h-3.5" /> Dates &amp; Timeline
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5e6c84]">Created:</span>
                <span className="text-[#172b4d] font-medium">
                  {new Date(analysis.createdAt).toLocaleString()}
                </span>
              </div>

              {analysis.timeOfOccurrence && (
                <div className="flex justify-between">
                  <span className="text-[#5e6c84]">Incident Time:</span>
                  <span className="text-[#172b4d]">
                    {analysis.timeOfOccurrence}
                  </span>
                </div>
              )}

              {analysis.recentChanges && (
                <div className="pt-2 border-t border-[#ebecf0]">
                  <span className="text-[#5e6c84] block text-[11px] mb-0.5">Recent Changes:</span>
                  <span className="text-[#172b4d] font-medium text-xs block">
                    {analysis.recentChanges}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Attached Evidence & Log Files */}
          <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white space-y-3 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5e6c84] flex items-center gap-1 border-b border-[#ebecf0] pb-2">
              <FileText className="w-3.5 h-3.5" /> Attachments &amp; Logs
            </h3>

            {evidenceList && evidenceList.length > 0 ? (
              <ul className="space-y-2">
                {evidenceList.map((ev) => (
                  <li key={ev._id} className="p-2 rounded bg-[#f4f5f7] border border-[#dfe1e6] flex items-center justify-between text-xs">
                    <div className="truncate max-w-[180px]">
                      <span className="font-semibold block truncate">{ev.fileName}</span>
                      <span className="text-[10px] text-[#5e6c84]">{(ev.fileSize / 1024).toFixed(1)} KB</span>
                    </div>
                    <button
                      onClick={() => handleDeleteEvidence(ev._id)}
                      className="text-[#6b778c] hover:text-[#de350b] p-1"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#5e6c84]">No log files attached.</p>
            )}

            {/* Quick Upload Form */}
            <form onSubmit={handleUploadEvidence} className="pt-2 border-t border-[#ebecf0] space-y-2">
              <label className="block text-[11px] font-semibold text-[#5e6c84]">
                Attach Server Log (.log, .txt, .pdf):
              </label>
              <input
                type="file"
                onChange={(e) => setNewFile(e.target.files[0] || null)}
                className="block w-full text-xs text-[#5e6c84] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-[#dfe1e6] file:text-xs file:bg-[#f4f5f7] file:text-[#172b4d]"
              />
              <button
                type="submit"
                disabled={!newFile || uploading}
                className="w-full py-1.5 rounded bg-[#0052cc] hover:bg-[#0065ff] disabled:opacity-50 text-white font-medium text-xs transition"
              >
                {uploading ? 'Parsing...' : 'Attach & Re-Analyze'}
              </button>
            </form>
          </div>

          {/* Engine Metadata Box */}
          <div className="p-3.5 rounded-lg border border-[#dfe1e6] bg-[#fafbfc] text-xs space-y-1 text-[#5e6c84]">
            <div className="flex justify-between">
              <span>Reasoning Engine:</span>
              <span className="font-semibold text-[#172b4d]">Local Inference (Offline)</span>
            </div>
            <div className="flex justify-between">
              <span>Issue Key:</span>
              <span className="font-semibold text-[#0052cc]">{issueKey}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
