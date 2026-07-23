import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, GitBranch, BarChart2, Settings, ChevronRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../../auth/AuthContext';

const NAV_ITEMS = [
  { label: 'Govern', path: '/govern', icon: Shield, description: 'Policies & Framework' },
  { label: 'Map', path: '/map', icon: GitBranch, description: 'Inventory & Shadow AI' },
  { label: 'Measure', path: '/measure', icon: BarChart2, description: 'Coverage & Exposure' },
  { label: 'Manage', path: '/manage', icon: Settings, description: 'Audit & Approvals' },
];

export function Sidebar() {
  const { role, setRole, availableRoles, ROLE_LABELS } = useAuth();
  const location = useLocation();

  return (
    <aside
      className="fixed top-0 left-0 h-full w-60 flex flex-col z-20 border-r border-surface-600"
      style={{
        background: 'linear-gradient(180deg, #160029 0%, #1a0035 60%, #0D0D18 100%)',
      }}
    >
      {/* Logo */}
      <div className="border-b border-white/10">
        <BrandLogo />
      </div>

      {/* NIST label */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-xs font-mono text-white/30 uppercase tracking-widest">
          NIST AI RMF
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ label, path, icon: Icon, description }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive: navActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                  navActive || isActive
                    ? 'bg-brand-purple/20 border-l-2 border-brand-purple text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent',
                ].join(' ')
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium font-display leading-none">{label}</span>
                <span className="text-xs text-white/30 group-hover:text-white/40 mt-0.5 leading-none truncate">
                  {description}
                </span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: role switcher + user info */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <div>
          <label className="block text-xs text-white/30 font-mono mb-1 uppercase tracking-wider">
            Active Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-surface-700 border border-surface-500 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-purple cursor-pointer"
          >
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-purple/30 border border-brand-purple/50 flex items-center justify-center">
            <span className="text-brand-pink text-xs font-bold">
              {role === 'CRO' ? 'CR' : role === 'MRM_VALIDATOR' ? 'MV' : 'SA'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white/70 text-xs font-medium truncate">
              {ROLE_LABELS[role]}
            </span>
            <span className="text-white/30 text-xs truncate">AI Risk Dashboard</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
