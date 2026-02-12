"use client";

import { X, AlertTriangle } from "lucide-react";
import type { User } from "@/lib/services/userManagementService";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: User | null;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, user }: DeleteConfirmModalProps) {
  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-200"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[color:var(--card)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 border-b border-[color:var(--surface-muted)] p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
          <div className="rounded-full bg-gradient-to-br from-red-500 to-orange-600 p-3 shadow-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">حذف کاربر</h2>
            <p className="text-sm text-[color:var(--muted-text)]">این عمل قابل بازگشت نیست</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[color:var(--muted-text)] transition-all hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] hover:rotate-90"
            title="بستن"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[color:var(--muted-text)]">
            آیا از حذف کاربر{" "}
            <strong className="text-[color:var(--foreground)]">
              {user.f_name} {user.l_name}
            </strong>{" "}
            اطمینان دارید؟
          </p>
          {user.email && (
            <p className="mt-2 text-sm text-[color:var(--muted-text)]">
              ایمیل: {user.email}
            </p>
          )}
          {user.phone && (
            <p className="text-sm text-[color:var(--muted-text)]">
              تلفن: {user.phone}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 border-t border-[color:var(--surface-muted)] p-6">
          <button
            onClick={onClose}
            className="order-2 sm:order-1 flex-1 rounded-lg border border-[color:var(--surface-muted)] px-4 py-2.5 text-sm font-medium transition-all hover:bg-[color:var(--surface-muted)] hover:scale-105"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            className="order-1 sm:order-2 flex-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:scale-105"
          >
            حذف کاربر
          </button>
        </div>
      </div>
    </div>
  );
}
