import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarEventDay from '@/components/calendar/CalendarEventDay.vue';
import type { CalendarEvent } from '@/types/types.p';


function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: overrides.id ?? '1',
    title: overrides.title ?? 'Event',
    type: overrides.type ?? 'credit',
    color: overrides.color,
    amount: 0,
    start: new Date(),
    end: new Date(),
  };
}

function mountComp(opts: { events?: CalendarEvent[]; maxChipsPerDay?: number } = {}) {
  return mount(CalendarEventDay, {
    props: {
      events: opts.events ?? [],
      maxChipsPerDay: opts.maxChipsPerDay ?? 2,
    },
  });
}

function getChips(wrapper: ReturnType<typeof mountComp>) {
  // chips are divs rendered by v-for (not the wrapper containers)
  // We can select by title attribute which is always set on chips
  return wrapper.findAll('div[title]');
}

describe('CalendarEventDay', () => {
  it('renders nothing when events is empty', () => {
    const wrapper = mountComp({ events: [], maxChipsPerDay: 2 });

    expect(getChips(wrapper)).toHaveLength(0);
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('renders up to maxChipsPerDay chips and sets title attribute', () => {
    const events = [
      makeEvent({ id: '1', title: 'A', type: 'credit' }),
      makeEvent({ id: '2', title: 'B', type: 'debit' }),
      makeEvent({ id: '3', title: 'C', type: 'credit' }),
    ];

    const wrapper = mountComp({ events, maxChipsPerDay: 2 });

    const chips = getChips(wrapper);
    expect(chips).toHaveLength(2); // sliced

    expect(chips[0]?.text()).toBe('A');
    expect(chips[0]?.attributes('title')).toBe('A');

    expect(chips[1]?.text()).toBe('B');
    expect(chips[1]?.attributes('title')).toBe('B');
  });

  it('eventChipClass: applies debit classes for debit events', () => {
    const events = [makeEvent({ id: '1', title: 'Debit', type: 'debit' })];
    const wrapper = mountComp({ events, maxChipsPerDay: 3 });

    const chip = getChips(wrapper)[0];
    const cls = chip?.attributes('class') ?? '';

    // common base pieces
    expect(cls).toContain('truncate');
    expect(cls).toContain('border-l-4');

    // debit branch
    expect(cls).toContain('bg-rose-400/10');
    expect(cls).toContain('border-l-rose-400/60');
    expect(cls).not.toContain('bg-emerald-400/10');
  });

  it('eventChipClass: applies non-debit (emerald) classes for other types', () => {
    const events = [
      makeEvent({ id: '1', title: 'Credit', type: 'credit' }),
      makeEvent({ id: '2', title: 'Other', type: 'credit' }), // also non-debit
    ];

    const wrapper = mountComp({ events, maxChipsPerDay: 5 });

    const chips = getChips(wrapper);
    expect(chips).toHaveLength(2);

    for (const chip of chips) {
      const cls = chip.attributes('class') ?? '';
      expect(cls).toContain('bg-emerald-400/10');
      expect(cls).toContain('border-l-emerald-400/60');
      expect(cls).not.toContain('bg-rose-400/10');
    }
  });

  it('applies inline borderLeftColor style when event.color exists', () => {
    const events = [
      makeEvent({ id: '1', title: 'Colored', type: 'credit', color: '#ff0000' }),
      makeEvent({ id: '2', title: 'NoColor', type: 'credit' }),
    ];

    const wrapper = mountComp({ events, maxChipsPerDay: 5 });

    const chips = getChips(wrapper);
    const colored = chips[0]?.element as HTMLElement;
    const noColor = chips[1]?.element as HTMLElement;

    // With color -> inline style should set border-left-color
    expect(colored.style.borderLeftColor).toBe('rgb(255, 0, 0)'); // browser normalizes #ff0000 to rgb

    // Without color -> should not have inline border-left-color
    // (style.borderLeftColor would be empty string if not set inline)
    expect(noColor.style.borderLeftColor).toBe('');
  });

  it('renders "+N more" button only when events exceed maxChipsPerDay, with correct title', () => {
    const events = [
      makeEvent({ id: '1', title: 'A' }),
      makeEvent({ id: '2', title: 'B' }),
      makeEvent({ id: '3', title: 'C' }),
      makeEvent({ id: '4', title: 'D' }),
    ];

    const wrapper = mountComp({ events, maxChipsPerDay: 2 });

    const btn = wrapper.get('button');
    expect(btn.text()).toBe('+2 more');
    expect(btn.attributes('title')).toBe('Show 2 more');
  });

  it('does not render "+N more" button when events length equals maxChipsPerDay', () => {
    const events = [makeEvent({ id: '1', title: 'A' }), makeEvent({ id: '2', title: 'B' })];
    const wrapper = mountComp({ events, maxChipsPerDay: 2 });

    expect(wrapper.find('button').exists()).toBe(false);
  });
});
