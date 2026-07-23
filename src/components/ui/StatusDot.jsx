import React from 'react';

/**
 * StatusDot — pulsing status indicator using Tailwind's animate-ping ripple.
 * Non-healthy severities emit a ripple; healthy is a static dot.
 * @param {'Critical'|'High'|'Medium'|'Low'|'Healthy'} severity
 * @param {string} className
 */
export function StatusDot({ severity = 'Healthy', className = '' }) {
  const colors = {
    Critical: { dot: 'bg-severity-critical', pulse: 'bg-severity-critical/40' },
    High:     { dot: 'bg-severity-high',     pulse: 'bg-severity-high/40' },
    Medium:   { dot: 'bg-severity-medium',   pulse: 'bg-severity-medium/40' },
    Low:      { dot: 'bg-severity-low',      pulse: 'bg-severity-low/40' },
    Stale:    { dot: 'bg-severity-stale',    pulse: 'bg-severity-stale/40' },
    Healthy:  { dot: 'bg-severity-healthy',  pulse: null },
  };
  const c = colors[severity] || colors.Healthy;
  return (
    <span className={`relative flex h-3 w-3 ${className}`}>
      {c.pulse && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.pulse} opacity-75`} />
      )}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${c.dot}`} />
    </span>
  );
}
