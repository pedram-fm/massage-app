'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Plus,
  Trash2,
  CalendarOff,
  CalendarClock,
  CalendarX2,
  AlertCircle,
} from 'lucide-react';
import {
  useScheduleOverrides,
  useCreateOverride,
  useDeleteOverride,
} from '@/modules/shared/hooks/use-schedule';
import { CreateOverrideRequest, OverrideType } from '@/types/reservation';
import { JalaliDate, getJalaliString, formatJalali, getToday } from '@/lib/jalali-utils';
import { cn } from '@/lib/utils';

function to12HourShort(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'ب.ظ' : 'ق.ظ';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function ScheduleOverrideList() {
  const { data: overrides, isLoading } = useScheduleOverrides();
  const createOverride = useCreateOverride();
  const deleteOverride = useDeleteOverride();

  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    date: JalaliDate | undefined;
    type: OverrideType;
    start_time?: string;
    end_time?: string;
    reason?: string;
  }>({
    date: undefined,
    type: OverrideType.Unavailable,
  });

  const handleSubmit = () => {
    if (!formData.date) return;

    const request: CreateOverrideRequest = {
      override_date_jalali: getJalaliString(formData.date),
      override_type: formData.type,
      reason_fa: formData.reason,
    };

    if (formData.type === OverrideType.CustomHours) {
      request.start_time = formData.start_time;
      request.end_time = formData.end_time;
    }

    createOverride.mutate(request, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          date: undefined,
          type: OverrideType.Unavailable,
        });
      },
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف این استثنا اطمینان دارید؟')) {
      deleteOverride.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-strong)]" />
            <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <CalendarOff className="h-5 w-5 text-[var(--accent-strong)]" />
              استثناهای برنامه
            </CardTitle>
            <CardDescription className="mt-1">
              روزهای تعطیل یا ساعات کاری خاص را تعریف کنید
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--accent-strong)] hover:bg-[var(--accent-strong)]/90">
                <Plus className="ml-2 h-4 w-4" />
                استثنا جدید
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>ایجاد استثنا</DialogTitle>
                <DialogDescription>
                  برای روز خاصی ساعات کاری متفاوت یا تعطیلی تعریف کنید
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">تاریخ</Label>
                  <JalaliDatePicker
                    value={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                    minDate={getToday()}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">نوع استثنا</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: OverrideType) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OverrideType.Unavailable}>
                        <span className="flex items-center gap-2">
                          <CalendarX2 className="h-4 w-4 text-red-500" />
                          روز تعطیل
                        </span>
                      </SelectItem>
                      <SelectItem value={OverrideType.CustomHours}>
                        <span className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-amber-500" />
                          ساعات کاری خاص
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === OverrideType.CustomHours && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--surface)]">
                    <TimePicker
                      label="ساعت شروع"
                      value={formData.start_time}
                      onChange={(time) =>
                        setFormData({ ...formData, start_time: time })
                      }
                    />
                    <TimePicker
                      label="ساعت پایان"
                      value={formData.end_time}
                      onChange={(time) =>
                        setFormData({ ...formData, end_time: time })
                      }
                      minTime={formData.start_time}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">دلیل (اختیاری)</Label>
                  <Textarea
                    value={formData.reason || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    placeholder="مثال: تعطیلات عید"
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  انصراف
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.date || createOverride.isPending}
                  className="bg-[var(--accent-strong)] hover:bg-[var(--accent-strong)]/90"
                >
                  {createOverride.isPending && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                  ایجاد
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {overrides && overrides.length > 0 ? (
          <div className="divide-y divide-border/40">
            {overrides.map((override) => {
              const isUnavailable = override.override_type === OverrideType.Unavailable;
              return (
                <div
                  key={override.id}
                  className={cn(
                    'flex items-center justify-between px-5 py-4 transition-colors duration-200 hover:bg-muted/30',
                    isUnavailable
                      ? 'border-r-3 border-r-red-400'
                      : 'border-r-3 border-r-amber-400'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-xl transition-colors',
                        isUnavailable
                          ? 'bg-red-50 text-red-500'
                          : 'bg-amber-50 text-amber-500'
                      )}
                    >
                      {isUnavailable ? (
                        <CalendarX2 className="h-5 w-5" />
                      ) : (
                        <CalendarClock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {formatJalali(override.override_date_gregorian, 'jDD jMMMM jYYYY')}
                        </span>
                        <Badge
                          variant={isUnavailable ? 'destructive' : 'secondary'}
                          className={cn(
                            'text-[10px] px-1.5 py-0',
                            !isUnavailable && 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          )}
                        >
                          {isUnavailable ? 'تعطیل' : 'ساعات خاص'}
                        </Badge>
                      </div>
                      {!isUnavailable && override.start_time && override.end_time && (
                        <p className="text-xs text-muted-foreground">
                          {to12HourShort(override.start_time.substring(0, 5))} تا{' '}
                          {to12HourShort(override.end_time.substring(0, 5))}
                        </p>
                      )}
                      {override.reason_fa && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {override.reason_fa}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelete(override.id)}
                    disabled={deleteOverride.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CalendarOff className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">هیچ استثنایی تعریف نشده است</p>
            <p className="text-xs mt-1">می‌توانید روزهای تعطیل یا ساعات خاص اضافه کنید</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
