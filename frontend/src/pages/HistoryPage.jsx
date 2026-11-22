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
  FileText,
  Terminal
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
    if (!window.confirm('Delete this incident investigation?')) return;
    try {
      await api.delete(`/analysis/${id}`);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 font-mono text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            coroot / investigation-history
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">
            Search, filter, and inspect past root cause analysis investigations.
          </p>
        </div>
        <Link
          to="/new-analysis"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-[0_0_12px_rgba(16,185,129,0.2)]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          New Incident
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, error code, or stack trace keywords..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-800 bg-[#07070a] text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-bold hover:bg-zinc-700 transition"
          >
            Filter
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80">
          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-zinc-800 bg-[#07070a] text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-zinc-800 bg-[#07070a] text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              {SEVERITIES.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-zinc-800 bg-[#07070a] text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Investigations Table */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-emerald-400 rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs">Loading investigation records...</span>
        </div>
      ) : analyses.length > 0 ? (
        <div className="space-y-2.5">
          {analyses.map((item) => (
            <div
              key={item._id}
              className="p-4 rounded-xl border border-zinc-800 bg-[#0c0c11] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {item.category}
                  </span>
                  <SeverityBadge severity={item.severity} />
                  <StatusBadge status={item.status} />
                  <span className="text-[10px] text-zinc-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <Link
                  to={`/analysis/${item._id}`}
                  className="text-sm font-bold text-white hover:text-emerald-400 transition block"
                >
                  {item.title}
                </Link>

                <p className="text-xs text-zinc-400 line-clamp-1 max-w-3xl font-sans">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  to={`/analysis/${item._id}/report`}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  title="View Report"
                >
                  <Printer className="w-4 h-4" />
                </Link>

                <Link
                  to={`/analysis/${item._id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-950/60 transition"
                >
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-zinc-800 text-zinc-500 text-xs">
          <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
          <span>No incident records found.</span>
        </div>
      )}
    </div>
  );
};
