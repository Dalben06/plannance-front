import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import type { CalendarDay } from '@/types/types.p';
import { getMouthEvents } from '@/api/calendar';

vi.mock('@/api/calendar', () => ({
  getMouthEvents: vi.fn(),
}));

function makeDay(overrides: Partial<CalendarDay> = {}): CalendarDay {
  return {
    id: overrides.id ?? 'd1',
    date: overrides.date ?? '2026-01-01',
    events: overrides.events ?? [],
    expense: overrides.expense ?? 0,
    income: overrides.income ?? 0,
  };
}

describe('calendar store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(getMouthEvents).mockResolvedValue([]);
  });

  it('has initial state and computed date', () => {
    const store = useCalendarStore();

    expect(Array.isArray(store.days)).toBe(true);
    expect(store.days.length).toBe(0);

    const now = new Date();
    expect(store.month).toBe(now.getMonth());
    expect(store.isLoading).toBe(false);
    expect(store.date.getMonth()).toBe(store.month);
    expect(store.date.getFullYear()).toBe(now.getFullYear());
  });

  it('goToday sets date/month back to current date', () => {
    const store = useCalendarStore();
    const nowMonth = new Date().getMonth();
    const otherMonth = nowMonth === 0 ? 1 : 0;

    store.date = new Date(new Date().getFullYear(), otherMonth, 1);
    expect(store.month).toBe(otherMonth);

    store.goToday();
    expect(store.month).toBe(nowMonth);
  });

  it('getEventsFromMonth calls API with YYYY-MM and updates days', async () => {
    const store = useCalendarStore();
    const apiDays = [makeDay({ id: 'april', date: '2026-04-01', expense: 20, income: 30 })];
    const expectedYearMonth = `${store.date.getFullYear()}-${String(store.date.getMonth() + 1).padStart(2, '0')}`;

    vi.mocked(getMouthEvents).mockResolvedValueOnce(apiDays);

    await store.getEventsFromMonth();

    expect(getMouthEvents).toHaveBeenCalledWith(expectedYearMonth);
    expect(store.days).toEqual(apiDays);
  });

  it('calculates expenses and income from day summaries', () => {
    const store = useCalendarStore();

    store.days = [
      makeDay({ id: 'a', expense: 100, income: 50.5 }),
      makeDay({ id: 'b', expense: 20.25, income: 10 }),
    ];

    expect(store.expenses).toBeCloseTo(120.25);
    expect(store.income).toBeCloseTo(60.5);

    store.days = [];
    expect(store.expenses).toBe(0);
    expect(store.income).toBe(0);
  });

  it('watcher fetches days on month change and toggles isLoading', async () => {
    const store = useCalendarStore();
    const fetchedDays = [makeDay({ id: 'fetched', date: '2030-03-01', expense: 11, income: 22 })];

    let resolveFetch: ((days: CalendarDay[]) => void) | undefined;
    vi.mocked(getMouthEvents).mockImplementationOnce(
      () =>
        new Promise<CalendarDay[]>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const nextMonth = (store.month + 1) % 12;
    store.date = new Date(2030, nextMonth, 1);
    await nextTick();

    expect(store.isLoading).toBe(true);
    expect(getMouthEvents).toHaveBeenCalledWith(`2030-${String(nextMonth + 1).padStart(2, '0')}`);

    resolveFetch?.(fetchedDays);
    await Promise.resolve();
    await nextTick();

    expect(store.isLoading).toBe(false);
    expect(store.days).toEqual(fetchedDays);
  });
});
