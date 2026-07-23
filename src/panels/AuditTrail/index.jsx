import React from 'react';
import { useAuditLog } from '../../hooks/useAuditLog';
import { AuditEventRow } from './AuditEventRow';
import { Card } from '../../components/ui/Card';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { Shield, Clock, AlertTriangle } from 'lucide-react';

export function AuditTrailPanel() {
  const { data, isLoading } = useAuditLog();

  const pendingCount = data?.filter((e) => e.status === 'pending').length ?? 0;
  const auditFindingCount = data?.filter((e) => e.status === 'pending' && e.pendingHours > 48).length ?? 0;
  const autoFlaggedCount = data?.filter((e) => e.status === 'auto-flagged').length ?? 0;

  // Sort: pending first, then by timestamp descending
  const sortedData = React.useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-800 border border-surface-600 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-severity-medium" />
            <span className="text-white/40 text-xs font-mono">Pending Approvals</span>
          </div>
          <div className="text-2xl font-display font-bold text-severity-medium">{isLoading ? '—' : pendingCount}</div>
        </div>
        <div className={`rounded-xl p-4 ${auditFindingCount > 0 ? 'bg-severity-stale/10 border border-severity-stale/30' : 'bg-surface-800 border border-surface-600'}`}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className={`w-3.5 h-3.5 ${auditFindingCount > 0 ? 'text-severity-stale' : 'text-severity-grey'}`} />
            <span className="text-white/40 text-xs font-mono">Audit Findings (&gt;48h)</span>
          </div>
          <div className={`text-2xl font-display font-bold ${auditFindingCount > 0 ? 'text-severity-stale' : 'text-severity-healthy'}`}>
            {isLoading ? '—' : auditFindingCount}
          </div>
        </div>
        <div className="bg-surface-800 border border-surface-600 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-severity-high" />
            <span className="text-white/40 text-xs font-mono">Auto-Flagged</span>
          </div>
          <div className="text-2xl font-display font-bold text-severity-high">{isLoading ? '—' : autoFlaggedCount}</div>
        </div>
      </div>

      {/* Log */}
      <Card
        title="Audit Trail"
        subtitle="Immutable log — all AI model changes, approvals, and incidents"
        actions={
          data?.[0] && (
            <FreshnessStamp timestamp={new Date().toISOString()} status="confirmed" compact />
          )
        }
      >
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-700 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="-mx-5 -mb-5 rounded-b-xl overflow-hidden">
            {(sortedData ?? []).map((event) => (
              <AuditEventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
