'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useCancelAppointment } from '@/modules/shared/hooks/use-appointments';

interface CancelAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: number;
  onSuccess?: () => void;
}

export function CancelAppointmentModal({
  open,
  onOpenChange,
  appointmentId,
  onSuccess,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = React.useState('');
  const cancelAppointment = useCancelAppointment();

  const handleSubmit = () => {
    if (!reason.trim()) {
      return;
    }

    cancelAppointment.mutate(
      { 
        id: appointmentId, 
        data: { reason }
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setReason('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            لغو نوبت
          </DialogTitle>
          <DialogDescription>
            لطفاً دلیل لغو نوبت را وارد کنید. این اطلاعات برای مراجع قابل مشاهده خواهد بود.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              دلیل لغو <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: تغییر برنامه درمانگر"
              rows={4}
              className={!reason.trim() && cancelAppointment.isError ? 'border-destructive' : ''}
            />
            {!reason.trim() && (
              <p className="text-sm text-muted-foreground">
                وارد کردن دلیل لغو الزامی است
              </p>
            )}
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">⚠️ توجه:</p>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>این عملیات قابل بازگشت نیست</li>
              <li>مراجع از لغو نوبت مطلع خواهد شد</li>
              <li>در صورت نیاز، می‌توانید نوبت جدید ایجاد کنید</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setReason('');
            }}
            disabled={cancelAppointment.isPending}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason.trim() || cancelAppointment.isPending}
          >
            {cancelAppointment.isPending && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
            لغو نوبت
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
