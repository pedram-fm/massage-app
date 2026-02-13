/**
 * TypeScript types for Reservation System
 */

// ====================
// Service Types
// ====================

export interface ServiceType {
  id: number;
  name: string;
  name_fa: string;
  description?: string;
  description_fa?: string;
  default_duration: number; // minutes
  default_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ====================
// Therapist Types
// ====================

export interface TherapistProfile {
  id: number;
  user_id: number;
  bio_fa?: string;
  bio_en?: string;
  specialties: string[];
  avatar_url?: string;
  average_rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TherapistService {
  id: number;
  therapist_profile_id: number;
  service_type_id: number;
  duration?: number;
  price?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  service_type?: ServiceType;
  therapist_profile?: TherapistProfile;
}

// ====================
// Schedule Types
// ====================

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface TherapistSchedule {
  id: number;
  therapist_profile_id: number;
  day_of_week: DayOfWeek;
  start_time: string; // HH:mm:ss
  end_time: string;
  break_duration: number; // minutes
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export enum OverrideType {
  Unavailable = 'unavailable',
  CustomHours = 'custom_hours',
}

export interface ScheduleOverride {
  id: number;
  therapist_profile_id: number;
  override_date_jalali: string; // YYYY-MM-DD
  override_date_gregorian: string; // YYYY-MM-DD
  override_type: OverrideType;
  start_time?: string; // HH:mm:ss for custom_hours
  end_time?: string;
  reason_fa?: string;
  reason_en?: string;
  created_at: string;
  updated_at: string;
}

// ====================
// Appointment Types
// ====================

export enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no_show',
}

export interface Appointment {
  id: number;
  therapist_id: number;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  therapist_service_id?: number;
  service_type?: ServiceType;
  appointment_date_jalali: string; // YYYY-MM-DD
  appointment_date_gregorian: string;
  start_time: string; // HH:mm:ss
  end_time: string;
  duration: number; // minutes
  price: number;
  status: AppointmentStatus;
  status_label?: string;
  notes?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

// ====================
// Availability Types
// ====================

export interface TimeSlot {
  start_time: string; // ISO 8601
  end_time: string;
  start_time_formatted: string; // HH:mm
  end_time_formatted: string;
  duration: number;
}

export interface ServiceSlots {
  service_id: number;
  service_name: string;
  service_name_fa: string;
  duration: number;
  price: number;
  slots: TimeSlot[];
  total_slots: number;
  has_available_slots: boolean;
}

export interface AvailabilityResponse {
  date: string; // Jalali date
  date_gregorian: string;
  is_available: boolean;
  reason?: string;
  day_of_week?: number;
  day_name_fa?: string;
  schedule_type?: string;
  working_hours?: {
    start: string;
    end: string;
  };
  slots_by_service: ServiceSlots[];
  total_services?: number;
}

// ====================
// Request/Response Types
// ====================

export interface CreateAppointmentRequest {
  therapist_service_id: number;
  appointment_date_jalali: string;
  start_time: string; // HH:mm
}

export interface CancelAppointmentRequest {
  reason?: string;
}

export interface UpdateWeeklyScheduleRequest {
  schedules: Array<{
    day_of_week: DayOfWeek;
    start_time: string; // HH:mm
    end_time: string;
    break_duration: number;
    is_active: boolean;
  }>;
}

export interface CreateOverrideRequest {
  override_date_jalali: string;
  override_type: OverrideType;
  start_time?: string; // HH:mm for custom_hours
  end_time?: string;
  reason_fa?: string;
  reason_en?: string;
}

export interface TherapistServiceRequest {
  service_type_id: number;
  duration?: number;
  price?: number;
  is_available: boolean;
}

// ====================
// API Response Wrapper
// ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
