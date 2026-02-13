'use client';

import { WeeklyScheduleEditor } from '@/components/therapist/weekly-schedule-editor';
import { ScheduleOverrideList } from '@/components/therapist/schedule-override-list';
import { Calendar, Clock } from 'lucide-react';

export default function TherapistSchedulePage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--surface)] text-[var(--accent-strong)]">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">برنامه کاری من</h1>
          <p className="text-sm text-muted-foreground">مدیریت ساعات کاری و استثناها</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <WeeklyScheduleEditor />
        <ScheduleOverrideList />
      </div>
    </div>
  );
}
