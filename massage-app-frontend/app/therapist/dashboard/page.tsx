'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  User,
} from 'lucide-react';
import { useAppointments } from '@/modules/shared/hooks/use-appointments';
import { AppointmentStatus } from '@/types/reservation';
import { formatJalali, formatDuration } from '@/lib/jalali-utils';

export default function TherapistDashboardPage() {
  const { data: todayData, isLoading: loadingToday } = useAppointments({
    date_from: new Date().toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
  });

  const { data: upcomingData, isLoading: loadingUpcoming } = useAppointments({
    status: AppointmentStatus.Confirmed,
    date_from: new Date().toISOString().split('T')[0],
  });

  const todayAppointments = todayData?.data || [];
  const upcomingAppointments = upcomingData?.data?.slice(0, 5) || [];

  // Calculate stats
  const todayCount = todayAppointments.length;
  const todayCompleted = todayAppointments.filter(
    (a) => a.status === AppointmentStatus.Completed
  ).length;
  const todayPending = todayAppointments.filter(
    (a) => a.status === AppointmentStatus.Pending
  ).length;

  const stats = [
    {
      title: 'نوبت‌های امروز',
      value: todayCount,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'انجام شده امروز',
      value: todayCompleted,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'در انتظار تایید',
      value: todayPending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">داشبورد</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">
                      {loadingToday ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>نوبت‌های پیش‌رو</CardTitle>
            <Button variant="ghost" asChild>
              <Link href="/therapist/appointments">
                مشاهده همه
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingUpcoming ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => {
                const serviceType = appointment.service_type;
                const clientName = appointment.client_name;

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {serviceType?.name_fa}
                        </span>
                        <StatusBadge status={appointment.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {clientName || 'مراجع'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatJalali(
                            appointment.appointment_date_gregorian,
                            'jYYYY/jMM/jDD'
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.start_time.substring(0, 5)}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">
                        {appointment.price.toLocaleString('fa-IR')} تومان
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDuration(appointment.duration)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              نوبتی در دسترس نیست
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>مدیریت سریع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/therapist/schedule">
                <Calendar className="ml-2 h-4 w-4" />
                تنظیم برنامه کاری
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/therapist/services">
                <CheckCircle2 className="ml-2 h-4 w-4" />
                مدیریت سرویس‌ها
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/therapist/appointments">
                <Clock className="ml-2 h-4 w-4" />
                مشاهده نوبت‌ها
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>راهنمای سریع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>برنامه هفتگی خود را در بخش "برنامه کاری من" تنظیم کنید</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>سرویس‌های خود را اضافه کرده و قیمت‌گذاری کنید</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>نوبت‌ها را تایید کرده و پس از پایان به عنوان انجام شده علامت بزنید</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
