import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns";

const CUTOFF_HOUR = 12;

/**
 * Returns the earliest valid delivery date based on the current moment.
 * Before 12pm → today + 2 days
 * After 12pm  → today + 3 days
 */
export function getEarliestDeliveryDate(): Date {
  const now = new Date();
  const leadDays = now.getHours() >= CUTOFF_HOUR ? 3 : 2;
  return startOfDay(addDays(now, leadDays));
}

/**
 * Returns true if the given date is a valid delivery date.
 */
export function isValidDeliveryDate(date: Date): boolean {
  const earliest = getEarliestDeliveryDate();
  return !isBefore(startOfDay(date), earliest);
}

/**
 * Returns a function suitable for react-day-picker's disabled prop.
 * Disables all dates before the earliest valid delivery date.
 */
export function getDisabledDays(): (date: Date) => boolean {
  const earliest = getEarliestDeliveryDate();
  return (date: Date) => isBefore(startOfDay(date), earliest);
}

/**
 * Formats a date as YYYY-MM-DD for the Web App
 */
export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Formats a date as human readable e.g. "Thursday 10 July 2026"
 */
export function toDateStr(date: Date): string {
  return format(date, "EEEE d MMMM yyyy");
}

/**
 * Returns a friendly label for the earliest delivery date
 */
export function getEarliestLabel(): string {
  return format(getEarliestDeliveryDate(), "EEE d MMM");
}
