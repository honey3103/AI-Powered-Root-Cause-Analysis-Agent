import React from 'react';

export const SeverityBadge = ({ severity }) => {
  const styles = {
    Critical: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    High: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  };

  const currentStyle = styles[severity] || styles.Medium;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current animate-pulse"></span>
      {severity} Severity
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    'In Progress': 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Resolved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  };

  const currentStyle = styles[status] || styles.Open;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}>
      {status}
    </span>
  );
};
