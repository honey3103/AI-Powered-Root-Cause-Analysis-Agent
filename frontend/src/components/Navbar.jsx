import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  HelpCircle, 
  LogOut,
  Layers,
  ChevronDown,
  CheckCircle2,
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
      <header className="sticky top-0 z-40 w-full border-b border-[#dfe1e6] bg-white h-14">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          
          {/* Left: Jira Logo & Menus */}
          <div className="flex items-center gap-6">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              {/* Jira Blue Diamond Icon */}
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0052cc] fill-current">
                  <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.34 4.35V2h-10.47zm-4.7 4.78c0 2.4 1.97 4.35 4.35 4.35h1.78v1.75c0 2.4 1.97 4.35 4.35 4.35V6.78H6.83zm-4.7 4.79c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35v-10.44H2.13z"/>
                </svg>
              </div>
              <span className="font-bold text-base tracking-tight text-[#172b4d]">
                Jira <span className="font-normal text-[#5e6c84]">Software</span>
              </span>
            </Link>

            {/* Jira Top Menu Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 text-sm text-[#172b4d]">
                <Link
                  to="/dashboard"
                  className="px-2.5 py-1.5 rounded hover:bg-[#ebecf0] font-medium flex items-center gap-1"
                >
                  Dashboards <ChevronDown className="w-3.5 h-3.5 text-[#5e6c84]" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-2.5 py-1.5 rounded hover:bg-[#ebecf0] font-medium flex items-center gap-1"
                >
                  Projects <ChevronDown className="w-3.5 h-3.5 text-[#5e6c84]" />
                </Link>
                <Link
                  to="/history"
                  className="px-2.5 py-1.5 rounded hover:bg-[#ebecf0] font-medium flex items-center gap-1"
                >
                  Issues <ChevronDown className="w-3.5 h-3.5 text-[#5e6c84]" />
                </Link>

                {/* Jira Classic Blue "Create" Button */}
                <Link
                  to="/new-analysis"
                  className="ml-2 px-3 py-1 rounded bg-[#0052cc] hover:bg-[#0065ff] text-white font-medium text-xs shadow-sm transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create
                </Link>
              </nav>
            )}
          </div>

          {/* Right: Search, Settings & Profile */}
          <div className="flex items-center gap-3">
            {/* Jira Search Input */}
            {user && (
              <div className="relative hidden sm:block w-48 lg:w-64">
                <Search className="w-3.5 h-3.5 text-[#6b778c] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search issues, logs..."
                  className="w-full pl-8 pr-3 py-1 text-xs rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] placeholder-[#6b778c] focus:outline-none focus:border-[#4c9aff] focus:bg-white"
                />
              </div>
            )}

            {/* Status / Sprint Pill */}
            <button
              onClick={() => setShowStatusModal(true)}
              className="text-xs text-[#0052cc] hover:underline font-medium hidden sm:inline"
            >
              Sprint 3 (~76%)
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#dfe1e6]">
                <Link
                  to="/settings"
                  className="p-1.5 rounded hover:bg-[#ebecf0] text-[#5e6c84] hover:text-[#172b4d]"
                  title="Settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </Link>

                {/* User Avatar Circle */}
                <div
                  className="w-7 h-7 rounded-full bg-[#0052cc] text-white font-bold text-xs flex items-center justify-center cursor-pointer select-none"
                  title={`${user.name} (${user.email})`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded hover:bg-[#ffebe6] text-[#6b778c] hover:text-[#de350b]"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <Link
                  to="/login"
                  className="px-3 py-1 text-[#0052cc] font-medium hover:underline"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded bg-[#0052cc] hover:bg-[#0065ff] text-white font-medium shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Jira Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md rounded-lg border border-[#dfe1e6] bg-white shadow-xl p-5 space-y-4 text-xs text-[#172b4d]">
            <div className="flex items-center justify-between border-b border-[#dfe1e6] pb-2">
              <h3 className="font-bold text-sm text-[#172b4d]">
                RCA Sprint Development Roadmap
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-[#6b778c] hover:text-[#172b4d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress:</span>
                <span className="text-[#0052cc]">76% Completed</span>
              </div>
              <div className="w-full bg-[#ebecf0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0052cc] h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#42526e]">
              <div className="p-2 rounded bg-[#f4f5f7] flex items-center justify-between">
                <span>Sprint 1: User Auth &amp; Incident Records</span>
                <span className="text-[#006644] font-medium">Done</span>
              </div>
              <div className="p-2 rounded bg-[#f4f5f7] flex items-center justify-between">
                <span>Sprint 2: Multi-format Log Parser (.pdf, .log, .csv)</span>
                <span className="text-[#006644] font-medium">Done</span>
              </div>
              <div className="p-2 rounded bg-[#f4f5f7] flex items-center justify-between">
                <span>Sprint 3: Five Whys Deduction &amp; PDF Export</span>
                <span className="text-[#006644] font-medium">Done</span>
              </div>
              <div className="p-2 rounded bg-[#f4f5f7] flex items-center justify-between text-[#6b778c]">
                <span>Sprint 4: Multi-Node Telemetry</span>
                <span className="text-[#ff8b00] font-medium">In Progress</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-3 py-1 rounded bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d] font-medium"
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
