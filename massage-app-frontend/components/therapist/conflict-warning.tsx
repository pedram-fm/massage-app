'use client';

import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConflictWarning {
  id: string | number;
  type: 'appointment' | 'override';
  date: string;
  startTime: string;
  endTime?: string;
  clientName?: string;
  serviceName?: string;
  status?: string;
  message?: string;
}

interface ConflictWarningProps {
  conflicts: ConflictWarning[];
  onConfirm?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
  variant?: 'warning' | 'destructive';
  className?: string;
}

export function ConflictWarningUI({
  conflicts,
  onConfirm,
  onCancel,
  showActions = true,
  variant = 'warning',
  className,
}: ConflictWarningProps) {
  if (conflicts.length === 0) return null;

  const appointmentConflicts = conflicts.filter((c) => c.type === 'appointment');
  const overrideConflicts = conflicts.filter((c) => c.type === 'override');

  return (
    <Alert
      variant={variant === 'destructive' ? 'destructive' : 'default'}
      className={cn(
        variant === 'warning' &&
          'border-orange-500 bg-orange-50 text-orange-900 dark:border-orange-600 dark:bg-orange-950 dark:text-orange-100',
        className
      )}
    >
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="flex items-center justify-between">
        <span>
          {variant === 'destructive'
            ? '⚠️ تداخل شناسایی شد'
            : 'هشدار: تداخل احتمالی'}
        </span>
        <Badge variant="secondary" className="mr-2">
          {conflicts.length} مورد
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-3 space-y-3">
        {/* Appointment Conflicts */}
        {appointmentConflicts.length > 0 && (
          <div className="space-y-2">
            <div className="font-semibold text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              نوبت‌های رزرو شده ({appointmentConflicts.length})
            </div>
            <div className="space-y-2">
              {appointmentConflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="rounded-md border border-orange-200 bg-white dark:bg-orange-950/20 p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      {conflict.clientName && (
                        <div className="font-medium">{conflict.clientName}</div>
                      )}
                      {conflict.serviceName && (
                        <div className="text-muted-foreground">
                          {conflict.serviceName}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {conflict.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {conflict.startTime.substring(0, 5)}
                          {conflict.endTime && ` - ${conflict.endTime.substring(0, 5)}`}
                        </span>
                      </div>
                      {conflict.status && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {conflict.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {conflict.message && (
                    <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                      {conflict.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Override Conflicts */}
        {overrideConflicts.length > 0 && (
          <div className="space-y-2">
            <div className="font-semibold text-sm flex items-center gap-2">
              <X className="h-4 w-4" />
              استثناهای برنامه ({overrideConflicts.length})
            </div>
            <div className="space-y-2">
              {overrideConflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="rounded-md border border-orange-200 bg-white dark:bg-orange-950/20 p-3 text-sm"
                >
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {conflict.date}
                    </span>
                    {conflict.startTime && conflict.endTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {conflict.startTime.substring(0, 5)} -{' '}
                        {conflict.endTime.substring(0, 5)}
                      </span>
                    )}
                  </div>
                  {conflict.message && (
                    <div className="mt-2 text-xs">{conflict.message}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Message */}
        <div className="pt-2 border-t text-sm">
          {variant === 'destructive' ? (
            <p>
              امکان انجام این عملیات وجود ندارد. لطفاً ابتدا نوبت‌های موجود را
              لغو یا تغییر دهید.
            </p>
          ) : (
            <p>
              در صورت ادامه، ممکن است تداخل زمانی ایجاد شود. آیا مطمئن هستید؟
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="flex-1"
              >
                انصراف
              </Button>
            )}
            {onConfirm && variant !== 'destructive' && (
              <Button
                variant={variant === 'warning' ? 'default' : 'destructive'}
                size="sm"
                onClick={onConfirm}
                className="flex-1"
              >
                ادامه
              </Button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
