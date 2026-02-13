import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import {
  therapistProfileService,
  UpdateProfileRequest,
} from '@/modules/shared/services/therapist-profile-service';

export function useTherapistProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['therapist', 'profile'],
    queryFn: async () => {
      const response = await therapistProfileService.getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => therapistProfileService.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['therapist', 'profile'], response.data);
      toast.success('پروفایل با موفقیت بروزرسانی شد');
    },
    onError: (error: Error) => {
      toast.error('خطا در بروزرسانی پروفایل: ' + error.message);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => therapistProfileService.uploadAvatar(file),
    onSuccess: (response) => {
      // Update profile with new avatar URL
      queryClient.setQueryData(['therapist', 'profile'], (old: any) => ({
        ...old,
        avatar_url: response.data.avatar_url,
      }));
      toast.success('تصویر پروفایل بارگذاری شد');
    },
    onError: (error: Error) => {
      toast.error('خطا در بارگذاری تصویر: ' + error.message);
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => therapistProfileService.deleteAvatar(),
    onSuccess: () => {
      // Remove avatar from profile
      queryClient.setQueryData(['therapist', 'profile'], (old: any) => ({
        ...old,
        avatar_url: null,
      }));
      toast.success('تصویر پروفایل حذف شد');
    },
    onError: (error: Error) => {
      toast.error('خطا در حذف تصویر: ' + error.message);
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    deleteAvatar: deleteAvatarMutation.mutate,
    isDeletingAvatar: deleteAvatarMutation.isPending,
  };
}
