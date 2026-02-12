"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Role, CreateUserDto, UpdateUserDto, User } from "@/lib/services/userManagementService";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<boolean>;
  roles: Role[];
  user?: User | null;
  mode: "create" | "edit";
}

export function UserFormModal({ isOpen, onClose, onSubmit, roles, user, mode }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        f_name: user.f_name || "",
        l_name: user.l_name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        role_id: user.role?.id.toString() || "",
        bio: user.bio || "",
      });
    } else {
      setFormData({
        f_name: "",
        l_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role_id: "",
        bio: "",
      });
    }
  }, [mode, user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData: any = {
        f_name: formData.f_name,
        l_name: formData.l_name,
        role_id: parseInt(formData.role_id),
      };

      if (formData.username) submitData.username = formData.username;
      if (formData.email) submitData.email = formData.email;
      if (formData.phone) submitData.phone = formData.phone;
      if (formData.bio) submitData.bio = formData.bio;

      // Password required for create, optional for edit
      if (mode === "create") {
        if (!formData.password) {
          alert("رمز عبور الزامی است");
          return;
        }
        submitData.password = formData.password;
      } else if (formData.password) {
        submitData.password = formData.password;
      }

      const success = await onSubmit(submitData);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-[color:var(--card)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[color:var(--surface-muted)] p-6">
          <h2 className="text-xl font-bold">
            {mode === "create" ? "ایجاد کاربر جدید" : "ویرایش کاربر"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[color:var(--muted-text)] transition-colors hover:bg-[color:var(--surface-muted)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                نام <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.f_name}
                onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.l_name}
                onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-medium">نام کاربری</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                تلفن {mode === "create" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                required={mode === "create"}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">ایمیل</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                نقش <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              >
                <option value="">انتخاب نقش</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                رمز عبور {mode === "create" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                required={mode === "create"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={mode === "edit" ? "برای تغییر رمز عبور وارد کنید" : ""}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
              {mode === "create" && (
                <p className="mt-1 text-xs text-[color:var(--muted-text)]">
                  حداقل 6 کاراکتر
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">بیوگرافی</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[color:var(--surface-muted)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[color:var(--surface-muted)]"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "در حال ذخیره..." : mode === "create" ? "ایجاد" : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
