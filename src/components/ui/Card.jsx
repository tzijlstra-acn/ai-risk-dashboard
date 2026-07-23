import React from 'react';

/**
 * Card — dark surface card component.
 * @param {string} title
 * @param {string} subtitle
 * @param {React.ReactNode} actions - slot for header-right actions
 * @param {React.ReactNode} children
 * @param {string} className
 */
export function Card({ title, subtitle, actions, children, className = '' }) {
  return (
    <div
      className={[
        'bg-surface-800 border border-surface-600 rounded-xl p-5',
        className,
      ].join(' ')}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-white font-display font-semibold text-sm">{title}</h3>
            )}
            {subtitle && (
              <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
