import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Key, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
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
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 text-[#172b4d]">
      
      {/* Top Header */}
      <div className="border-b border-[#dfe1e6] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-xs text-[#5e6c84] mb-0.5">
            <span>Projects</span> / <span>RCA Project</span> / <span className="font-semibold text-[#172b4d]">Project Settings</span>
          </div>
          <h1 className="text-xl font-bold text-[#172b4d] tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#0052cc]" />
            Project Settings &amp; Engine Configuration
          </h1>
          <p className="text-xs text-[#5e6c84] mt-0.5">
            Manage investigator profile, reasoning heuristics, and optional LLM provider keys.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded bg-[#e3fcef] border border-[#abf5d1] text-[#006644] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Project settings and reasoning parameters successfully updated.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-[#ffebe6] border border-[#ffbdad] text-[#de350b] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* User Profile Card */}
        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#ebecf0] pb-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#172b4d]">
              <User className="w-4 h-4 text-[#0052cc]" />
              <span>Investigator Profile</span>
            </div>
            <span className="text-[10px] text-[#5e6c84] bg-[#f4f5f7] border border-[#dfe1e6] px-2 py-0.5 rounded font-semibold">
              ROLE: SRE LEAD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172b4d] font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[#5e6c84] font-semibold mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-[#ebecf0] text-[#5e6c84] text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Reasoning Engine */}
        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#ebecf0] pb-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#172b4d]">
              <Cpu className="w-4 h-4 text-[#0052cc]" />
              <span>Reasoning Engine Configuration</span>
            </div>
            <span className="text-[10px] text-[#006644] bg-[#e3fcef] border border-[#abf5d1] px-2 py-0.5 rounded font-bold">
              OFFLINE ENGINE ACTIVE ($0 COST)
            </span>
          </div>

          <div>
            <label className="block text-[#172b4d] font-semibold mb-1">
              Active Reasoning Provider
            </label>
            <select
              value={preferredProvider}
              onChange={(e) => setPreferredProvider(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
            >
              <option value="auto">Auto (Deterministic &amp; Pattern Heuristics Engine - No API Key Needed)</option>
              <option value="gemini">Google Gemini 1.5 Flash (Optional Cloud Reasoning)</option>
              <option value="openai">OpenAI GPT-4o Mini (Optional Cloud Reasoning)</option>
            </select>
            <p className="text-[11px] text-[#5e6c84] mt-1">
              Default mode operates 100% locally with high-confidence failure scenarios and instant 5-Whys generation.
            </p>
          </div>

          {preferredProvider !== 'auto' && (
            <div className="pt-2 border-t border-[#ebecf0] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {preferredProvider === 'gemini' && (
                <div>
                  <label className="block text-[#172b4d] font-semibold mb-1">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeyGemini}
                    onChange={(e) => setApiKeyGemini(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
                  />
                </div>
              )}

              {preferredProvider === 'openai' && (
                <div>
                  <label className="block text-[#172b4d] font-semibold mb-1">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeyOpenAI}
                    onChange={(e) => setApiKeyOpenAI(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-1.5 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-[#0052cc] hover:bg-[#0065ff] text-white font-medium text-xs shadow-xs transition disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};
