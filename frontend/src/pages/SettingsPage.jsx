import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Key, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  ShieldCheck,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateSettings } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [preferredProvider, setPreferredProvider] = useState(user?.preferredProvider || 'auto');
  const [apiKeyGemini, setApiKeyGemini] = useState('');
  const [apiKeyOpenAI, setApiKeyOpenAI] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedSuccess(false);
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        preferredProvider,
      };

      if (apiKeyGemini.trim()) payload.apiKeyGemini = apiKeyGemini.trim();
      if (apiKeyOpenAI.trim()) payload.apiKeyOpenAI = apiKeyOpenAI.trim();

      await updateSettings(payload);
      setSavedSuccess(true);
      setApiKeyGemini('');
      setApiKeyOpenAI('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 font-mono text-zinc-100">
      {/* Header */}
      <div className="border-b border-[#1f1f28] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SYSTEM PREFERENCES</span>
            <span className="text-zinc-600">/</span>
            <span className="text-emerald-400 font-bold">CONFIG</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-emerald-400" />
            Agent & Pipeline Settings
          </h1>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Configure telemetry providers, offline reasoning heuristics, and LLM orchestration parameters.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span className="font-sans">Configuration parameters successfully updated and synced with backend.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span className="font-sans">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* User Profile Card */}
        <div className="p-5 rounded-2xl border border-[#1f1f28] bg-[#0c0c11] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1f1f28] pb-3">
            <div className="flex items-center gap-2 font-bold text-white">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Investigator Profile</span>
            </div>
            <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              ROLE: SRE LEAD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#23232c] bg-[#07070a] text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1.5">
                Email Address (Immutable)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1f1f28] bg-zinc-900/50 text-zinc-500 font-mono text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Reasoning Engine */}
        <div className="p-5 rounded-2xl border border-[#1f1f28] bg-[#0c0c11] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1f1f28] pb-3">
            <div className="flex items-center gap-2 font-bold text-white">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>RCA Reasoning Orchestrator</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded font-bold">
              OFFLINE HEURISTICS ACTIVE
            </span>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">
              Active Reasoning Provider
            </label>
            <select
              value={preferredProvider}
              onChange={(e) => setPreferredProvider(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#23232c] bg-[#07070a] text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono text-xs"
            >
              <option value="auto">Auto (Deterministic Heuristic Engine + Pattern Matching - No API Keys Needed)</option>
              <option value="gemini">Google Gemini 1.5 Flash (Cloud Generative Reasoning)</option>
              <option value="openai">OpenAI GPT-4o Mini (Cloud Generative Reasoning)</option>
            </select>
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              By default, the built-in deterministic engine processes logs, applies 5-Whys deduction, and computes confidence scores completely locally without external API dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-300 font-semibold">
                  Google Gemini API Key
                </label>
                {user?.hasGeminiKey && (
                  <span className="text-[10px] text-emerald-400 font-mono">[KEY CONFIGURED]</span>
                )}
              </div>
              <input
                type="password"
                value={apiKeyGemini}
                onChange={(e) => setApiKeyGemini(e.target.value)}
                placeholder={user?.hasGeminiKey ? '•••••••••••• (Saved in DB)' : 'AIzaSy...'}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#23232c] bg-[#07070a] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-zinc-300 font-semibold">
                  OpenAI API Key
                </label>
                {user?.hasOpenAIKey && (
                  <span className="text-[10px] text-emerald-400 font-mono">[KEY CONFIGURED]</span>
                )}
              </div>
              <input
                type="password"
                value={apiKeyOpenAI}
                onChange={(e) => setApiKeyOpenAI(e.target.value)}
                placeholder={user?.hasOpenAIKey ? '•••••••••••• (Saved in DB)' : 'sk-...'}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#23232c] bg-[#07070a] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Static Deep Black Coroot Theme Card */}
        <div className="p-5 rounded-2xl border border-[#1f1f28] bg-[#0c0c11] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Observability Console Theme</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
              LOCKED: COROOT STATIC BLACK
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            The user interface is permanently calibrated to <strong>Coroot High-Contrast Static Black (#050507)</strong>. 
            Designed specifically for 24/7 Site Reliability Engineer (SRE) operations, this palette ensures minimal retinal fatigue, high-contrast eBPF topology inspection, and instant visual triage of critical server outages.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
            <div className="p-2 rounded bg-[#050507] border border-[#23232c] flex items-center justify-between">
              <span className="text-zinc-500">Canvas</span>
              <span className="text-zinc-300 font-bold">#050507</span>
            </div>
            <div className="p-2 rounded bg-[#0c0c11] border border-[#23232c] flex items-center justify-between">
              <span className="text-zinc-500">Surface</span>
              <span className="text-zinc-300 font-bold">#0C0C11</span>
            </div>
            <div className="p-2 rounded bg-[#121217] border border-[#23232c] flex items-center justify-between">
              <span className="text-zinc-500">Panel</span>
              <span className="text-zinc-300 font-bold">#121217</span>
            </div>
            <div className="p-2 rounded bg-[#07070a] border border-emerald-500/30 flex items-center justify-between">
              <span className="text-emerald-400">Accent</span>
              <span className="text-emerald-400 font-bold">#10B981</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg font-bold text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Config...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Save Agent Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
