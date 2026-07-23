import React from 'react';
import { AuditTrailPanel } from '../panels/AuditTrail';
import { RoleGuard } from '../auth/RoleGuard';
import { FEATURE_FLAGS } from '../featureFlags';
import { useAuditLog, useApproveChange, useRejectChange } from '../hooks/useAuditLog';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

function SummaryChip({ value, label, color = 'text-white', dot }) {
  return (
    <div className="flex items-center gap-1.5">
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      <span className={`font-display font-bold text-lg ${color}`}>{value}</span>
      <span className="text-white/40 text-xs">{label}</span>
    </div>
  );
}

function PendingQueueRow({ event }) {
  const approveChange = useApproveChange();
  const rejectChange = useRejectChange();
  const isFinding = event.pendingHours > 48;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${isFinding ? 'bg-severity-stale/5 border-severity-stale/30' : 'bg-surface-700 border-surface-600'}`}>
      <Clock className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFinding ? 'text-severity-stale' : 'text-severity-medium'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-white text-sm font-medium truncate">{event.event}</p>
          <span className={`text-xs font-mono font-bold flex-shrink-0 ${isFinding ? 'text-severity-stale' : 'text-severity-medium'}`}>{event.pendingHours}h</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-brand-pink-light text-xs">{event.model}</span>
          <span className="text-white/20">·</span>
          <span className="text-white/40 text-xs">{event.actor} ({event.role})</span>
          {isFinding && <Badge severity="Stale" label="Audit Finding >48h" size="sm" />}
        </div>
        {event.details && <p className="text-white/40 text-xs mt-1.5 leading-relaxed">{event.details}</p>}
      </div>
      <RoleGuard permission="canApproveChanges">
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => approveChange.mutate(event.id)}
            disabled={approveChange.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-severity-healthy/10 border border-severity-healthy/30 text-severity-healthy hover:bg-severity-healthy/20 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => rejectChange.mutate(event.id)}
            disabled={rejectChange.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-severity-critical/10 border border-severity-critical/30 text-severity-critical hover:bg-severity-critical/20 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      </RoleGuard>
    </div>
  );
}

export function Manage() {
  const { data } = useAuditLog();
  const totalEvents = data?.length ?? 0;
  const pendingCount = data?.filter((e) => e.status === 'pending').length ?? 0;
  const findingCount = data?.filter((e) => e.status === 'pending' && e.pendingHours > 48).length ?? 0;
  const rejectedCount = data?.filter((e) => e.status === 'rejected').length ?? 0;

  const pendingQueue = React.useMemo(() =>
    (data ?? [])
      .filter((e) => e.status === 'pending')
      .sort((a, b) => (b.pendingHours ?? 0) - (a.pendingHours ?? 0)),
  [data]);

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex items-center flex-wrap gap-x-6 gap-y-2 bg-surface-800 border border-surface-600 rounded-xl px-5 py-3">
        <SummaryChip value={totalEvents} label="events" />
        <span className="text-white/15">·</span>
        <SummaryChip value={pendingCount} label="pending approval" color="text-severity-medium" dot="bg-severity-medium" />
        <span className="text-white/15">·</span>
        <SummaryChip value={findingCount} label="amber findings (>48h)" color={findingCount > 0 ? 'text-severity-stale' : 'text-severity-healthy'} dot={findingCount > 0 ? 'bg-severity-stale' : 'bg-severity-healthy'} />
        <span className="text-white/15">·</span>
        <SummaryChip value={rejectedCount} label="rejected" color={rejectedCount > 0 ? 'text-severity-critical' : 'text-white'} dot={rejectedCount > 0 ? 'bg-severity-critical' : undefined} />
      </div>

      {/* Pending approvals priority queue */}
      {pendingQueue.length > 0 && (
        <RoleGuard permission="canViewAudit">
          <Card
            title="Pending Approvals — Priority Queue"
            subtitle="Sorted by time waiting. Items over 48h are Audit Findings per SR 11-7."
            actions={<Badge severity={findingCount > 0 ? 'Stale' : 'Medium'} label={`${pendingQueue.length} awaiting sign-off`} size="sm" />}
          >
            <div className="space-y-2">
              {pendingQueue.map((e) => (
                <PendingQueueRow key={e.id} event={e} />
              ))}
            </div>
          </Card>
        </RoleGuard>
      )}

      {/* Audit Trail */}
      <RoleGuard permission="canViewAudit">
        <AuditTrailPanel />
      </RoleGuard>

      {/* Level 4/5 SIEM integration stub */}
      {!FEATURE_FLAGS.siemLiveFeed && (
        <div className="opacity-40 pointer-events-none border border-dashed border-white/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white/30 text-xs font-mono">L4</span>
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">SIEM Live Integration — Level 4 Feature</p>
              <p className="text-white/30 text-xs mt-1 leading-relaxed">
                {/* TODO: Level 4 — integrate SIEM/CSPM live feeds here */}
                Real-time security event feed from Splunk / Microsoft Sentinel. Automated incident creation
                and escalation based on AI-specific threat signatures. Connect via settings.siemEndpoint.
              </p>
            </div>
          </div>
        </div>
      )}

      {!FEATURE_FLAGS.continuousBiasMonitoring && (
        <div className="opacity-40 pointer-events-none border border-dashed border-white/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white/30 text-xs font-mono">L4</span>
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">Continuous Bias Monitoring — Level 4 Feature</p>
              <p className="text-white/30 text-xs mt-1 leading-relaxed">
                {/* TODO: Level 4 — continuous bias monitoring pipeline */}
                Automated ECOA/Reg B disparate impact monitoring for credit models. Threshold-based alerts
                when Protected Attribute Group disparity exceeds 80% rule threshold.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
