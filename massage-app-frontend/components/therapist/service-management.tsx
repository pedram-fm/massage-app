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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, DollarSign, Clock } from 'lucide-react';
import {
  useServiceTypes,
  useTherapistServices,
  useAddTherapistService,
  useUpdateTherapistService,
  useDeleteTherapistService,
} from '@/modules/shared/hooks/use-services';
import { TherapistServiceRequest } from '@/types/reservation';
import { formatDuration } from '@/lib/jalali-utils';

export function ServiceManagement() {
  const { data: serviceTypes, isLoading: loadingTypes } = useServiceTypes();
  const { data: therapistServices, isLoading: loadingServices } = useTherapistServices();
  const addService = useAddTherapistService();
  const updateService = useUpdateTherapistService();
  const deleteService = useDeleteTherapistService();

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedServiceId, setSelectedServiceId] = React.useState<number>();
  
  const [formData, setFormData] = React.useState<TherapistServiceRequest>({
    service_type_id: 0,
    is_available: true,
  });

  const handleAdd = () => {
    if (!formData.service_type_id) return;

    addService.mutate(formData, {
      onSuccess: () => {
        setAddDialogOpen(false);
        setFormData({
          service_type_id: 0,
          is_available: true,
        });
      },
    });
  };

  const handleEdit = () => {
    if (!selectedServiceId) return;

    const { service_type_id, ...updateData } = formData;
    updateService.mutate(
      { id: selectedServiceId, data: updateData },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedServiceId(undefined);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف این سرویس اطمینان دارید؟')) {
      deleteService.mutate(id);
    }
  };

  const openEditDialog = (serviceId: number) => {
    const service = therapistServices?.find((s) => s.id === serviceId);
    if (!service) return;

    setSelectedServiceId(serviceId);
    setFormData({
      service_type_id: service.service_type_id,
      duration: service.duration || undefined,
      price: service.price || undefined,
      is_available: service.is_available,
    });
    setEditDialogOpen(true);
  };

  const availableServiceTypes = serviceTypes?.filter(
    (type) =>
      !therapistServices?.some((ts) => ts.service_type_id === type.id)
  );

  if (loadingTypes || loadingServices) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>سرویس‌های من</CardTitle>
            <CardDescription>
              سرویس‌های ماساژی که ارائه می‌دهید را مدیریت کنید
            </CardDescription>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                افزودن سرویس
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>افزودن سرویس جدید</DialogTitle>
                <DialogDescription>
                  سرویس جدیدی به لیست خود اضافه کنید
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>نوع سرویس</Label>
                  <Select
                    value={formData.service_type_id?.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, service_type_id: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableServiceTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name_fa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>مدت زمان (دقیقه) - اختیاری</Label>
                  <Input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="پیش‌فرض"
                  />
                </div>

                <div className="space-y-2">
                  <Label>قیمت (تومان) - اختیاری</Label>
                  <Input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="پیش‌فرض"
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_available: checked })
                    }
                  />
                  <Label htmlFor="available">فعال</Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  انصراف
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!formData.service_type_id || addService.isPending}
                >
                  {addService.isPending && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                  افزودن
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {therapistServices && therapistServices.length > 0 ? (
          <div className="space-y-2">
            {therapistServices.map((service) => {
              const serviceType = service.service_type;
              const duration = service.duration || serviceType?.default_duration;
              const price = service.price || serviceType?.default_price;

              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{serviceType?.name_fa}</h3>
                      {!service.is_available && (
                        <Badge variant="secondary">غیرفعال</Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {duration ? formatDuration(duration) : '-'}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {price?.toLocaleString('fa-IR')} تومان
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(service.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteService.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            هیچ سرویسی اضافه نشده است
          </p>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ویرایش سرویس</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>مدت زمان (دقیقه)</Label>
                <Input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="پیش‌فرض"
                />
              </div>

              <div className="space-y-2">
                <Label>قیمت (تومان)</Label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="پیش‌فرض"
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="edit-available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_available: checked })
                  }
                />
                <Label htmlFor="edit-available">فعال</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                انصراف
              </Button>
              <Button
                onClick={handleEdit}
                disabled={updateService.isPending}
              >
                {updateService.isPending && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
                ذخیره
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
