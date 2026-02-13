'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Loader2, Calendar, Clock, User, FileText } from 'lucide-react';
import {
  useAppointments,
  useCancelAppointment,
  useUpdateAppointmentStatus,
  type AppointmentFilters,
} from '@/modules/shared/hooks/use-appointments';
import { AppointmentStatus } from '@/types/reservation';
import { formatJalali, formatDuration } from '@/lib/jalali-utils';

const STATUS_TABS = [
  { value: 'all', label: 'همه', status: undefined },
  { value: 'pending', label: 'در انتظار', status: AppointmentStatus.Pending },
  { value: 'confirmed', label: 'تایید شده', status: AppointmentStatus.Confirmed },
  { value: 'completed', label: 'انجام شده', status: AppointmentStatus.Completed },
  { value: 'cancelled', label: 'لغو شده', status: AppointmentStatus.Cancelled },
];

export function AppointmentList() {
  const [filters, setFilters] = React.useState<AppointmentFilters>({});
  const { data: appointmentsData, isLoading } = useAppointments(filters);
  const cancelAppointment = useCancelAppointment();
  const updateStatus = useUpdateAppointmentStatus();

  const appointments = appointmentsData?.data || [];

  const handleStatusChange = (appointmentId: number, newStatus: AppointmentStatus) => {
    updateStatus.mutate({ id: appointmentId, status: newStatus });
  };

  const handleCancel = (appointmentId: number) => {
    if (confirm('آیا از لغو این نوبت اطمینان دارید؟')) {
      cancelAppointment.mutate({ id: appointmentId });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">نوبت‌های من</CardTitle>
        <CardDescription className="text-sm">مدیریت و پیگیری نوبت‌های رزرو شده</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          onValueChange={(value) => {
            const tab = STATUS_TABS.find((t) => t.value === value);
            setFilters({ ...filters, status: tab?.status });
          }}
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1 h-auto">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {STATUS_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const serviceType = appointment.service_type;
                  const clientName = appointment.client_name;

                  return (
                    <div
                      key={appointment.id}
                      className="rounded-lg border p-3 sm:p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-base sm:text-lg">
                              {serviceType?.name_fa}
                            </h3>
                            <StatusBadge status={appointment.status} />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                              {clientName || '-'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                              {formatDuration(appointment.duration)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-sm sm:text-base self-start">
                          {appointment.price.toLocaleString('fa-IR')} تومان
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>
                            {formatJalali(
                              appointment.appointment_date_gregorian,
                              'jYYYY/jMM/jDD'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span>
                            {appointment.start_time.substring(0, 5)} -{' '}
                            {appointment.end_time.substring(0, 5)}
                          </span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="flex items-start gap-2 rounded-md bg-muted p-2 text-xs sm:text-sm">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="break-words">{appointment.notes}</span>
                        </div>
                      )}

                      {appointment.cancellation_reason && (
                        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-2 text-xs sm:text-sm">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span className="text-destructive break-words">
                            دلیل لغو: {appointment.cancellation_reason}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                        {appointment.status === AppointmentStatus.Pending && (
                          <>
                            <Button
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() =>
                                handleStatusChange(
                                  appointment.id,
                                  AppointmentStatus.Confirmed
                                )
                              }
                            >
                              تایید
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-full sm:w-auto"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              لغو
                            </Button>
                          </>
                        )}

                        {appointment.status === AppointmentStatus.Confirmed && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full sm:w-auto text-xs sm:text-sm"
                              onClick={() =>
                                handleStatusChange(
                                  appointment.id,
                                  AppointmentStatus.Completed
                                )
                              }
                            >
                              علامت‌گذاری به عنوان انجام شده
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() =>
                                handleStatusChange(
                                  appointment.id,
                                  AppointmentStatus.NoShow
                                )
                              }
                            >
                              عدم حضور
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-full sm:w-auto"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              لغو
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  نوبتی یافت نشد
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
