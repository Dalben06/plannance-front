import { describe, it, expect } from 'vitest';
import {
  atNoon,
  makeDate,
  addDays,
  startOfMonth,
  isSameDay,
  toKey,
  parseDate,
  startOfWeek,
  buildMonthGrid,
  formatCurrency,
} from '@/utils/calendar-utils';

describe('calendar-utils', () => {
  it('atNoon returns a date set to 12:00 local time', () => {
    const d = new Date(2026, 0, 15, 3, 30, 45);
    const n = atNoon(d);
    expect(n.getFullYear()).toBe(2026);
    expect(n.getMonth()).toBe(0);
    expect(n.getDate()).toBe(15);
    expect(n.getHours()).toBe(12);
    expect(n.getMinutes()).toBe(0);
    expect(n.getSeconds()).toBe(0);
    expect(n.getMilliseconds()).toBe(0);
  });

  it('makeDate constructs a date at noon', () => {
    const d = makeDate(2024, 4, 3); // May 3, 2024
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(4);
    expect(d.getDate()).toBe(3);
    expect(d.getHours()).toBe(12);
  });

  it('addDays advances the date by given days', () => {
    const orig = makeDate(2025, 6, 10);
    const plus5 = addDays(orig, 5);
    expect(plus5.getDate()).toBe(15);
    // original should be unchanged (function returns new Date)
    expect(orig.getDate()).toBe(10);
  });

  it('startOfMonth returns the first day at noon', () => {
    const d = makeDate(2026, 11, 25); // Dec 25, 2026
    const s = startOfMonth(d);
    expect(s.getFullYear()).toBe(2026);
    expect(s.getMonth()).toBe(11);
    expect(s.getDate()).toBe(1);
    expect(s.getHours()).toBe(12);
  });

  it('isSameDay correctly compares dates', () => {
    const a = makeDate(2026, 0, 1);
    const b = new Date(2026, 0, 1, 23, 59);
    const c = makeDate(2026, 0, 2);
    expect(isSameDay(a, b)).toBe(true);
    expect(isSameDay(a, c)).toBe(false);
  });

  it('toKey returns YYYY-MM-DD', () => {
    const d = makeDate(1999, 9, 5); // Oct 5, 1999
    expect(toKey(d)).toBe('1999-10-05');
  });

  describe('parseDate accepts Date and ISO-like strings', () => {

    it('parse Date based all number parameters', () => {
      //arrange
      const d = new Date(2026, 2, 12, 3);
      const p1 = parseDate(d);
      //assert
      expect(p1.getFullYear()).toBe(2026);
      expect(p1.getMonth()).toBe(2);
      expect(p1.getDate()).toBe(12);
      expect(p1.getHours()).toBe(12);
    })

    it('parse date based on string YYYY-MM-DD', () => {
      const p2 = parseDate('2026-04-07');
      expect(p2.getFullYear()).toBe(2026);
      expect(p2.getMonth()).toBe(3);
      expect(p2.getDate()).toBe(7);
      expect(p2.getHours()).toBe(12);
    })

    // For non-YYYY-MM-DD strings, fallback to Date constructor then atNoon
    it('parse date based ISO format in string', () => {
      const iso = '2026-05-02T00:00:00Z';
      const p3 = parseDate(iso);
      expect(p3.getFullYear()).toBe(2026);
      expect(p3.getMonth()).toBe(4);
      expect(p3.getDate()).toBe(2);
    })

  });

  it('startOfWeek returns the week start given weekStartsOn', () => {
    // Jan 7, 2026 is a Wednesday
    const w = makeDate(2026, 0, 7);
    const sundayStart = startOfWeek(w, 0);
    expect(sundayStart.getDay()).toBe(0);
    expect(sundayStart.getDate()).toBe(4); // Jan 4, 2026

    const mondayStart = startOfWeek(w, 1);
    expect(mondayStart.getDay()).toBe(1);
    expect(mondayStart.getDate()).toBe(5); // Jan 5, 2026
  });

  it('buildMonthGrid returns 42 days starting at grid start', () => {
    const cursor = makeDate(2026, 0, 1); // Jan 2026
    const grid = buildMonthGrid(cursor, 0);
    expect(grid).toHaveLength(42);
    const first = grid[0] ?? new Date();
    // First should be the startOfWeek of startOfMonth(cursor)
    const expectedFirst = startOfWeek(startOfMonth(cursor), 0);
    expect(first.getFullYear()).toBe(expectedFirst.getFullYear());
    expect(first.getMonth()).toBe(expectedFirst.getMonth());
    expect(first.getDate()).toBe(expectedFirst.getDate());
    // Last should be 41 days after first
    const last = grid[41] ?? new Date();
    const diff = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
    expect(diff).toBe(41);
  });

  it('formatCurrency formats numbers as USD by default', () => {
    const s = formatCurrency(1234.56, 'USD');
    // Should contain the digits and decimal grouping
    expect(s).toContain('1,234.56');
    // Currency symbol may vary by environment, so we assert the numeric formatting
  });
});
