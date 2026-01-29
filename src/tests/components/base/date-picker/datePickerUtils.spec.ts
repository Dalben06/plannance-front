import { describe, it, expect } from 'vitest';
import {
  normalizeToNoon,
  formatIsoDate,
  parseDateValue,
  isSameCalendarDay,
  getMonthStart,
  addCalendarMonths,
  getWeekStart,
  buildCalendarGrid,
  getWeekdayShortLabels,
  isDateInRange,
  type WeekStartsOn,
} from '@/components/base/date-picker/datePickerUtils'; // adjust path if needed

describe('datePickerUtils', () => {
  it('normalizeToNoon sets time to 12:00:00.000', () => {
    const d = new Date(2026, 0, 15, 3, 4, 5, 6);
    const n = normalizeToNoon(d);

    expect(n.getFullYear()).toBe(2026);
    expect(n.getMonth()).toBe(0);
    expect(n.getDate()).toBe(15);
    expect(n.getHours()).toBe(12);
    expect(n.getMinutes()).toBe(0);
    expect(n.getSeconds()).toBe(0);
    expect(n.getMilliseconds()).toBe(0);
  });

  it('formatIsoDate returns YYYY-MM-DD', () => {
    const d = new Date(2026, 0, 5, 12, 0, 0);
    expect(formatIsoDate(d)).toBe('2026-01-05');
  });

  it('parseDateValue parses ISO string and normalizes to noon', () => {
    const d = parseDateValue('2026-01-05');
    expect(d).not.toBeNull();
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(0);
    expect(d?.getDate()).toBe(5);
    expect(d?.getHours()).toBe(12);
  });

  it('parseDateValue clones and normalizes Date input', () => {
    const input = new Date(2026, 1, 2, 1, 2, 3);
    const d = parseDateValue(input);

    expect(d).not.toBeNull();
    expect(d).not.toBe(input);
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(1);
    expect(d?.getDate()).toBe(2);
    expect(d?.getHours()).toBe(12);
  });

  it('parseDateValue returns null for invalid values', () => {
    expect(parseDateValue(null)).toBeNull();
    expect(parseDateValue(undefined)).toBeNull();
    expect(parseDateValue('not-a-date')).toBeNull();
    expect(parseDateValue('2026-13-01')).toBeNull();
  });

  it('isSameCalendarDay compares by date only', () => {
    const a = new Date(2026, 0, 10, 1, 0, 0);
    const b = new Date(2026, 0, 10, 23, 0, 0);
    const c = new Date(2026, 0, 11, 12, 0, 0);

    expect(isSameCalendarDay(a, b)).toBe(true);
    expect(isSameCalendarDay(a, c)).toBe(false);
  });

  it('getMonthStart returns first day of month at noon', () => {
    const d = new Date(2026, 5, 20, 9, 0, 0);
    const start = getMonthStart(d);

    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(5);
    expect(start.getDate()).toBe(1);
    expect(start.getHours()).toBe(12);
  });

  it('addCalendarMonths moves month cursor correctly', () => {
    const d = new Date(2026, 0, 15, 12, 0, 0); // Jan
    const next = addCalendarMonths(d, 1);
    const prev = addCalendarMonths(d, -1);

    expect(next.getMonth()).toBe(1); // Feb
    expect(next.getDate()).toBe(1);
    expect(prev.getMonth()).toBe(11); // Dec
    expect(prev.getFullYear()).toBe(2025);
  });

  it('getWeekStart returns Sunday when weekStartsOn=0 and Monday when weekStartsOn=1', () => {
    // Jan 15, 2026 is Thursday
    const d = new Date(2026, 0, 15, 12, 0, 0);

    const sun = getWeekStart(d, 0);
    const mon = getWeekStart(d, 1);

    expect(sun.getDay()).toBe(0);
    expect(mon.getDay()).toBe(1);
  });

  it('buildCalendarGrid returns 42 days and starts at week start for the month', () => {
    const cursor = new Date(2026, 0, 10, 12, 0, 0); // Jan 2026
    const weekStartsOn: WeekStartsOn = 0;

    const grid = buildCalendarGrid(cursor, weekStartsOn);

    expect(grid.length).toBe(42);
    expect(grid[0]?.getDay()).toBe(0); // Sunday
    // all normalized
    expect(grid.every((d) => d.getHours() === 12)).toBe(true);
  });

  it('getWeekdayShortLabels supports (weekStartsOn) overload', () => {
    const labels = getWeekdayShortLabels(0);
    expect(labels.length).toBe(7);
    expect(labels.every((x) => typeof x === 'string')).toBe(true);
  });

  it('getWeekdayShortLabels supports (region, weekStartsOn) and rotates correctly', () => {
    const enSun = getWeekdayShortLabels('en-US', 0);
    const enMon = getWeekdayShortLabels('en-US', 1);

    expect(enSun.length).toBe(7);
    expect(enMon.length).toBe(7);

    // Rotation: Monday-first should start with the second element of Sunday-first
    expect(enMon[0]).toBe(enSun[1]);
    expect(enMon[6]).toBe(enSun[0]);
  });

  it('isDateInRange checks min/max boundaries', () => {
    const min = parseDateValue('2026-01-10');
    const max = parseDateValue('2026-01-20');
    const inside = parseDateValue('2026-01-15');
    const before = parseDateValue('2026-01-05');
    const after = parseDateValue('2026-01-25');

    expect(min).not.toBeNull();
    expect(max).not.toBeNull();
    expect(inside).not.toBeNull();
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();

    expect(isDateInRange(inside as Date, min, max)).toBe(true);
    expect(isDateInRange(before as Date, min, max)).toBe(false);
    expect(isDateInRange(after as Date, min, max)).toBe(false);
  });
});
