"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  UserCheck,
  UserX,
  RefreshCw
} from "lucide-react";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { UserFormModal } from "@/components/admin/UserFormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { User } from "@/lib/services/userManagementService";

export default function UsersManagementPage() {
  const {
    users,
    stats,
    roles,
    loading,
    currentPage,
    totalPages,
    search,
    roleFilter,
    createUser,
    updateUser,
    deleteUser,
    changeRole,
    fetchUsers,
    setSearch,
    setRoleFilter,
    setCurrentPage,
  } = useUserManagement();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCreateUser = async (data: any) => {
    const success = await createUser(data);
    return success;
  };

  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return false;
    const success = await updateUser(selectedUser.id, data);
    return success;
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    await deleteUser(selectedUser.id);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleChangeRole = async (userId: number, roleId: number) => {
    await changeRole(userId, roleId);
  };

  const getRoleBadgeColor = (roleName?: string) => {
    switch (roleName) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "masseur":
      case "masseuse":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "client":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--brand)]">مدیریت کاربران</h1>
          <p className="text-[color:var(--muted-text)] mt-1">مشاهده و مدیریت کاربران سامانه</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          کاربر جدید
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-text)]">کل کاربران</p>
                <p className="text-2xl font-bold">{stats.total_users}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-text)]">ایمیل تایید شده</p>
                <p className="text-2xl font-bold">{stats.verified_email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
                <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-text)]">تلفن تایید شده</p>
                <p className="text-2xl font-bold">{stats.verified_phone}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-3">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-text)]">ورود هفته اخیر</p>
                <p className="text-2xl font-bold">{stats.recent_logins}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--muted-text)]" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام، ایمیل، تلفن..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] py-2 pr-10 pl-4 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
            >
              <option value="">همه نقش‌ها</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.display_name}
                </option>
              ))}
            </select>

            <button
              onClick={fetchUsers}
              className="rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-2 hover:bg-[color:var(--surface-muted)] transition-colors"
              title="رفرش"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[color:var(--brand)] mx-auto" />
              <p className="mt-2 text-sm text-[color:var(--muted-text)]">در حال بارگذاری...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <UserX className="h-12 w-12 text-[color:var(--muted-text)] mx-auto" />
              <p className="mt-2 text-[color:var(--muted-text)]">کاربری یافت نشد</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--surface-muted)] bg-[color:var(--surface)]">
                  <th className="px-6 py-4 text-right text-xs font-medium text-[color:var(--muted-text)]">کاربر</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-[color:var(--muted-text)]">تماس</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-[color:var(--muted-text)]">نقش</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-[color:var(--muted-text)]">وضعیت</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-[color:var(--muted-text)]">تاریخ عضویت</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-[color:var(--muted-text)]">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--surface-muted)]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[color:var(--surface)] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{user.f_name} {user.l_name}</p>
                        {user.username && (
                          <p className="text-sm text-[color:var(--muted-text)]">@{user.username}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-[color:var(--muted-text)]" />
                            <span>{user.email}</span>
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-[color:var(--muted-text)]" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role?.id || ""}
                        onChange={(e) => handleChangeRole(user.id, parseInt(e.target.value))}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user.role?.name)}`}
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.display_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.email_verified_at && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700" title="ایمیل تایید شده">
                            <Mail className="h-3 w-3" />
                          </span>
                        )}
                        {user.phone_verified_at && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700" title="تلفن تایید شده">
                            <Phone className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[color:var(--muted-text)]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("fa-IR") : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                          title="ویرایش"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteConfirm(true);
                          }}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[color:var(--surface-muted)] px-6 py-4">
            <p className="text-sm text-[color:var(--muted-text)]">
              صفحه {currentPage} از {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[color:var(--surface-muted)] px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--surface-muted)] transition-colors"
              >
                قبلی
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[color:var(--surface-muted)] px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--surface-muted)] transition-colors"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        roles={roles}
        mode="create"
      />

      <UserFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateUser}
        roles={roles}
        user={selectedUser}
        mode="edit"
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
}
