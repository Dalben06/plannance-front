// src/tests/components/base/BaseSelect.spec.ts
import { describe, it, expect } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { h, type Component, type VNode } from 'vue';
import BaseSelect from '@/components/base/BaseSelect.vue'; // adjust path if needed
import { ChevronUpDownIcon as LeadingIcon } from '@/ui/icons';

type Primitive = string | number;

type SelectOption = {
  label: string;
  value: Primitive;
  disabled?: boolean;
};

type Size = 'sm' | 'md' | 'lg';
type SelectModelValue = Primitive | '' | null | Primitive[];

type BaseSelectProps = {
  modelValue: SelectModelValue;
  options?: SelectOption[];
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  placeholderValue?: Primitive | '';
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  size?: Size;
  leadingIcon?: Component;
  selectClass?: string;
};

type Slots = {
  default?: () => VNode[];
};

type MountOptions = {
  props?: Partial<BaseSelectProps>;
  slots?: Slots;
};

const DEFAULT_OPTIONS: SelectOption[] = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
];

function mountSelect(options: MountOptions = {}): VueWrapper {
  const { props = {}, slots } = options;

  const mergedProps: BaseSelectProps = {
    id: 'my-select', // deterministic
    modelValue: '' as SelectModelValue,
    options: props.options ?? DEFAULT_OPTIONS,
    label: props.label,
    hint: props.hint,
    error: props.error,
    placeholder: props.placeholder,
    placeholderValue: props.placeholderValue ?? '',
    name: props.name,
    disabled: props.disabled ?? false,
    required: props.required ?? false,
    multiple: props.multiple ?? false,
    size: props.size ?? 'md',
    leadingIcon: props.leadingIcon,
    selectClass: props.selectClass,
  };

  return mount(BaseSelect, {
    props: mergedProps,
    slots,
  });
}

function getSelect(wrapper: VueWrapper) {
  return wrapper.get('select');
}

describe('BaseSelect', () => {
  it('renders label and required asterisk', () => {
    const wrapper = mountSelect({ props: { label: 'Category', required: true } });

    const label = wrapper.get('label');
    expect(label.text()).toContain('Category');
    expect(label.text()).toContain('*');
    expect(label.attributes('for')).toBe('my-select');
  });

  it('renders placeholder only for single-select', () => {
    const wrapper = mountSelect({
      props: { placeholder: 'Select one', placeholderValue: '' },
    });

    const opts = wrapper.findAll('option');
    expect(opts[0]?.text()).toBe('Select one');
    expect(opts[0]?.attributes('disabled')).toBeDefined();
    expect(opts[0]?.attributes('hidden')).toBeDefined();
  });

  it('does NOT render placeholder for multiple-select', () => {
    const wrapper = mountSelect({
      props: { multiple: true, placeholder: 'Select one' },
    });

    expect(wrapper.findAll('option').some((o) => o.text() === 'Select one')).toBe(false);
    expect(getSelect(wrapper).attributes('multiple')).toBeDefined();
  });

  it('renders options from props when no default slot is provided (slot fallback)', () => {
    const wrapper = mountSelect();

    expect(wrapper.text()).toContain('One');
    expect(wrapper.text()).toContain('Two');
  });

  it('renders options from default slot and NOT the prop options', () => {
    const wrapper = mountSelect({
      props: { options: DEFAULT_OPTIONS }, // prove fallback would exist
      slots: {
        default: () => [
          h('option', { value: 'x' }, 'X'),
          h('option', { value: 'y' }, 'Y'),
        ],
      },
    });

    expect(wrapper.text()).toContain('X');
    expect(wrapper.text()).toContain('Y');

    // fallback content should not render when default slot exists
    expect(wrapper.text()).not.toContain('One');
    expect(wrapper.text()).not.toContain('Two');
  });

  it('emits update:modelValue when selection changes (single)', async () => {
    const wrapper = mountSelect({ props: { modelValue: '' } });

    await getSelect(wrapper).setValue('two');

    const events = wrapper.emitted('update:modelValue');
    expect(events).toBeTruthy();
    expect(events?.[0]).toEqual(['two']);
  });

  it('emits update:modelValue with array when multiple', async () => {
    const wrapper = mountSelect({
      props: { multiple: true, modelValue: [] },
    });

    await getSelect(wrapper).setValue(['one', 'two']);

    const events = wrapper.emitted('update:modelValue');
    expect(events).toBeTruthy();
    expect(events?.[0]).toEqual([['one', 'two']]);
  });

  it('sets aria-describedby and renders hint', () => {
    const wrapper = mountSelect({ props: { hint: 'Helpful text' } });

    const select = getSelect(wrapper);
    expect(select.attributes('aria-describedby')).toBe('my-select-desc');

    const p = wrapper.get('#my-select-desc');
    expect(p.text()).toBe('Helpful text');
    expect(p.classes()).toContain('text-slate-500');
  });

  it('sets aria-invalid, error classes, and shows error message', () => {
    const wrapper = mountSelect({ props: { error: 'Required' } });

    const select = getSelect(wrapper);
    expect(select.attributes('aria-invalid')).toBe('true');
    expect(select.attributes('aria-describedby')).toBe('my-select-desc');

    const cls = select.attributes('class') ?? '';
    expect(cls).toContain('border-red-300');

    const p = wrapper.get('#my-select-desc');
    expect(p.text()).toBe('Required');
    expect(p.classes()).toContain('text-red-600');
  });

  it('adds leading icon styling (pl-10) and increases icon count', () => {
    const withoutLeading = mountSelect();
    const withLeading = mountSelect({ props: { leadingIcon: LeadingIcon } });

    // class added
    expect(getSelect(withLeading).attributes('class') ?? '').toContain('pl-10');

    // chevron icon is always present; leading icon adds one more SVG
    expect(withoutLeading.findAll('svg').length).toBe(1);
    expect(withLeading.findAll('svg').length).toBe(2);
  });

  it('appends selectClass', () => {
    const wrapper = mountSelect({ props: { selectClass: 'extra-class' } });
    expect(getSelect(wrapper).attributes('class') ?? '').toContain('extra-class');
  });

  it('re-emits blur/focus/change events', async () => {
    const wrapper = mountSelect();

    await getSelect(wrapper).trigger('focus');
    await getSelect(wrapper).trigger('blur');
    await getSelect(wrapper).trigger('change');

    expect(wrapper.emitted('focus')?.length).toBe(1);
    expect(wrapper.emitted('blur')?.length).toBe(1);
    expect(wrapper.emitted('change')?.length).toBe(1);
  });
});
