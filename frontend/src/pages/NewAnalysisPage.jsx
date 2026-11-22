import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  Upload, 
  AlertCircle, 
  Terminal,
  Play,
  Lightbulb,
  FileCode
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 font-mono text-zinc-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            coroot / intake-terminal
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">
            Feed incident symptoms, error logs, and recent deployments into Coroot RCA Engine.
          </p>
        </div>

        {/* Demo Templates */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadExample502}
            className="px-2.5 py-1.5 rounded-md text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
          >
            Demo 502 Outage
          </button>
          <button
            type="button"
            onClick={loadExampleDb}
            className="px-2.5 py-1.5 rounded-md text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
          >
            Demo DB Timeout
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Section 1: Problem Definition */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-3">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
            1. INCIDENT DEFINITION &amp; TELEMETRY CONTEXT
          </span>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Incident Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Website returning HTTP 502 Bad Gateway after deployment"
              className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-white focus:outline-none focus:border-emerald-500"
              >
                {SEVERITIES.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev} Severity
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Incident Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, what broke, and affected endpoints..."
              className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-white font-sans focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Section 2: Symptoms & Traces */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-3">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
            2. ANOMALIES &amp; LOG SIGNATURES
          </span>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Observed Symptoms (Comma separated)
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. 502 Bad Gateway, high latency, socket timeout"
              className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Error Messages / Stack Trace
            </label>
            <textarea
              rows={3}
              value={errorMessages}
              onChange={(e) => setErrorMessages(e.target.value)}
              placeholder="Paste exact error log lines, HTTP error codes, or stack traces..."
              className="w-full text-[11px] px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Time of Occurrence
              </label>
              <input
                type="text"
                value={timeOfOccurrence}
                onChange={(e) => setTimeOfOccurrence(e.target.value)}
                placeholder="e.g. 2026-11-22 12:45 UTC or Today 10:15 AM"
                className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Recent Changes / Deployments
              </label>
              <input
                type="text"
                value={recentChanges}
                onChange={(e) => setRecentChanges(e.target.value)}
                placeholder="e.g. Release v2.4, config file update, schema migration"
                className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-[#08080c] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Evidence File Intake */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
            3. LOG FILE &amp; TELEMETRY EVIDENCE (.LOG, .TXT, .CSV, .PDF)
          </span>

          <label className="flex flex-col items-center justify-center border border-dashed border-zinc-800 hover:border-emerald-500/60 rounded-xl p-5 cursor-pointer bg-[#08080c] hover:bg-[#0d0d14] transition">
            <Upload className="w-6 h-6 text-emerald-400 mb-1" />
            <span className="font-semibold text-zinc-300 text-xs">
              {file ? file.name : 'Select or drop raw log file for automated regex extraction'}
            </span>
            <span className="text-[10px] text-zinc-500 mt-0.5">
              {file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'Supports .log, .txt, .csv, .pdf (Max 10MB)'}
            </span>
            <input
              type="file"
              accept=".txt,.log,.csv,.pdf"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Correlating Evidence...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Coroot RCA</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
