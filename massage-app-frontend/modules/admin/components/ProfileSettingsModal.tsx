"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { httpClient } from "@/modules/shared/api/httpClient";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        f_name: user.f_name || "",
        l_name: user.l_name || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || "",
        bio: user.bio || "",
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        f_name: formData.f_name,
        l_name: formData.l_name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        bio: formData.bio,
      };

      // Use auth profile endpoint instead of admin endpoint
      await httpClient.put('/v1/auth/profile', updateData);
      
      // Update user in context and localStorage
      updateUser({
        f_name: formData.f_name,
        l_name: formData.l_name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        bio: formData.bio,
      });
      
      toast.success("پروفایل شما با موفقیت بروزرسانی شد");
      onClose(); 
    } catch (error: any) {
      toast.error(error.message || "خطا در بروزرسانی پروفایل");
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
        <div className="relative flex items-center justify-between border-b border-[color:var(--surface-muted)] p-6">
          <h2 className="text-xl font-bold">ویرایش پروفایل</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[color:var(--muted-text)] transition-all hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] hover:rotate-90"
            title="بستن"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[color:var(--muted-text)]">نام *</label>
                <input
                  required
                  value={formData.f_name}
                  onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                  className="w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm outline-none transition-all focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[color:var(--muted-text)]">نام خانوادگی *</label>
                <input
                  required
                  value={formData.l_name}
                  onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
                  className="w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm outline-none transition-all focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--muted-text)]">نام کاربری</label>
              <input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm outline-none transition-all focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--muted-text)]">ایمیل *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm outline-none transition-all focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--muted-text)]">شماره تماس *</label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm outline-none transition-all focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[color:var(--muted-text)]">درباره من</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm outline-none transition-all focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[color:var(--surface-muted)]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-[color:var(--surface-muted)] px-6 py-2.5 text-sm font-medium transition-all hover:bg-[color:var(--surface-muted)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'در حال ذخیره...' : 'ثبت تغییرات'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
