import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  LogOut, 
  Terminal, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  GitBranch
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProgressModal, setShowProgressModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-15 px-4 sm:px-6 lg:px-8 py-2">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-800 text-sky-400 flex items-center justify-center border border-slate-700 shadow-sm font-mono text-sm font-bold">
                &gt;_
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 font-mono">
                  rca-analyser
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowProgressModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
                  title="Click to view development milestone & completion breakdown"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  v0.8.2-beta • 76% Done
                </button>
              </div>
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <Link
                to="/new-analysis"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New Incident
              </Link>
            )}

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono leading-tight">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <Link
                  to="/login"
                  className="px-3 py-1.5 font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Progress Breakdown Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Project Progress: 76% (Sprint 3 / MVP)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Full-Stack MERN + Root Cause Engine • Current Status
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Overall Completion</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">76%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '76%' }}></div>
              </div>
            </div>

            {/* Modules Breakdown */}
            <div className="space-y-2 text-xs pt-2">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Phase 1-3: User Auth, Incident Form & Dashboard
                </span>
                <span className="font-mono text-emerald-600 font-semibold">100%</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Phase 4-5: Ranked Causes & 5 Whys Engine
                </span>
                <span className="font-mono text-emerald-600 font-semibold">100%</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Phase 6: Log & PDF Evidence Extractor
                </span>
                <span className="font-mono text-emerald-600 font-semibold">90%</span>
              </div>

              <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 flex items-center justify-between">
                <span className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Phase 7: PDF Report Generation & Print Format
                </span>
                <span className="font-mono text-amber-600 font-semibold">75% (WIP)</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  Phase 8: GitHub Sync & Slack Alerts (Future Scope)
                </span>
                <span className="font-mono text-slate-400">15% (Planned)</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span>Branch: <code>main@dev-sprint-3</code></span>
              <button
                type="button"
                onClick={() => setShowProgressModal(false)}
                className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs"
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
