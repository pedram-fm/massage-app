"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { userManagementService, type UpdateUserDto } from "@/modules/admin/services/userManagementService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      const updateData: UpdateUserDto = {
        f_name: formData.f_name,
        l_name: formData.l_name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        bio: formData.bio,
      };

      await userManagementService.updateUser(user.id, updateData);
      
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] " dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">ویرایش پروفایل</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نام</label>
              <input
                required
                value={formData.f_name}
                onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                className="w-full rounded-md border p-2 text-sm outline-none focus:border-[color:var(--brand)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">نام خانوادگی</label>
              <input
                required
                value={formData.l_name}
                onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
                className="w-full rounded-md border p-2 text-sm outline-none focus:border-[color:var(--brand)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">نام کاربری</label>
            <input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-md border p-2 text-sm outline-none focus:border-[color:var(--brand)]"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ایمیل</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border p-2 text-sm outline-none focus:border-[color:var(--brand)]"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">شماره تماس</label>
            <input
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-md border p-2 text-sm outline-none focus:border-[color:var(--brand)]"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">درباره من</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-md border p-2 text-sm outline-none focus:border-[color:var(--brand)] min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              ثبت تغییرات
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
