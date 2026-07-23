import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { StatusDot } from '../../components/ui/StatusDot';
import { formatDate } from '../../utils/date';

export function ShadowAITable({ data = [], onCriticalClick }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-600">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-600 bg-surface-700">
            {['Name', 'Severity', 'Department', 'Detected', 'Data Classifications', 'Customer Data', 'Status'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            const isCritical = item.touchesCustomerData || item.touchesCreditLending;
            const effectiveSeverity = isCritical ? 'Critical' : item.severity;

            return (
              <tr
                key={item.id}
                onClick={() => isCritical && onCriticalClick(item)}
                className={[
                  'border-b border-surface-600/50 transition-colors animate-fade-slide-up',
                  `stagger-${Math.min(i + 1, 8)}`,
                  isCritical
                    ? 'bg-severity-critical/5 hover:bg-severity-critical/10 cursor-pointer border-l-2 border-l-severity-critical'
                    : i % 2 === 0
                    ? 'bg-surface-800 hover:bg-surface-700/50'
                    : 'bg-surface-800/60 hover:bg-surface-700/50',
                ].join(' ')}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isCritical && <StatusDot severity="Critical" className="flex-shrink-0" />}
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <div className="text-white/30 text-xs mt-0.5">{item.owner}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {(effectiveSeverity === 'Critical' || effectiveSeverity === 'High') && (
                      <StatusDot severity={effectiveSeverity} className="flex-shrink-0" />
                    )}
                    <Badge severity={effectiveSeverity} label={effectiveSeverity} size="sm" />
                  </div>
                </td>
                <td className="px-4 py-3 text-white/70 text-xs">{item.department}</td>
                <td className="px-4 py-3 text-white/60 text-xs font-mono">{formatDate(item.detectedDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.dataClassificationsTouched.slice(0, 2).map((cls) => (
                      <Badge
                        key={cls}
                        severity={cls === 'Customer Credit' || cls === 'Restricted' ? 'Critical' : cls === 'PII' ? 'High' : 'Grey'}
                        label={cls}
                        size="sm"
                      />
                    ))}
                    {item.dataClassificationsTouched.length > 2 && (
                      <span className="text-white/30 text-xs">+{item.dataClassificationsTouched.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-xs font-medium ${item.touchesCustomerData ? 'text-severity-critical' : 'text-severity-grey'}`}>
                      {item.touchesCustomerData ? '⚠ Yes' : 'No'}
                    </span>
                    {item.touchesCreditLending && (
                      <span className="text-xs text-severity-critical">⚠ Credit/Lending</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    severity={item.status === 'Active' ? 'Critical' : item.status === 'Remediated' ? 'Healthy' : 'Stale'}
                    label={item.status}
                    size="sm"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
