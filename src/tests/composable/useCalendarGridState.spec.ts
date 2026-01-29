import { describe, it, expect, vi, beforeEach } from 'vitest';
import { effectScope, nextTick, ref, type Ref } from 'vue';
import type { CalendarEvent } from '@/types/types.p';
import { useCalendarGridState } from '@/composable/useCalendarGridState';

type WeekStartsOn = 0 | 1;

function toKeyUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateIso(v: Date | string): Date {
  if (v instanceof Date) return v;
  return new Date(`${v}T00:00:00.000Z`);
}

function makeEventStrict(overrides: {
  id: string;
  title?: string;
  start: CalendarEvent['start'];
  type: CalendarEvent['type'];
  amount: number;
}): CalendarEvent {
  return {
    id: overrides.id,
    title: overrides.title ?? 'Event',
    start: overrides.start,
    end: undefined,
    amount: overrides.amount,
    type: overrides.type,
    color: undefined,
  };
}

/**
 * For testing defensive branches with invalid API data.
 * No `any` – we go through `unknown` and document why.
 */
function makeEventUnsafe(e: Omit<CalendarEvent, 'amount'> & { amount: unknown }): CalendarEvent {
  return e as unknown as CalendarEvent;
}

describe('useCalendarGridState', () => {
  const buildMonthGridMock = vi.fn<(d: Date, w: WeekStartsOn) => Date[]>();

  beforeEach(() => {
    buildMonthGridMock.mockReset();
    buildMonthGridMock.mockReturnValue([
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-01-02T00:00:00.000Z'),
    ]);
  });

  function createState(params: {
    currentDate: Ref<Date>;
    events: Ref<CalendarEvent[]>;
    weekStartsOn: Ref<WeekStartsOn>;
  }) {
    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarGridState({
        currentDate: params.currentDate,
        events: params.events,
        weekStartsOn: params.weekStartsOn,
        utils: {
          buildMonthGrid: buildMonthGridMock,
          parseDate: parseDateIso,
          toKey: toKeyUtc,
        },
      }),
    );

    if (!state) throw new Error('Failed to create state');
    return { state, scope };
  }

  it('computes calendarDays with totals and ignores nullish amount', () => {
    const currentDate = ref(new Date('2026-01-01T00:00:00.000Z'));
    const weekStartsOn = ref<WeekStartsOn>(0);

    const events = ref<CalendarEvent[]>([
      makeEventStrict({ id: 'd1', start: '2026-01-01', type: 'debit', amount: 10 }),
      makeEventStrict({ id: 'c1', start: '2026-01-01', type: 'credit', amount: 20 }),

      // invalid API data: amount is null -> should be ignored by totals
      makeEventUnsafe({
        id: 'n1',
        title: 'Nullish',
        start: '2026-01-01',
        end: undefined,
        amount: null, // triggers (amount == null) branch
        type: 'debit',
        color: undefined,
      }),

      makeEventStrict({ id: 'c2', start: '2026-01-02', type: 'credit', amount: 5 }),
    ]);

    const { state, scope } = createState({ currentDate, events, weekStartsOn });

    const days = state.calendarDays.value;
    expect(days).toHaveLength(2);

    const day1 = days[0]!;
    const day2 = days[1]!;

    expect(day1.id).toBe('2026-01-01');
    expect(day1.events.map((e) => e.id)).toEqual(['d1', 'c1', 'n1']);
    expect(day1.expense).toBe(10);
    expect(day1.income).toBe(20);

    expect(day2.id).toBe('2026-01-02');
    expect(day2.events.map((e) => e.id)).toEqual(['c2']);
    expect(day2.expense).toBe(0);
    expect(day2.income).toBe(5);

    scope.stop();
  });

  it('recomputes when currentDate changes', async () => {
    const currentDate = ref(new Date('2026-01-01T00:00:00.000Z'));
    const weekStartsOn = ref<WeekStartsOn>(0);
    const events = ref<CalendarEvent[]>([]);

    const { state, scope } = createState({ currentDate, events, weekStartsOn });

    void state.gridDays.value;
    expect(buildMonthGridMock).toHaveBeenCalledWith(currentDate.value, 0);

    currentDate.value = new Date('2026-02-01T00:00:00.000Z');
    await nextTick();

    void state.gridDays.value;
    expect(buildMonthGridMock).toHaveBeenLastCalledWith(currentDate.value, 0);

    scope.stop();
  });

  it('recomputes when events change (totals update)', async () => {
    const currentDate = ref(new Date('2026-01-01T00:00:00.000Z'));
    const weekStartsOn = ref<WeekStartsOn>(0);
    const events = ref<CalendarEvent[]>([]);

    const { state, scope } = createState({ currentDate, events, weekStartsOn });

    expect(state.calendarDays.value[0]!.expense).toBe(0);

    events.value = [makeEventStrict({ id: 'd1', start: '2026-01-01', type: 'debit', amount: 99 })];
    await nextTick();

    expect(state.calendarDays.value[0]!.expense).toBe(99);
    expect(state.calendarDays.value[0]!.income).toBe(0);

    scope.stop();
  });
});
