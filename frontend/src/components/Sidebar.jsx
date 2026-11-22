import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  GitBranch,
  Terminal,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Incidents Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Log New Incident', to: '/new-analysis', icon: PlusCircle },
    { label: 'Past Investigations', to: '/history', icon: History },
    { label: 'Project Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-3.75rem)] flex flex-col justify-between p-4 hidden md:flex font-sans">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2 font-semibold">
            Workspaces
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-slate-500" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Milestone Card */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-amber-500" /> Sprint 3 Status
            </span>
            <span className="font-mono text-[11px] text-amber-600 font-bold">76%</span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            MVP phase: Incident creation, 5 Whys, and evidence parsing are complete. PDF report refining is underway.
          </p>
        </div>
      </div>

      {/* Build Info */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          backend:5000 ok
        </span>
        <span className="text-[10px]">v0.8.2-beta</span>
      </div>
    </aside>
  );
};
