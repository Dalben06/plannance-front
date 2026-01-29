import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick, type Ref, type PropType } from 'vue';
import type { CalendarDay, CalendarEvent, WeekStartsOn } from '@/types/types.p';

type CalendarStoreLike = {
  date: Ref<Date>;
  events: Ref<CalendarEvent[]>;
};

const dateRef = ref<Date>(new Date('2026-01-10T00:00:00.000Z'));
const eventsRef = ref<CalendarEvent[]>([]);

vi.mock('@/stores/calendar', () => ({
  useCalendarStore: (): CalendarStoreLike => ({ date: dateRef, events: eventsRef }),
}));

vi.mock('pinia', () => ({
  storeToRefs: (store: CalendarStoreLike) => store,
}));

const buildMonthGridMock = vi.fn<(d: Date, w: WeekStartsOn) => Date[]>();
const parseDateMock = vi.fn<(v: Date | string) => Date>();
const toKeyMock = vi.fn<(d: Date) => string>();

function toKeyUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

vi.mock('@/utils/calendar-utils', () => ({
  buildMonthGrid: (d: Date, w: WeekStartsOn) => buildMonthGridMock(d, w),
  parseDate: (v: Date | string) => parseDateMock(v),
  toKey: (d: Date) => toKeyMock(d),
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
    return () => h('div');
  },
});

// IMPORTANT: import after mocks
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: overrides.id ?? 'e1',
    title: overrides.title ?? 'Event',
    start: overrides.start ?? '2026-01-01',
    end: overrides.end,
    amount: overrides.amount ?? 10,
    type: overrides.type ?? 'credit',
    color: overrides.color,
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
    buildMonthGridMock.mockReset();
    parseDateMock.mockReset();
    toKeyMock.mockReset();

    dateRef.value = new Date('2026-01-10T00:00:00.000Z');
    eventsRef.value = [];

    buildMonthGridMock.mockImplementation((d) => {
      const month = d.getUTCMonth() + 1;
      return month === 1
        ? [new Date('2026-01-01T00:00:00.000Z'), new Date('2026-01-02T00:00:00.000Z')]
        : [new Date('2026-02-01T00:00:00.000Z'), new Date('2026-02-02T00:00:00.000Z')];
    });

    parseDateMock.mockImplementation((v) => (v instanceof Date ? v : new Date(`${v}T00:00:00.000Z`)));
    toKeyMock.mockImplementation((d) => toKeyUtc(d));
  });

  it('updates calendarDays when store date changes (no strict call count)', async () => {
    const wrapper = mountGrid({ weekStartsOn: 0 });

    expect(getDayRowProps(wrapper).days[0]!.id).toBe('2026-01-01');

    dateRef.value = new Date('2026-02-10T00:00:00.000Z');
    await nextTick();

    expect(getDayRowProps(wrapper).days[0]!.id).toBe('2026-02-01');
    expect(buildMonthGridMock).toHaveBeenCalledWith(dateRef.value, 0);
  });

  it('updates totals when store events change', async () => {
    const wrapper = mountGrid();

    expect(getDayRowProps(wrapper).days[0]!.expense).toBe(0);

    eventsRef.value = [makeEvent({ start: '2026-01-01', type: 'debit', amount: 99 })];
    await nextTick();

    expect(getDayRowProps(wrapper).days[0]!.expense).toBe(99);
    expect(getDayRowProps(wrapper).days[0]!.income).toBe(0);
  });
});
