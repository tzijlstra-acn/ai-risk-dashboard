import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * FoundationModelBadge — monospace pill for foundation model names.
 * Purple tint. Shows warning icon if AUP non-compliant.
 * @param {string} model - Model name
 * @param {boolean} flagged - Show AUP warning if true
 */
export function FoundationModelBadge({ model, flagged = false }) {
  if (!model) return null;

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-mono font-medium',
        flagged
          ? 'bg-severity-critical/10 text-severity-critical border border-severity-critical/30'
          : 'bg-brand-purple/10 text-brand-pink-light border border-brand-purple/30',
      ].join(' ')}
    >
      {flagged && <AlertTriangle className="w-3 h-3 flex-shrink-0" />}
      {model}
    </span>
  );
}
