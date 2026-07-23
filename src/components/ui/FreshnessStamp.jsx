import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTimestamp, hoursSince } from '../../utils/date';

/**
 * FreshnessStamp — shows data-as-of timestamp with color-coded freshness dot.
 *
 * Status logic:
 *   - confirmed: green dot if < 1hr, amber if 1-24hr, red if >24hr
 *   - zero-confirmed: grey dot + tooltip
 *   - scan-failed / any other: ALWAYS amber (never green)
 *
 * @param {string} timestamp - ISO timestamp
 * @param {'confirmed'|'zero-confirmed'|'scan-failed'} status
 * @param {boolean} compact - show minimal version
 */
export function FreshnessStamp({ timestamp, status = 'confirmed', compact = false }) {
  const hours = hoursSince(timestamp);

  let dotColor;
  let statusLabel;
  let icon = null;

  if (status === 'zero-confirmed') {
    dotColor = 'bg-severity-grey';
    statusLabel = 'Zero confirmed (valid result)';
  } else if (status === 'scan-failed' || (status !== 'confirmed' && status !== 'zero-confirmed')) {
    // NEVER show green for scan-failed or incomplete
    dotColor = 'bg-severity-stale';
    statusLabel = 'Scan incomplete — data may be stale';
    icon = <AlertTriangle className="w-3 h-3 text-severity-stale" />;
  } else {
    // confirmed
    if (hours < 1) {
      dotColor = 'bg-severity-healthy';
      statusLabel = 'Live';
    } else if (hours < 24) {
      dotColor = 'bg-severity-stale';
      statusLabel = 'Updated today';
    } else {
      dotColor = 'bg-severity-critical';
      statusLabel = 'Stale (>24h)';
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-white/30" title={`Data as of ${timestamp} — ${statusLabel}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
        <span className="font-mono">{formatTimestamp(timestamp)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
        {icon}
        <span className="font-mono">Data as of {formatTimestamp(timestamp)}</span>
      </div>
      <span className="text-white/20">·</span>
      <span
        className={
          status === 'zero-confirmed'
            ? 'text-severity-grey'
            : status === 'scan-failed'
            ? 'text-severity-stale'
            : hours < 1
            ? 'text-severity-healthy'
            : hours < 24
            ? 'text-severity-stale'
            : 'text-severity-critical'
        }
      >
        {statusLabel}
      </span>
    </div>
  );
}
