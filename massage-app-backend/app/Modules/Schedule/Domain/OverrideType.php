<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Domain;

enum OverrideType: string
{
    case UNAVAILABLE = 'unavailable';
    case CUSTOM_HOURS = 'custom_hours';

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
            self::UNAVAILABLE => 'تعطیل / مرخصی',
            self::CUSTOM_HOURS => 'ساعات کاری خاص',
        };
    }

    /**
     * Get description
     */
    public function description(): string
    {
        return match ($this) {
            self::UNAVAILABLE => 'این روز کاری نیست',
            self::CUSTOM_HOURS => 'ساعات کاری این روز متفاوت است',
        };
    }

    /**
     * Check if time range is required
     */
    public function requiresTimeRange(): bool
    {
        return $this === self::CUSTOM_HOURS;
    }
}
