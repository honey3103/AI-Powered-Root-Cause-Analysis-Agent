import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Activity, 
  Layers, 
  FileCode2, 
  Zap, 
  ShieldAlert, 
  Server, 
  Cpu, 
  FileSearch,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#050507] text-zinc-100 font-sans selection:bg-emerald-500/20">
      {/* Coroot Subtle Grid Background & Radial Glow */}
      <div className="absolute inset-0 coroot-grid pointer-events-none opacity-40"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] coroot-glow pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 space-y-16">
        {/* Top Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>COROOT-STYLE AI INCIDENT AGENT • ZERO NOISE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono leading-[1.1]">
            Find the <span className="text-emerald-400">Root Cause</span> of Production Failures in Seconds.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
            Coroot AI correlates application logs, parses crash dumps, executes a structured <strong>Five Whys diagnostic tree</strong>, and pinpoints the exact failure mechanism — not chatbot guesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
            >
              Launch Live Console
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              to="/new-analysis"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 transition"
            >
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              Try Demo Incident (502 Outage)
            </Link>
          </div>
        </div>

        {/* Coroot AI Interactive Live Diagnostic Simulation Box */}
        <div className="rounded-2xl border border-zinc-800 bg-[#09090f] shadow-2xl p-5 sm:p-7 space-y-5 font-mono text-xs">
          {/* Simulation Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
              <div>
                <div className="text-zinc-200 font-bold text-xs sm:text-sm">
                  INCIDENT: <span className="text-rose-400">prod-us-east / checkout-service / 502-bad-gateway</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  Severity: CRITICAL • Ingress: Envoy / Nginx • Status: ROOT CAUSE PINPOINTED
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto text-[11px]">
              <span className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold">
                Confidence: 88%
              </span>
              <span className="text-zinc-500">Time to RCA: 1.2s</span>
            </div>
          </div>

          {/* Diagnostic Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-[#0e0e14] border border-zinc-800/70">
              <span className="text-zinc-500 text-[10px] block">LOGS INSPECTED</span>
              <span className="font-bold text-zinc-200">14,250 entries</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0e0e14] border border-zinc-800/70">
              <span className="text-zinc-500 text-[10px] block">CRASH SIGNATURES</span>
              <span className="font-bold text-rose-400">12 ECONNREFUSED</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0e0e14] border border-zinc-800/70">
              <span className="text-zinc-500 text-[10px] block">REASONING METHOD</span>
              <span className="font-bold text-emerald-400">5 Whys Cascade</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0e0e14] border border-zinc-800/70">
              <span className="text-zinc-500 text-[10px] block">ACTION PLAN</span>
              <span className="font-bold text-zinc-200">3 Immediate, 2 Long</span>
            </div>
          </div>

          {/* Root Cause Deduction Highlight */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Primary Root Cause Identified:
            </div>
            <p className="text-xs sm:text-sm font-semibold text-zinc-100 font-sans leading-relaxed">
              Upstream Application Container Process Crashed on Port 3000 Immediately Following Deployment.
            </p>
            <p className="text-[11px] text-zinc-400 font-sans">
              Why deduction: The container threw an unhandled exception binding to <code>0.0.0.0:3000</code> due to missing Redis configuration variable introduced in recent release.
            </p>
          </div>
        </div>

        {/* Feature Grid in Coroot Deep Black Aesthetic */}
        <div className="space-y-4">
          <div className="text-center font-mono">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Engine Capabilities
            </h2>
            <p className="text-lg font-bold text-zinc-100 mt-1">
              Engineered for SRE &amp; DevOps Incident Response
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-5 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-2 hover:border-zinc-700 transition">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-100 text-sm">
                Ranked Root Causes
              </h3>
              <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                Calculates confidence percentages for multiple potential failure modes, complete with supporting evidence and contradicting points.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-2 hover:border-zinc-700 transition">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-100 text-sm">
                Five Whys Deep Dive
              </h3>
              <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                Drills down from superficial symptoms (e.g. 502 Bad Gateway) down to root process, configuration, or architectural deficiencies.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-2 hover:border-zinc-700 transition">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <FileSearch className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-100 text-sm">
                Multi-Format Log Parser
              </h3>
              <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                Upload .LOG, .TXT, .CSV, or .PDF crash dumps. Automatically detects stack traces, error codes, and timestamps.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>Coroot AI Architecture • Developed by Harsh (CSE)</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Build: <code>v0.8.2-coroot-dark</code></span>
            <span className="text-emerald-400">Status: 76% Implemented</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
