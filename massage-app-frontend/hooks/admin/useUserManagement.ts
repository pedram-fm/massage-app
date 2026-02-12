import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  userManagementService,
  type User,
  type Role,
  type UserStats,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/lib/services/userManagementService";

/**
 * Custom Hook for User Management
 * Following Single Responsibility Principle and separating concerns
 */
export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  /**
   * Fetch users with current filters
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userManagementService.getUsers({
        page: currentPage,
        per_page: 15,
        search: search || undefined,
        role: roleFilter || undefined,
      });

      setUsers(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات کاربران");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, roleFilter]);

  /**
   * Fetch statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const data = await userManagementService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  /**
   * Fetch available roles
   */
  const fetchRoles = useCallback(async () => {
    try {
      const data = await userManagementService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  }, []);

  /**
   * Create new user
   */
  const createUser = async (data: CreateUserDto): Promise<boolean> => {
    try {
      await userManagementService.createUser(data);
      toast.success("کاربر با موفقیت ایجاد شد");
      await fetchUsers();
      await fetchStats();
      return true;
    } catch (error: any) {
      toast.error(error.message || "خطا در ایجاد کاربر");
      return false;
    }
  };

  /**
   * Update existing user
   */
  const updateUser = async (id: number, data: UpdateUserDto): Promise<boolean> => {
    try {
      await userManagementService.updateUser(id, data);
      toast.success("کاربر با موفقیت به‌روزرسانی شد");
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast.error(error.message || "خطا در به‌روزرسانی کاربر");
      return false;
    }
  };

  /**
   * Delete user
   */
  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      await userManagementService.deleteUser(id);
      toast.success("کاربر با موفقیت حذف شد");
      await fetchUsers();
      await fetchStats();
      return true;
    } catch (error: any) {
      toast.error(error.message || "خطا در حذف کاربر");
      return false;
    }
  };

  /**
   * Change user role
   */
  const changeRole = async (userId: number, roleId: number): Promise<boolean> => {
    try {
      await userManagementService.changeUserRole(userId, roleId);
      toast.success("نقش کاربر با موفقیت تغییر یافت");
      await fetchUsers();
      await fetchStats();
      return true;
    } catch (error: any) {
      toast.error(error.message || "خطا در تغییر نقش");
      return false;
    }
  };

  /**
   * Reset search and filters
   */
  const resetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
    fetchRoles();
  }, [fetchStats, fetchRoles]);

  return {
    // State
    users,
    stats,
    roles,
    loading,
    currentPage,
    totalPages,
    search,
    roleFilter,

    // Actions
    createUser,
    updateUser,
    deleteUser,
    changeRole,
    fetchUsers,
    resetFilters,

    // Setters
    setSearch,
    setRoleFilter,
    setCurrentPage,
  };
}
