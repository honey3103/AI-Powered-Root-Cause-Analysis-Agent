import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  Search, 
  Trash2, 
  ArrowRight, 
  Printer, 
  Plus,
  Filter,
  FileText
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Website downtime',
  'API errors',
  'Database issues',
  'Server problems',
  'Deployment failures',
  'Performance issues',
  'Application crashes',
  'Other technical issues',
];

const SEVERITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved'];

export const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    fetchAnalyses();
  }, [category, severity, status]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (severity !== 'All') params.severity = severity;
      if (status !== 'All') params.status = status;

      const res = await api.get('/analysis', { params });
      setAnalyses(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAnalyses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this issue record?')) return;
    try {
      await api.delete(`/analysis/${id}`);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 text-[#172b4d]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#dfe1e6] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#172b4d] tracking-tight">
            Search &amp; Manage Issues
          </h1>
          <p className="text-xs text-[#5e6c84] mt-0.5">
            Filter, inspect 5-Whys root cause deductions, and export incident reports.
          </p>
        </div>
        <Link
          to="/new-analysis"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0052cc] hover:bg-[#0065ff] text-white text-xs font-medium shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Incident
        </Link>
      </div>

      {/* Jira Search & Filter Toolbar */}
      <div className="p-3.5 rounded-lg border border-[#dfe1e6] bg-white space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2 text-[#5e6c84]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by issue title, symptoms, or error messages..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] focus:outline-none focus:border-[#4c9aff] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d] text-xs font-medium"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-[#5e6c84]">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px]">Filters:</span>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2 py-1 rounded border border-[#dfe1e6] bg-white text-xs text-[#172b4d] focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="px-2 py-1 rounded border border-[#dfe1e6] bg-white text-xs text-[#172b4d] focus:outline-none"
          >
            {SEVERITIES.map((sev) => (
              <option key={sev} value={sev}>
                Priority: {sev}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2 py-1 rounded border border-[#dfe1e6] bg-white text-xs text-[#172b4d] focus:outline-none"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jira Issue List Table */}
      {loading ? (
        <div className="p-8 text-center bg-white rounded-lg border border-[#dfe1e6]">
          <div className="w-6 h-6 border-2 border-[#dfe1e6] border-t-[#0052cc] rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs text-[#5e6c84]">Loading issues...</span>
        </div>
      ) : analyses.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg border border-[#dfe1e6] text-xs text-[#5e6c84] space-y-2">
          <p>No matching incident investigations found.</p>
          <Link to="/new-analysis" className="text-[#0052cc] hover:underline font-medium">
            Create your first incident
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-[#dfe1e6] bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafbfc] border-b border-[#dfe1e6] text-[#5e6c84] font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Key</th>
                <th className="py-2.5 px-3">Summary</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebecf0]">
              {analyses.map((item) => {
                const issueKey = `RCA-${item._id.substring(item._id.length - 4).toUpperCase()}`;
                return (
                  <tr key={item._id} className="hover:bg-[#f4f5f7] transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="w-2 h-2 rounded-sm bg-[#de350b] inline-block" title="Bug / Incident"></span>
                    </td>
                    <td className="py-2.5 px-3">
                      <Link
                        to={`/analysis/${item._id}`}
                        className="font-medium text-[#0052cc] hover:underline"
                      >
                        {issueKey}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <Link
                        to={`/analysis/${item._id}`}
                        className="font-semibold text-[#172b4d] hover:text-[#0052cc]"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-[#5e6c84] truncate max-w-md">
                        {item.description}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-[#5e6c84]">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-3">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-2.5 px-3 text-[#5e6c84]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1">
                      <Link
                        to={`/analysis/${item._id}`}
                        className="p-1 rounded text-[#5e6c84] hover:text-[#0052cc] inline-block"
                        title="View details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 rounded text-[#6b778c] hover:text-[#de350b] inline-block"
                        title="Delete issue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
