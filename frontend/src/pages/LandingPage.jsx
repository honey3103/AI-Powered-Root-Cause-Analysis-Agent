import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Activity,
  Layers,
  Terminal,
  ShieldAlert,
  Search
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f4f5f7] text-[#172b4d] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Top Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#dfe1e6] text-xs text-[#5e6c84] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#006644]"></span>
            <span>RCA Project • Active Sprint 3</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#172b4d] leading-tight">
            Root Cause Analysis &amp; Incident Tracking System
          </h1>

          <p className="text-sm text-[#5e6c84] leading-relaxed max-w-2xl mx-auto">
            A diagnostic engineering portal to record production outages, extract error signatures from server logs, and deduce root causes using the structured <strong>Five Whys</strong> methodology.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-sm">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#0052cc] hover:bg-[#0065ff] font-medium text-white shadow-xs transition"
            >
              Open Project Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/new-analysis"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-white hover:bg-[#fafbfc] border border-[#dfe1e6] font-medium text-[#172b4d] shadow-xs transition"
            >
              <Plus className="w-4 h-4 text-[#0052cc]" />
              Create Incident
            </Link>
          </div>
        </div>

        {/* Project Overview Card */}
        <div className="p-5 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-2">
          <h2 className="text-sm font-bold text-[#172b4d] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0052cc]" />
            Incident Investigation Workflow
          </h2>
          <p className="text-xs text-[#5e6c84] leading-relaxed">
            During production downtime (such as HTTP 502 Bad Gateways, database pool saturation, or service crashes), this system automates triage: parsing error signatures, compiling chronological failure steps, executing a deductive 5-Whys reasoning chain, and generating immediate, short-term, and long-term action checklists.
          </p>
        </div>

        {/* 4-Step Pipeline Cards */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-[#5e6c84] uppercase tracking-wider">How the Investigation Pipeline Operates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-2">
              <div className="w-7 h-7 rounded bg-[#deebff] text-[#0052cc] flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-xs font-bold text-[#172b4d]">Incident Intake</h3>
              <p className="text-xs text-[#5e6c84] leading-relaxed">
                Log symptoms, occurrence timestamp, recent code releases, and attach server log files.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-2">
              <div className="w-7 h-7 rounded bg-[#deebff] text-[#0052cc] flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-xs font-bold text-[#172b4d]">Log Extraction</h3>
              <p className="text-xs text-[#5e6c84] leading-relaxed">
                Automated regex scanner extracts error spikes, warnings, and stack traces from raw log text.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-2">
              <div className="w-7 h-7 rounded bg-[#deebff] text-[#0052cc] flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="text-xs font-bold text-[#172b4d]">Five Whys Deduction</h3>
              <p className="text-xs text-[#5e6c84] leading-relaxed">
                Drills down 5 logical layers from surface symptoms to root failure with confidence scores.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-2">
              <div className="w-7 h-7 rounded bg-[#deebff] text-[#0052cc] flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="text-xs font-bold text-[#172b4d]">Remediation &amp; PDF</h3>
              <p className="text-xs text-[#5e6c84] leading-relaxed">
                Produces immediate, short-term, and long-term fix steps, with downloadable post-mortem reports.
              </p>
            </div>
          </div>
        </div>

        {/* Live Example Incident Box */}
        <div className="p-5 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ebecf0] pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052cc]">
                Sample Incident Record
              </span>
              <h3 className="text-sm font-bold text-[#172b4d]">
                RCA-1042: Web Service Returning HTTP 502 Bad Gateway
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-[#ffebe6] text-[#de350b] font-bold self-start sm:self-auto border border-[#ffbdad]">
              Highest Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-[#f4f5f7] border border-[#dfe1e6] space-y-1.5">
              <span className="text-[11px] font-semibold text-[#172b4d] block">
                Extracted Log Evidence:
              </span>
              <div className="font-mono text-[11px] text-[#de350b] space-y-0.5">
                <div>[error] connect() failed (111: Connection refused) while connecting to upstream</div>
                <div className="text-[#ff8b00]">[warn] liveness probe failed 3 times. Pod CrashLoopBackOff.</div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#f4f5f7] border border-[#dfe1e6] space-y-1.5">
              <span className="text-[11px] font-semibold text-[#172b4d] block">
                Deduced Root Cause:
              </span>
              <p className="text-xs text-[#5e6c84]">
                Node.js HTTP listener crashed during initialization due to missing environment variable in Docker release v2.4.1.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
