import React from 'react';

/**
 * AnimatedBar — progress/coverage bar that animates its width from 0 to `pct`
 * on mount (and whenever `pct` changes). Pure CSS transition, no dependencies.
 * @param {number} pct - target width 0-100
 * @param {string} color - hex/color for the fill
 * @param {string} className - extra classes for the track
 * @param {string} height - tailwind height class for the track (default h-2)
 */
export function AnimatedBar({ pct = 0, color = '#A100FF', className = '', height = 'h-2' }) {
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className={`w-full bg-surface-600 rounded-full ${height} overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}
