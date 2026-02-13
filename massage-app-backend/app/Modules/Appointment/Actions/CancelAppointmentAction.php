<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Actions;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use Carbon\Carbon;

class CancelAppointmentAction
{
    /**
     * Cancel an appointment
     *
     * @param int $appointmentId
     * @param string|null $reason
     * @param int|null $cancelledBy User ID who cancelled (therapist or admin)
     * @return Appointment
     * @throws \Exception
     */
    public function execute(
        int $appointmentId,
        ?string $reason = null,
        ?int $cancelledBy = null
    ): Appointment {
        $appointment = Appointment::findOrFail($appointmentId);

        // Check if can be cancelled
        if (!$appointment->canBeCancelled()) {
            throw new \Exception('این رزرو قابل لغو نیست.');
        }

        // Cancel
        $appointment->update([
            'status' => AppointmentStatus::CANCELLED,
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);

        // (Optional) Calculate refund based on cancellation policy
        // $refundAmount = $this->calculateRefund($appointment);

        // (Optional) Notify client
        // event(new AppointmentCancelled($appointment));

        // (Optional) Check waitlist
        // dispatch(new NotifyWaitlistJob($appointment));

        return $appointment->fresh();
    }

    /**
     * Calculate refund amount based on cancellation time
     *
     * @param Appointment $appointment
     * @return int Refund amount in Toman
     */
    public function calculateRefund(Appointment $appointment): int
    {
        $hoursUntilAppointment = now()->diffInHours($appointment->start_time, false);

        // More than 24 hours: full refund
        if ($hoursUntilAppointment >= 24) {
            return $appointment->price;
        }

        // 6-24 hours: 50% refund
        if ($hoursUntilAppointment >= 6) {
            return (int) ($appointment->price * 0.5);
        }

        // Less than 6 hours: no refund
        return 0;
    }

    /**
     * Get cancellation policy text
     *
     * @param Appointment $appointment
     * @return array
     */
    public function getCancellationPolicy(Appointment $appointment): array
    {
        $hoursUntil = now()->diffInHours($appointment->start_time, false);

        if ($hoursUntil < 0) {
            return [
                'can_cancel' => false,
                'refund_percentage' => 0,
                'refund_amount' => 0,
                'message' => 'رزرو گذشته قابل لغو نیست',
            ];
        }

        if ($hoursUntil >= 24) {
            return [
                'can_cancel' => true,
                'refund_percentage' => 100,
                'refund_amount' => $appointment->price,
                'message' => 'بیش از 24 ساعت تا رزرو: استرداد کامل',
            ];
        }

        if ($hoursUntil >= 6) {
            return [
                'can_cancel' => true,
                'refund_percentage' => 50,
                'refund_amount' => (int) ($appointment->price * 0.5),
                'message' => '6 تا 24 ساعت تا رزرو: استرداد 50%',
            ];
        }

        return [
            'can_cancel' => true,
            'refund_percentage' => 0,
            'refund_amount' => 0,
            'message' => 'کمتر از 6 ساعت تا رزرو: بدون استرداد',
        ];
    }

    /**
     * Bulk cancel appointments
     *
     * @param array $appointmentIds
     * @param string|null $reason
     * @return int Number of cancelled appointments
     */
    public function cancelMultiple(array $appointmentIds, ?string $reason = null): int
    {
        $cancelled = 0;

        foreach ($appointmentIds as $id) {
            try {
                $this->execute($id, $reason);
                $cancelled++;
            } catch (\Exception $e) {
                // Log error but continue
                \Log::warning("Failed to cancel appointment {$id}: " . $e->getMessage());
            }
        }

        return $cancelled;
    }
}
