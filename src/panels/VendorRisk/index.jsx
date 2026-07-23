import React, { useState } from 'react';
import { useVendors } from '../../hooks/useVendors';
import { VendorCard } from './VendorCard';
import { VendorDetailDrawer } from './VendorDetailDrawer';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { AlertTriangle, Building2, Link } from 'lucide-react';

export function VendorRiskPanel() {
  const { data, isLoading } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCardClick = (vendor) => {
    setSelectedVendor(vendor);
    setDrawerOpen(true);
  };

  const nonCompliantCount = data?.filter((v) => v.doraStatus === 'Non-Compliant').length ?? 0;
  const singleDepCount = data?.filter((v) => v.singleProviderDependency).length ?? 0;
  const aupIssueCount = data?.filter((v) => !v.acceptableUsePolicyCompliant).length ?? 0;
  const dataFreshness = data?.[0]?.dataFreshness;

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Vendors', value: data?.length ?? 0, icon: Building2, color: 'text-white' },
          { label: 'DORA Non-Compliant', value: nonCompliantCount, icon: AlertTriangle, color: nonCompliantCount > 0 ? 'text-severity-critical' : 'text-severity-healthy' },
          { label: 'Single-Dep Flags', value: singleDepCount, icon: Link, color: singleDepCount > 0 ? 'text-severity-high' : 'text-severity-healthy' },
          { label: 'AUP Issues', value: aupIssueCount, icon: AlertTriangle, color: aupIssueCount > 0 ? 'text-severity-high' : 'text-severity-healthy' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface-800 border border-surface-600 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-white/40 text-xs font-mono">{label}</span>
            </div>
            <div className={`text-2xl font-display font-bold ${color}`}>{isLoading ? '—' : value}</div>
          </div>
        ))}
      </div>

      {/* Data freshness */}
      {dataFreshness && (
        <div className="flex justify-end">
          <FreshnessStamp timestamp={dataFreshness} status="confirmed" />
        </div>
      )}

      {/* Vendor grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-40 bg-surface-800 rounded-xl border border-surface-600" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data ?? []).map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onClick={handleCardClick} />
          ))}
        </div>
      )}

      <VendorDetailDrawer
        vendor={selectedVendor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
