import React from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from './AuthContext';

/**
 * RoleGuard — renders children if the current role has the specified permission,
 * otherwise shows a restricted access message.
 *
 * @param {string} permission - Permission key to check (e.g. 'canApproveChanges')
 * @param {React.ReactNode} children - Content to render if allowed
 * @param {React.ReactNode} [fallback] - Optional custom fallback (defaults to restriction banner)
 */
export function RoleGuard({ permission, children, fallback }) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-700 border border-surface-600 text-severity-grey text-sm">
      <Lock className="w-4 h-4 flex-shrink-0" />
      <span>Access restricted for your role</span>
    </div>
  );
}
