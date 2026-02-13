"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Role, CreateUserDto, UpdateUserDto, User } from "@/modules/admin/services/userManagementService";
import { 
  validateEmail, 
  validatePhone, 
  validatePassword,
  sanitizeInput 
} from "@/modules/shared/utils/validation";
import { VALIDATION_RULES } from "@/modules/shared/config/constants";
import { toast } from "sonner";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.f_name.trim()) {
      newErrors.f_name = 'نام الزامی است';
    } else if (formData.f_name.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      newErrors.f_name = `نام باید حداقل ${VALIDATION_RULES.USERNAME_MIN_LENGTH} کاراکتر باشد`;
    }

    if (!formData.l_name.trim()) {
      newErrors.l_name = 'نام خانوادگی الزامی است';
    }

    // Email validation (optional but if provided must be valid)
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    // Phone validation
    if (mode === 'create' && !formData.phone) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'شماره تلفن معتبر نیست (مثال: 09123456789)';
    }

    // Password validation
    if (mode === 'create' && !formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors?.[0] || 'رمز عبور معتبر نیست';
      }
    }

    // Role validation
    if (!formData.role_id) {
      newErrors.role_id = 'انتخاب نقش الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: any = {
        f_name: sanitizeInput(formData.f_name),
        l_name: sanitizeInput(formData.l_name),
        role_id: parseInt(formData.role_id),
      };

      if (formData.username) submitData.username = sanitizeInput(formData.username);
      if (formData.email) submitData.email = sanitizeInput(formData.email);
      if (formData.phone) submitData.phone = sanitizeInput(formData.phone);
      if (formData.bio) submitData.bio = sanitizeInput(formData.bio);
      if (formData.password) submitData.password = formData.password;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-200"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[color:var(--card)] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-[color:var(--surface-muted)] p-6 bg-gradient-to-r from-[color:var(--brand)]/10 to-purple-500/10">
          <h2 className="text-xl font-bold text-center">
            {mode === "create" ? "ایجاد کاربر جدید" : "ویرایش کاربر"}
          </h2>
          <button
            onClick={onClose}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-[color:var(--muted-text)] transition-all hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] hover:rotate-90"
            title="بستن"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
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
                onChange={(e) => {
                  setFormData({ ...formData, f_name: e.target.value });
                  setErrors({ ...errors, f_name: '' });
                }}
                className={`w-full rounded-lg border bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20 ${
                  errors.f_name ? 'border-red-500' : 'border-[color:var(--surface-muted)]'
                }`}
                maxLength={VALIDATION_RULES.USERNAME_MAX_LENGTH}
              />
              {errors.f_name && (
                <p className="text-red-500 text-xs mt-1">{errors.f_name}</p>
              )}
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
                onChange={(e) => {
                  setFormData({ ...formData, l_name: e.target.value });
                  setErrors({ ...errors, l_name: '' });
                }}
                className={`w-full rounded-lg border bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20 ${
                  errors.l_name ? 'border-red-500' : 'border-[color:var(--surface-muted)]'
                }`}
                maxLength={VALIDATION_RULES.USERNAME_MAX_LENGTH}
              />
              {errors.l_name && (
                <p className="text-red-500 text-xs mt-1">{errors.l_name}</p>
              )}
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
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: '' });
                }}
                placeholder="09123456789"
                className={`w-full rounded-lg border bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20 ${
                  errors.phone ? 'border-red-500' : 'border-[color:var(--surface-muted)]'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">ایمیل</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: '' });
                }}
                className={`w-full rounded-lg border bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20 ${
                  errors.email ? 'border-red-500' : 'border-[color:var(--surface-muted)]'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                نقش <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.role_id}
                onChange={(e) => {
                  setFormData({ ...formData, role_id: e.target.value });
                  setErrors({ ...errors, role_id: '' });
                }}
                className={`w-full rounded-lg border bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20 ${
                  errors.role_id ? 'border-red-500' : 'border-[color:var(--surface-muted)]'
                }`}
              >
                <option value="">انتخاب نقش</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.display_name}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>
              )}
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
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors({ ...errors, password: '' });
                }}
                placeholder={mode === "edit" ? "برای تغییر رمز عبور وارد کنید" : ""}
                className={`w-full rounded-lg border bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] focus:ring-opacity-20 ${
                  errors.password ? 'border-red-500' : 'border-[color:var(--surface-muted)]'
                }`}
                minLength={VALIDATION_RULES.PASSWORD_MIN_LENGTH}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              {!errors.password && mode === "create" && (
                <p className="mt-1 text-xs text-[color:var(--muted-text)]">
                  حداقل {VALIDATION_RULES.PASSWORD_MIN_LENGTH} کاراکتر، شامل حروف بزرگ و کوچک و اعداد
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
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-[color:var(--surface-muted)]">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 rounded-lg border border-[color:var(--surface-muted)] px-6 py-2.5 text-sm font-medium transition-all hover:bg-[color:var(--surface-muted)] hover:scale-105"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="order-1 sm:order-2 rounded-lg bg-gradient-to-r from-[color:var(--brand)] to-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "در حال ذخیره..." : mode === "create" ? "ایجاد" : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
