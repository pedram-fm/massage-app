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
import { formatDuration } from '@/lib/jalali-utils';
import { cn } from '@/lib/utils';

interface DurationPickerProps {
  value?: number; // duration in minutes
  onChange: (duration: number) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: number[]; // custom duration options in minutes
  className?: string;
}

const DEFAULT_DURATIONS = [15, 30, 45, 60, 90, 120]; // minutes

export function DurationPicker({
  value,
  onChange,
  label,
  placeholder = 'انتخاب مدت زمان',
  disabled = false,
  options = DEFAULT_DURATIONS,
  className,
}: DurationPickerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <Select
        value={value?.toString()}
        onValueChange={(val) => onChange(Number(val))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {value ? formatDuration(value) : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((duration) => (
            <SelectItem key={duration} value={duration.toString()}>
              {formatDuration(duration)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
