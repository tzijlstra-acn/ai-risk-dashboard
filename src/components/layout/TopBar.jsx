import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';
import { FreshnessStamp } from '../ui/FreshnessStamp';

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

      {/* Right: search + freshness + bell */}
      <div className="flex items-center gap-4">
        {dataFreshness && (
          <FreshnessStamp timestamp={dataFreshness} status="confirmed" compact />
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
