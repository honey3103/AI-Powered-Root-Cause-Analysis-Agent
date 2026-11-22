import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Terminal,
  Activity,
  Cpu,
  Layers,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1f1f28] bg-[#07070a]/90 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
          {/* Brand & Coroot Mark */}
          <div className="flex items-center gap-4">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-emerald-500 text-black font-mono font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
                CR
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm tracking-tight text-white">
                  coroot<span className="text-emerald-400">/ai-rca</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  v0.8.2
                </span>
              </div>
            </Link>

            {/* Live Telemetry Pill */}
            <button
              onClick={() => setShowStatusModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AGENT: ACTIVE</span>
              <span className="text-zinc-500">•</span>
              <span className="text-emerald-400 font-semibold">76% Implemented</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {user && (
              <Link
                to="/new-analysis"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>New Incident</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
                <div className="hidden sm:flex flex-col text-right font-mono">
                  <span className="text-xs font-semibold text-zinc-200 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 leading-tight">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-zinc-400 hover:text-white transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white font-medium border border-zinc-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Coroot Telemetry & Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-[#0c0c11] shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <h3 className="font-bold text-sm text-white">
                  Coroot AI RCA Agent • Engine Status
                </h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-zinc-300">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-500">ENGINE PIPELINE COMPLETION</span>
                <span className="text-emerald-400 font-bold">76%</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-[11px]">
              <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Incident Intake &amp; Symptom Correlator
                </span>
                <span className="text-emerald-400 font-bold">OPERATIONAL</span>
              </div>

              <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Five Whys Deductive Diagnostic Engine
                </span>
                <span className="text-emerald-400 font-bold">OPERATIONAL</span>
              </div>

              <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Multi-Format Log Extractor (TXT, LOG, CSV, PDF)
                </span>
                <span className="text-emerald-400 font-bold">90% READY</span>
              </div>

              <div className="p-2.5 rounded bg-zinc-900/70 border border-amber-500/30 flex items-center justify-between">
                <span className="text-amber-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  PDF Post-Mortem Audit Generator
                </span>
                <span className="text-amber-400 font-bold">75% (IN PROGRESS)</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800 flex justify-between items-center">
              <span>Investigator: Harsh • Architecture: Full-Stack MERN + eBPF Logic</span>
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
