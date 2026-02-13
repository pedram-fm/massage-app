/**
 * Time Utilities for Schedule Management
 */

export interface TimeRange {
  start: string; // HH:mm format
  end: string;
}

/**
 * Parse time string (HH:mm) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string (HH:mm)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Check if two time ranges overlap
 */
export function timeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
  const start1 = timeToMinutes(range1.start);
  const end1 = timeToMinutes(range1.end);
  const start2 = timeToMinutes(range2.start);
  const end2 = timeToMinutes(range2.end);

  return start1 < end2 && start2 < end1;
}

/**
 * Check if a time is within a time range
 */
export function isTimeInRange(time: string, range: TimeRange): boolean {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(range.start);
  const endMinutes = timeToMinutes(range.end);

  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
}

/**
 * Add minutes to a time string
 */
export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const totalMinutes = timeToMinutes(time) + minutesToAdd;
  return minutesToTime(totalMinutes);
}

/**
 * Calculate duration between two times in minutes
 */
export function getTimeDuration(start: string, end: string): number {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return endMinutes - startMinutes;
}

/**
 * Generate time slots for a day
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDuration: number,
  breakDuration: number = 0
): TimeRange[] {
  const slots: TimeRange[] = [];
  let currentMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  while (currentMinutes + slotDuration <= endMinutes) {
    const slotStart = minutesToTime(currentMinutes);
    const slotEnd = minutesToTime(currentMinutes + slotDuration);
    
    slots.push({ start: slotStart, end: slotEnd });
    
    currentMinutes += slotDuration + breakDuration;
  }

  return slots;
}

/**
 * Format time range to Persian string
 */
export function formatTimeRange(range: TimeRange): string {
  return `${range.start} - ${range.end}`;
}

/**
 * Validate time string format (HH:mm)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Get current time in HH:mm format
 */
export function getCurrentTime(): string {
  const now = new Date();
  return minutesToTime(now.getHours() * 60 + now.getMinutes());
}
