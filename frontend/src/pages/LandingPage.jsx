import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSearch,
  GitBranch,
  Layers,
  Database,
  Server,
  Code2
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Dev Status Banner */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="font-mono font-semibold">PROJECT STATUS: Active Development (Sprint 3 / MVP)</span>
          <span className="text-slate-400">•</span>
          <span>~76% Implemented</span>
        </div>
        <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
          Target: Intermediate Mini-Project Submission
        </div>
      </div>

      {/* Main Header / Intro */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
          <Terminal className="w-3.5 h-3.5 text-sky-500" />
          <span>cs-project / rca-agent / v0.8.2-beta</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          Incident Root Cause Analyser
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          A full-stack web application designed to help developers and system admins diagnose software incidents, parse server logs, and determine underlying causes using the <strong>Five Whys</strong> problem-solving technique.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 transition shadow-sm"
          >
            Open Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Sign In with Test Account
          </Link>
        </div>
      </div>

      {/* Progress Milestone Tracker (76% Complete) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              Sprint 3 Implementation Milestone
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Feature completion status tracking against project requirements
            </p>
          </div>
          <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">
            76% Done
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
        </div>

        {/* Modules status grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                1. Authentication & Incident Records
              </span>
              <span className="font-mono text-emerald-600">100%</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              JWT auth, password bcrypt hashing, MongoDB storage, per-user incident triage.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                2. Five Whys & Cause Ranking Engine
              </span>
              <span className="font-mono text-emerald-600">100%</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Sequential 5 Whys deduction, confidence scoring, supporting & contradicting points.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                3. Log & Evidence Extractor
              </span>
              <span className="font-mono text-emerald-600">90%</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Multer file parsing (.log, .txt, .csv, .pdf), error regex detection, timestamp matching.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                4. PDF Report Generator & Print Format
              </span>
              <span className="font-mono text-amber-600">75% (WIP)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              PDFKit backend streaming working; fine-tuning printable page breaks and table margins.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/40 space-y-1 opacity-70">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                5. GitHub Commit Sync & Slack Alerts
              </span>
              <span className="font-mono text-slate-400">15% (Roadmap)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Future release: webhook sync to pull commit diffs directly from GitHub repositories.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/40 space-y-1 opacity-70">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                6. Real-time Socket Live Streaming
              </span>
              <span className="font-mono text-slate-400">10% (Roadmap)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Future release: WebSocket streaming for live tailing of production container logs.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Spec */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Project Architecture & Stack
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-slate-400 block text-[10px] font-mono">FRONTEND</span>
            <span className="font-semibold text-slate-900 dark:text-white">React 18 + Vite</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Tailwind CSS + Recharts</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-slate-400 block text-[10px] font-mono">BACKEND</span>
            <span className="font-semibold text-slate-900 dark:text-white">Node.js + Express</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">REST APIs + Multer</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-slate-400 block text-[10px] font-mono">DATABASE</span>
            <span className="font-semibold text-slate-900 dark:text-white">MongoDB + Mongoose</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Local Port 27017</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-slate-400 block text-[10px] font-mono">ANALYSIS ENGINE</span>
            <span className="font-semibold text-slate-900 dark:text-white">Rule Heuristics + LLM</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Offline Fallback Engine</span>
          </div>
        </div>
      </div>

      {/* Realistic Student/Developer Footer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <div>
          <span>Harsh • Mini-Project Submission (2026)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Build: <code>v0.8.2-beta</code></span>
          <span>Environment: <code>development</code></span>
        </div>
      </footer>
    </div>
  );
};
