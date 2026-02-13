'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  JalaliDate,
  getMonthName,
  getToday,
  getDaysInMonth,
  isJalaliEqual,
  isJalaliBefore,
  isJalaliAfter,
  JALALI_WEEKDAY_SHORT,
  toGregorian,
} from '@/lib/jalali-utils';

interface JalaliDatePickerProps {
  value?: JalaliDate;
  onChange: (date: JalaliDate) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: JalaliDate;
  maxDate?: JalaliDate;
  className?: string;
}

/**
 * Get the day-of-week (0=Sat, 6=Fri) for the first day of a Jalali month.
 */
function getFirstDayOfWeek(year: number, month: number): number {
  const gregorian = toGregorian({ year, month, day: 1 });
  // JS getDay(): 0=Sun ... 6=Sat. Convert to Persian week (0=Sat).
  const jsDay = gregorian.getDay();
  return (jsDay + 1) % 7;
}

export function JalaliDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  disabled = false,
  minDate,
  maxDate,
  className,
}: JalaliDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const today = React.useMemo(() => getToday(), []);

  const [viewYear, setViewYear] = React.useState(value?.year ?? today.year);
  const [viewMonth, setViewMonth] = React.useState(value?.month ?? today.month);

  // Sync view when value changes externally
  React.useEffect(() => {
    if (value) {
      setViewYear(value.year);
      setViewMonth(value.month);
    }
  }, [value]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getFirstDayOfWeek(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isDateDisabled = (day: number): boolean => {
    if (disabled) return true;
    const d: JalaliDate = { year: viewYear, month: viewMonth, day };
    if (minDate && isJalaliBefore(d, minDate)) return true;
    if (maxDate && isJalaliAfter(d, maxDate)) return true;
    return false;
  };

  const handleSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    onChange({ year: viewYear, month: viewMonth, day });
    setOpen(false);
  };

  const displayValue = value
    ? `${value.day} ${getMonthName(value.month)} ${value.year}`
    : placeholder;

  // Build calendar grid (6 rows x 7 cols max)
  const calendarCells = React.useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [firstDayOffset, daysInMonth]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-right font-normal',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" dir="rtl">
        <div className="p-3 space-y-3 select-none min-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">
              {getMonthName(viewMonth)} {viewYear}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {JALALI_WEEKDAY_SHORT.map((wd) => (
              <div key={wd} className="text-xs font-medium text-muted-foreground py-1">
                {wd}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-8 w-8" />;
              }
              const isSelected = value && isJalaliEqual(value, { year: viewYear, month: viewMonth, day });
              const isTodayDate = isJalaliEqual(today, { year: viewYear, month: viewMonth, day });
              const isDis = isDateDisabled(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDis}
                  onClick={() => handleSelect(day)}
                  className={cn(
                    'h-8 w-8 rounded-md text-sm font-medium transition-colors duration-150',
                    'hover:bg-accent/30 focus:outline-none focus:ring-1 focus:ring-ring',
                    isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    isTodayDate && !isSelected && 'border border-primary/40 text-primary',
                    isDis && 'opacity-30 cursor-not-allowed hover:bg-transparent',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="flex justify-center pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setViewYear(today.year);
                setViewMonth(today.month);
              }}
            >
              امروز
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
