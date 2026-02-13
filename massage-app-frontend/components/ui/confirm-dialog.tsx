'use client';

import { ReactNode, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ConfirmDialogVariant = 'destructive' | 'warning' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  icon?: LucideIcon;
  isLoading?: boolean;
}

const variantConfig = {
  destructive: {
    icon: Trash2,
    iconClassName: 'text-red-600',
    confirmClassName: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'text-orange-600',
    confirmClassName: 'bg-orange-600 hover:bg-orange-700',
  },
  info: {
    icon: Info,
    iconClassName: 'text-blue-600',
    confirmClassName: 'bg-blue-600 hover:bg-blue-700',
  },
};

/**
 * Confirmation Dialog Component
 * 
 * Usage for delete action:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <ConfirmDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onConfirm={handleDelete}
 *   title="حذف آیتم"
 *   description="آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟"
 *   variant="destructive"
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'تأیید',
  cancelText = 'انصراف',
  variant = 'info',
  icon: CustomIcon,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = CustomIcon || config.icon;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn('rounded-full bg-gray-100 p-2', config.iconClassName)}>
              <Icon className="h-5 w-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-right">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(config.confirmClassName, 'text-white')}
          >
            {isLoading ? 'در حال انجام...' : confirmText}
          </AlertDialogAction>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Delete Confirmation Dialog
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  isLoading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="تأیید حذف"
      description={`آیا مطمئن هستید که می‌خواهید "${itemName}" را حذف کنید؟ این عملیات قابل بازگشت نیست.`}
      confirmText="حذف"
      cancelText="انصراف"
      variant="destructive"
      isLoading={isLoading}
    />
  );
}

/**
 * Cancel Confirmation Dialog
 */
export function CancelConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  isLoading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="تأیید لغو"
      description={`آیا مطمئن هستید که می‌خواهید "${itemName}" را لغو کنید؟`}
      confirmText="لغو رزرو"
      cancelText="بازگشت"
      variant="warning"
      icon={XCircle}
      isLoading={isLoading}
    />
  );
}

/**
 * Hook for managing confirm dialog state
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const confirm = (onConfirm: () => void) => {
    setCallback(() => onConfirm);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
    setCallback(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setCallback(null);
  };

  return {
    isOpen,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
