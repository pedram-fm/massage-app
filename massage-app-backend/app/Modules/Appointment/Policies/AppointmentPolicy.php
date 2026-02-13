<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Policies;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Users\Models\User;

class AppointmentPolicy
{
    /**
     * Determine if the user can view any appointments
     */
    public function viewAny(User $user): bool
    {
        // Therapists can view their own appointments
        // Admins can view all appointments
        return $user->isMassageTherapist() || $user->isAdmin();
    }

    /**
     * Determine if the user can view the appointment
     */
    public function view(User $user, Appointment $appointment): bool
    {
        // Therapist can view their own appointments
        if ($user->isMassageTherapist() && $appointment->therapist_id === $user->id) {
            return true;
        }

        // Admin can view all appointments
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can create appointments
     */
    public function create(User $user): bool
    {
        // Therapists can create appointments for themselves
        if ($user->isMassageTherapist()) {
            // Check if therapist profile exists and is active
            $profile = \App\Modules\Therapist\Domain\TherapistProfile::where('user_id', $user->id)->first();
            return $profile && $profile->is_accepting_clients;
        }

        // Admins can create appointments for any therapist
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can update the appointment
     */
    public function update(User $user, Appointment $appointment): bool
    {
        // Cannot update cancelled appointments
        if ($appointment->status === AppointmentStatus::CANCELLED) {
            return false;
        }

        // Therapist can update their own appointments if not completed
        if ($user->isMassageTherapist() && $appointment->therapist_id === $user->id) {
            return $appointment->status !== AppointmentStatus::COMPLETED;
        }

        // Admin can update any appointment that's not completed
        if ($user->isAdmin()) {
            return $appointment->status !== AppointmentStatus::COMPLETED;
        }

        return false;
    }

    /**
     * Determine if the user can cancel the appointment
     */
    public function cancel(User $user, Appointment $appointment): bool
    {
        // Cannot cancel already cancelled or completed appointments
        if (in_array($appointment->status, [AppointmentStatus::CANCELLED, AppointmentStatus::COMPLETED])) {
            return false;
        }

        // Therapist can cancel their own appointments
        if ($user->isMassageTherapist() && $appointment->therapist_id === $user->id) {
            return true;
        }

        // Admin can cancel any appointment
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can complete the appointment
     */
    public function complete(User $user, Appointment $appointment): bool
    {
        // Can only complete confirmed appointments
        if ($appointment->status !== AppointmentStatus::CONFIRMED) {
            return false;
        }

        // Appointment must be in the past
        if ($appointment->end_time->isFuture()) {
            return false;
        }

        // Therapist can complete their own appointments
        if ($user->isMassageTherapist() && $appointment->therapist_id === $user->id) {
            return true;
        }

        // Admin can complete any appointment
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can delete the appointment
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        // Only admins can permanently delete appointments
        if ($user->isAdmin()) {
            return true;
        }

        // Therapists cannot delete, only cancel
        return false;
    }

    /**
     * Determine if the user can restore the appointment
     */
    public function restore(User $user, Appointment $appointment): bool
    {
        // Only admins can restore appointments
        return $user->isAdmin();
    }

    /**
     * Determine if the user can permanently delete the appointment
     */
    public function forceDelete(User $user, Appointment $appointment): bool
    {
        // Only admins can force delete
        return $user->isAdmin();
    }
}
