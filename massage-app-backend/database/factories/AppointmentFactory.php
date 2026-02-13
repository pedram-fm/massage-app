<?php

namespace Database\Factories;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Service\Domain\ServiceType;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Appointment\Domain\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Appointment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $duration = $this->faker->randomElement([30, 60, 90, 120]);
        $endTime = (clone $startTime)->modify("+{$duration} minutes");

        return [
            'therapist_id' => User::factory(),
            'client_name' => $this->faker->name,
            'client_phone' => $this->faker->numerify('09#########'),
            'client_email' => $this->faker->optional()->email,
            'service_type_id' => ServiceType::factory(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration' => $duration,
            'price' => $this->faker->numberBetween(300000, 2000000),
            'status' => AppointmentStatus::CONFIRMED,
            'notes' => $this->faker->optional()->sentence(),
            'cancellation_reason' => null,
            'cancelled_at' => null,
        ];
    }

    /**
     * Indicate that the appointment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::PENDING,
        ]);
    }

    /**
     * Indicate that the appointment is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::CONFIRMED,
        ]);
    }

    /**
     * Indicate that the appointment is completed.
     */
    public function completed(): static
    {
        $startTime = $this->faker->dateTimeBetween('-30 days', '-1 day');
        $duration = $this->faker->randomElement([30, 60, 90, 120]);
        $endTime = (clone $startTime)->modify("+{$duration} minutes");

        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::COMPLETED,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);
    }

    /**
     * Indicate that the appointment is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::CANCELLED,
            'cancellation_reason' => $this->faker->sentence(),
            'cancelled_at' => now(),
        ]);
    }

    /**
     * Indicate that the appointment is no-show.
     */
    public function noShow(): static
    {
        $startTime = $this->faker->dateTimeBetween('-7 days', '-1 day');
        $duration = $this->faker->randomElement([30, 60, 90, 120]);
        $endTime = (clone $startTime)->modify("+{$duration} minutes");

        return $this->state(fn (array $attributes) => [
            'status' => AppointmentStatus::NO_SHOW,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);
    }

    /**
     * Indicate that the appointment is for a specific therapist.
     */
    public function forTherapist(User $therapist): static
    {
        return $this->state(fn (array $attributes) => [
            'therapist_id' => $therapist->id,
        ]);
    }

    /**
     * Indicate that the appointment is for a specific service.
     */
    public function forService(ServiceType $service): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type_id' => $service->id,
        ]);
    }

    /**
     * Indicate that the appointment is today.
     */
    public function today(): static
    {
        $hour = $this->faker->numberBetween(9, 18);
        $startTime = now()->setTime($hour, 0, 0);
        $duration = $this->faker->randomElement([30, 60, 90, 120]);
        $endTime = (clone $startTime)->modify("+{$duration} minutes");

        return $this->state(fn (array $attributes) => [
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration' => $duration,
        ]);
    }

    /**
     * Indicate that the appointment is in the past.
     */
    public function past(): static
    {
        $startTime = $this->faker->dateTimeBetween('-30 days', '-1 day');
        $duration = $this->faker->randomElement([30, 60, 90, 120]);
        $endTime = (clone $startTime)->modify("+{$duration} minutes");

        return $this->state(fn (array $attributes) => [
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration' => $duration,
        ]);
    }

    /**
     * Indicate that the appointment is in the future.
     */
    public function future(): static
    {
        $startTime = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $duration = $this->faker->randomElement([30, 60, 90, 120]);
        $endTime = (clone $startTime)->modify("+{$duration} minutes");

        return $this->state(fn (array $attributes) => [
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration' => $duration,
        ]);
    }
}
