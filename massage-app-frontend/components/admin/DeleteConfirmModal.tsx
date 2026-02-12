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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-[color:var(--card)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[color:var(--surface-muted)] p-6">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">حذف کاربر</h2>
            <p className="text-sm text-[color:var(--muted-text)]">این عمل قابل بازگشت نیست</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[color:var(--muted-text)] transition-colors hover:bg-[color:var(--surface-muted)]"
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
        <div className="flex gap-3 border-t border-[color:var(--surface-muted)] p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[color:var(--surface-muted)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[color:var(--surface-muted)]"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            حذف کاربر
          </button>
        </div>
      </div>
    </div>
  );
}
