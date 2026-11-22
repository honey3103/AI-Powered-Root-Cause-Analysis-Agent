import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  Upload, 
  AlertCircle, 
  Plus, 
  HelpCircle,
  FileText,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  'Website downtime',
  'API errors',
  'Database issues',
  'Server problems',
  'Deployment failures',
  'Performance issues',
  'Application crashes',
  'Other technical issues',
];

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export const NewAnalysisPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Website downtime');
  const [severity, setSeverity] = useState('High');
  const [symptoms, setSymptoms] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const [timeOfOccurrence, setTimeOfOccurrence] = useState('');
  const [recentChanges, setRecentChanges] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadExample502 = () => {
    setTitle('Web Service Returning HTTP 502 Bad Gateway');
    setDescription('Immediately following the deployment of version v2.4.1 to the production Kubernetes cluster, end users reported HTTP 502 Bad Gateway errors when trying to load the website.');
    setCategory('Website downtime');
    setSeverity('Critical');
    setSymptoms('Reverse proxy returns 502 Bad Gateway, health check endpoint /healthz timing out, ingress controller logs show connection refused');
    setErrorMessages('nginx: [error] 23#23: *1042 connect() failed (111: Connection refused) while connecting to upstream http://10.244.2.14:3000');
    setTimeOfOccurrence(new Date().toISOString());
    setRecentChanges('Merged PR #142 containing new environment variables and switched Docker base image from node:18-alpine to node:20-slim.');
    setAdditionalInfo('Database cluster CPU and connections look normal. Pod status shows CrashLoopBackOff.');
  };

  const loadExampleDb = () => {
    setTitle('Database Connection Pool Saturation & Query Timeouts');
    setDescription('During peak load, API endpoints began throwing 504 Gateway Timeouts. Database CPU spiked to 98% with hundreds of active client connections.');
    setCategory('Database issues');
    setSeverity('High');
    setSymptoms('API latency escalated from 80ms to over 25000ms, database pool client timeouts, connection pool starved');
    setErrorMessages('Error: Timeout: Connection pool timeout occurred after 10000ms. Max connections (100) reached. Active clients: 100, waiting requests: 432.');
    setTimeOfOccurrence(new Date().toISOString());
    setRecentChanges('Added new analytics dashboard endpoint with unindexed group-by query.');
    setAdditionalInfo('PostgreSQL connection count hit hard limit of max_connections.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Please provide at least an incident title and description');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/analysis', {
        title,
        description,
        category,
        severity,
        symptoms: symptoms.split(',').map((s) => s.trim()).filter(Boolean),
        errorMessages,
        timeOfOccurrence,
        recentChanges,
        additionalInfo,
      });

      const analysisId = res.data.analysis._id;

      if (file && analysisId) {
        const formData = new FormData();
        formData.append('file', file);
        await api.post(`/analysis/${analysisId}/evidence`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        await api.post(`/analysis/${analysisId}/reanalyze`);
      }

      navigate(`/analysis/${analysisId}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.message || 'Failed to initialize incident analysis.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 text-[#172b4d]">
      
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dfe1e6] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#172b4d] tracking-tight">
            Create Issue / Investigation
          </h1>
          <p className="text-xs text-[#5e6c84] mt-0.5">
            Log a new production incident for automated 5-Whys deduction and root cause analysis.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadExample502}
            className="px-2.5 py-1 text-xs font-medium rounded bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d]"
          >
            Load 502 Outage Demo
          </button>
          <button
            type="button"
            onClick={loadExampleDb}
            className="px-2.5 py-1 text-xs font-medium rounded bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d]"
          >
            Load DB Pool Demo
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded bg-[#ffebe6] border border-[#ffbdad] text-[#de350b] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Jira Create Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-lg border border-[#dfe1e6] bg-white space-y-4 text-xs">
        
        {/* Issue Summary / Title */}
        <div>
          <label className="block font-semibold text-[#172b4d] mb-1">
            Summary / Incident Title <span className="text-[#de350b]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Web Service Returning HTTP 502 Bad Gateway"
            className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-white text-[#172b4d] focus:outline-none focus:border-[#4c9aff] text-xs"
          />
        </div>

        {/* Two-column selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Issue Category <span className="text-[#de350b]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-white text-[#172b4d] focus:outline-none focus:border-[#4c9aff] text-xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Priority / Severity <span className="text-[#de350b]">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-white text-[#172b4d] focus:outline-none focus:border-[#4c9aff] text-xs"
            >
              {SEVERITIES.map((sev) => (
                <option key={sev} value={sev}>
                  {sev} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-[#172b4d] mb-1">
            Description <span className="text-[#de350b]">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what occurred, impacted endpoints, and observed downtime..."
            className="w-full px-3 py-2 rounded border border-[#dfe1e6] bg-white text-[#172b4d] focus:outline-none focus:border-[#4c9aff] text-xs leading-relaxed"
          />
        </div>

        {/* Symptoms & Error Traces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Symptoms (Comma separated)
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. 502 Bad Gateway, timeout, socket hangup"
              className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-white text-[#172b4d] focus:outline-none focus:border-[#4c9aff] text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Recent Deployments / Changes
            </label>
            <input
              type="text"
              value={recentChanges}
              onChange={(e) => setRecentChanges(e.target.value)}
              placeholder="e.g. Merged PR #142, base image upgrade"
              className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-white text-[#172b4d] focus:outline-none focus:border-[#4c9aff] text-xs"
            />
          </div>
        </div>

        {/* Stack Trace / Logs input */}
        <div>
          <label className="block font-semibold text-[#172b4d] mb-1">
            Error Log Snippet / Stack Trace
          </label>
          <textarea
            rows={3}
            value={errorMessages}
            onChange={(e) => setErrorMessages(e.target.value)}
            placeholder="Paste raw error line, HTTP 500/502 output, or crash dump..."
            className="w-full px-3 py-2 rounded border border-[#dfe1e6] bg-[#fafbfc] font-mono text-xs text-[#de350b] focus:outline-none focus:border-[#4c9aff]"
          />
        </div>

        {/* File Attachment Dropzone */}
        <div>
          <label className="block font-semibold text-[#172b4d] mb-1">
            Attachment / Log File (.log, .txt, .pdf, .csv)
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#dfe1e6] hover:border-[#4c9aff] rounded-lg p-5 cursor-pointer bg-[#fafbfc] hover:bg-white transition">
            <Upload className="w-5 h-5 text-[#5e6c84] mb-1" />
            <span className="font-semibold text-[#172b4d] text-xs">
              {file ? file.name : 'Click to browse or drop log file here'}
            </span>
            {file && (
              <span className="text-[11px] text-[#006644] mt-0.5">
                {(file.size / 1024).toFixed(1)} KB selected
              </span>
            )}
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ebecf0]">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-3.5 py-1.5 rounded text-[#42526e] hover:bg-[#ebecf0] font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 rounded bg-[#0052cc] hover:bg-[#0065ff] disabled:opacity-50 text-white font-medium text-xs shadow-sm flex items-center gap-1.5"
          >
            {loading ? (
              <span>Running Analysis...</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Create &amp; Analyze</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
