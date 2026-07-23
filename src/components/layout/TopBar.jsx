import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';
import { FreshnessStamp } from '../ui/FreshnessStamp';
import { useInventory } from '../../hooks/useInventory';
import { useVendors } from '../../hooks/useVendors';
import { useShadowAI } from '../../hooks/useShadowAI';
import { useValidation } from '../../hooks/useValidation';
import { useAuditLog } from '../../hooks/useAuditLog';

const ROUTE_TITLES = {
  '/govern': { title: 'Govern', subtitle: 'Policies & Framework', crumbs: ['NIST AI RMF', 'Govern'] },
  '/map': { title: 'Map', subtitle: 'Inventory & Shadow AI', crumbs: ['NIST AI RMF', 'Map'] },
  '/measure': { title: 'Measure', subtitle: 'Coverage & Exposure', crumbs: ['NIST AI RMF', 'Measure'] },
  '/manage': { title: 'Manage', subtitle: 'Audit & Approvals', crumbs: ['NIST AI RMF', 'Manage'] },
};

export function TopBar({ searchTerm, onSearchChange, dataFreshness }) {
  const location = useLocation();
  const routeInfo = ROUTE_TITLES[location.pathname] || {
    title: 'AI Risk Dashboard',
    subtitle: 'Accenture NFR Practice',
    crumbs: ['NIST AI RMF'],
  };

  // Pull cached data from all panels to derive system health + weakest-link freshness
  const inventory = useInventory();
  const vendors = useVendors();
  const shadowAI = useShadowAI();
  const validation = useValidation();
  const auditLog = useAuditLog();

  const queries = [inventory, vendors, shadowAI, validation, auditLog];
  const scanFailures = queries.filter((q) => q.isError).length;
  const stillLoading = queries.some((q) => q.isLoading);

  // Oldest (weakest-link) data timestamp across all panels
  const oldestFreshness = React.useMemo(() => {
    const stamps = [
      inventory.data?.[0]?.dataFreshness,
      vendors.data?.[0]?.dataFreshness,
      shadowAI.data?.[0]?.dataFreshness,
      validation.data?.dataFreshness,
    ].filter(Boolean);
    if (stamps.length === 0) return dataFreshness || null;
    return stamps.reduce((oldest, s) => (new Date(s) < new Date(oldest) ? s : oldest), stamps[0]);
  }, [inventory.data, vendors.data, shadowAI.data, validation.data, dataFreshness]);

  const systemOk = scanFailures === 0;

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-surface-600 bg-surface-800 flex-shrink-0">
      {/* Left: title + breadcrumb */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-xs text-white/30 font-mono">
          {routeInfo.crumbs.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              <span>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-white font-display font-semibold text-sm leading-tight">
          {routeInfo.title}
          <span className="ml-2 text-white/40 font-normal text-xs">— {routeInfo.subtitle}</span>
        </h1>
      </div>

      {/* Right: system status + freshness + search + bell */}
      <div className="flex items-center gap-4">
        {/* System status */}
        <div
          className={[
            'hidden md:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border',
            systemOk
              ? 'text-severity-healthy bg-severity-healthy/10 border-severity-healthy/20'
              : 'text-severity-stale bg-severity-stale/10 border-severity-stale/20',
          ].join(' ')}
          title={systemOk ? 'All data feeds healthy' : `${scanFailures} panel feed(s) failed to load`}
        >
          <span className={`w-2 h-2 rounded-full ${systemOk ? 'bg-severity-healthy' : 'bg-severity-stale'} ${stillLoading ? 'animate-pulse' : ''}`} />
          {systemOk ? 'All systems operational' : `${scanFailures} scan failure${scanFailures > 1 ? 's' : ''}`}
        </div>

        {oldestFreshness && (
          <div className="hidden lg:block" title="Oldest data timestamp across all panels (weakest link)">
            <FreshnessStamp timestamp={oldestFreshness} status={systemOk ? 'confirmed' : 'scan-failed'} compact />
          </div>
        )}
        <SearchBar value={searchTerm} onChange={onSearchChange} />
        <button className="relative text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-severity-critical border border-surface-800" />
        </button>
      </div>
    </header>
  );
}
