import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

/**
 * Gauge — recharts RadialBarChart gauge.
 * @param {number} value - 0-100
 * @param {string} label - main label
 * @param {string} sublabel - secondary label
 * @param {string} color - hex color for the bar
 * @param {Function} onClick
 */
export function Gauge({ value = 0, label, sublabel, color = '#A100FF', onClick }) {
  const data = [{ value, fill: color }];

  return (
    <div
      className={[
        'flex flex-col items-center gap-2',
        onClick ? 'cursor-pointer group' : '',
      ].join(' ')}
      onClick={onClick}
    >
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="90%"
            startAngle={225}
            endAngle={-45}
            data={data}
            barSize={10}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            {/* Background track */}
            <RadialBar
              background={{ fill: '#22223A' }}
              dataKey="value"
              cornerRadius={5}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-white leading-none">
            {Math.round(value)}
          </span>
          <span className="text-xs text-white/40 font-mono leading-none mt-0.5">%</span>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <p className="text-white text-sm font-display font-medium group-hover:text-brand-pink-light transition-colors">
            {label}
          </p>
          {sublabel && (
            <p className="text-white/40 text-xs mt-0.5">{sublabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
