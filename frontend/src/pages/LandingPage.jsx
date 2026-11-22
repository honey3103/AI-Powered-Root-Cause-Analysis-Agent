import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Server, 
  Cpu, 
  FileSearch,
  Activity,
  Layers,
  Terminal,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#09090b] text-zinc-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Top Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>B.Tech Final Year Project • Computer Science &amp; Engineering</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            AI-Powered Root Cause Analysis (RCA) System
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A full-stack diagnostic web application built to analyze production incident logs, correlate system errors, and deduce root causes using the structured <strong>Five Whys</strong> engineering methodology.
          </p>

          {/* Status Banner */}
          <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 max-w-sm mx-auto flex items-center justify-center gap-2 text-xs text-zinc-400">
            <span>Project Status: </span>
            <span className="text-emerald-400 font-medium">Sprint 3 (~76% Implemented)</span>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-sm">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/new-analysis"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition"
            >
              <Terminal className="w-4 h-4 text-zinc-400" />
              New Incident Investigation
            </Link>
          </div>
        </div>

        {/* Project Overview Card */}
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Problem Statement &amp; Motivation
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            During production outages (like HTTP 502 Bad Gateways, database deadlocks, or application crashes), developers are forced to manually sift through thousands of noisy log lines while under pressure. 
            This project automates incident triage by extracting error signatures from uploaded log files, organizing the timeline of events, and applying a step-by-step 5-Whys deductive chain to deliver ranked root causes and a 3-tier remediation action plan.
          </p>
        </div>

        {/* 4-Step Pipeline Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-white">How the System Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-emerald-400 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-sm font-semibold text-white">Incident Intake</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enter incident symptoms, time of occurrence, recent PR/config deployments, and attach raw log files.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-emerald-400 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-sm font-semibold text-white">Log Extraction</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automated regex scanner parses error spikes, warnings, stack traces, and timestamps from memory buffers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-emerald-400 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="text-sm font-semibold text-white">Five Whys Deduction</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drills down 5 logical layers from surface symptoms to the root failure, ranking causes with confidence scores.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-emerald-400 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="text-sm font-semibold text-white">Action Plan &amp; PDF</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Produces immediate (0-2h), short-term (1-3d), and long-term fix steps, with downloadable PDF reports.
              </p>
            </div>
          </div>
        </div>

        {/* Live Example Incident Box */}
        <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Sample Investigation Output
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Incident #1042: Web Service Returning HTTP 502 Bad Gateway
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/80 text-rose-300 font-medium self-start sm:self-auto">
              Critical Severity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Input Evidence */}
            <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-300 block">
                Extracted Log Evidence &amp; Symptoms
              </span>
              <div className="p-2 rounded bg-zinc-900 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="text-rose-400">
                  [error] connect() failed (111: Connection refused) while connecting to upstream
                </div>
                <div className="text-amber-400">
                  [warn] liveness probe failed 3 times. Pod CrashLoopBackOff.
                </div>
                <div className="text-zinc-500">
                  Time: 2026-11-22 14:30 UTC • Recent Change: Merged PR #142 (Docker base image change)
                </div>
              </div>
            </div>

            {/* Right: Deductions */}
            <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-300 block">
                Primary Root Cause (88% Confidence)
              </span>
              <p className="text-zinc-300 leading-relaxed text-xs">
                Upstream container crashed on startup due to missing environment variables introduced in PR #142, leading to failed health checks and ingress 502 connection refusal.
              </p>
              <div className="pt-1 text-[11px] text-emerald-400 font-medium">
                Immediate Action: Roll back deployment to v2.4.0 and supply missing DB_PORT variable.
              </div>
            </div>
          </div>
        </div>

        {/* Current Project Progress (~76%) */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Project Implementation Status
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              76% Complete (Sprint 3)
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>JWT Auth &amp; Incident Isolation (100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Format Log Parser (.log, .pdf) (100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Five Whys Reasoning Engine (100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ranked Root Causes &amp; Confidence (100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF Report Export (PDFKit) (85%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Cluster eBPF Stream (Planned Sprint 4)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div>
            AI-Powered Root Cause Analysis Agent
          </div>
          <div>
            Automated SRE &amp; Incident Triage Platform
          </div>
        </footer>

      </div>
    </div>
  );
};
