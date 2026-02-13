'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/ui/time-picker';
import { DurationPicker } from '@/components/ui/duration-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Copy, Clock, Coffee, CheckCircle2 } from 'lucide-react';
import {
  useWeeklySchedule,
  useUpdateWeeklySchedule,
} from '@/modules/shared/hooks/use-schedule';
import { DayOfWeek, UpdateWeeklyScheduleRequest } from '@/types/reservation';
import { JALALI_WEEKDAY_NAMES, JALALI_WEEKDAY_SHORT } from '@/lib/jalali-utils';
import { cn } from '@/lib/utils';

interface DaySchedule {
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  break_duration: number;
  is_active: boolean;
}

const initialSchedule: DaySchedule[] = [
  { day_of_week: DayOfWeek.Saturday, start_time: '09:00', end_time: '17:00', break_duration: 15, is_active: true },
  { day_of_week: DayOfWeek.Sunday, start_time: '09:00', end_time: '17:00', break_duration: 15, is_active: true },
  { day_of_week: DayOfWeek.Monday, start_time: '09:00', end_time: '17:00', break_duration: 15, is_active: true },
  { day_of_week: DayOfWeek.Tuesday, start_time: '09:00', end_time: '17:00', break_duration: 15, is_active: true },
  { day_of_week: DayOfWeek.Wednesday, start_time: '09:00', end_time: '17:00', break_duration: 15, is_active: true },
  { day_of_week: DayOfWeek.Thursday, start_time: '09:00', end_time: '17:00', break_duration: 15, is_active: false },
  { day_of_week: DayOfWeek.Friday, start_time: '09:00', end_time: '17:00', break_duration: 15, is_active: false },
];

function to12HourShort(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'ب.ظ' : 'ق.ظ';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function WeeklyScheduleEditor() {
  const { data: existingSchedule, isLoading } = useWeeklySchedule();
  const updateSchedule = useUpdateWeeklySchedule();

  const [schedules, setSchedules] = React.useState<DaySchedule[]>(initialSchedule);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (existingSchedule && existingSchedule.length > 0) {
      const mapped: DaySchedule[] = initialSchedule.map((initial) => {
        const existing = existingSchedule.find(
          (s) => s.day_of_week === initial.day_of_week
        );
        if (existing) {
          return {
            day_of_week: existing.day_of_week,
            start_time: existing.start_time.substring(0, 5),
            end_time: existing.end_time.substring(0, 5),
            break_duration: existing.break_duration,
            is_active: existing.is_active,
          };
        }
        return initial;
      });
      setSchedules(mapped);
    }
  }, [existingSchedule]);

  const updateDay = (dayOfWeek: DayOfWeek, updates: Partial<DaySchedule>) => {
    setSaved(false);
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.day_of_week === dayOfWeek
          ? { ...schedule, ...updates }
          : schedule
      )
    );
  };

  const handleSave = () => {
    const request: UpdateWeeklyScheduleRequest = {
      schedules: schedules.map((s) => ({
        ...s,
        start_time: s.start_time,
        end_time: s.end_time,
      })),
    };
    updateSchedule.mutate(request, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const applyToAll = (sourceDay: DayOfWeek) => {
    const source = schedules.find((s) => s.day_of_week === sourceDay);
    if (!source) return;
    setSaved(false);
    setSchedules((prev) =>
      prev.map((schedule) => ({
        ...schedule,
        start_time: source.start_time,
        end_time: source.end_time,
        break_duration: source.break_duration,
      }))
    );
  };

  const activeCount = schedules.filter((s) => s.is_active).length;

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
              <Clock className="h-5 w-5 text-[var(--accent-strong)]" />
              برنامه هفتگی
            </CardTitle>
            <CardDescription className="mt-1">
              {activeCount} روز فعال از ۷ روز هفته
            </CardDescription>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateSchedule.isPending}
            className={cn(
              'transition-all duration-300',
              saved
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-[var(--accent-strong)] hover:bg-[var(--accent-strong)]/90'
            )}
          >
            {updateSchedule.isPending ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="ml-2 h-4 w-4" />
            ) : null}
            {saved ? 'ذخیره شد' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.day_of_week}
              className={cn(
                'transition-all duration-300 ease-in-out',
                schedule.is_active
                  ? 'bg-gradient-to-l from-[var(--surface)] to-transparent'
                  : 'bg-muted/20 opacity-70 hover:opacity-100',
              )}
            >
              {/* Day row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Day label + switch */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <Switch
                    id={`active-${schedule.day_of_week}`}
                    checked={schedule.is_active}
                    onCheckedChange={(checked) =>
                      updateDay(schedule.day_of_week, { is_active: checked })
                    }
                  />
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors duration-200',
                        schedule.is_active
                          ? 'bg-[var(--accent-strong)] text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {JALALI_WEEKDAY_SHORT[schedule.day_of_week]}
                    </span>
                    <Label
                      htmlFor={`active-${schedule.day_of_week}`}
                      className={cn(
                        'text-sm font-semibold cursor-pointer transition-colors duration-200',
                        schedule.is_active ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {JALALI_WEEKDAY_NAMES[schedule.day_of_week]}
                    </Label>
                  </div>
                </div>

                {/* Time info / controls */}
                <div className="flex-1">
                  {schedule.is_active ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <TimePicker
                          value={schedule.start_time}
                          onChange={(time) =>
                            updateDay(schedule.day_of_week, { start_time: time })
                          }
                          maxTime={schedule.end_time}
                          className="w-[140px]"
                        />
                        <span className="text-muted-foreground text-xs">تا</span>
                        <TimePicker
                          value={schedule.end_time}
                          onChange={(time) =>
                            updateDay(schedule.day_of_week, { end_time: time })
                          }
                          minTime={schedule.start_time}
                          className="w-[140px]"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Coffee className="h-3.5 w-3.5" />
                        <DurationPicker
                          value={schedule.break_duration}
                          onChange={(duration) =>
                            updateDay(schedule.day_of_week, { break_duration: duration })
                          }
                          options={[0, 10, 15, 20, 30]}
                          className="w-[120px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">تعطیل</span>
                  )}
                </div>

                {/* Copy to all button */}
                {schedule.is_active && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-[var(--accent-strong)] shrink-0"
                          onClick={() => applyToAll(schedule.day_of_week)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">اعمال به همه روزها</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
