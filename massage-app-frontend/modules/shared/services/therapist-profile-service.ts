import { apiClient } from '@/lib/api-client';

export interface TherapistProfile {
  id: number;
  user_id: number;
  bio?: string;
  bio_fa?: string;
  avatar?: string | null;
  avatar_url?: string | null;
  specialties: string[];
  years_of_experience?: number;
  certifications: string[];
  rating: number | string;
  total_appointments: number;
  is_accepting_clients: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  bio?: string;
  bio_fa?: string;
  specialties?: string[];
  years_of_experience?: number;
  certifications?: string[];
  is_accepting_clients?: boolean;
}

export const therapistProfileService = {
  /**
   * Get current therapist profile
   */
  async getProfile(): Promise<{ success: boolean; data: TherapistProfile }> {
    const response = await apiClient.get<{ success: boolean; data: TherapistProfile }>(
      '/therapist/profile'
    );
    return response;
  },

  /**
   * Update therapist profile
   */
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<{ success: boolean; data: TherapistProfile }> {
    const response = await apiClient.put<{ success: boolean; data: TherapistProfile }>(
      '/therapist/profile',
      data
    );
    return response;
  },

  /**
   * Upload avatar image
   */
  async uploadAvatar(file: File): Promise<{ success: boolean; data: { avatar_url: string } }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ success: boolean; data: { avatar_url: string } }>(
      '/therapist/profile/avatar',
      formData
    );

    return response;
  },

  /**
   * Delete avatar image
   */
  async deleteAvatar(): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(
      '/therapist/profile/avatar'
    );
    return response;
  },
};
