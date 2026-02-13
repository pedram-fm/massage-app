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
import { useUserManagement } from "@/modules/admin/hooks/useUserManagement";
import { UserFormModal } from "@/modules/admin/components/UserFormModal";
import { DeleteConfirmModal } from "@/modules/admin/components/DeleteConfirmModal";
import type { User, CreateUserDto, UpdateUserDto } from "@/modules/admin/services/userManagementService";

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

  const handleCreateUser = async (data: CreateUserDto | UpdateUserDto) => {
    const success = await createUser(data as CreateUserDto);
    return success;
  };

  const handleUpdateUser = async (data: CreateUserDto | UpdateUserDto) => {
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
      case "therapist":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "client":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[color:var(--brand)] to-purple-600 bg-clip-text text-transparent">مدیریت کاربران</h1>
          <p className="text-sm md:text-base text-[color:var(--muted-text)] mt-1">مشاهده و مدیریت کاربران سامانه</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[color:var(--brand)] to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-200 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          کاربر جدید
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2 md:p-3">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-blue-100 font-medium">کل کاربران</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{stats.total_users}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2 md:p-3">
                  <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-green-100 font-medium">ایمیل تایید شده</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{stats.verified_email}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2 md:p-3">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-purple-100 font-medium">تلفن تایید شده</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{stats.verified_phone}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2 md:p-3">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-orange-100 font-medium">ورود هفته اخیر</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{stats.recent_logins}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-[color:var(--surface-muted)] bg-gradient-to-r from-[color:var(--card)] to-[color:var(--surface)] p-4 md:p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--brand)]" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام، ایمیل، تلفن..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border-2 border-[color:var(--surface-muted)] bg-[color:var(--surface)] py-2.5 pr-10 pl-4 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/20 transition-all"
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
              className="flex-1 rounded-xl border-2 border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-3 md:px-4 py-2.5 text-sm font-medium focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/20 transition-all"
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
              className="rounded-xl border-2 border-[color:var(--brand)]/20 bg-gradient-to-br from-[color:var(--brand)]/10 to-purple-500/10 p-2.5 hover:from-[color:var(--brand)]/20 hover:to-purple-500/20 transition-all hover:scale-110"
              title="رفرش"
            >
              <RefreshCw className="h-5 w-5 text-[color:var(--brand)]" />
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
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[color:var(--brand)]/20 bg-gradient-to-r from-[color:var(--brand)]/5 to-purple-500/5">
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider">کاربر</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider">تماس</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider">نقش</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider">وضعیت</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider">تاریخ عضویت</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[color:var(--brand)] uppercase tracking-wider">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--surface-muted)]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gradient-to-l hover:from-[color:var(--brand)]/5 hover:to-transparent transition-all duration-150 border-r-4 border-transparent hover:border-[color:var(--brand)]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand)] to-purple-600 text-xs font-bold text-white shadow-md">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={`${user.f_name} ${user.l_name}`}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <span>{user.f_name?.[0]}{user.l_name?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{user.f_name} {user.l_name}</p>
                            {user.username && (
                              <p className="text-sm text-[color:var(--muted-text)]">@{user.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-[color:var(--brand)]" />
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-[color:var(--brand)]" />
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
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-300 shadow-sm" title="ایمیل تایید شده">
                            <Mail className="h-3 w-3" />
                          </span>
                        )}
                        {user.phone_verified_at && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 shadow-sm" title="تلفن تایید شده">
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
                          className="rounded-lg p-2 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all hover:scale-110"
                          title="ویرایش"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteConfirm(true);
                          }}
                          className="rounded-lg p-2 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 transition-all hover:scale-110"
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

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-[color:var(--surface-muted)]">
            {users.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gradient-to-l hover:from-[color:var(--brand)]/5 hover:to-transparent transition-all duration-200 border-r-4 border-transparent hover:border-[color:var(--brand)]">
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand)] to-purple-600 text-sm font-bold text-white shadow-md ring-2 ring-white dark:ring-gray-800">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={`${user.f_name} ${user.l_name}`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span>{user.f_name?.[0]}{user.l_name?.[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{user.f_name} {user.l_name}</p>
                        {user.username && (
                          <p className="text-sm text-[color:var(--muted-text)]">@{user.username}</p>
                        )}
                        <div className="mt-1">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            user.role?.name === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            user.role?.name === 'therapist' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {user.role?.display_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteConfirm(true);
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-[color:var(--surface)] rounded-lg p-3 space-y-1.5">
                    {user.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-[color:var(--brand)] shrink-0" />
                        <span className="truncate flex-1">{user.email}</span>
                        {user.email_verified_at && (
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs text-green-700 dark:text-green-300 shrink-0">
                            تایید
                          </span>
                        )}
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-[color:var(--brand)] shrink-0" />
                        <span className="truncate flex-1">{user.phone}</span>
                        {user.phone_verified_at && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300 shrink-0">
                            تایید
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-[color:var(--muted-text)]">
                    <Calendar className="h-3 w-3" />
                    <span>عضویت: {user.created_at ? new Date(user.created_at).toLocaleDateString("fa-IR") : "-"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[color:var(--surface-muted)] bg-gradient-to-r from-[color:var(--surface)]/50 to-transparent px-4 md:px-6 py-4">
            <p className="text-sm font-medium text-[color:var(--muted-text)]">
              صفحه <span className="text-[color:var(--brand)] font-bold">{currentPage}</span> از <span className="text-[color:var(--brand)] font-bold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border-2 border-[color:var(--surface-muted)] px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[color:var(--brand)] hover:to-purple-600 hover:text-white hover:border-transparent transition-all hover:scale-105 disabled:hover:scale-100"
              >
                قبلی
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border-2 border-[color:var(--surface-muted)] px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[color:var(--brand)] hover:to-purple-600 hover:text-white hover:border-transparent transition-all hover:scale-105 disabled:hover:scale-100"
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
