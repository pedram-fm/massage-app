<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Policies;

use App\Modules\Schedule\Domain\ScheduleOverride;
use App\Modules\Schedule\Domain\TherapistSchedule;
use App\Modules\Users\Models\User;
use Carbon\Carbon;

class SchedulePolicy
{
    /**
     * Determine if the user can view any schedules
     */
    public function viewAny(User $user): bool
    {
        // Therapists can view their own schedules
        // Admins can view all schedules
        return $user->isMassageTherapist() || $user->isAdmin();
    }

    /**
     * Determine if the user can view the schedule
     */
    public function view(User $user, TherapistSchedule $schedule): bool
    {
        // Therapist can view their own schedule
        if ($user->isMassageTherapist() && $schedule->therapist_id === $user->id) {
            return true;
        }

        // Admin can view all schedules
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can create schedules
     */
    public function create(User $user): bool
    {
        // Therapists can create their own schedules
        if ($user->isMassageTherapist()) {
            return true;
        }

        // Admins can create schedules for any therapist
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can update the schedule
     */
    public function update(User $user, TherapistSchedule $schedule): bool
    {
        // Therapist can update their own schedule
        if ($user->isMassageTherapist() && $schedule->therapist_id === $user->id) {
            return true;
        }

        // Admin can update any schedule
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can delete the schedule
     */
    public function delete(User $user, TherapistSchedule $schedule): bool
    {
        // Therapist can delete their own schedule
        if ($user->isMassageTherapist() && $schedule->therapist_id === $user->id) {
            return true;
        }

        // Admin can delete any schedule
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can view schedule overrides
     */
    public function viewOverrides(User $user, int $therapistId): bool
    {
        // Therapist can view their own overrides
        if ($user->isMassageTherapist() && $user->id === $therapistId) {
            return true;
        }

        // Admin can view all overrides
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can create schedule overrides
     */
    public function createOverride(User $user, int $therapistId): bool
    {
        // Therapist can create overrides for themselves
        if ($user->isMassageTherapist() && $user->id === $therapistId) {
            return true;
        }

        // Admin can create overrides for any therapist
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can update schedule override
     */
    public function updateOverride(User $user, ScheduleOverride $override): bool
    {
        // Cannot update past overrides
        if (Carbon::parse($override->override_date)->isPast()) {
            return false;
        }

        // Therapist can update their own overrides
        if ($user->isMassageTherapist() && $override->therapist_id === $user->id) {
            return true;
        }

        // Admin can update any override
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the user can delete schedule override
     */
    public function deleteOverride(User $user, ScheduleOverride $override): bool
    {
        // Cannot delete past overrides
        if (Carbon::parse($override->override_date)->isPast()) {
            return false;
        }

        // Check if there are confirmed appointments on this override date
        $hasAppointments = \DB::table('appointments')
            ->where('therapist_id', $override->therapist_id)
            ->whereDate('start_time', $override->override_date)
            ->whereIn('status', ['confirmed'])
            ->exists();

        if ($hasAppointments) {
            return false;
        }

        // Therapist can delete their own overrides
        if ($user->isMassageTherapist() && $override->therapist_id === $user->id) {
            return true;
        }

        // Admin can delete any override
        if ($user->isAdmin()) {
            return true;
        }

        return false;
    }
}
