'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  UserX,
  Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Appointment, AppointmentStatus } from '@/types/reservation';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDuration } from '@/lib/jalali-utils';
import { useUpdateAppointmentStatus, useCancelAppointment } from '@/modules/shared/hooks/use-appointments';
import { CancelAppointmentModal } from '@/components/therapist/cancel-appointment-modal';
import { AppointmentCardSkeleton } from '@/components/ui/loading-skeleton';

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = Number(params.id);

  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<{
    open: boolean;
    action: 'confirm' | 'complete' | 'no-show' | null;
  }>({ open: false, action: null });
  const [notes, setNotes] = React.useState('');

  const { data: appointment, isLoading } = useQuery<Appointment>({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Appointment }>(
        `/therapist/appointments/${appointmentId}`
      );
      return response.data;
    },
  });

  const updateStatus = useUpdateAppointmentStatus();
  const cancelAppointment = useCancelAppointment();

  React.useEffect(() => {
    if (appointment?.notes) {
      setNotes(appointment.notes);
    }
  }, [appointment?.notes]);

  const handleStatusChange = (status: AppointmentStatus) => {
    updateStatus.mutate(
      { id: appointmentId, status, notes },
      {
        onSuccess: () => {
          setConfirmAction({ open: false, action: null });
        },
      }
    );
  };

  const handleConfirmAction = () => {
    if (!confirmAction.action) return;

    const statusMap = {
      confirm: AppointmentStatus.Confirmed,
      complete: AppointmentStatus.Completed,
      'no-show': AppointmentStatus.NoShow,
    };

    handleStatusChange(statusMap[confirmAction.action]);
  };

  const openConfirmDialog = (action: 'confirm' | 'complete' | 'no-show') => {
    setConfirmAction({ open: true, action });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">جزئیات نوبت</h1>
        </div>
        <AppointmentCardSkeleton />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">جزئیات نوبت</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <XCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg text-muted-foreground">نوبت یافت نشد</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canConfirm = appointment.status === AppointmentStatus.Pending;
  const canComplete = appointment.status === AppointmentStatus.Confirmed;
  const canCancel = [AppointmentStatus.Pending, AppointmentStatus.Confirmed].includes(
    appointment.status
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">جزئیات نوبت</h1>
            <p className="text-sm text-muted-foreground">شماره: #{appointment.id}</p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات مراجع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">نام</p>
                  <p className="font-medium">{appointment.client_name || '-'}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">شماره تماس</p>
                  <p className="font-medium" dir="ltr">
                    {appointment.client_phone || '-'}
                  </p>
                </div>
              </div>

              {appointment.client_email && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ایمیل</p>
                      <p className="font-medium" dir="ltr">
                        {appointment.client_email}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardHeader>
              <CardTitle>جزئیات رزرو</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاریخ</p>
                    <p className="font-medium">{appointment.appointment_date_jalali}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">ساعت</p>
                    <p className="font-medium">
                      {appointment.start_time?.substring(0, 5)} -{' '}
                      {appointment.end_time?.substring(0, 5)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">سرویس</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{appointment.service_type?.name_fa}</p>
                  {appointment.service_type?.description_fa && (
                    <p className="text-sm text-muted-foreground">
                      {appointment.service_type.description_fa}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">مدت زمان</p>
                  <p className="font-medium">
                    {appointment.duration ? formatDuration(appointment.duration) : '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">قیمت</p>
                  <p className="font-medium">
                    {appointment.price?.toLocaleString('fa-IR') || '-'} تومان
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>یادداشت</CardTitle>
              <CardDescription>یادداشت‌های خصوصی درمانگر</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">یادداشت</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="یادداشت‌های خود را اینجا بنویسید..."
                  rows={4}
                  disabled={appointment.status === AppointmentStatus.Cancelled}
                />
              </div>

              {notes !== (appointment.notes || '') && (
                <Button
                  onClick={() =>
                    updateStatus.mutate({ id: appointmentId, notes })
                  }
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                  ذخیره یادداشت
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Cancellation Info */}
          {appointment.status === AppointmentStatus.Cancelled && appointment.cancellation_reason && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">دلیل لغو</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{appointment.cancellation_reason}</p>
                {appointment.cancelled_at && (
                  <p className="text-sm text-muted-foreground mt-2">
                    زمان لغو: {new Date(appointment.cancelled_at).toLocaleDateString('fa-IR')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>عملیات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canConfirm && (
                <Button
                  className="w-full"
                  onClick={() => openConfirmDialog('confirm')}
                  disabled={updateStatus.isPending}
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  تأیید نوبت
                </Button>
              )}

              {canComplete && (
                <Button
                  className="w-full"
                  variant="default"
                  onClick={() => openConfirmDialog('complete')}
                  disabled={updateStatus.isPending}
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  اتمام نوبت
                </Button>
              )}

              {canComplete && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => openConfirmDialog('no-show')}
                  disabled={updateStatus.isPending}
                >
                  <UserX className="ml-2 h-4 w-4" />
                  عدم حضور
                </Button>
              )}

              {canCancel && (
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => setCancelModalOpen(true)}
                  disabled={cancelAppointment.isPending}
                >
                  <XCircle className="ml-2 h-4 w-4" />
                  لغو نوبت
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تکمیلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">تاریخ ایجاد</p>
                <p>
                  {appointment.created_at
                    ? new Date(appointment.created_at).toLocaleDateString('fa-IR')
                    : '-'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">آخرین بروزرسانی</p>
                <p>
                  {appointment.updated_at
                    ? new Date(appointment.updated_at).toLocaleDateString('fa-IR')
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelAppointmentModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        appointmentId={appointmentId}
        onSuccess={() => router.push('/therapist/appointments')}
      />

      {/* Confirm Action Dialog */}
      <AlertDialog
        open={confirmAction.open}
        onOpenChange={(open) => setConfirmAction({ open, action: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction.action === 'confirm' && 'تأیید نوبت'}
              {confirmAction.action === 'complete' && 'اتمام نوبت'}
              {confirmAction.action === 'no-show' && 'عدم حضور مراجع'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.action === 'confirm' &&
                'آیا از تأیید این نوبت اطمینان دارید؟'}
              {confirmAction.action === 'complete' &&
                'نوبت به عنوان انجام شده ثبت می‌شود. آیا مطمئن هستید؟'}
              {confirmAction.action === 'no-show' &&
                'مراجع حاضر نشده است. این عملیات قابل بازگشت نیست.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              تأیید
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
