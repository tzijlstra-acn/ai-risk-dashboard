import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Role definitions with permission sets.
 * CRO: full access
 * MRM_VALIDATOR: read-only governance, no approve/reject
 * SOC_ANALYST: shadow AI, vendor, regulatory only
 */
const ROLE_PERMISSIONS = {
  CRO: {
    canViewInventory: true,
    canViewValidation: true,
    canViewAudit: true,
    canViewGovernance: true,
    canViewShadowAI: true,
    canViewRegulatory: true,
    canViewVendors: true,
    canApproveChanges: true,
    canWriteGovernance: true,
  },
  MRM_VALIDATOR: {
    canViewInventory: true,
    canViewValidation: true,
    canViewAudit: true,
    canViewGovernance: true,
    canViewShadowAI: false,
    canViewRegulatory: true,
    canViewVendors: true,
    canApproveChanges: false,
    canWriteGovernance: false,
  },
  SOC_ANALYST: {
    canViewInventory: false,
    canViewValidation: false,
    canViewAudit: false,
    canViewGovernance: false,
    canViewShadowAI: true,
    canViewRegulatory: true,
    canViewVendors: true,
    canApproveChanges: false,
    canWriteGovernance: false,
  },
};

const ROLE_LABELS = {
  CRO: 'Chief Risk Officer',
  MRM_VALIDATOR: 'MRM Validator',
  SOC_ANALYST: 'SOC Analyst',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('ai_dashboard_role') || 'CRO';
  });

  useEffect(() => {
    localStorage.setItem('ai_dashboard_role', role);
  }, [role]);

  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.CRO;

  const value = {
    role,
    roleLabel: ROLE_LABELS[role] || role,
    setRole,
    permissions,
    hasPermission: (perm) => !!permissions[perm],
    availableRoles: Object.keys(ROLE_PERMISSIONS),
    ROLE_LABELS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
