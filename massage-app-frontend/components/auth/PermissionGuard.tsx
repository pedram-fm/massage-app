"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { PermissionName } from "@/lib/types/auth";

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: PermissionName | PermissionName[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission is enough
}

/**
 * PermissionGuard component
 * Shows/hides content based on user permissions
 * 
 * @example
 * <PermissionGuard permissions={PermissionName.MANAGE_USERS}>
 *   <UserManagementPanel />
 * </PermissionGuard>
 */
export function PermissionGuard({ 
  children, 
  permissions, 
  fallback = null,
  requireAll = false 
}: PermissionGuardProps) {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  
  const hasAccess = requireAll
    ? permissionArray.every(p => hasPermission(p))
    : permissionArray.some(p => hasPermission(p));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
