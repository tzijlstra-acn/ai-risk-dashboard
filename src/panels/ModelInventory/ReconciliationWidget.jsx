import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

// Mock MRM System-of-Record comparison data
// TODO: Replace mock comparison with live MRM API call here
const MRM_SOR_EXTRAS = [
  {
    id: 'sor-ext-001',
    name: 'Counterparty Credit Risk Model (CCR)',
    department: 'Derivatives',
    mrm_tier: 'High',
    reason: 'Registered in MRM SoR but not yet ingested into the dashboard inventory feed.',
  },
  {
    id: 'sor-ext-002',
    name: 'Retail PD Scorecard v2',
    department: 'Retail Credit Risk',
    mrm_tier: 'Medium',
    reason: 'Superseded by PD/LGD Model v4 in dashboard; still open in MRM SoR pending decommission sign-off.',
  },
];

const DASHBOARD_EXTRAS = [
  {
    id: 'inv-024',
    name: 'IT Anomaly Detection',
    department: 'Technology',
    mrm_tier: 'Low',
    reason: 'Discovered via infrastructure scan; MRM SoR registration not yet raised (GPU-hosted, Low tier).',
  },
];

export function ReconciliationWidget({ totalInDashboard = 0 }) {
  const [open, setOpen] = useState(true);

  const totalInSoR = totalInDashboard + MRM_SOR_EXTRAS.length - DASHBOARD_EXTRAS.length;
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
        <>
          {discrepancyCount > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-surface-600">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-600 bg-surface-700">
                    <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">In Dashboard</th>
                    <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">In MRM SoR</th>
                    <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MRM_SOR_EXTRAS.map((item) => (
                    <tr key={item.id} className="border-b border-surface-600/50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-white/30 text-xs"><XCircle className="w-3.5 h-3.5" /> Missing</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-severity-healthy flex-shrink-0" />
                          <span className="text-white text-sm font-medium">{item.name}</span>
                          <Badge severity={item.mrm_tier === 'High' ? 'Critical' : item.mrm_tier === 'Medium' ? 'Medium' : 'Low'} label={`SR 11-7 ${item.mrm_tier}`} size="sm" />
                        </div>
                        <p className="text-white/40 text-[11px] mt-1">{item.department} — {item.reason}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge severity="Stale" label="Not in dashboard" size="sm" />
                      </td>
                    </tr>
                  ))}
                  {DASHBOARD_EXTRAS.map((item) => (
                    <tr key={item.id} className="border-b border-surface-600/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-severity-healthy flex-shrink-0" />
                          <span className="text-white text-sm font-medium">{item.name}</span>
                          <Badge severity={item.mrm_tier === 'High' ? 'Critical' : item.mrm_tier === 'Medium' ? 'Medium' : 'Low'} label={`SR 11-7 ${item.mrm_tier}`} size="sm" />
                        </div>
                        <p className="text-white/40 text-[11px] mt-1">{item.department} — {item.reason}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-white/30 text-xs"><XCircle className="w-3.5 h-3.5" /> Missing</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge severity="Medium" label="Not in MRM SoR" size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-severity-healthy text-sm px-3 py-2 bg-severity-healthy/10 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              Dashboard is fully reconciled with MRM SoR
            </div>
          )}

          <p className="text-xs text-white/20 font-mono mt-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" />
            {/* TODO: Replace mock comparison with live MRM API call here */}
            Mock data — replace with live MRM API comparison
          </p>
        </>
      )}
    </Card>
  );
}
