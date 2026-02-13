/**
 * API hooks for Schedule Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  TherapistSchedule,
  ScheduleOverride,
  UpdateWeeklyScheduleRequest,
  CreateOverrideRequest,
  ApiResponse,
} from '@/types/reservation';
import { toast } from '@/lib/toast';

// ====================
// Query Keys
// ====================

export const scheduleKeys = {
  all: ['schedules'] as const,
  weekly: (therapistId?: number) => [...scheduleKeys.all, 'weekly', therapistId] as const,
  overrides: (therapistId?: number) => [...scheduleKeys.all, 'overrides', therapistId] as const,
};

// ====================
// Weekly Schedule Queries
// ====================

/**
 * Get therapist's weekly schedule
 */
export function useWeeklySchedule(therapistId?: number) {
  return useQuery({
    queryKey: scheduleKeys.weekly(therapistId),
    queryFn: async () => {
      const endpoint = '/therapist/schedule';
      const response = await apiClient.get<ApiResponse<TherapistSchedule[]>>(endpoint);
      return response.data;
    },
  });
}

/**
 * Update therapist's weekly schedule
 */
export function useUpdateWeeklySchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateWeeklyScheduleRequest) => {
      const response = await apiClient.put<ApiResponse<TherapistSchedule[]>>(
        '/therapist/schedule',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.weekly() });
      toast.success('برنامه هفتگی با موفقیت بروزرسانی شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در بروزرسانی برنامه');
    },
  });
}

// ====================
// Schedule Override Queries
// ====================

/**
 * Get therapist's schedule overrides
 */
export function useScheduleOverrides(therapistId?: number) {
  return useQuery({
    queryKey: scheduleKeys.overrides(therapistId),
    queryFn: async () => {
      const endpoint = '/therapist/schedule/overrides';
      const response = await apiClient.get<ApiResponse<ScheduleOverride[]>>(endpoint);
      return response.data;
    },
  });
}

/**
 * Create schedule override
 */
export function useCreateOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOverrideRequest) => {
      const response = await apiClient.post<ApiResponse<ScheduleOverride>>(
        '/therapist/schedule/overrides',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.overrides() });
      toast.success('استثنا با موفقیت ایجاد شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ایجاد استثنا');
    },
  });
}

/**
 * Delete schedule override
 */
export function useDeleteOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/therapist/schedule/overrides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.overrides() });
      toast.success('استثنا با موفقیت حذف شد');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در حذف استثنا');
    },
  });
}
