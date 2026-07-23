import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * GaugeTooltip — custom tooltip content for coverage gauges.
 */
function GaugeTooltip({ active, tooltip, heading }) {
  if (!active || !tooltip) return null;
  return (
    <div className="bg-surface-900 border border-surface-500 rounded-lg px-3 py-2 shadow-xl text-xs min-w-[160px]">
      <p className="text-white font-medium mb-1">{heading}</p>
      {tooltip.models != null && (
        <div className="flex justify-between gap-4 text-white/60">
          <span>Models</span><span className="text-white font-mono">{tooltip.models}</span>
        </div>
      )}
      {tooltip.tiers?.length > 0 && (
        <div className="mt-1 pt-1 border-t border-surface-600 space-y-0.5">
          {tooltip.tiers.map((t) => (
            <div key={t.tier} className="flex justify-between gap-4 text-white/60">
              <span>{t.tier} tier</span>
              <span className="text-white font-mono">{t.validated}/{t.total}{t.overdue ? ` · ${t.overdue} overdue` : ''}</span>
            </div>
          ))}
        </div>
      )}
      {tooltip.nextDue && (
        <div className="mt-1 pt-1 border-t border-surface-600 flex justify-between gap-4 text-white/60">
          <span>Next due</span><span className="text-brand-pink-light font-mono">{tooltip.nextDue}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Gauge — recharts RadialBarChart gauge.
 * @param {number} value - 0-100
 * @param {string} label - main label
 * @param {string} sublabel - secondary label
 * @param {string} color - hex color for the bar
 * @param {Function} onClick
 * @param {object} tooltip - optional { models, tiers:[{tier,validated,total,overdue}], nextDue }
 */
export function Gauge({ value = 0, label, sublabel, color = '#A100FF', onClick, tooltip }) {
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
            {tooltip && (
              <Tooltip
                cursor={false}
                wrapperStyle={{ outline: 'none', zIndex: 30 }}
                content={<GaugeTooltip tooltip={tooltip} heading={label} />}
              />
            )}
            {/* Background track */}
            <RadialBar
              background={{ fill: '#22223A' }}
              dataKey="value"
              cornerRadius={5}
              angleAxisId={0}
              isAnimationActive
              animationBegin={200}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
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
