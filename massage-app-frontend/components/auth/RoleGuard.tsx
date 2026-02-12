"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { RoleName } from "@/lib/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleName[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * RoleGuard component
 * Protects routes based on user roles
 * 
 * @example
 * <RoleGuard allowedRoles={[RoleName.ADMIN]}>
 *   <AdminDashboard />
 * </RoleGuard>
 */
export function RoleGuard({ 
  children, 
  allowedRoles, 
  redirectTo = "/auth/login",
  fallback = null 
}: RoleGuardProps) {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
      } else if (!hasRole(allowedRoles)) {
        // Redirect to appropriate dashboard based on current role
        if (user.role?.name === RoleName.ADMIN) {
          router.push("/admin/dashboard");
        } else if (user.role?.name === RoleName.MASSEUR || user.role?.name === RoleName.MASSEUSE) {
          router.push("/therapist/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [user, isLoading, hasRole, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return <div>{fallback || "جاری بارگذاری..."}</div>;
  }

  if (!user || !hasRole(allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}

/**
 * AdminOnly component
 * Shorthand for admin-only routes
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={[RoleName.ADMIN]}>{children}</RoleGuard>;
}

/**
 * TherapistOnly component
 * Shorthand for therapist-only routes (masseur or masseuse)
 */
export function TherapistOnly({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={[RoleName.MASSEUR, RoleName.MASSEUSE]}>{children}</RoleGuard>;
}

/**
 * ClientOnly component
 * Shorthand for client-only routes
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={[RoleName.CLIENT]}>{children}</RoleGuard>;
}
