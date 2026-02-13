'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value?: string; // HH:mm format (24h internally)
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  minTime?: string;
  maxTime?: string;
  step?: number; // minutes step (default: 30)
  className?: string;
  use12Hour?: boolean;
}

function to12Hour(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'ب.ظ' : 'ق.ظ';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function TimePicker({
  value,
  onChange,
  label,
  placeholder = 'انتخاب زمان',
  disabled = false,
  minTime = '00:00',
  maxTime = '23:59',
  step = 30,
  className,
  use12Hour = true,
}: TimePickerProps) {
  const timeOptions = React.useMemo(() => {
    const options: { value: string; label: string }[] = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);

    const startMinutes = minHour * 60 + minMinute;
    const endMinutes = maxHour * 60 + maxMinute;

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += step) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      options.push({
        value: timeStr,
        label: use12Hour ? to12Hour(timeStr) : timeStr,
      });
    }

    return options;
  }, [minTime, maxTime, step, use12Hour]);

  const displayValue = value && use12Hour ? to12Hour(value) : value;

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className="text-sm font-medium text-muted-foreground">{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {displayValue || placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((time) => (
            <SelectItem key={time.value} value={time.value}>
              {time.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
