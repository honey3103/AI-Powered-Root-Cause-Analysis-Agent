import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Terminal,
  Activity,
  Layers,
  X,
  ShieldCheck
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
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
          {/* Brand & Project Name */}
          <div className="flex items-center gap-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white">
                  RCA Agent
                </span>
              </div>
            </Link>

            {/* Human Project Progress Badge */}
            <button
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition"
              title="Click to view development milestones"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Sprint 3: </span>
              <span className="text-emerald-400 font-medium">76% Built</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {user && (
              <Link
                to="/new-analysis"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Incident</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-medium text-zinc-200 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-zinc-500 leading-tight">
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
              <div className="flex items-center gap-2 text-xs">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-zinc-400 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium border border-zinc-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Human Project Milestone Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">
                  Project Development Status &amp; Roadmap
                </h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-zinc-300">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Total Project Completion:</span>
                <span className="text-emerald-400 font-bold">~76% (MVP Complete)</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-200 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Sprint 1: Auth &amp; Incident Case Management
                </span>
                <span className="text-emerald-400 font-medium">Done (100%)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-200 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Sprint 2: Multi-Format Log Parser (.log, .pdf, .csv)
                </span>
                <span className="text-emerald-400 font-medium">Done (100%)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-200 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Sprint 3: Five Whys Deductive Reasoning &amp; PDF Report
                </span>
                <span className="text-emerald-400 font-medium">Done (90%)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Sprint 4: Multi-Cluster Telemetry Streaming
                </span>
                <span className="text-amber-400 font-medium">Planned (In Progress)</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-800 flex justify-between items-center">
              <span>Developer: Harsh • B.Tech Computer Science</span>
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-3 py-1 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
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
