/**
 * Project: AI-Powered Root Cause Analysis Agent
 * Developer: Harsh (CSE)
 * File: DashboardPage.jsx
 * Description: Fetches and displays incident counts and category/severity charts using Recharts.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Layers, 
  PlusCircle, 
  ArrowRight,
  BarChart2,
  PieChart as PieIcon,
  Search,
  BookOpen
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
  // state for holding metrics received from /api/analysis/dashboard/stats
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // load dashboard statistics when component mounts
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // calling express backend api
      const response = await api.get('/analysis/dashboard/stats');
      // console.log("Fetched stats successfully:", response.data);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  // color map for severity pie chart
  const SEVERITY_COLORS = {
    Critical: '#e11d48',
    High: '#ea580c',
    Medium: '#d97706',
    Low: '#059669',
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Loading incident metrics from MongoDB...</span>
        </div>
      </div>
    );
  }

  // format data for recharts bar chart
  const categoryData = (stats?.categoryCounts || []).map((item) => ({
    name: item._id || 'Other',
    count: item.count,
  }));

  // format data for recharts pie chart
  const severityData = (stats?.severityCounts || []).map((item) => ({
    name: item._id || 'Medium',
    value: item.count,
    color: SEVERITY_COLORS[item._id] || '#0284c7',
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Student Milestone Header */}
      <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-mono">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="font-bold">Mini Project Progress: 76% (Module 1-4 Complete)</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-600 dark:text-slate-300 text-[11px] hidden sm:inline">
            Incident logging, 5 Whys deduction, and log parsing are functional.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-amber-700 dark:text-amber-400 font-bold">Harsh (CSE)</span>
        </div>
      </div>

      {/* Page Title & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Incident Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of logged technical issues, active investigations, and severity breakdown.
          </p>
        </div>
        <div>
          <Link
            to="/new-analysis"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Log New Incident
          </Link>
        </div>
      </div>

      {/* 4 Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">Total Logged</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">
            {stats?.totalAnalyses || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Total investigations</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-amber-600 dark:text-amber-400 block font-semibold">Open Issues</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">
            {stats?.openIncidents || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Pending resolution</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-rose-600 dark:text-rose-400 block font-semibold">High / Critical</span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">
            {stats?.highSeverityIncidents || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">High severity incidents</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 block font-semibold">Resolved</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {stats?.resolvedIncidents || 0}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Closed with solutions</span>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Frequency Bar Chart */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-sky-500" />
              Incidents by Problem Category
            </span>
            <span className="text-[10px] font-mono text-slate-400">Frequency Count</span>
          </div>

          {categoryData.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    interval={0} 
                    angle={-20} 
                    textAnchor="end" 
                  />
                  <YAxis stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b', 
                      borderRadius: '0.5rem', 
                      fontSize: '11px',
                      color: '#fff' 
                    }} 
                  />
                  <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400 text-xs font-mono">
              No incident data yet. Log your first incident to see chart.
            </div>
          )}
        </div>

        {/* Severity Pie Chart */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-purple-500" />
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b', 
                      borderRadius: '0.5rem', 
                      fontSize: '11px',
                      color: '#fff' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono mt-1">
                {severityData.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                    <span className="text-slate-500 dark:text-slate-400">{s.name} ({s.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400 text-xs font-mono">
              No severity records.
            </div>
          )}
        </div>
      </div>

      {/* Recent Incident Table */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Incident Log
            </h3>
          </div>
          <Link
            to="/history"
            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {stats.recentAnalyses.map((item) => (
              <div
                key={item._id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/analysis/${item._id}`}
                      className="font-semibold text-slate-900 dark:text-slate-100 hover:text-sky-500"
                    >
                      {item.title}
                    </Link>
                    <SeverityBadge severity={item.severity} />
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <Link
                    to={`/analysis/${item._id}`}
                    className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400 font-mono">
            No incident records found. Click &quot;Log New Incident&quot; to begin.
          </div>
        )}
      </div>
    </div>
  );
};
