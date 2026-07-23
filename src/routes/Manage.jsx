import React from 'react';
import { AuditTrailPanel } from '../panels/AuditTrail';
import { RoleGuard } from '../auth/RoleGuard';
import { FEATURE_FLAGS } from '../featureFlags';
import { useAuditLog } from '../hooks/useAuditLog';

export function Manage() {
  const { data } = useAuditLog();
  const pendingCount = data?.filter((e) => e.status === 'pending').length ?? 0;

  return (
    <div className="space-y-6">
      {/* Pending approvals summary */}
      {pendingCount > 0 && (
        <div className="bg-severity-medium/10 border border-severity-medium/30 rounded-xl px-5 py-4">
          <p className="text-severity-medium font-medium text-sm">
            {pendingCount} pending approval{pendingCount > 1 ? 's' : ''} require CRO sign-off
          </p>
          <p className="text-white/40 text-xs mt-1">
            Items pending over 48 hours are flagged as Audit Findings per SR 11-7 requirements.
          </p>
        </div>
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
