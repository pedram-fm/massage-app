"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, RoleName, PermissionName, AuthContextType } from "@/lib/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const storedUser = localStorage.getItem("auth_user");
      const token = localStorage.getItem("auth_token");
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!user?.role) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role.name);
    }
    
    return user.role.name === role;
  };

  const hasPermission = (permission: PermissionName | PermissionName[]): boolean => {
    if (!user?.permissions) return false;
    
    if (Array.isArray(permission)) {
      return permission.some(p => user.permissions?.includes(p));
    }
    
    return user.permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    return hasRole(RoleName.ADMIN);
  };

  const isMassageTherapist = (): boolean => {
    return hasRole([RoleName.MASSEUR, RoleName.MASSEUSE]);
  };

  const isClient = (): boolean => {
    return hasRole(RoleName.CLIENT);
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token_type");
    setUser(null);
    router.push("/auth/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

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
