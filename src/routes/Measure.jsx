import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { useShadowAI } from '../hooks/useShadowAI';
import { useValidation } from '../hooks/useValidation';
import { useVendors } from '../hooks/useVendors';
import { ValidationCoveragePanel } from '../panels/ValidationCoverage';
import { RegulatoryExposurePanel } from '../panels/RegulatoryExposure';
import { VendorRiskPanel } from '../panels/VendorRisk';
import { RoleGuard } from '../auth/RoleGuard';
import { Database, AlertTriangle, Clock, Building2 } from 'lucide-react';

function KPICard({ label, value, subvalue, icon: Icon, color, loading }) {
  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider">{label}</p>
          <p className={`text-3xl font-display font-bold mt-1 ${color}`}>
            {loading ? '—' : value}
          </p>
          {subvalue && (
            <p className="text-white/30 text-xs mt-1">{subvalue}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export function Measure() {
  const { data: inventory, isLoading: invLoading } = useInventory();
  const { data: shadowAI, isLoading: shadowLoading } = useShadowAI();
  const { data: validation, isLoading: valLoading } = useValidation();
  const { data: vendors, isLoading: venLoading } = useVendors();

  const totalAssets = inventory?.length ?? 0;
  const criticalShadow = shadowAI?.filter((i) => i.touchesCustomerData || i.touchesCreditLending).length ?? 0;
  const overdueValidations = validation?.overall?.overdue ?? 0;
  const vendorAlerts = vendors?.filter((v) => v.doraStatus === 'Non-Compliant' || !v.acceptableUsePolicyCompliant || v.singleProviderDependency).length ?? 0;

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total AI Assets"
          value={totalAssets}
          subvalue={`${inventory?.filter((a) => a.mrm_tier === 'High').length ?? 0} High-tier SR 11-7`}
          icon={Database}
          color="text-white"
          loading={invLoading}
        />
        <KPICard
          label="Critical Shadow AI"
          value={criticalShadow}
          subvalue="Touching customer/credit data"
          icon={AlertTriangle}
          color={criticalShadow > 0 ? 'text-severity-critical' : 'text-severity-healthy'}
          loading={shadowLoading}
        />
        <KPICard
          label="Overdue Validations"
          value={overdueValidations}
          subvalue="Past validation due date"
          icon={Clock}
          color={overdueValidations > 0 ? 'text-severity-critical' : 'text-severity-healthy'}
          loading={valLoading}
        />
        <KPICard
          label="Vendor Risk Alerts"
          value={vendorAlerts}
          subvalue="DORA / AUP / concentration flags"
          icon={Building2}
          color={vendorAlerts > 0 ? 'text-severity-high' : 'text-severity-healthy'}
          loading={venLoading}
        />
      </div>

      {/* Validation Coverage — full width */}
      <RoleGuard permission="canViewValidation">
        <ValidationCoveragePanel />
      </RoleGuard>

      {/* Heat-map + Vendor — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleGuard permission="canViewRegulatory">
          <RegulatoryExposurePanel />
        </RoleGuard>

        <RoleGuard permission="canViewVendors">
          <div className="space-y-4">
            <h2 className="text-white font-display font-semibold text-sm">Vendor Risk Summary</h2>
            <VendorRiskPanel />
          </div>
        </RoleGuard>
      </div>
    </div>
  );
}
