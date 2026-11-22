import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  ArrowRight,
  BarChart2,
  PieChart as PieIcon,
  Search,
  Activity,
  Layers,
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
    Critical: '#de350b',
    High: '#ff8b00',
    Medium: '#0052cc',
    Low: '#36b37e',
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#dfe1e6] border-t-[#0052cc] rounded-full animate-spin"></div>
          <span className="text-xs text-[#5e6c84]">Loading Jira dashboard gadgets...</span>
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
    color: SEVERITY_COLORS[item._id] || '#0052cc',
  }));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 text-[#172b4d]">
      
      {/* Top Jira Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfe1e6] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#172b4d] tracking-tight">
            System Dashboard
          </h1>
          <p className="text-xs text-[#5e6c84] mt-0.5">
            Key metrics, open incident counts, and root cause diagnostic analytics.
          </p>
        </div>
        <div>
          <Link
            to="/new-analysis"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#0052cc] hover:bg-[#0065ff] text-white font-medium text-xs shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Incident
          </Link>
        </div>
      </div>

      {/* 4 Jira Gadget Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs">
          <span className="text-[11px] uppercase text-[#5e6c84] block font-bold">Total Issues</span>
          <div className="text-2xl font-bold text-[#172b4d] mt-1">
            {stats?.totalAnalyses || 0}
          </div>
          <span className="text-[11px] text-[#5e6c84] mt-0.5 block">Recorded in project</span>
        </div>

        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs">
          <span className="text-[11px] uppercase text-[#ff8b00] block font-bold">Open / In Progress</span>
          <div className="text-2xl font-bold text-[#ff8b00] mt-1">
            {stats?.openIncidents || 0}
          </div>
          <span className="text-[11px] text-[#5e6c84] mt-0.5 block">Awaiting resolution</span>
        </div>

        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs">
          <span className="text-[11px] uppercase text-[#de350b] block font-bold">Critical Outages</span>
          <div className="text-2xl font-bold text-[#de350b] mt-1">
            {stats?.criticalIncidents || 0}
          </div>
          <span className="text-[11px] text-[#5e6c84] mt-0.5 block">Highest priority</span>
        </div>

        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs">
          <span className="text-[11px] uppercase text-[#006644] block font-bold">Resolved Cases</span>
          <div className="text-2xl font-bold text-[#006644] mt-1">
            {stats?.resolvedIncidents || 0}
          </div>
          <span className="text-[11px] text-[#5e6c84] mt-0.5 block">Post-mortem closed</span>
        </div>
      </div>

      {/* 2 Analytics Gadget Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gadget 1: Category Distribution */}
        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#ebecf0] pb-2">
            <h3 className="text-xs font-bold text-[#172b4d] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#0052cc]" />
              Incident Distribution by Category
            </h3>
            <span className="text-[11px] text-[#5e6c84]">Issues count</span>
          </div>

          {categoryData.length > 0 ? (
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#5e6c84" 
                    fontSize={11} 
                    tickLine={false}
                    angle={-20}
                    textAnchor="end"
                    interval={0} 
                  />
                  <YAxis stroke="#5e6c84" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dfe1e6', color: '#172b4d', fontSize: '12px' }}
                    cursor={{ fill: '#f4f5f7' }}
                  />
                  <Bar dataKey="count" fill="#0052cc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-[#5e6c84] text-xs">
              No category data available yet.
            </div>
          )}
        </div>

        {/* Gadget 2: Severity Breakdown */}
        <div className="p-4 rounded-lg border border-[#dfe1e6] bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#ebecf0] pb-2">
            <h3 className="text-xs font-bold text-[#172b4d] uppercase tracking-wider flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-[#0052cc]" />
              Severity Breakdown
            </h3>
            <span className="text-[11px] text-[#5e6c84]">Priority share</span>
          </div>

          {severityData.length > 0 ? (
            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dfe1e6', color: '#172b4d', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-[#5e6c84] text-xs">
              No severity records.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
