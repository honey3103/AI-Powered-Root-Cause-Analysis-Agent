/**
 * Project: AI-Powered Root Cause Analysis Agent
 * Student: Harsh
 * Department: Computer Science & Engineering
 * Semester: Mini Project Submission (2026)
 * File: Navbar.jsx
 * Description: Top navigation bar with project title, theme toggle, and user profile.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  LogOut, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  X,
  FileCode2,
  GraduationCap
} from 'lucide-react';

export const Navbar = () => {
  // auth and theme hooks
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // state to toggle project details modal
  const [showProjectInfo, setShowProjectInfo] = useState(false);

  const handleLogout = () => {
    // remove token and go to login page
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
          {/* Left: Project title & Student Badge */}
          <div className="flex items-center gap-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                RCA
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 block leading-tight">
                  Root Cause Analyser
                </span>
                <span className="text-[10px] text-slate-500 font-mono block leading-tight">
                  Student Project • Harsh (CSE)
                </span>
              </div>
            </Link>

            {/* Project progress button */}
            <button
              type="button"
              onClick={() => setShowProjectInfo(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 transition"
              title="Click to view Project Submission & Module Details"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Milestone: 76% Completed
            </button>
          </div>

          {/* Right: Actions and User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <Link
                to="/new-analysis"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-sky-600 hover:bg-sky-500 transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New Investigation
              </Link>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile or Login */}
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
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <Link
                  to="/login"
                  className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-white bg-sky-600 hover:bg-sky-500 font-medium transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Student Project Details Modal */}
      {showProjectInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    College Mini Project: Root Cause Analysis Agent
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Student: Harsh • B.Tech Computer Science &amp; Engineering
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProjectInfo(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Total Project Implementation</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">76% Complete</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: '76%' }}></div>
              </div>
            </div>

            {/* Modules implemented by student */}
            <div className="space-y-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Module 1: User Authentication &amp; JWT Protected Routes
                </span>
                <span className="font-mono text-emerald-600 font-bold">Done</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Module 2: Five Whys Problem-Solving Engine
                </span>
                <span className="font-mono text-emerald-600 font-bold">Done</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Module 3: Log &amp; PDF Evidence Extractor (Multer + Regex)
                </span>
                <span className="font-mono text-emerald-600 font-bold">Done</span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                <span className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Module 4: PDF Report Generator &amp; Printable Audit Sheet
                </span>
                <span className="font-mono text-amber-600 font-bold">75% (WIP)</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-2">
                  <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                  Module 5: GitHub Webhooks &amp; Slack Alerts (Future Scope)
                </span>
                <span className="font-mono text-slate-400">15% (Planned)</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-mono">
              <span>Stack: MERN + Heuristic Engine</span>
              <button
                type="button"
                onClick={() => setShowProjectInfo(false)}
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
