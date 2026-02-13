<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Domain;

enum AppointmentStatus: string
{
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';
    case COMPLETED = 'completed';
    case NO_SHOW = 'no_show';

    /**
     * Get all possible values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get label in Persian
     */
    public function label(): string
    {
        return match ($this) {
            self::CONFIRMED => 'تایید شده',
            self::CANCELLED => 'لغو شده',
            self::COMPLETED => 'انجام شده',
            self::NO_SHOW => 'حضور نداشته',
        };
    }

    /**
     * Get color for UI
     */
    public function color(): string
    {
        return match ($this) {
            self::CONFIRMED => 'blue',
            self::CANCELLED => 'red',
            self::COMPLETED => 'green',
            self::NO_SHOW => 'gray',
        };
    }

    /**
     * Check if appointment can be cancelled
     */
    public function isCancellable(): bool
    {
        return $this === self::CONFIRMED;
    }

    /**
     * Check if appointment can be marked as completed
     */
    public function canComplete(): bool
    {
        return $this === self::CONFIRMED;
    }
}
