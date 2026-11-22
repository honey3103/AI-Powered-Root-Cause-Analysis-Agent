import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  Activity,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Incidents Console', to: '/dashboard', icon: LayoutDashboard },
    { label: 'New Investigation', to: '/new-analysis', icon: PlusCircle },
    { label: 'Investigation History', to: '/history', icon: History },
    { label: 'Agent Configuration', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#1f1f28] bg-[#07070a] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 hidden md:flex font-mono text-xs">
      <div className="space-y-6">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold px-3 mb-2">
            Investigation Workspaces
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold'
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

        {/* Coroot AI Telemetry Diagnostics Widget */}
        <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#0d0d12] space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              RCA Pipeline Status
            </span>
            <span className="text-emerald-400">76%</span>
          </div>

          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '76%' }}></div>
          </div>

          <div className="space-y-1 text-[10px] text-zinc-400">
            <div className="flex justify-between">
              <span>Reasoning Engine:</span>
              <span className="text-zinc-200">Heuristic + LLM</span>
            </div>
            <div className="flex justify-between">
              <span>Log Parser:</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Latency to RCA:</span>
              <span className="text-zinc-200">&lt; 1.4s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Cluster: Localhost
        </span>
        <span>Harsh (CSE)</span>
      </div>
    </aside>
  );
};
