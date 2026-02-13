'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Calendar as CalendarIcon, Phone, Mail, User } from 'lucide-react';
import {
  useTherapistServices,
} from '@/modules/shared/hooks/use-services';
import {
  useCreateAppointment,
} from '@/modules/shared/hooks/use-appointments';
import { AvailableSlotsPicker } from './available-slots-picker';
import { formatDuration } from '@/lib/jalali-utils';

interface CreateAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAppointmentModal({
  open,
  onOpenChange,
}: CreateAppointmentModalProps) {
  const { data: services, isLoading: loadingServices } = useTherapistServices();
  const createAppointment = useCreateAppointment();

  const [step, setStep] = React.useState<'service' | 'slot' | 'client'>(
    'service'
  );
  const [formData, setFormData] = React.useState({
    therapist_service_id: 0,
    appointment_date_jalali: '',
    start_time: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    notes: '',
  });

  const selectedService = services?.find(
    (s) => s.id === formData.therapist_service_id
  );
  const serviceType = selectedService?.service_type;
  const duration =
    selectedService?.duration || serviceType?.default_duration;

  const handleServiceSelect = (serviceId: string) => {
    setFormData({
      ...formData,
      therapist_service_id: Number(serviceId),
    });
  };

  const handleSlotSelect = (date: string, startTime: string) => {
    setFormData({
      ...formData,
      appointment_date_jalali: date,
      start_time: startTime,
    });
  };

  const handleSubmit = () => {
    if (
      !formData.therapist_service_id ||
      !formData.appointment_date_jalali ||
      !formData.start_time ||
      !formData.client_name ||
      !formData.client_phone
    ) {
      return;
    }

    createAppointment.mutate(
      {
        therapist_service_id: formData.therapist_service_id,
        appointment_date_jalali: formData.appointment_date_jalali,
        start_time: formData.start_time,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setFormData({
      therapist_service_id: 0,
      appointment_date_jalali: '',
      start_time: '',
      client_name: '',
      client_phone: '',
      client_email: '',
      notes: '',
    });
    setStep('service');
  };

  const canGoNext = () => {
    if (step === 'service') return formData.therapist_service_id > 0;
    if (step === 'slot')
      return formData.appointment_date_jalali && formData.start_time;
    return false;
  };

  const handleNext = () => {
    if (step === 'service') setStep('slot');
    else if (step === 'slot') setStep('client');
  };

  const handleBack = () => {
    if (step === 'client') setStep('slot');
    else if (step === 'slot') setStep('service');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>رزرو نوبت جدید</DialogTitle>
          <DialogDescription>
            {step === 'service' && 'انتخاب سرویس'}
            {step === 'slot' && 'انتخاب تاریخ و زمان'}
            {step === 'client' && 'اطلاعات مراجع'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>انتخاب سرویس</Label>
                {loadingServices ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Select
                    value={formData.therapist_service_id.toString()}
                    onValueChange={handleServiceSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {services
                        ?.filter((s) => s.is_available)
                        .map((service) => {
                          const type = service.service_type;
                          const dur =
                            service.duration || type?.default_duration;
                          const price = service.price || type?.default_price;
                          return (
                            <SelectItem
                              key={service.id}
                              value={service.id.toString()}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <span>{type?.name_fa}</span>
                                <span className="text-xs text-muted-foreground">
                                  {dur ? formatDuration(dur) : ''} -{' '}
                                  {price?.toLocaleString('fa-IR')} تومان
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedService && (
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h4 className="font-semibold mb-2">{serviceType?.name_fa}</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      مدت زمان: {duration ? formatDuration(duration) : '-'}
                    </p>
                    <p>
                      قیمت:{' '}
                      {(
                        selectedService.price ||
                        serviceType?.default_price ||
                        0
                      ).toLocaleString('fa-IR')}{' '}
                      تومان
                    </p>
                    {serviceType?.description_fa && (
                      <p className="text-muted-foreground pt-2">
                        {serviceType.description_fa}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Slot Selection */}
          {step === 'slot' && formData.therapist_service_id > 0 && (
            <AvailableSlotsPicker
              therapistServiceId={formData.therapist_service_id}
              serviceName={serviceType?.name_fa}
              duration={duration}
              onSelectSlot={handleSlotSelect}
              selectedSlot={
                formData.appointment_date_jalali && formData.start_time
                  ? {
                      date: formData.appointment_date_jalali,
                      startTime: formData.start_time,
                    }
                  : undefined
              }
            />
          )}

          {/* Step 3: Client Information */}
          {step === 'client' && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-semibold">خلاصه رزرو</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>سرویس: {serviceType?.name_fa}</p>
                  <p>تاریخ: {formData.appointment_date_jalali}</p>
                  <p>ساعت: {formData.start_time.substring(0, 5)}</p>
                  <p>مدت زمان: {duration ? formatDuration(duration) : '-'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">
                  نام مراجع <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                    placeholder="نام و نام خانوادگی"
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_phone">
                  شماره تماس <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, client_phone: e.target.value })
                    }
                    placeholder="09123456789"
                    className="pr-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">ایمیل (اختیاری)</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) =>
                      setFormData({ ...formData, client_email: e.target.value })
                    }
                    placeholder="example@email.com"
                    className="pr-10"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">یادداشت (اختیاری)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="توضیحات تکمیلی..."
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step !== 'service' && (
            <Button variant="outline" onClick={handleBack}>
              قبلی
            </Button>
          )}

          {step !== 'client' ? (
            <Button onClick={handleNext} disabled={!canGoNext()}>
              بعدی
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.client_name ||
                !formData.client_phone ||
                createAppointment.isPending
              }
            >
              {createAppointment.isPending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              ثبت رزرو
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
