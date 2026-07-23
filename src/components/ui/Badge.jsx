import React from 'react';
import { SEVERITY_CLASSES } from '../../theme';

/**
 * Badge — severity pill with colored dot.
 * @param {string} severity - 'Critical'|'High'|'Medium'|'Low'|'Healthy'|'Stale'|'Grey'
 * @param {string} label - display text
 * @param {'sm'|'md'} size
 */
export function Badge({ severity = 'Grey', label, size = 'md', className = '' }) {
  const classes = SEVERITY_CLASSES[severity] || SEVERITY_CLASSES.Grey;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium font-body',
        classes.bg,
        classes.text,
        sizeClasses,
        className,
      ].join(' ')}
    >
      <span className={['w-1.5 h-1.5 rounded-full flex-shrink-0', classes.text.replace('text-', 'bg-')].join(' ')} />
      {label ?? severity}
    </span>
  );
}
