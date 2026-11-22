import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Layers, 
  Plus, 
  ArrowRight,
  BarChart2,
  PieChart as PieIcon,
  Search,
  Activity,
  Terminal,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analysis/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const SEVERITY_COLORS = {
    Critical: '#f43f5e',
    High: '#f59e0b',
    Medium: '#0ea5e9',
    Low: '#10b981',
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] font-mono">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-emerald-400 rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-500">Connecting to Coroot telemetry stream...</span>
        </div>
      </div>
    );
  }

  const categoryData = (stats?.categoryCounts || []).map((item) => ({
    name: item._id || 'Other',
    count: item.count,
  }));

  const severityData = (stats?.severityCounts || []).map((item) => ({
    name: item._id || 'Medium',
    value: item.count,
    color: SEVERITY_COLORS[item._id] || '#10b981',
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-mono text-zinc-100">
      {/* Top Coroot Telemetry & Status Bar */}
      <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#0c0c11] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white">COROOT INCIDENT CONSOLE</span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">
            Telemetry: ACTIVE • Engine: Heuristic + LLM • Milestone: 76% Implemented
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-zinc-500">Investigator:</span>
          <span className="text-emerald-400 font-bold">Harsh (CSE)</span>
        </div>
      </div>

      {/* Main Header & New Incident Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            incidents / telemetry-overview
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Real-time status of service degradation, Five Whys diagnostic chains, and anomalous cluster traces.
          </p>
        </div>
        <div>
          <Link
            to="/new-analysis"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            New Investigation
          </Link>
        </div>
      </div>

      {/* 4 Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] shadow-sm">
          <span className="text-[10px] uppercase text-zinc-500 block font-bold">Total Investigated</span>
          <div className="text-2xl font-black text-white mt-1">
            {stats?.totalAnalyses || 0}
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">Recorded incidents</span>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-[#0c0c11] shadow-sm">
          <span className="text-[10px] uppercase text-amber-400 block font-bold">Active / Open</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {stats?.openIncidents || 0}
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">Under investigation</span>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-[#0c0c11] shadow-sm">
          <span className="text-[10px] uppercase text-rose-400 block font-bold">Critical Outages</span>
          <div className="text-2xl font-black text-rose-500 mt-1">
            {stats?.highSeverityIncidents || 0}
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">Outage level impact</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/20 bg-[#0c0c11] shadow-sm">
          <span className="text-[10px] uppercase text-emerald-400 block font-bold">Mitigated</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {stats?.resolvedIncidents || 0}
          </div>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">RCA closed</span>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Frequency Bar Chart */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-2">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              Incidents by Problem Category
            </span>
            <span className="text-[10px] text-zinc-500">Distribution</span>
          </div>

          {categoryData.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#52525b" 
                    fontSize={10} 
                    interval={0} 
                    angle={-20} 
                    textAnchor="end" 
                  />
                  <YAxis stroke="#52525b" fontSize={10} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0c0c11', 
                      borderColor: '#27272a', 
                      borderRadius: '0.5rem', 
                      fontSize: '11px',
                      color: '#f4f4f5',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-zinc-500 text-xs">
              No incident telemetry available. Log an incident to populate.
            </div>
          )}
        </div>

        {/* Severity Pie Chart */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-2">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
              Severity Breakdown
            </span>
          </div>

          {severityData.length > 0 ? (
            <div className="h-60 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0c0c11', 
                      borderColor: '#27272a', 
                      borderRadius: '0.5rem', 
                      fontSize: '11px',
                      color: '#f4f4f5',
                      fontFamily: 'monospace'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] mt-1">
                {severityData.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                    <span className="text-zinc-400">{s.name} ({s.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-zinc-500 text-xs">
              No severity records.
            </div>
          )}
        </div>
      </div>

      {/* Recent Incident Feed */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-2">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Recent Incident Feed
            </h3>
          </div>
          <Link
            to="/history"
            className="text-xs font-medium text-emerald-400 hover:underline flex items-center gap-1"
          >
            All Investigations <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
          <div className="divide-y divide-zinc-800/60 text-xs">
            {stats.recentAnalyses.map((item) => (
              <div
                key={item._id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-900/30 px-2 rounded-lg transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/analysis/${item._id}`}
                      className="font-bold text-white hover:text-emerald-400 transition"
                    >
                      {item.title}
                    </Link>
                    <SeverityBadge severity={item.severity} />
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-xl font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {item.category}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <Link
                    to={`/analysis/${item._id}`}
                    className="p-1 rounded text-zinc-400 hover:text-white"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500">
            No incident records found. Click &quot;New Investigation&quot; to begin.
          </div>
        )}
      </div>
    </div>
  );
};
