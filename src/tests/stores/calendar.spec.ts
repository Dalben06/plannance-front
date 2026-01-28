import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import type { CalendarEvent } from '@/types/types.p';

describe('calendar store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has initial state and computed date', () => {
    const store = useCalendarStore();
    expect(store.events).toBeDefined();
    expect(Array.isArray(store.events)).toBe(true);
    expect(store.events.length).toBe(0);

    const nowMonth = new Date().getMonth();
    expect(store.month).toBe(nowMonth);
    expect(store.isLoading).toBe(false);

    // date is computed from current year and month
    expect(store.date.getMonth()).toBe(store.month);
    expect(store.date.getFullYear()).toBe(new Date().getFullYear());
  });

  it('goToday sets month to current month', () => {
    const store = useCalendarStore();
    // change month to something else
    store.month = 0 === new Date().getMonth() ? 1 : 0;
    expect(store.month).not.toBe(new Date().getMonth());

    store.goToday();
    expect(store.month).toBe(new Date().getMonth());
  });

  it('updates date when month changes', () => {
    const store = useCalendarStore();
    store.month = 3; // April
    expect(store.date.getMonth()).toBe(3);
  });

  it('calculates expenses and income correctly', () => {
    const store = useCalendarStore();

    // set some events
    // minimal shape required by the store: { amount, type }
    // use both debit and credit
    // fill events with typed CalendarEvent objects
    (store.events).splice(0, store.events.length,
      { id: 'a', title: 'A', start: new Date(), amount: 100, type: 'debit' },
      { id: 'b', title: 'B', start: new Date(), amount: 50.5, type: 'credit' },
      { id: 'c', title: 'C', start: new Date(), amount: 20.25, type: 'debit' },
    );

    expect(store.expenses).toBeCloseTo(120.25);
    expect(store.income).toBeCloseTo(50.5);

    // empty events leads to zero sums
    (store.events).splice(0, store.events.length);
    expect(store.expenses).toBe(0);
    expect(store.income).toBe(0);
  });

  it('watcher runs when month changes: clears events and toggles isLoading', async () => {
    const store = useCalendarStore();
    // pre-populate events
    (store.events as unknown as CalendarEvent[]).splice(0, store.events.length,
      { id: 'x', title: 'X', start: new Date(), amount: 10, type: 'debit' },
    );

    expect(store.events.length).toBeGreaterThan(0);

    // change month to trigger watcher
    store.month = (store.month + 1) % 12;

    // wait for watcher to run
    await nextTick();

    // watcher sets fetching via isLoading; final value should be false
    expect(store.isLoading).toBe(false);
    // getEventsFromMonth in store clears events, so expect empty
    expect(store.events.length).toBe(0);
  });
});
