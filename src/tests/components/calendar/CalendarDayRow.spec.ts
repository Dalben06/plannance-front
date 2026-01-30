import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, type PropType, nextTick, type Ref } from 'vue';
import type { CalendarDay, CalendarEvent } from '@/types/types.p';

// --------------------
// Store + Pinia mocks
// --------------------
const isLoadingRef = ref(false);

type CalendarStoreLike = { isLoading: Ref<boolean> };

vi.mock('@/stores/calendar', () => ({
  useCalendarStore: (): CalendarStoreLike => ({ isLoading: isLoadingRef }),
}));

vi.mock('pinia', () => ({
  storeToRefs: (store: CalendarStoreLike) => store,
}));

// --------------------
// calendar-utils mocks
// - Make "today" deterministic inside component module
// --------------------
const TODAY_ISO = '2026-01-28T12:00:00.000Z';

vi.mock('@/utils/calendar-utils', () => ({
  atNoon: () => new Date(TODAY_ISO),
  isSameDay: (a: Date, b: Date) =>
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate(),
}));

// --------------------
// Child component stubs
// --------------------
const CalendarEventDayStub = defineComponent({
  name: 'CalendarEventDay',
  props: {
    events: { type: Array as PropType<CalendarEvent[]>, required: true },
    maxChipsPerDay: { type: Number, required: true },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-stub': 'event-day',
        'data-count': String(props.events.length),
        'data-max': String(props.maxChipsPerDay),
      });
  },
});

const CalendarSummaryDayStub = defineComponent({
  name: 'CalendarSummaryDay',
  props: {
    expense: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-stub': 'summary-day',
        'data-expense': String(props.expense),
        'data-income': String(props.income),
      });
  },
});

// IMPORTANT: import after mocks
import CalendarDayRow from '@/components/calendar/CalendarDayRow.vue';

// --------------------
// Helpers
// --------------------
function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: overrides.id ?? 'e1',
    title: overrides.title ?? 'Event',
    start: overrides.start ?? '2026-01-28',
    end: overrides.end,
    amount: overrides.amount ?? 10,
    type: overrides.type ?? 'credit',
    color: overrides.color,
  };
}

function makeDay(overrides: Partial<CalendarDay> = {}): CalendarDay {
  return {
    id: overrides.id ?? 'd1',
    date: overrides.date ?? new Date(TODAY_ISO),
    events: overrides.events ?? [],
    expense: overrides.expense ?? 0,
    income: overrides.income ?? 0,
  };
}

function mountRow(opts: {
  currentDate: Date;
  days: CalendarDay[];
  maxChipsPerDay?: number;
}) {
  return mount(CalendarDayRow, {
    props: {
      currentDate: opts.currentDate,
      days: opts.days,
      maxChipsPerDay: opts.maxChipsPerDay ?? 2,
    },
    global: {
      stubs: {
        CalendarEventDay: CalendarEventDayStub,
        'calendar-event-day': CalendarEventDayStub,
        CalendarSummaryDay: CalendarSummaryDayStub,
        'calendar-summary-day': CalendarSummaryDayStub,
      },
    },
  });
}

// --------------------
// Tests
// --------------------
describe('CalendarDayRow', () => {
  beforeEach(() => {
    isLoadingRef.value = false;
  });

  it('renders loading skeletons and hides child components when isLoading=true', () => {
    isLoadingRef.value = true;

    const wrapper = mountRow({
      currentDate: new Date('2026-01-15T00:00:00.000Z'),
      days: [makeDay({ id: 'd_today', date: new Date(TODAY_ISO) })],
      maxChipsPerDay: 3,
    });

    // day skeleton visible, day number hidden
    wrapper.get('[data-testid="day-skeleton"]');
    expect(wrapper.find('[data-testid="day-number"]').exists()).toBe(false);

    // loading skeleton sections visible
    wrapper.get('[data-testid="events-skeleton"]');
    wrapper.get('[data-testid="summary-skeleton"]');

    // child stubs not rendered
    expect(wrapper.find('[data-stub="event-day"]').exists()).toBe(false);
    expect(wrapper.find('[data-stub="summary-day"]').exists()).toBe(false);
  });

  it('renders day number + child components when isLoading=false and passes props', () => {
    isLoadingRef.value = false;

    const day = makeDay({
      id: 'd1',
      date: new Date(TODAY_ISO),
      events: [makeEvent({ id: 'e1' }), makeEvent({ id: 'e2' })],
      expense: 120,
      income: 300,
    });

    const wrapper = mountRow({
      currentDate: new Date('2026-01-10T00:00:00.000Z'),
      days: [day],
      maxChipsPerDay: 5,
    });

    expect(wrapper.get('[data-testid="day-number"]').text()).toBe('28');

    // child stubs exist
    const eventDay = wrapper.get('[data-stub="event-day"]');
    expect(eventDay.attributes('data-count')).toBe('2');
    expect(eventDay.attributes('data-max')).toBe('5');

    const summaryDay = wrapper.get('[data-stub="summary-day"]');
    expect(summaryDay.attributes('data-expense')).toBe('120');
    expect(summaryDay.attributes('data-income')).toBe('300');
  });

  it('applies today ring class and today badge class when date is today', () => {
    const wrapper = mountRow({
      currentDate: new Date('2026-01-01T00:00:00.000Z'),
      days: [makeDay({ id: 'd_today', date: new Date(TODAY_ISO) })],
    });

    const cell = wrapper.get('[data-testid="day-cell"]');
    expect(cell.classes()).toContain('ring-2');

    const badge = wrapper.get('[data-testid="day-number"]');
    const badgeClass = badge.attributes('class') ?? '';
    expect(badgeClass).toContain('bg-blue-500/10');
    expect(badgeClass).toContain('text-blue-200');
  });

  it('applies opacity-50 when day is outside current month/year and does not apply today styles', () => {
    const wrapper = mountRow({
      currentDate: new Date('2026-01-15T00:00:00.000Z'), // January
      days: [
        makeDay({
          id: 'd_outside',
          date: new Date('2026-02-01T12:00:00.000Z'), // February
        }),
      ],
    });

    const cell = wrapper.get('[data-testid="day-cell"]');
    expect(cell.classes()).toContain('opacity-50');
    expect(cell.classes()).not.toContain('ring-2');

    const badgeClass = wrapper.get('[data-testid="day-number"]').attributes('class') ?? '';
    expect(badgeClass).toContain('bg-white/5');
    expect(badgeClass).toContain('text-white/85');
  });

  it('reacts to isLoading changes (skeleton -> children)', async () => {
    isLoadingRef.value = true;

    const wrapper = mountRow({
      currentDate: new Date('2026-01-15T00:00:00.000Z'),
      days: [makeDay({ id: 'd1', date: new Date(TODAY_ISO), events: [makeEvent()] })],
      maxChipsPerDay: 2,
    });

    // initially loading
    expect(wrapper.find('[data-stub="event-day"]').exists()).toBe(false);
    wrapper.get('[data-testid="events-skeleton"]');

    // toggle
    isLoadingRef.value = false;
    await nextTick();

    // now children
    wrapper.get('[data-stub="event-day"]');
    wrapper.get('[data-stub="summary-day"]');
    expect(wrapper.find('[data-testid="events-skeleton"]').exists()).toBe(false);
  });
});
