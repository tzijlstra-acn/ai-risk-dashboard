import React from 'react';
import { AlertTriangle, Link } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { FoundationModelBadge } from '../../components/ui/FoundationModelBadge';

function doraSeverity(status) {
  switch (status) {
    case 'Registered': return 'Healthy';
    case 'Pending': return 'Medium';
    case 'Non-Compliant': return 'Critical';
    default: return 'Grey';
  }
}

export function VendorCard({ vendor, onClick }) {
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

      {/* Warning flags */}
      <div className="space-y-1">
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
