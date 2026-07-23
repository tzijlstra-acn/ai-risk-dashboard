import React from 'react';
import { useAuditLog } from '../../hooks/useAuditLog';
import { AuditEventRow } from './AuditEventRow';
import { Card } from '../../components/ui/Card';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { Shield, Clock, AlertTriangle } from 'lucide-react';

// Templates for the live "system scan" simulation
const SCAN_EVENTS = [
  'Automated model scan completed',
  'CASB shadow-AI sweep finished',
  'Drift monitoring check completed',
  'DORA register reconciliation run',
  'Access certification scan completed',
  'Hallucination test battery executed',
];
const SCAN_MODELS = [
  'Credit Scoring Engine',
  'Real-Time Fraud Detection',
  'AML Transaction Screening',
  'Customer Service Chatbot',
  'PD/LGD Model v4',
  'Liquidity Risk Model',
];

function makeScanEvent() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return {
    id: `live-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: pick(SCAN_EVENTS),
    model: pick(SCAN_MODELS),
    actor: 'System',
    role: 'Automated Scanner',
    type: 'validation',
    status: 'auto-flagged',
    details: 'Continuous control monitoring — automated system scan. No manual sign-off required.',
    _isNew: true,
  };
}

export function AuditTrailPanel() {
  const { data, isLoading } = useAuditLog();
  const [liveEvents, setLiveEvents] = React.useState([]);

  // Live simulation — prepend a system-scan event every 45s
  React.useEffect(() => {
    const interval = setInterval(() => {
      const evt = makeScanEvent();
      setLiveEvents((prev) => [evt, ...prev].slice(0, 8));
      // clear the "new" flash flag after 2s
      setTimeout(() => {
        setLiveEvents((prev) => prev.map((e) => (e.id === evt.id ? { ...e, _isNew: false } : e)));
      }, 2100);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const combined = React.useMemo(() => [...liveEvents, ...(data ?? [])], [liveEvents, data]);

  const pendingCount = combined.filter((e) => e.status === 'pending').length;
  const auditFindingCount = combined.filter((e) => e.status === 'pending' && e.pendingHours > 48).length;
  const autoFlaggedCount = combined.filter((e) => e.status === 'auto-flagged').length;

  // Sort: pending first, then by timestamp descending (live events already newest)
  const sortedData = React.useMemo(() => {
    return [...combined].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }, [combined]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-800 border border-surface-600 rounded-xl p-4 animate-fade-slide-up stagger-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-severity-medium" />
            <span className="text-white/40 text-xs font-mono">Pending Approvals</span>
          </div>
          <div className="text-2xl font-display font-bold text-severity-medium">{isLoading ? '—' : pendingCount}</div>
        </div>
        <div className={`rounded-xl p-4 animate-fade-slide-up stagger-2 ${auditFindingCount > 0 ? 'bg-severity-stale/10 border border-severity-stale/30' : 'bg-surface-800 border border-surface-600'}`}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className={`w-3.5 h-3.5 ${auditFindingCount > 0 ? 'text-severity-stale' : 'text-severity-grey'}`} />
            <span className="text-white/40 text-xs font-mono">Audit Findings (&gt;48h)</span>
          </div>
          <div className={`text-2xl font-display font-bold ${auditFindingCount > 0 ? 'text-severity-stale' : 'text-severity-healthy'}`}>
            {isLoading ? '—' : auditFindingCount}
          </div>
        </div>
        <div className="bg-surface-800 border border-surface-600 rounded-xl p-4 animate-fade-slide-up stagger-3">
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
        subtitle="Immutable log — all AI model changes, approvals, and incidents · live scanning"
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
          <div className="-mx-5 -mb-5 rounded-b-xl overflow-hidden relative">
            {/* Vertical timeline spine */}
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-surface-600" />
            {sortedData.map((event, i) => (
              <AuditEventRow
                key={event.id}
                event={event}
                isNew={event._isNew}
                stagger={`stagger-${Math.min(i + 1, 8)}`}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
