'use client';

import { Badge } from '@/components/ui/badge';
import { AppointmentStatus } from '@/types/reservation';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const STATUS_CONFIG = {
  [AppointmentStatus.Pending]: {
    label: 'در انتظار تایید',
    variant: 'default' as const,
    className: 'bg-yellow-500 hover:bg-yellow-600',
  },
  [AppointmentStatus.Confirmed]: {
    label: 'تایید شده',
    variant: 'default' as const,
    className: 'bg-blue-500 hover:bg-blue-600',
  },
  [AppointmentStatus.Completed]: {
    label: 'انجام شده',
    variant: 'default' as const,
    className: 'bg-green-500 hover:bg-green-600',
  },
  [AppointmentStatus.Cancelled]: {
    label: 'لغو شده',
    variant: 'destructive' as const,
    className: '',
  },
  [AppointmentStatus.NoShow]: {
    label: 'عدم حضور',
    variant: 'secondary' as const,
    className: 'bg-gray-500 hover:bg-gray-600',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
