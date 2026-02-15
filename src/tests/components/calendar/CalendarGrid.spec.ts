import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick, type Ref, type PropType } from 'vue';
import type { CalendarDay, WeekStartsOn } from '@/types/types.p';

type CalendarStoreLike = {
  date: Ref<Date>;
  days: Ref<CalendarDay[]>;
};

const dateRef = ref<Date>(new Date('2026-01-10T00:00:00.000Z'));
const daysRef = ref<CalendarDay[]>([]);

vi.mock('@/stores/calendar', () => ({
  useCalendarStore: (): CalendarStoreLike => ({ date: dateRef, days: daysRef }),
}));

vi.mock('pinia', () => ({
  storeToRefs: (store: CalendarStoreLike) => store,
}));

type DayRowProps = {
  days: CalendarDay[];
  currentDate: Date;
  maxChipsPerDay: number;
};

const CalendarDayRowStub = defineComponent({
  name: 'CalendarDayRow',
  props: {
    days: { type: Array as PropType<CalendarDay[]>, required: true },
    currentDate: { type: Date as PropType<Date>, required: true },
    maxChipsPerDay: { type: Number, required: true },
  },
  setup() {
    return () => h('div', { 'data-stub': 'day-row' });
  },
});

// IMPORTANT: import after mocks
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';

function makeDay(overrides: Partial<CalendarDay> = {}): CalendarDay {
  return {
    id: overrides.id ?? 'd1',
    date: overrides.date ?? '2026-01-10',
    events: overrides.events ?? [],
    expense: overrides.expense ?? 0,
    income: overrides.income ?? 0,
  };
}

function mountGrid(props?: { weekStartsOn?: WeekStartsOn; maxChipsPerDay?: number }) {
  return mount(CalendarGrid, {
    props: {
      weekStartsOn: props?.weekStartsOn ?? 0,
      maxChipsPerDay: props?.maxChipsPerDay ?? 3,
    },
    global: {
      stubs: {
        CalendarDayRow: CalendarDayRowStub,
        'calendar-day-row': CalendarDayRowStub,
      },
    },
  });
}

function getDayRowProps(wrapper: ReturnType<typeof mountGrid>): DayRowProps {
  return wrapper.getComponent(CalendarDayRowStub).props() as DayRowProps;
}

describe('CalendarGrid', () => {
  beforeEach(() => {
    dateRef.value = new Date('2026-01-10T00:00:00.000Z');
    daysRef.value = [makeDay({ id: 'd1', date: '2026-01-10' })];
  });

  it('passes store date and days to CalendarDayRow and updates reactively', async () => {
    const wrapper = mountGrid({ weekStartsOn: 0 });

    let dayRowProps = getDayRowProps(wrapper);
    expect(dayRowProps.days).toHaveLength(1);
    expect(dayRowProps.days[0]!.id).toBe('d1');
    expect(dayRowProps.currentDate.toISOString()).toBe('2026-01-10T00:00:00.000Z');

    dateRef.value = new Date('2026-02-10T00:00:00.000Z');
    daysRef.value = [makeDay({ id: 'd2', date: '2026-02-10' })];
    await nextTick();

    dayRowProps = getDayRowProps(wrapper);
    expect(dayRowProps.days).toHaveLength(1);
    expect(dayRowProps.days[0]!.id).toBe('d2');
    expect(dayRowProps.currentDate.toISOString()).toBe('2026-02-10T00:00:00.000Z');
  });

  it('forwards maxChipsPerDay prop to CalendarDayRow', () => {
    const wrapper = mountGrid({ maxChipsPerDay: 7 });

    expect(getDayRowProps(wrapper).maxChipsPerDay).toBe(7);
  });
});
