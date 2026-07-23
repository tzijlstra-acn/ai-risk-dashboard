import React from 'react';
import { AlertTriangle, Link, CalendarClock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { FoundationModelBadge } from '../../components/ui/FoundationModelBadge';
import { formatDate, daysUntil } from '../../utils/date';

function doraSeverity(status) {
  switch (status) {
    case 'Registered': return 'Healthy';
    case 'Pending': return 'Medium';
    case 'Non-Compliant': return 'Critical';
    default: return 'Grey';
  }
}

export function formatSpend(amount) {
  if (amount == null) return '—';
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${Math.round(amount / 1000)}k`;
  return `€${amount}`;
}

export function VendorCard({ vendor, onClick }) {
  const contractDays = daysUntil(vendor.contractEndDate);
  const contractSoon = !isNaN(contractDays) && contractDays >= 0 && contractDays < 90;
  const contractExpired = !isNaN(contractDays) && contractDays < 0;
  return (
    <div
      onClick={() => onClick(vendor)}
      className="bg-surface-800 border border-surface-600 rounded-xl p-4 cursor-pointer hover:border-brand-purple/50 hover:bg-surface-700/50 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-display font-semibold text-sm group-hover:text-brand-pink-light transition-colors">
            {vendor.name}
          </h3>
          <p className="text-white/40 text-xs mt-0.5">{vendor.category}</p>
        </div>
        <Badge severity={doraSeverity(vendor.doraStatus)} label={vendor.doraStatus} size="sm" />
      </div>

      {/* Risk score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-white/40 font-mono">Risk Score</span>
          <span className={`font-bold font-mono ${
            vendor.riskScore >= 70 ? 'text-severity-critical' :
            vendor.riskScore >= 50 ? 'text-severity-high' :
            vendor.riskScore >= 30 ? 'text-severity-medium' : 'text-severity-healthy'
          }`}>{vendor.riskScore}/100</span>
        </div>
        <div className="w-full bg-surface-600 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              vendor.riskScore >= 70 ? 'bg-severity-critical' :
              vendor.riskScore >= 50 ? 'bg-severity-high' :
              vendor.riskScore >= 30 ? 'bg-severity-medium' : 'bg-severity-healthy'
            }`}
            style={{ width: `${vendor.riskScore}%` }}
          />
        </div>
      </div>

      {/* Foundation models */}
      <div className="mb-3">
        <p className="text-xs text-white/30 font-mono mb-1.5">Foundation Models</p>
        <div className="flex flex-wrap gap-1">
          {vendor.foundationModelsSupplied.map((m) => (
            <FoundationModelBadge key={m} model={m} flagged={!vendor.acceptableUsePolicyCompliant} />
          ))}
        </div>
      </div>

      {/* Commercial + contract */}
      <div className="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-surface-600/50">
        <div>
          <p className="text-[10px] text-white/30 font-mono uppercase">Annual Spend</p>
          <p className="text-white text-sm font-display font-bold">{formatSpend(vendor.annualSpend)}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/30 font-mono uppercase">Contract Ends</p>
          <p className={`text-xs font-medium flex items-center gap-1 ${contractExpired ? 'text-severity-critical' : contractSoon ? 'text-severity-stale' : 'text-white/70'}`}>
            {(contractSoon || contractExpired) && <CalendarClock className="w-3 h-3" />}
            {formatDate(vendor.contractEndDate)}
          </p>
          {!isNaN(contractDays) && (
            <p className={`text-[10px] font-mono ${contractExpired ? 'text-severity-critical' : contractSoon ? 'text-severity-stale' : 'text-white/30'}`}>
              {contractExpired ? `${Math.abs(contractDays)}d overdue` : `${contractDays}d left`}
            </p>
          )}
        </div>
      </div>
      <p className="text-[10px] text-white/30 font-mono mb-2">Last assessed {formatDate(vendor.lastAssessmentDate)}</p>

      {/* Warning flags */}
      <div className="space-y-1">
        {contractSoon && (
          <div className="flex items-center gap-1.5 text-xs text-severity-stale">
            <CalendarClock className="w-3 h-3" />
            Contract renewal due within 90 days
          </div>
        )}
        {vendor.singleProviderDependency && (
          <div className="flex items-center gap-1.5 text-xs text-severity-high">
            <Link className="w-3 h-3" />
            Single-provider dependency
          </div>
        )}
        {!vendor.acceptableUsePolicyCompliant && (
          <div className="flex items-center gap-1.5 text-xs text-severity-critical">
            <AlertTriangle className="w-3 h-3" />
            Contains model(s) not covered by bank AUP
          </div>
        )}
      </div>
    </div>
  );
}
