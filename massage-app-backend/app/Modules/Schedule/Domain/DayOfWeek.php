<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Domain;

enum DayOfWeek: int
{
    case SUNDAY = 0;      // یکشنبه
    case MONDAY = 1;      // دوشنبه
    case TUESDAY = 2;     // سه‌شنبه
    case WEDNESDAY = 3;   // چهارشنبه
    case THURSDAY = 4;    // پنج‌شنبه
    case FRIDAY = 5;      // جمعه
    case SATURDAY = 6;    // شنبه

    /**
     * Get all possible values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get Persian name
     */
    public function persianName(): string
    {
        return match ($this) {
            self::SUNDAY => 'یکشنبه',
            self::MONDAY => 'دوشنبه',
            self::TUESDAY => 'سه‌شنبه',
            self::WEDNESDAY => 'چهارشنبه',
            self::THURSDAY => 'پنج‌شنبه',
            self::FRIDAY => 'جمعه',
            self::SATURDAY => 'شنبه',
        };
    }

    /**
     * Get English short name
     */
    public function shortName(): string
    {
        return match ($this) {
            self::SUNDAY => 'Sun',
            self::MONDAY => 'Mon',
            self::TUESDAY => 'Tue',
            self::WEDNESDAY => 'Wed',
            self::THURSDAY => 'Thu',
            self::FRIDAY => 'Fri',
            self::SATURDAY => 'Sat',
        };
    }

    /**
     * Get from Carbon dayOfWeek (0 = Sunday)
     */
    public static function fromCarbon(int $carbonDay): self
    {
        return self::from($carbonDay);
    }

    /**
     * Check if weekend (Friday in Iran)
     */
    public function isWeekend(): bool
    {
        return $this === self::FRIDAY;
    }

    /**
     * Get next day
     */
    public function next(): self
    {
        $next = ($this->value + 1) % 7;
        return self::from($next);
    }

    /**
     * Get previous day
     */
    public function previous(): self
    {
        $prev = ($this->value - 1 + 7) % 7;
        return self::from($prev);
    }
}
