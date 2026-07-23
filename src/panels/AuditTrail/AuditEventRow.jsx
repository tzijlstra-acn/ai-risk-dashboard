import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { RoleGuard } from '../../auth/RoleGuard';
import { useApproveChange, useRejectChange } from '../../hooks/useAuditLog';
import { formatTimestamp } from '../../utils/date';

function typeSeverity(type) {
  switch (type) {
    case 'incident': return 'Critical';
    case 'approval': return 'Healthy';
    case 'validation': return 'Low';
    case 'change': return 'Medium';
    default: return 'Grey';
  }
}

function statusSeverity(status) {
  switch (status) {
    case 'approved': return 'Healthy';
    case 'rejected': return 'Critical';
    case 'pending': return 'Medium';
    case 'auto-flagged': return 'High';
    default: return 'Grey';
  }
}

// Timeline dot colour per event type
const DOT_COLOR = {
  incident: 'bg-severity-critical',
  approval: 'bg-severity-healthy',
  validation: 'bg-severity-low',
  change: 'bg-severity-medium',
};

export function AuditEventRow({ event, isNew = false, stagger = '' }) {
  const approveChange = useApproveChange();
  const rejectChange = useRejectChange();

  const isAuditFinding = event.status === 'pending' && event.pendingHours > 48;
  const isPending = event.status === 'pending';
  const dotColor = DOT_COLOR[event.type] || 'bg-severity-grey';
  const pulsingDot = isAuditFinding || isPending;

  return (
    <div
      className={[
        'group relative pl-11 pr-4 py-4 border-b border-surface-600/50 transition-colors animate-fade-slide-up',
        stagger,
        isNew ? 'animate-flash-highlight' : isAuditFinding ? 'bg-severity-stale/5' : 'hover:bg-surface-700/30',
      ].join(' ')}
    >
      {/* Timeline dot */}
      <span className="absolute left-5 top-5 -translate-x-1/2 flex h-3 w-3">
        {pulsingDot && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAuditFinding ? 'bg-severity-stale/50' : 'bg-severity-medium/50'}`} />
        )}
        <span className={`relative inline-flex rounded-full h-3 w-3 ring-2 ring-surface-800 ${isAuditFinding ? 'bg-severity-stale' : dotColor}`} />
      </span>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium leading-tight">{event.event}</p>
          <p className="text-brand-pink-light text-xs mt-0.5">{event.model}</p>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-white/40 text-xs font-mono">{formatTimestamp(event.timestamp)}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">{event.actor} ({event.role})</span>
            <Badge severity={typeSeverity(event.type)} label={event.type} size="sm" />
            <Badge severity={statusSeverity(event.status)} label={event.status} size="sm" />
            {isAuditFinding && (
              <Badge severity="Stale" label={`Audit Finding — >${event.pendingHours}h Unsigned`} size="sm" />
            )}
          </div>

          {event.details && (
            <p className="text-white/40 text-xs mt-2 leading-relaxed">{event.details}</p>
          )}
        </div>

        {/* CRO-only inline actions — animate in on hover */}
        {isPending && (
          <RoleGuard permission="canApproveChanges">
            <div className="flex items-center gap-2 flex-shrink-0 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              <button
                onClick={() => approveChange.mutate(event.id)}
                disabled={approveChange.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-severity-healthy/10 border border-severity-healthy/30 text-severity-healthy hover:bg-severity-healthy/20 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => rejectChange.mutate(event.id)}
                disabled={rejectChange.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-severity-critical/10 border border-severity-critical/30 text-severity-critical hover:bg-severity-critical/20 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          </RoleGuard>
        )}
      </div>
    </div>
  );
}
