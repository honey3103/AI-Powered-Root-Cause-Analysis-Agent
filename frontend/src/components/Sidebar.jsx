/**
 * Project: AI-Powered Root Cause Analysis Agent
 * Student: Harsh (CSE)
 * File: Sidebar.jsx
 * Description: Left sidebar navigation with quick links to Dashboard, New Incident, and History.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  BookOpen,
  CheckCircle,
  Clock
} from 'lucide-react';

export const Sidebar = () => {
  // navigation items array
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'New Investigation', to: '/new-analysis', icon: PlusCircle },
    { label: 'Analysis History', to: '/history', icon: History },
    { label: 'Project Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 hidden md:flex text-xs">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Student Project Status Card */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2">
          <div className="flex items-center justify-between font-mono font-semibold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              Project Modules
            </span>
            <span className="text-amber-600 dark:text-amber-400">76%</span>
          </div>

          {/* Simple progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            Auth, Five Whys &amp; Log parsing implemented. Final report export formatting in progress.
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <span>Dev Build: v0.8.2</span>
        <span className="text-emerald-500">API: Connected</span>
      </div>
    </aside>
  );
};
