"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { RoleName, PermissionName } from "@/lib/types/auth";

interface ConditionalRenderProps {
  children: React.ReactNode;
}

/**
 * Hook for conditional rendering based on roles
 */
export function useRoleBasedRendering() {
  const { user, hasRole, hasPermission, isAdmin, isMassageTherapist, isClient } = useAuth();

  return {
    user,
    hasRole,
    hasPermission,
    isAdmin,
    isMassageTherapist,
    isClient,
    
    // Conditional render helpers
    IfAdmin: ({ children }: ConditionalRenderProps) => isAdmin() ? <>{children}</> : null,
    IfTherapist: ({ children }: ConditionalRenderProps) => isMassageTherapist() ? <>{children}</> : null,
    IfClient: ({ children }: ConditionalRenderProps) => isClient() ? <>{children}</> : null,
    IfNotClient: ({ children }: ConditionalRenderProps) => !isClient() ? <>{children}</> : null,
  };
}

/**
 * Utility functions for role checking in components
 */
export const roleUtils = {
  /**
   * Get display name for role
   */
  getRoleDisplayName(role?: RoleName): string {
    switch (role) {
      case RoleName.ADMIN:
        return "مدیر";
      case RoleName.MASSEUR:
        return "ماساژور (مرد)";
      case RoleName.MASSEUSE:
        return "ماساژور (زن)";
      case RoleName.CLIENT:
        return "مشتری";
      default:
        return "نامشخص";
    }
  },

  /**
   * Get dashboard route for role
   */
  getDashboardRoute(role?: RoleName): string {
    switch (role) {
      case RoleName.ADMIN:
        return "/admin/dashboard";
      case RoleName.MASSEUR:
      case RoleName.MASSEUSE:
        return "/therapist/dashboard";
      case RoleName.CLIENT:
        return "/dashboard";
      default:
        return "/";
    }
  },

  /**
   * Check if role is a therapist
   */
  isTherapistRole(role?: RoleName): boolean {
    return role === RoleName.MASSEUR || role === RoleName.MASSEUSE;
  },
};
