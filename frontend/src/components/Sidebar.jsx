import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListFilter, 
  Settings, 
  Layers,
  FolderGit2
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboards', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Incident', to: '/new-analysis', icon: PlusCircle },
    { label: 'Issues & History', to: '/history', icon: ListFilter },
    { label: 'Project Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-56 border-r border-[#dfe1e6] bg-[#fafbfc] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-3 hidden md:flex text-xs text-[#172b4d] shrink-0">
      <div className="space-y-4">
        {/* Project Header */}
        <div className="flex items-center gap-2 px-2 py-2 border-b border-[#dfe1e6]">
          <div className="w-6 h-6 rounded bg-[#deebff] text-[#0052cc] font-bold text-xs flex items-center justify-center">
            RCA
          </div>
          <div>
            <div className="font-bold text-xs text-[#172b4d]">Incident Tracker</div>
            <div className="text-[10px] text-[#5e6c84]">Software project</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div>
          <div className="text-[10px] uppercase font-bold text-[#5e6c84] px-2 mb-1.5 tracking-wider">
            Planning &amp; Issues
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-1.5 rounded transition ${
                    isActive
                      ? 'bg-[#ebecf0] text-[#0052cc] font-semibold'
                      : 'text-[#42526e] hover:bg-[#ebecf0] hover:text-[#172b4d]'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-[#5e6c84]" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sprint Status Box */}
        <div className="p-3 rounded-lg border border-[#dfe1e6] bg-white space-y-2">
          <div className="text-xs font-semibold text-[#172b4d] flex items-center justify-between">
            <span>Active Sprint</span>
            <span className="text-[10px] text-[#0052cc] font-bold">SPRINT 3</span>
          </div>
          <div className="w-full bg-[#ebecf0] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#0052cc] h-full rounded-full" style={{ width: '76%' }}></div>
          </div>
          <div className="text-[10px] text-[#5e6c84] flex justify-between">
            <span>Progress</span>
            <span className="font-semibold text-[#172b4d]">76% Completed</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
