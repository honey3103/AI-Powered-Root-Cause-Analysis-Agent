import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'New Investigation', to: '/new-analysis', icon: PlusCircle },
    { label: 'Incident History', to: '/history', icon: History },
    { label: 'AI & System Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-60 border-r border-zinc-800 bg-zinc-950 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 hidden md:flex text-xs">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-2">
            Main Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-emerald-400 font-medium border border-zinc-800'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Project Development Status Widget */}
        <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Project Progress
            </span>
            <span className="text-emerald-400">76%</span>
          </div>

          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }}></div>
          </div>

          <div className="space-y-1 text-[11px] text-zinc-400 pt-1">
            <div className="flex justify-between">
              <span>Current Sprint:</span>
              <span className="text-zinc-200 font-medium">Sprint 3 (MVP)</span>
            </div>
            <div className="flex justify-between">
              <span>Log Parser:</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>5 Whys Engine:</span>
              <span className="text-emerald-400">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Status: Local Server
        </span>
        <span className="text-zinc-400">Harsh (CSE)</span>
      </div>
    </aside>
  );
};
