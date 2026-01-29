import { computed, unref, type ComputedRef, type Ref } from 'vue';
import type { CalendarDay, CalendarEvent, WeekStartsOn } from '@/types/types.p';
import { buildMonthGrid, parseDate, toKey } from '@/utils/calendar-utils';


export type CalendarGridUtils = {
  buildMonthGrid: (date: Date, weekStartsOn: WeekStartsOn) => Date[];
  parseDate: (value: Date | string) => Date;
  toKey: (date: Date) => string;
};

export type Totals = { expense: number; income: number };

const defaultUtils: CalendarGridUtils = {
  buildMonthGrid,
  parseDate,
  toKey,
};

export function groupEventsByDay(
  items: readonly CalendarEvent[],
  utils: Pick<CalendarGridUtils, 'parseDate' | 'toKey'> = defaultUtils,
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();

  for (const ev of items) {
    const key = utils.toKey(utils.parseDate(ev.start));
    const bucket = map.get(key);
    if (bucket) bucket.push(ev);
    else map.set(key, [ev]);
  }

  return map;
}

export function computeTotals(items: readonly CalendarEvent[]): Totals {
  return items.reduce<Totals>(
    (acc, e) => {
      // defensive (API/edge) even if type says number
      if (e.amount == null) return acc;

      if (e.type === 'debit') acc.expense += e.amount;
      if (e.type === 'credit') acc.income += e.amount;
      return acc;
    },
    { expense: 0, income: 0 },
  );
}

export function buildCalendarDays(
  grid: readonly Date[],
  byDay: Map<string, CalendarEvent[]>,
  toKeyFn: CalendarGridUtils['toKey'],
): CalendarDay[] {
  return grid.map((dayDate) => {
    const key = toKeyFn(dayDate);
    const dayEvents = byDay.get(key) ?? [];
    const { expense, income } = computeTotals(dayEvents);

    return {
      id: key,
      date: dayDate,
      events: dayEvents,
      expense,
      income,
    };
  });
}

export function useCalendarGridState(params: {
  currentDate: Ref<Date>;
  events: Ref<CalendarEvent[]>;
  weekStartsOn: Ref<WeekStartsOn> | WeekStartsOn;
  utils?: Partial<CalendarGridUtils>;
}): {
  gridDays: ComputedRef<Date[]>;
  eventsByDay: ComputedRef<Map<string, CalendarEvent[]>>;
  calendarDays: ComputedRef<CalendarDay[]>;
} {
  const utils: CalendarGridUtils = { ...defaultUtils, ...(params.utils ?? {}) };

  const gridDays = computed(() =>
    utils.buildMonthGrid(params.currentDate.value, unref(params.weekStartsOn)),
  );

  const eventsByDay = computed(() => groupEventsByDay(params.events.value, utils));

  const calendarDays = computed(() =>
    buildCalendarDays(gridDays.value, eventsByDay.value, utils.toKey),
  );

  return { gridDays, eventsByDay, calendarDays };
}
