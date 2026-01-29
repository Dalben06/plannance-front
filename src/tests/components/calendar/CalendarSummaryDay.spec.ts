import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarSummaryDay from '@/components/calendar/CalendarSummaryDay.vue';

describe('CalendarSummaryDay (wiring)', () => {
  it('renders nothing when expense/income are <= 0', () => {
    const wrapper = mount(CalendarSummaryDay, { props: { expense: 0, income: 0 } });
    expect(wrapper.text()).toBe('');
  });

  it('renders spent and income when values are > 0', () => {
    const wrapper = mount(CalendarSummaryDay, { props: { expense: 10, income: 20 } });
    expect(wrapper.text()).toContain('Spent:');
    expect(wrapper.text()).toContain('Income:');
  });
});
