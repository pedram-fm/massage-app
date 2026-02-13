'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { Loader2, Clock, CheckCircle, CalendarOff } from 'lucide-react';
import { useAvailability } from '@/modules/shared/hooks/use-appointments';
import { JalaliDate, getToday, getJalaliString, formatDuration } from '@/lib/jalali-utils';
import { cn } from '@/lib/utils';
import type { TimeSlot } from '@/types/reservation';

interface AvailableSlotsPickerProps {
  therapistServiceId: number;
  serviceName?: string;
  duration?: number;
  onSelectSlot: (date: string, startTime: string) => void;
  selectedSlot?: { date: string; startTime: string };
}

export function AvailableSlotsPicker({
  therapistServiceId,
  serviceName,
  duration,
  onSelectSlot,
  selectedSlot,
}: AvailableSlotsPickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<JalaliDate>(getToday());

  const dateString = getJalaliString(selectedDate);
  const { data: availability, isLoading } = useAvailability(
    therapistServiceId,
    dateString
  );

  // Extract slots for the selected service from slots_by_service
  const serviceSlots = React.useMemo(() => {
    if (!availability?.is_available || !availability.slots_by_service) return [];
    const serviceData = availability.slots_by_service.find(
      (s) => s.service_id === therapistServiceId
    );
    return serviceData?.slots ?? [];
  }, [availability, therapistServiceId]);

  const handleDateChange = (date: JalaliDate) => {
    setSelectedDate(date);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    onSelectSlot(dateString, slot.start_time_formatted);
  };

  const isSlotSelected = (slot: TimeSlot) => {
    return selectedSlot?.date === dateString && selectedSlot?.startTime === slot.start_time_formatted;
  };

  const unavailableReason = availability && !availability.is_available
    ? availability.reason === 'therapist_unavailable'
      ? 'ماساژور در این تاریخ فعال نیست'
      : availability.reason === 'no_services_configured'
        ? 'سرویسی تنظیم نشده است'
        : 'نوبتی موجود نیست'
    : null;

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <Card>
        <CardHeader>
          <CardTitle>انتخاب تاریخ</CardTitle>
          {serviceName && (
            <CardDescription>
              سرویس: {serviceName}
              {duration && ` - ${formatDuration(duration)}`}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <JalaliDatePicker
            value={selectedDate}
            onChange={handleDateChange}
            minDate={getToday()}
          />
        </CardContent>
      </Card>

      {/* Available Slots */}
      <Card>
        <CardHeader>
          <CardTitle>نوبت‌های موجود</CardTitle>
          <CardDescription>
            برای تاریخ {selectedDate.day} / {selectedDate.month} / {selectedDate.year}
            {availability?.day_name_fa && ` (${availability.day_name_fa})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : unavailableReason ? (
            <div className="text-center p-8 text-muted-foreground">
              <CalendarOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{unavailableReason}</p>
            </div>
          ) : serviceSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {serviceSlots.map((slot) => {
                const selected = isSlotSelected(slot);
                return (
                  <Button
                    key={slot.start_time_formatted}
                    variant={selected ? 'default' : 'outline'}
                    className={cn(
                      'h-auto flex-col gap-2 p-4',
                      selected && 'border-primary'
                    )}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">
                        {slot.start_time_formatted}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      تا {slot.end_time_formatted}
                    </span>
                    {selected && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="ml-1 h-3 w-3" />
                        انتخاب شده
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>هیچ نوبت موجودی برای این تاریخ وجود ندارد</p>
            </div>
          )}

          {serviceSlots.length > 0 && availability?.working_hours && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  تعداد نوبت‌ها: {serviceSlots.length}
                </span>
                <span>
                  ساعت کاری: {availability.working_hours.start} - {availability.working_hours.end}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
