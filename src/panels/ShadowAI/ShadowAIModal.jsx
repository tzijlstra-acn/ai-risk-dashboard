import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { FoundationModelBadge } from '../../components/ui/FoundationModelBadge';
import { formatDate, formatTimestamp } from '../../utils/date';

// Mock traffic logs
function getMockTrafficLogs(id) {
  const base = new Date('2025-03-14T10:00:00Z');
  return Array.from({ length: 6 }, (_, i) => ({
    timestamp: new Date(base - i * 3600000 * 4).toISOString(),
    endpoint: id === 'shd-001' ? 'https://api.openai.com/v1/chat/completions' : 'https://api.external-llm.com/v1/complete',
    volume: Math.floor(Math.random() * 300 + 50) + ' requests',
    dataSize: Math.floor(Math.random() * 800 + 100) + ' KB',
  }));
}

export function ShadowAIModal({ incident, open, onClose }) {
  if (!incident) return null;

  const trafficLogs = getMockTrafficLogs(incident.id);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Shadow AI Detail — ${incident.name}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Status + severity header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge severity={incident.severity} label={incident.severity} />
          <Badge
            severity={
              incident.status === 'Active' ? 'Critical' :
              incident.status === 'Remediated' ? 'Healthy' : 'Stale'
            }
            label={incident.status}
          />
          <FoundationModelBadge model={incident.foundationModel} />
          <span className="text-white/40 text-xs">Detected: {formatDate(incident.detectedDate)}</span>
        </div>

        {/* Data classifications */}
        <div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Data Classifications Touched</p>
          <div className="flex flex-wrap gap-2">
            {incident.dataClassificationsTouched.map((cls) => (
              <Badge
                key={cls}
                severity={
                  cls === 'Customer Credit' || cls === 'Restricted' ? 'Critical' :
                  cls === 'PII' ? 'High' :
                  cls === 'Confidential' ? 'Medium' : 'Grey'
                }
                label={cls}
                size="sm"
              />
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            {incident.touchesCustomerData && (
              <span className="text-severity-critical font-medium">⚠ Touches customer data</span>
            )}
            {incident.touchesCreditLending && (
              <span className="text-severity-critical font-medium">⚠ Touches credit/lending decisions</span>
            )}
          </div>
        </div>

        {/* Traffic logs */}
        <div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
            Traffic Logs (mock) — {incident.trafficVolume}
          </p>
          <div className="overflow-x-auto rounded-lg border border-surface-600">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-700">
                  <th className="px-3 py-2 text-left text-white/40">Timestamp</th>
                  <th className="px-3 py-2 text-left text-white/40">Endpoint</th>
                  <th className="px-3 py-2 text-left text-white/40">Volume</th>
                  <th className="px-3 py-2 text-left text-white/40">Data Size</th>
                </tr>
              </thead>
              <tbody>
                {trafficLogs.map((log, i) => (
                  <tr key={i} className="border-b border-surface-600/50 hover:bg-surface-700/50">
                    <td className="px-3 py-2 text-white/60">{formatTimestamp(log.timestamp)}</td>
                    <td className="px-3 py-2 text-brand-pink-light truncate max-w-xs">{log.endpoint}</td>
                    <td className="px-3 py-2 text-white/70">{log.volume}</td>
                    <td className="px-3 py-2 text-white/70">{log.dataSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remediation steps */}
        <div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Remediation Steps</p>
          <ol className="space-y-2">
            {incident.remediationSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-purple/20 text-brand-pink-light text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-white/80 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Assign button (stubbed) */}
        <div className="flex justify-end gap-3 pt-2 border-t border-surface-600">
          <button
            className="px-4 py-2 rounded-lg bg-surface-700 border border-surface-500 text-white/60 text-sm hover:text-white hover:border-white/30 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-brand-purple/20 border border-brand-purple text-brand-pink-light text-sm hover:bg-brand-purple/30 transition-colors"
            onClick={() => alert('TODO: Assign remediation owner — connect to ServiceNow/Jira')}
          >
            Assign Remediation
          </button>
        </div>
      </div>
    </Modal>
  );
}
