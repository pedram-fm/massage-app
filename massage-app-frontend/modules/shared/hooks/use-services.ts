/**
 * API hooks for Service Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  ServiceType,
  TherapistService,
  TherapistServiceRequest,
  ApiResponse,
} from '@/types/reservation';
import { toast } from '@/lib/toast';

// ====================
// Query Keys
// ====================

export const serviceKeys = {
  all: ['services'] as const,
  list: () => [...serviceKeys.all, 'list'] as const,
  therapistServices: (therapistId?: number) =>
    [...serviceKeys.all, 'therapist', therapistId] as const,
};

// ====================
// Service Type Queries
// ====================

/**
 * Get all service types (for selection)
 */
export function useServiceTypes() {
  return useQuery({
    queryKey: serviceKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ServiceType[]>>('/service-types');
      return response.data;
    },
  });
}

// ====================
// Therapist Service Queries
// ====================

/**
 * Get therapist's services
 */
export function useTherapistServices(therapistId?: number) {
  return useQuery({
    queryKey: serviceKeys.therapistServices(therapistId),
    queryFn: async () => {
      const endpoint = '/therapist/services';
      const response = await apiClient.get<ApiResponse<TherapistService[]>>(endpoint);
      return response.data;
    },
    enabled: therapistId !== undefined || therapistId === undefined, // Always enabled
  });
}

/**
 * Add service to therapist
 */
export function useAddTherapistService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TherapistServiceRequest) => {
      const response = await apiClient.post<ApiResponse<TherapistService>>(
        '/therapist/services',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.therapistServices() });
      toast.success('سرویس با موفقیت اضافه شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در افزودن سرویس');
    },
  });
}

/**
 * Update therapist service
 */
export function useUpdateTherapistService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TherapistServiceRequest>;
    }) => {
      const response = await apiClient.put<ApiResponse<TherapistService>>(
        `/therapist/services/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.therapistServices() });
      toast.success('سرویس با موفقیت بروزرسانی شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در بروزرسانی سرویس');
    },
  });
}

/**
 * Delete therapist service
 */
export function useDeleteTherapistService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/therapist/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.therapistServices() });
      toast.success('سرویس با موفقیت حذف شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در حذف سرویس');
    },
  });
}
