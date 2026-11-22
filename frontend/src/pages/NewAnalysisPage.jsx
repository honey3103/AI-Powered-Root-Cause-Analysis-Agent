/**
 * Project: AI-Powered Root Cause Analysis Agent
 * Developer: Harsh (CSE)
 * File: NewAnalysisPage.jsx
 * Description: Form component where user enters incident symptoms and uploads log evidence.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  Upload, 
  AlertCircle, 
  Terminal,
  FileText,
  Play,
  Lightbulb
} from 'lucide-react';

// list of technical problem categories
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

  // form state variables
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

  // loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // helper to quickly load a 502 bad gateway demo during project viva
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

  // helper to quickly load a database pool saturation demo
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

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!title.trim() || !description.trim()) {
      setError('Please provide at least an incident title and description');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // step 1: call backend POST /api/analysis
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

      // step 2: if a log file was uploaded, send it to backend using FormData
      if (file && analysisId) {
        const formData = new FormData();
        formData.append('file', file);
        await api.post(`/analysis/${analysisId}/evidence`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // re-run analysis with the uploaded evidence
        await api.post(`/analysis/${analysisId}/reanalyze`);
      }

      // step 3: redirect user to result page
      navigate(`/analysis/${analysisId}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.message || 'Failed to initialize incident analysis.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Title and Viva Demo buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Log New Technical Incident
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fill in incident symptoms and logs to trigger the 5 Whys diagnostic engine.
          </p>
        </div>

        {/* Demo templates for quick presentation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadExample502}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Load 502 Bad Gateway sample data"
          >
            Demo 502 Outage
          </button>
          <button
            type="button"
            onClick={loadExampleDb}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Load Database Pool sample data"
          >
            Demo DB Timeout
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Section 1: Problem Definition */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            1. Problem Statement
          </span>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Incident Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Website returning HTTP 502 Bad Gateway after deployment"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
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
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptoms, what broke, and affected services..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Section 2: Technical Symptoms */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            2. Technical Symptoms &amp; Traces
          </span>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observed Symptoms (Comma separated)
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. 502 Bad Gateway, high latency, socket timeout"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Error Messages / Stack Trace
            </label>
            <textarea
              rows={3}
              value={errorMessages}
              onChange={(e) => setErrorMessages(e.target.value)}
              placeholder="Paste exact error log lines, HTTP error codes, or stack traces..."
              className="w-full font-mono text-[11px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time of Occurrence
              </label>
              <input
                type="text"
                value={timeOfOccurrence}
                onChange={(e) => setTimeOfOccurrence(e.target.value)}
                placeholder="e.g. 2026-11-22 12:45 UTC or Today 10:15 AM"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recent Changes / Deployments
              </label>
              <input
                type="text"
                value={recentChanges}
                onChange={(e) => setRecentChanges(e.target.value)}
                placeholder="e.g. Release v2.4, config file update, schema migration"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Log Upload */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xs">
          <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            3. Log File Evidence (Optional)
          </span>

          <label className="flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <Upload className="w-6 h-6 text-slate-400 mb-1" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {file ? file.name : 'Choose a log or dump file (.log, .txt, .csv, .pdf)'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'Max 10MB'}
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
            className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg font-semibold text-white bg-sky-600 hover:bg-sky-500 transition shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Incident...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run RCA Diagnostic</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
