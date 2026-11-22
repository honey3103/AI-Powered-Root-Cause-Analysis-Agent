/**
 * Project Title: AI-Powered Root Cause Analysis Agent
 * Submitted by: Harsh
 * Course: B.Tech Computer Science and Engineering (2026)
 * Project Type: Intermediate Mini Project (Full-Stack MERN + AI)
 * File: LandingPage.jsx
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText, 
  Database, 
  Server, 
  Code,
  GraduationCap,
  Layers,
  Search
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* College Project Submission Banner */}
      <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300">
          <GraduationCap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="font-semibold">B.Tech Computer Science &amp; Engineering • Mini Project 2026</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-600 dark:text-slate-400">Student: <strong>Harsh</strong></span>
        </div>
        <div className="font-mono text-amber-700 dark:text-amber-400 font-semibold text-[11px] bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-300 dark:border-amber-800 self-start sm:self-auto">
          Project Progress: ~76% (Sprint 3)
        </div>
      </div>

      {/* Main Project Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
          <span>Project ID: RCA-AGENT-2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI-Powered Root Cause Analysis Agent
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          This web application was developed as an intermediate full-stack mini project to assist software developers in investigating technical outages and server errors. It correlates submitted error messages and uploaded server logs, executes the <strong>Five Whys problem-solving methodology</strong>, and generates ranked root cause explanations with action plans.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition shadow-sm"
          >
            Open Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
          >
            Sign In with Test Account
          </Link>
        </div>
      </div>

      {/* Project Modules & Implementation Status (Student Project Tracking) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Project Modules &amp; Implementation Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of project requirements implemented for intermediate submission
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
            Progress: 76% Done
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Module 1: Authentication &amp; User Records
              </span>
              <span className="text-emerald-600 font-mono font-bold">100%</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              JWT authentication, bcrypt password hashing, MongoDB models for users and incidents.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Module 2: Five Whys &amp; Root Cause Ranking
              </span>
              <span className="text-emerald-600 font-mono font-bold">100%</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              5 Whys deductive sequence, confidence percentage estimation, supporting &amp; contradicting evidence.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Module 3: Log &amp; Evidence Parser
              </span>
              <span className="text-emerald-600 font-mono font-bold">90%</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Multer file processing for .txt, .log, .csv, and .pdf with regex error extraction.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
            <div className="flex items-center justify-between font-semibold text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Module 4: PDF Report Generator &amp; Print Audit
              </span>
              <span className="text-amber-600 font-mono font-bold">75% (WIP)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Backend PDFKit stream working; fine-tuning printable table layout and page margins.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-850/30 space-y-1 opacity-70">
            <div className="flex items-center justify-between font-semibold text-slate-500 dark:text-slate-400">
              <span>Module 5: GitHub Webhook Sync (Future Scope)</span>
              <span className="font-mono">15%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Planned for final phase: pulling commit diffs automatically from GitHub repositories.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-850/30 space-y-1 opacity-70">
            <div className="flex items-center justify-between font-semibold text-slate-500 dark:text-slate-400">
              <span>Module 6: Slack / Discord Incident Alerts</span>
              <span className="font-mono">10%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Planned for final phase: automated dispatch of incident summaries to team chat.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Diagram */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Technologies Used in Project
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-sky-600 font-semibold mb-1">
              <Code className="w-4 h-4" /> Frontend
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium">React 18 + Vite</p>
            <span className="text-[10px] text-slate-400">Tailwind CSS + Recharts</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-indigo-600 font-semibold mb-1">
              <Server className="w-4 h-4" /> Backend
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium">Node.js + Express</p>
            <span className="text-[10px] text-slate-400">REST APIs + Multer</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold mb-1">
              <Database className="w-4 h-4" /> Database
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium">MongoDB</p>
            <span className="text-[10px] text-slate-400">Mongoose ODM</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-purple-600 font-semibold mb-1">
              <Layers className="w-4 h-4" /> Logic Engine
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium">Heuristics + AI</p>
            <span className="text-[10px] text-slate-400">Built-in SRE Rules</span>
          </div>
        </div>
      </div>

      {/* Student Project Footer */}
      <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
        <div>
          <span>Submitted by: <strong>Harsh</strong> • Computer Science &amp; Engineering</span>
        </div>
        <div>
          <span>Status: Working Prototype (76% Evaluation Milestone)</span>
        </div>
      </footer>
    </div>
  );
};
