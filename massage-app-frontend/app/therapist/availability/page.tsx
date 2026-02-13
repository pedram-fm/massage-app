'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowRight, RefreshCw, Clock, CalendarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JalaliDatePicker } from '@/components/ui/jalali-date-picker';
import { useAvailability } from '@/modules/shared/hooks/use-appointments';
import { useTherapistServices } from '@/modules/shared/hooks/use-services';
import { PageSkeleton } from '@/components/ui/loading-skeleton';
import { toJalali } from '@/lib/jalali-utils';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDuration } from '@/lib/jalali-utils';

export default function AvailabilityPreviewPage() {
  const router = useRouter();
  const today = toJalali(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const { data: services, isLoading: loadingServices } = useTherapistServices();
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  // Auto-select first available service
  const effectiveServiceId = selectedServiceId ?? services?.find(s => s.is_available)?.id ?? 0;

  const jalaliDateString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;

  const {
    data: availability,
    isLoading,
    isError,
    error,
    refetch,
  } = useAvailability(effectiveServiceId, jalaliDateString);

  // Get slots for the selected service
  const serviceSlots = availability?.is_available && availability.slots_by_service
    ? effectiveServiceId
      ? availability.slots_by_service.find(s => s.service_id === effectiveServiceId)?.slots ?? []
      : availability.slots_by_service.flatMap(s => s.slots)
    : [];

  const handleRefresh = () => {
    refetch();
  };

  if (loadingServices) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">پیش‌نمایش زمان‌های خالی</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            مشاهده نوبت‌های قابل رزرو برای تاریخ انتخابی
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()} size="sm">
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت
        </Button>
      </div>

      {/* Date & Service Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="h-5 w-5" />
            انتخاب تاریخ و سرویس
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <JalaliDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="انتخاب تاریخ"
              className="flex-1"
            />
            <Select
              value={effectiveServiceId ? effectiveServiceId.toString() : undefined}
              onValueChange={(v) => setSelectedServiceId(Number(v))}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="انتخاب سرویس" />
              </SelectTrigger>
              <SelectContent>
                {services?.filter(s => s.is_available).map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.service_type?.name_fa}
                    {service.duration ? ` (${formatDuration(service.duration)})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="w-full sm:w-auto">
              <RefreshCw className="ml-2 h-4 w-4" />
              بروزرسانی
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {isError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8 text-center">
            <p className="text-red-800 font-semibold mb-1">خطا در دریافت اطلاعات</p>
            <p className="text-red-700 text-sm">{error?.message || 'لطفاً دوباره تلاش کنید'}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="ml-2 h-4 w-4" />
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && <PageSkeleton />}

      {/* Availability Display */}
      {!isLoading && availability && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">زمان‌های موجود</CardTitle>
            <CardDescription>
              {availability.date} {availability.day_name_fa ? `(${availability.day_name_fa})` : ''}
              {availability.working_hours && (
                <span> - ساعت کاری: {availability.working_hours.start} تا {availability.working_hours.end}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!availability.is_available ? (
              <div className="py-8 text-center text-gray-500">
                <CalendarOff className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="font-semibold mb-1">
                  {availability.reason === 'therapist_unavailable'
                    ? 'ماساژور در این تاریخ فعال نیست'
                    : availability.reason === 'no_services_configured'
                      ? 'سرویسی تنظیم نشده است'
                      : 'زمان خالی وجود ندارد'}
                </p>
              </div>
            ) : serviceSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {serviceSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={cn(
                      'rounded-lg border-2 border-green-200 bg-green-50 p-3 text-center transition-all',
                      'hover:border-green-400 hover:bg-green-100 hover:shadow-sm'
                    )}
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
              <div className="py-8 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="font-semibold mb-1">زمان خالی وجود ندارد</p>
                <p className="text-sm">برای این سرویس در این تاریخ نوبتی موجود نیست</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
