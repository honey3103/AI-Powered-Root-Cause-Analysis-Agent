import React from 'react';

export const SeverityBadge = ({ severity }) => {
  const styles = {
    Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    Medium: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const dotColors = {
    Critical: 'bg-rose-500',
    High: 'bg-amber-500',
    Medium: 'bg-sky-500',
    Low: 'bg-emerald-500',
  };

  const currentStyle = styles[severity] || styles.Medium;
  const dotColor = dotColors[severity] || 'bg-sky-500';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${currentStyle}`}>
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotColor} animate-pulse`}></span>
      {severity?.toUpperCase()}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'In Progress': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const currentStyle = styles[status] || styles.Open;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${currentStyle}`}>
      {status}
    </span>
  );
};
