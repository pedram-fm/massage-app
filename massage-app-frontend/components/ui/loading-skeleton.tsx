'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-muted',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
}

// Calendar Skeleton
export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton width={120} height={32} />
        <Skeleton width={80} height={32} />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} height={24} className="mb-2" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} height={40} />
        ))}
      </div>
    </div>
  );
}

// Schedule Card Skeleton
export function ScheduleCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width={80} height={24} />
        <Skeleton width={60} height={24} variant="circular" />
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height={20} />
        <Skeleton width="80%" height={20} />
      </div>
    </div>
  );
}

// Appointment Card Skeleton
export function AppointmentCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={20} />
        </div>
        <Skeleton width={80} height={32} />
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Skeleton width={100} height={20} />
        <Skeleton width={100} height={20} />
      </div>
      <Skeleton width="100%" height={20} />
    </div>
  );
}

// Appointment List Skeleton
export function AppointmentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <AppointmentCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Service Card Skeleton
export function ServiceCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width={150} height={24} />
        <Skeleton width={60} height={24} />
      </div>
      <Skeleton width="100%" height={40} />
      <div className="flex items-center justify-between pt-2">
        <Skeleton width={100} height={20} />
        <Skeleton width={80} height={20} />
      </div>
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border p-6 space-y-2">
      <Skeleton width={60} height={20} />
      <Skeleton width={100} height={36} />
      <Skeleton width={80} height={16} />
    </div>
  );
}

// Stats Grid Skeleton
export function StatsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 border-b pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width={`${100 / columns}%`} height={24} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width={`${100 / columns}%`} height={20} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Page Skeleton (Full page with header and content)
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton width={200} height={36} />
        <Skeleton width={120} height={40} />
      </div>

      {/* Stats */}
      <StatsGridSkeleton />

      {/* Content */}
      <div className="space-y-4">
        <Skeleton width={150} height={24} />
        <AppointmentListSkeleton count={3} />
      </div>
    </div>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width={100} height={20} />
          <Skeleton width="100%" height={40} />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton width={100} height={40} />
        <Skeleton width={100} height={40} />
      </div>
    </div>
  );
}
