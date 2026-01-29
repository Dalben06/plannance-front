import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import {BaseInput} from '@/components/base'; // adjust path

type MountOpts = {
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
};

function mountInput(opts: MountOpts = {}): VueWrapper {
  const { props = {}, slots = {} } = opts;

  return mount(BaseInput, {
    props: {
      modelValue: '',
      ...props,
    },
    slots,
  });
}

function getInput(wrapper: VueWrapper) {
  return wrapper.get('input');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BaseInput', () => {
  it('renders label and required asterisk', () => {
    const wrapper = mountInput({
      props: { label: 'Email', required: true, id: 'email' },
    });

    const label = wrapper.get('label');
    expect(label.text()).toContain('Email');
    expect(label.text()).toContain('*');
    expect(label.attributes('for')).toBe('email');

    expect(getInput(wrapper).attributes('id')).toBe('email');
  });

  it('generates uid when id is not provided (deterministic)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 -> "0.8" -> "8"
    const wrapper = mountInput({ props: { label: 'Name' } });

    const id = getInput(wrapper).attributes('id');
    expect(id).toBe('in_8');

    const label = wrapper.get('label');
    expect(label.attributes('for')).toBe('in_8');
  });

  it('renders hint and wires aria-describedby', () => {
    const wrapper = mountInput({
      props: { id: 'username', hint: 'Enter your username' },
    });

    const input = getInput(wrapper);
    expect(input.attributes('aria-describedby')).toBe('username-help');

    const help = wrapper.get('#username-help');
    expect(help.text()).toBe('Enter your username');
  });

  it('renders error message (string) over hint and sets aria-invalid', () => {
    const wrapper = mountInput({
      props: {
        id: 'amount',
        hint: 'Hint should be hidden',
        error: 'Required field',
      },
    });

    const input = getInput(wrapper);
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('amount-help');

    const error = wrapper.get('#amount-help');
    expect(error.text()).toBe('Required field');
    // hint should not render
    expect(wrapper.text()).not.toContain('Hint should be hidden');
  });

  it('when error is boolean true, sets aria-invalid true and does not render help text/aria-describedby', () => {
    const wrapper = mountInput({
      props: { id: 'x', error: true },
    });

    const input = getInput(wrapper);
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBeUndefined();
    expect(wrapper.find('#x-help').exists()).toBe(false);
  });

  it('applies size classes', () => {
    const wrapper = mountInput({ props: { size: 'sm' } });
    const cls = getInput(wrapper).attributes('class') ?? '';
    expect(cls).toContain('px-3');
    expect(cls).toContain('py-2');
    expect(cls).toContain('rounded-xl');
  });

  it('forwards native attributes (placeholder/name/type/autocomplete)', () => {
    const wrapper = mountInput({
      props: {
        id: 'email',
        name: 'email',
        type: 'email',
        placeholder: 'you@example.com',
        autocomplete: 'email',
      },
    });

    const input = getInput(wrapper);
    expect(input.attributes('name')).toBe('email');
    expect(input.attributes('type')).toBe('email');
    expect(input.attributes('placeholder')).toBe('you@example.com');
    expect(input.attributes('autocomplete')).toBe('email');
  });

  it('supports disabled/readonly/autofocus/required attributes', () => {
    const wrapper = mountInput({
      props: {
        disabled: true,
        readonly: true,
        autofocus: true,
        required: true,
      },
    });

    const input = getInput(wrapper);
    expect(input.attributes('disabled')).toBeDefined();
    expect(input.attributes('readonly')).toBeDefined();
    expect(input.attributes('autofocus')).toBeDefined();
    expect(input.attributes('required')).toBeDefined();

    // bg-white removed when disabled
    const group = wrapper.get('.group');
    expect(group.classes()).not.toContain('bg-white');
  });

  it('renders prefix/suffix slots', () => {
    const wrapper = mountInput({
      slots: {
        prefix: '<span data-testid="prefix">P</span>',
        suffix: '<span data-testid="suffix">S</span>',
      },
    });

    expect(wrapper.get('[data-testid="prefix"]').text()).toBe('P');
    expect(wrapper.get('[data-testid="suffix"]').text()).toBe('S');
  });

  it('emits update:modelValue on input (no modifiers)', async () => {
    const wrapper = mountInput({ props: { modelValue: '' } });
    await getInput(wrapper).setValue('hello');

    const events = wrapper.emitted('update:modelValue');
    expect(events).toBeTruthy();
    expect(events![0]).toEqual(['hello']);
  });

  it('supports trim modifier', async () => {
    const wrapper = mountInput({
      props: { modelValue: '', modelModifiers: { trim: true } },
    });

    await getInput(wrapper).setValue('  hi  ');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hi']);
  });

  it('supports number modifier (empty -> null)', async () => {
    const wrapper = mountInput({
      props: { modelValue: '', modelModifiers: { number: true } },
    });

    await getInput(wrapper).setValue('12.5');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([12.5]);

    await getInput(wrapper).setValue('');
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([null]);
  });

  it('supports trim + number together (trim applied before number)', async () => {
    const wrapper = mountInput({
      props: { modelValue: '', modelModifiers: { trim: true, number: true } },
    });

    await getInput(wrapper).setValue('  42  ');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([42]);
  });

  it('re-emits blur/focus/keydown', async () => {
    const wrapper = mountInput();

    await getInput(wrapper).trigger('focus');
    await getInput(wrapper).trigger('blur');
    await getInput(wrapper).trigger('keydown');

    expect(wrapper.emitted('focus')?.length).toBe(1);
    expect(wrapper.emitted('blur')?.length).toBe(1);
    expect(wrapper.emitted('keydown')?.length).toBe(1);
  });
});
