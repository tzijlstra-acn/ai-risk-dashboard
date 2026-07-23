import React from 'react';

/**
 * Card — dark surface card component.
 * @param {string} title
 * @param {string} subtitle
 * @param {React.ReactNode} actions - slot for header-right actions
 * @param {React.ReactNode} children
 * @param {string} className
 * @param {boolean} loading - show shimmer skeleton instead of children
 */
export function Card({ title, subtitle, actions, children, className = '', loading = false }) {
  if (loading) {
    return (
      <div className="bg-surface-800 border border-surface-600 rounded-xl p-4 space-y-3 animate-fade-in">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-4 rounded-lg bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700"
            style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={[
        'bg-surface-800 border border-surface-600 rounded-xl p-5',
        'animate-fade-slide-up transition-colors duration-300 hover:border-surface-500',
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
