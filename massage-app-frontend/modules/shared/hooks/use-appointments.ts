/**
 * API hooks for Appointment Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  Appointment,
  AvailabilityResponse,
  CreateAppointmentRequest,
  CancelAppointmentRequest,
  ApiResponse,
  AppointmentStatus,
} from '@/types/reservation';
import { toast } from '@/lib/toast';

// ====================
// Query Keys
// ====================

export const appointmentKeys = {
  all: ['appointments'] as const,
  list: (filters?: AppointmentFilters) => [...appointmentKeys.all, 'list', filters] as const,
  detail: (id: number) => [...appointmentKeys.all, 'detail', id] as const,
  availability: (therapistServiceId: number, dateJalali: string) =>
    [...appointmentKeys.all, 'availability', therapistServiceId, dateJalali] as const,
};

// ====================
// Types
// ====================

export interface AppointmentFilters {
  status?: AppointmentStatus;
  date_from?: string;
  date_to?: string;
  page?: number;
}

// ====================
// Availability Queries
// ====================

/**
 * Get available time slots for a therapist service on a specific date
 */
export function useAvailability(therapistServiceId: number, dateJalali: string) {
  return useQuery({
    queryKey: appointmentKeys.availability(therapistServiceId, dateJalali),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AvailabilityResponse>>(
        `/therapist/availability?therapist_service_id=${therapistServiceId}&date_jalali=${dateJalali}`
      );
      return response.data;
    },
    enabled: !!therapistServiceId && !!dateJalali,
  });
}

// ====================
// Appointment Queries
// ====================

/**
 * Get therapist's appointments
 */
export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.date_from) params.append('date_from', filters.date_from);
      if (filters?.date_to) params.append('date_to', filters.date_to);
      if (filters?.page) params.append('page', filters.page.toString());

      const queryString = params.toString();
      const endpoint = `/therapist/appointments${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<{ success: boolean; data: Appointment[]; meta?: { current_page: number; last_page: number; per_page: number; total: number } }>(endpoint);
      return response;
    },
  });
}

/**
 * Get single appointment details
 */
export function useAppointment(id: number) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Appointment>>(
        `/therapist/appointments/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
}

// ====================
// Appointment Mutations
// ====================

/**
 * Create new appointment
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentRequest) => {
      const response = await apiClient.post<ApiResponse<Appointment>>(
        '/therapist/appointments',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('نوبت با موفقیت رزرو شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در رزرو نوبت');
    },
  });
}

/**
 * Cancel appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data?: CancelAppointmentRequest;
    }) => {
      const response = await apiClient.patch<ApiResponse<Appointment>>(
        `/therapist/appointments/${id}`,
        { status: 'cancelled', ...data }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('نوبت با موفقیت لغو شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در لغو نوبت');
    },
  });
}

/**
 * Update appointment status
 */
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: number;
      status?: AppointmentStatus;
      notes?: string;
    }) => {
      const response = await apiClient.patch<ApiResponse<Appointment>>(
        `/therapist/appointments/${id}`,
        { status, notes }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      if (variables.status) {
        toast.success('وضعیت نوبت بروزرسانی شد');
      } else if (variables.notes !== undefined) {
        toast.success('یادداشت ذخیره شد');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در بروزرسانی');
    },
  });
}
