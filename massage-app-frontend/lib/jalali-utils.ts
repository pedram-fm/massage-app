/**
 * Jalali (Shamsi/Persian) Date Utilities
 * Using moment-jalaali for date conversion and manipulation
 */

import moment from 'moment-jalaali';

// Configure moment-jalaali to use Persian calendar by default
moment.loadPersian({ usePersianDigits: false });

export interface JalaliDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string;
}

/**
 * Convert Gregorian date to Jalali
 */
export function toJalali(date: Date | string): JalaliDate {
  const m = moment(date);
  return {
    year: m.jYear(),
    month: m.jMonth() + 1, // moment uses 0-based months
    day: m.jDate(),
  };
}

/**
 * Convert Jalali date to Gregorian Date object
 */
export function toGregorian(jalali: JalaliDate): Date {
  return moment(`${jalali.year}/${jalali.month}/${jalali.day}`, 'jYYYY/jM/jD').toDate();
}

/**
 * Format Jalali date to Persian string
 */
export function formatJalali(
  date: Date | string | JalaliDate,
  format: string = 'jYYYY/jMM/jDD'
): string {
  if (typeof date === 'object' && 'year' in date) {
    return moment(`${date.year}/${date.month}/${date.day}`, 'jYYYY/jM/jD').format(format);
  }
  return moment(date).format(format);
}

/**
 * Get Jalali date string in YYYY-MM-DD format for storage
 */
export function getJalaliString(date: Date | JalaliDate): string {
  if (date instanceof Date) {
    return formatJalali(date, 'jYYYY-jMM-jDD');
  }
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

/**
 * Parse Jalali string (YYYY-MM-DD) to Date
 */
export function parseJalaliString(dateString: string): Date {
  return moment(dateString, 'jYYYY-jMM-jDD').toDate();
}

/**
 * Get Jalali month names
 */
export const JALALI_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

/**
 * Get Jalali weekday names
 */
export const JALALI_WEEKDAY_NAMES = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
  'شنبه',
];

/**
 * Get short Jalali weekday names
 */
export const JALALI_WEEKDAY_SHORT = [
  'ش',
  'ی',
  'د',
  'س',
  'چ',
  'پ',
  'ج',
];

/**
 * Get month name from month number (1-12)
 */
export function getMonthName(month: number): string {
  return JALALI_MONTH_NAMES[month - 1] || '';
}

/**
 * Get weekday name from date
 */
export function getWeekdayName(date: Date): string {
  const dayIndex = moment(date).day();
  return JALALI_WEEKDAY_NAMES[dayIndex];
}

/**
 * Get today's Jalali date
 */
export function getToday(): JalaliDate {
  return toJalali(new Date());
}

/**
 * Check if two Jalali dates are equal
 */
export function isJalaliEqual(date1: JalaliDate, date2: JalaliDate): boolean {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
}

/**
 * Check if Jalali date is before another
 */
export function isJalaliBefore(date1: JalaliDate, date2: JalaliDate): boolean {
  const m1 = toGregorian(date1);
  const m2 = toGregorian(date2);
  return m1 < m2;
}

/**
 * Check if Jalali date is after another
 */
export function isJalaliAfter(date1: JalaliDate, date2: JalaliDate): boolean {
  const m1 = toGregorian(date1);
  const m2 = toGregorian(date2);
  return m1 > m2;
}

/**
 * Add days to Jalali date
 */
export function addDays(date: JalaliDate, days: number): JalaliDate {
  const gregorian = toGregorian(date);
  const newDate = moment(gregorian).add(days, 'days').toDate();
  return toJalali(newDate);
}

/**
 * Get days in Jalali month
 */
export function getDaysInMonth(year: number, month: number): number {
  return moment.jDaysInMonth(year, month - 1);
}

/**
 * Format time duration in minutes to Persian string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} دقیقه`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} ساعت`;
  }
  return `${hours} ساعت و ${mins} دقیقه`;
}

/**
 * Check if date is today
 */
export function isToday(date: JalaliDate): boolean {
  return isJalaliEqual(date, getToday());
}

/**
 * Get relative time string in Persian
 */
export function getRelativeTime(date: Date | string): string {
  const m = moment(date);
  const now = moment();
  const diffMinutes = now.diff(m.toDate(), 'minutes');
  const diffHours = now.diff(m.toDate(), 'hours');
  const diffDays = now.diff(m.toDate(), 'days');
  
  if (diffMinutes < 1) {
    return 'همین الان';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} دقیقه پیش`;
  }
  if (diffHours < 24) {
    return `${diffHours} ساعت پیش`;
  }
  if (diffDays < 7) {
    return `${diffDays} روز پیش`;
  }
  
  return formatJalali(m.toDate(), 'jYYYY/jMM/jDD');
}
