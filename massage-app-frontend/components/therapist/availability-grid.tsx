'use client';

import { Clock, Calendar, CalendarOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AvailabilityResponse } from '@/types/reservation';

interface AvailabilityGridProps {
  availability: AvailabilityResponse;
  isLoading?: boolean;
}

export function AvailabilityGrid({
  availability,
  isLoading = false,
}: AvailabilityGridProps) {
  if (!availability?.is_available || !availability.slots_by_service?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CalendarOff className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold mb-1">زمان خالی وجود ندارد</p>
          <p className="text-sm text-gray-500">
            {availability?.reason === 'therapist_unavailable'
              ? 'ماساژور در این تاریخ فعال نیست'
              : availability?.reason === 'no_services_configured'
                ? 'سرویسی تنظیم نشده است'
                : 'برای این تاریخ تمام زمان‌ها رزرو شده است'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {availability.slots_by_service.map((service) => (
        <Card key={service.service_id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              {service.service_name_fa}
            </CardTitle>
            <CardDescription>
              {service.duration} دقیقه - {service.price?.toLocaleString('fa-IR')} تومان - {service.total_slots} زمان خالی
            </CardDescription>
          </CardHeader>
          <CardContent>
            {service.slots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {service.slots.map((slot, index) => (
                  <div
                    key={index}
                    className="rounded-lg border-2 border-green-200 bg-green-50 p-3 text-center transition-all hover:border-green-400 hover:bg-green-100"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Clock className="h-4 w-4 text-green-600" />
                      <div className="text-sm font-semibold text-green-900">
                        {slot.start_time_formatted}
                      </div>
                      <div className="text-xs text-green-700">
                        تا {slot.end_time_formatted}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">زمان خالی وجود ندارد</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
