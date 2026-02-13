'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppointmentList } from '@/components/therapist/appointment-list';
import { CreateAppointmentModal } from '@/components/therapist/create-appointment-modal';

export default function TherapistAppointmentsPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">نوبت‌های من</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          رزرو نوبت جدید
        </Button>
      </div>

      <AppointmentList />

      <CreateAppointmentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}
