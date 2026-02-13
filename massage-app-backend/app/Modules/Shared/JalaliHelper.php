<?php

declare(strict_types=1);

namespace App\Modules\Shared;

use Carbon\Carbon;
use DateTime;

/**
 * Minimal Jalali (Shamsi/Persian) date converter.
 * Drop-in helper when hekmatinasser/verta is unavailable.
 *
 * Algorithm based on the well-known Jalali ↔ Gregorian conversion
 * (Kazimierz M. Borkowski's algorithm, adapted).
 */
class JalaliHelper
{
    // ── Jalali → Gregorian ──────────────────────────────────────

    /**
     * Convert a Jalali date string to a Carbon/DateTime instance.
     *
     * @param string $jalaliDate  e.g. "1404-11-25" or "1404/11/25"
     * @param string $format      Input format ("Y-m-d" supported)
     * @return Carbon
     */
    public static function jalaliToGregorian(string $jalaliDate, string $format = 'Y-m-d'): Carbon
    {
        $normalized = str_replace('/', '-', trim($jalaliDate));
        [$jy, $jm, $jd] = array_map('intval', explode('-', $normalized));

        [$gy, $gm, $gd] = self::jalToGreg($jy, $jm, $jd);

        return Carbon::createFromDate($gy, $gm, $gd)->startOfDay();
    }

    // ── Gregorian → Jalali ──────────────────────────────────────

    /**
     * Convert a Carbon/DateTime to a Jalali date string.
     *
     * @param Carbon|DateTime $date
     * @param string $format  "Y-m-d" | "Y/m/d"
     * @return string
     */
    public static function gregorianToJalali(Carbon|DateTime $date, string $format = 'Y-m-d'): string
    {
        $carbon = $date instanceof DateTime ? Carbon::instance($date) : $date;
        [$jy, $jm, $jd] = self::gregToJal((int)$carbon->year, (int)$carbon->month, (int)$carbon->day);

        $separator = str_contains($format, '/') ? '/' : '-';

        return sprintf('%04d%s%02d%s%02d', $jy, $separator, $jm, $separator, $jd);
    }

    // ── Start / End of Jalali month ─────────────────────────────

    /**
     * Get a Carbon instance for the start of a given Jalali month.
     *
     * @param int $jy Jalali year
     * @param int $jm Jalali month (1-12)
     * @return Carbon
     */
    public static function startOfJalaliMonth(int $jy, int $jm): Carbon
    {
        return self::jalaliToGregorian(sprintf('%04d-%02d-01', $jy, $jm));
    }

    /**
     * Get a Carbon instance for the end of a given Jalali month.
     *
     * @param int $jy Jalali year
     * @param int $jm Jalali month (1-12)
     * @return Carbon
     */
    public static function endOfJalaliMonth(int $jy, int $jm): Carbon
    {
        $daysInMonth = self::jalaliDaysInMonth($jy, $jm);
        return self::jalaliToGregorian(sprintf('%04d-%02d-%02d', $jy, $jm, $daysInMonth))
            ->endOfDay();
    }

    /**
     * Parse a Jalali "Y-m" string and return [startOfMonth, endOfMonth] Carbon pair.
     */
    public static function parseJalaliMonth(string $jalaliMonth): array
    {
        $normalized = str_replace('/', '-', trim($jalaliMonth));
        [$jy, $jm] = array_map('intval', explode('-', $normalized));

        return [
            self::startOfJalaliMonth($jy, $jm),
            self::endOfJalaliMonth($jy, $jm),
        ];
    }

    // ── Utilities ───────────────────────────────────────────────

    public static function jalaliDaysInMonth(int $jy, int $jm): int
    {
        if ($jm <= 6) return 31;
        if ($jm <= 11) return 30;
        return self::isJalaliLeap($jy) ? 30 : 29;
    }

    public static function isJalaliLeap(int $jy): bool
    {
        $leaps = [1, 5, 9, 13, 17, 22, 26, 30];
        return in_array($jy % 33, $leaps);
    }

    // ── Core algorithms ─────────────────────────────────────────

    /**
     * Jalali → Gregorian  [jy,jm,jd] → [gy,gm,gd]
     */
    private static function jalToGreg(int $jy, int $jm, int $jd): array
    {
        $jy -= 979;
        $jm -= 1;
        $jd -= 1;

        $jDayNo = 365 * $jy + intdiv($jy, 33) * 8 + intdiv($jy % 33 + 3, 4);

        for ($i = 0; $i < $jm; $i++) {
            $jDayNo += ($i < 6) ? 31 : 30;
        }
        $jDayNo += $jd;

        $gDayNo = $jDayNo + 79;

        $gy = 1600 + 400 * intdiv($gDayNo, 146097);
        $gDayNo %= 146097;

        $leap = true;
        if ($gDayNo >= 36525) {
            $gDayNo--;
            $gy += 100 * intdiv($gDayNo, 36524);
            $gDayNo %= 36524;

            if ($gDayNo >= 365) {
                $gDayNo++;
            } else {
                $leap = false;
            }
        }

        $gy += 4 * intdiv($gDayNo, 1461);
        $gDayNo %= 1461;

        if ($gDayNo >= 366) {
            $leap = false;
            $gDayNo--;
            $gy += intdiv($gDayNo, 365);
            $gDayNo %= 365;
        }

        $gDaysInMonth = [31, ($leap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        $gm = 0;
        for ($i = 0; $i < 12 && $gDayNo >= $gDaysInMonth[$i]; $i++) {
            $gDayNo -= $gDaysInMonth[$i];
            $gm++;
        }

        return [$gy, $gm + 1, $gDayNo + 1];
    }

    /**
     * Gregorian → Jalali  [gy,gm,gd] → [jy,jm,jd]
     * Based on jdf.scr.ir algorithm.
     */
    private static function gregToJal(int $gy, int $gm, int $gd): array
    {
        $g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

        if ($gy > 1600) {
            $jy = 979;
            $gy -= 1600;
        } else {
            $jy = 0;
            $gy -= 621;
        }

        $gy2 = ($gm > 2) ? ($gy + 1) : $gy;
        $days = (365 * $gy) + intdiv($gy2 + 3, 4) - intdiv($gy2 + 99, 100) + intdiv($gy2 + 399, 400) - 80 + $gd + $g_d_m[$gm - 1];

        $jy += 33 * intdiv($days, 12053);
        $days %= 12053;

        $jy += 4 * intdiv($days, 1461);
        $days %= 1461;

        if ($days > 365) {
            $jy += intdiv($days - 1, 365);
            $days = ($days - 1) % 365;
        }

        $jm = ($days < 186) ? 1 + intdiv($days, 31) : 7 + intdiv($days - 186, 30);
        $jd = 1 + (($days < 186) ? ($days % 31) : (($days - 186) % 30));

        return [$jy, $jm, $jd];
    }

    private static function isGregorianLeap(int $gy): bool
    {
        return ($gy % 4 === 0 && $gy % 100 !== 0) || ($gy % 400 === 0);
    }
}
