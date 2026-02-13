"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, RoleName, PermissionName, AuthContextType } from "@/modules/auth/types/auth";
import { API_CONFIG } from "@/modules/shared/config/constants";
import * as tokenManager from "@/modules/auth/utils/tokenManager";
import { ROUTES } from "@/modules/shared/navigation/routes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    tokenManager.clearAuth();
    setUser(null);
    router.push(ROUTES.LOGIN);
  }, [router]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = tokenManager.getToken();

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Show cached user immediately while verifying in background
        const cachedUser = tokenManager.getUser();
        if (cachedUser) {
          setUser(cachedUser);
          setIsLoading(false);
        }

        // Verify token against API
        try {
          const res = await fetch(`${API_CONFIG.BASE_URL}/v1/auth/me`, {
            headers: {
              Authorization: tokenManager.getAuthHeader()!,
              Accept: "application/json",
            },
          });

          if (!res.ok) throw new Error("Token invalid");

          const userData: User = await res.json();

          // Defensive: keep cached role if API didn't return it
          if (cachedUser?.role && !userData.role) {
            userData.role = cachedUser.role;
            userData.permissions = cachedUser.permissions;
          }

          setUser(userData);
          tokenManager.setUser(userData);
        } catch {
          // Token invalid / expired
          tokenManager.clearAuth();
          setUser(null);
        }
      } catch {
        tokenManager.clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ── role / permission helpers ──

  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!user?.role) return false;
    if (Array.isArray(role)) return role.includes(user.role.name);
    return user.role.name === role;
  };

  const hasPermission = (permission: PermissionName | PermissionName[]): boolean => {
    if (!user?.permissions) return false;
    if (Array.isArray(permission)) return permission.some(p => user.permissions?.includes(p));
    return user.permissions.includes(permission);
  };

  const isAdmin = (): boolean => hasRole(RoleName.ADMIN);
  const isMassageTherapist = (): boolean => hasRole(RoleName.THERAPIST);
  const isClient = (): boolean => hasRole(RoleName.CLIENT);

  // ── login ──

  const login = (token: string, userData: User, tokenType = "Bearer") => {
    tokenManager.clearAuth();
    tokenManager.setToken(token, tokenType);
    tokenManager.setUser(userData);
    setUser(userData);
  };

  // ── update user ──

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userData };
    tokenManager.setUser(updated);
    setUser(updated);
  };

  // ── context value ──

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    hasPermission,
    isAdmin,
    isMassageTherapist,
    isClient,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
