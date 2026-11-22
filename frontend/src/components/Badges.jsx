import React from 'react';

// Jira Style Priority Badges with Atlassian Colors
export const SeverityBadge = ({ severity }) => {
  const styles = {
    Critical: 'bg-[#ffebe6] text-[#de350b] border-[#ffbdad]',
    High: 'bg-[#fffae6] text-[#ff8b00] border-[#ffe380]',
    Medium: 'bg-[#deebff] text-[#0747a6] border-[#b3d4ff]',
    Low: 'bg-[#e3fcef] text-[#006644] border-[#abf5d1]',
  };

  const icons = {
    Critical: '▲ Highest',
    High: '▲ High',
    Medium: '= Medium',
    Low: '▼ Low',
  };

  const currentStyle = styles[severity] || styles.Medium;
  const label = icons[severity] || severity;

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border ${currentStyle}`}>
      {label}
    </span>
  );
};

// Jira Style Status Lozenges (e.g. TO DO, IN PROGRESS, RESOLVED)
export const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-[#dfe1e6] text-[#42526e]',
    'In Progress': 'bg-[#deebff] text-[#0747a6]',
    Resolved: 'bg-[#e3fcef] text-[#006644]',
  };

  const currentStyle = styles[status] || styles.Open;

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentStyle}`}>
      {status === 'Open' ? 'TO DO' : status === 'Resolved' ? 'RESOLVED' : status}
    </span>
  );
};
