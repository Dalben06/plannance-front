import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import BaseDatePicker from '@/components/base/BaseDatePicker.vue'; // adjust path if needed

type WeekStartsOn = 0 | 1;

type BaseDatePickerProps = {
  modelValue: string | Date | null | undefined;
  label?: string;
  hint?: string;
  error?: string | boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  weekStartsOn?: WeekStartsOn;
  min?: string | Date;
  max?: string | Date;
};

type MountOptions = {
  props?: Partial<BaseDatePickerProps>;
};

function mountDatePicker(options: MountOptions = {}): VueWrapper {
  const { props = {} } = options;

  const mergedProps: BaseDatePickerProps = {
    modelValue: null,
    placeholder: 'Select date',
    disabled: false,
    required: false,
    weekStartsOn: 0,
    ...props,
  };

  return mount(BaseDatePicker, { props: mergedProps });
}

function openDatePicker(wrapper: VueWrapper): Promise<void> {
  return wrapper.get('[data-testid="datepicker-trigger"]').trigger('click');
}

function isPopoverVisible(wrapper: VueWrapper): boolean {
  return wrapper.find('[data-testid="datepicker-popover"]').exists();
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0)); // Jan 15, 2026 @ noon (local)
});

afterEach(() => {
  vi.useRealTimers();
});

describe('BaseDatePicker', () => {
  it('renders label and required asterisk', () => {
    const wrapper = mountDatePicker({ props: { label: 'Start date', required: true } });
    expect(wrapper.text()).toContain('Start date');
    expect(wrapper.text()).toContain('*');
  });

  it('shows placeholder when no date is selected', () => {
    const wrapper = mountDatePicker({ props: { placeholder: 'Pick a date' } });
    expect(wrapper.text()).toContain('Pick a date');
  });

  it('opens and closes the popover (Close button)', async () => {
    const wrapper = mountDatePicker();

    expect(isPopoverVisible(wrapper)).toBe(false);
    await openDatePicker(wrapper);
    expect(isPopoverVisible(wrapper)).toBe(true);

    await wrapper.get('[data-testid="datepicker-close"]').trigger('click');
    expect(isPopoverVisible(wrapper)).toBe(false);
  });

  it('does not open when disabled', async () => {
    const wrapper = mountDatePicker({ props: { disabled: true } });
    await openDatePicker(wrapper);
    expect(isPopoverVisible(wrapper)).toBe(false);
  });

  it('renders weekday order based on weekStartsOn', async () => {
    const wrapper = mountDatePicker({ props: { weekStartsOn: 1 } });
    await openDatePicker(wrapper);

    const weekdayNodes = wrapper.findAll('[data-testid="datepicker-popover"] .grid.grid-cols-7.mb-2 > div');
    expect(weekdayNodes[0]?.text()).toBe('Mon');
    expect(weekdayNodes[6]?.text()).toBe('Sun');
  });

  it('emits ISO string when modelValue is not a Date', async () => {
    const wrapper = mountDatePicker({ props: { modelValue: null } });

    await openDatePicker(wrapper);
    await wrapper.get('button[data-date="2026-01-20"]').trigger('click');

    const events = wrapper.emitted('update:modelValue');
    expect(events).toBeTruthy();
    expect(events?.[0]).toEqual(['2026-01-20']);

    expect(isPopoverVisible(wrapper)).toBe(false);
  });

  it('emits Date when modelValue is a Date', async () => {
    const initialValue = new Date(2026, 0, 10, 12, 0, 0);
    const wrapper = mountDatePicker({ props: { modelValue: initialValue } });

    await openDatePicker(wrapper);
    await wrapper.get('button[data-date="2026-01-22"]').trigger('click');

    const events = wrapper.emitted('update:modelValue');
    expect(events).toBeTruthy();

    const payload = events?.[0]?.[0];
    expect(payload instanceof Date).toBe(true);

    const selected = payload as Date;
    expect(selected.getFullYear()).toBe(2026);
    expect(selected.getMonth()).toBe(0);
    expect(selected.getDate()).toBe(22);
  });

  it('disables days outside min/max and does not emit on click', async () => {
    const wrapper = mountDatePicker({
      props: { min: '2026-01-10', max: '2026-01-20', modelValue: null },
    });

    await openDatePicker(wrapper);

    // Outside range (before min): button exists but should not emit because it has pointer-events-none
    await wrapper.get('button[data-date="2026-01-05"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();

    // Inside range
    await wrapper.get('button[data-date="2026-01-15"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-01-15']);
  });

  it('navigates months with previous/next buttons', async () => {
    const wrapper = mountDatePicker();
    await openDatePicker(wrapper);

    const title = () => wrapper.get('[data-testid="datepicker-month-title"]').text();

    const initialTitle = title();
    await wrapper.get('[data-testid="datepicker-next"]').trigger('click');
    expect(title()).not.toBe(initialTitle);

    await wrapper.get('[data-testid="datepicker-prev"]').trigger('click');
    expect(title()).toBe(initialTitle);
  });
});
