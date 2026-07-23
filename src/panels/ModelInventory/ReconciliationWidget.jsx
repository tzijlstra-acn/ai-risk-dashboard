import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

// Mock MRM System-of-Record data
// TODO: Replace mock comparison with live MRM API call here
const MRM_SOR_EXTRAS = [
  { id: 'sor-ext-001', name: 'Counterparty Credit Risk Model (CCR)', department: 'Derivatives', mrm_tier: 'High' },
  { id: 'sor-ext-002', name: 'Retail PD Scorecard v2', department: 'Retail Credit Risk', mrm_tier: 'Medium' },
];

const DASHBOARD_EXTRAS = [
  { id: 'inv-011', name: 'GPU Compute Cluster (GenAI R&D)', note: 'Not yet registered in MRM SoR' },
];

export function ReconciliationWidget({ totalInDashboard = 0 }) {
  const [open, setOpen] = useState(true);

  const totalInSoR = totalInDashboard + MRM_SOR_EXTRAS.length;
  const discrepancyCount = MRM_SOR_EXTRAS.length + DASHBOARD_EXTRAS.length;

  return (
    <Card
      className="mb-4"
      title="MRM System-of-Record Reconciliation"
      subtitle="Compares this dashboard against the MRM system of record"
      actions={
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-white/40 hover:text-white transition-colors p-1"
        >
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      }
    >
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-surface-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-display font-bold text-white">{totalInDashboard}</div>
          <div className="text-xs text-white/40 mt-0.5">In Dashboard</div>
        </div>
        <div className="bg-surface-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-display font-bold text-white">{totalInSoR}</div>
          <div className="text-xs text-white/40 mt-0.5">In MRM SoR</div>
        </div>
        <div className={`rounded-lg p-3 text-center ${discrepancyCount > 0 ? 'bg-severity-stale/10 border border-severity-stale/30' : 'bg-severity-healthy/10'}`}>
          <div className={`text-2xl font-display font-bold ${discrepancyCount > 0 ? 'text-severity-stale' : 'text-severity-healthy'}`}>
            {discrepancyCount}
          </div>
          <div className="text-xs text-white/40 mt-0.5">Discrepancies</div>
        </div>
      </div>

      {open && (
        <div className="space-y-3">
          {/* In SoR but not in dashboard */}
          {MRM_SOR_EXTRAS.length > 0 && (
            <div>
              <p className="text-xs font-mono text-severity-stale uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                In MRM SoR but missing from dashboard ({MRM_SOR_EXTRAS.length})
              </p>
              {MRM_SOR_EXTRAS.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-3 py-2 bg-severity-stale/10 border border-severity-stale/20 rounded-lg mb-1">
                  <div>
                    <span className="text-white text-sm font-medium">{item.name}</span>
                    <span className="text-white/40 text-xs ml-2">— {item.department}</span>
                  </div>
                  <Badge severity="High" label={`SR 11-7 ${item.mrm_tier}`} size="sm" />
                </div>
              ))}
            </div>
          )}

          {/* In dashboard but not in SoR */}
          {DASHBOARD_EXTRAS.length > 0 && (
            <div>
              <p className="text-xs font-mono text-severity-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <XCircle className="w-3 h-3" />
                In dashboard but not in MRM SoR ({DASHBOARD_EXTRAS.length})
              </p>
              {DASHBOARD_EXTRAS.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-3 py-2 bg-severity-medium/10 border border-severity-medium/20 rounded-lg">
                  <span className="text-white text-sm font-medium">{item.name}</span>
                  <span className="text-white/40 text-xs">{item.note}</span>
                </div>
              ))}
            </div>
          )}

          {discrepancyCount === 0 && (
            <div className="flex items-center gap-2 text-severity-healthy text-sm px-3 py-2 bg-severity-healthy/10 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              Dashboard is fully reconciled with MRM SoR
            </div>
          )}

          <p className="text-xs text-white/20 font-mono mt-2">
            {/* TODO: Replace mock comparison with live MRM API call here */}
            Mock data — replace with live MRM API comparison
          </p>
        </div>
      )}
    </Card>
  );
}
