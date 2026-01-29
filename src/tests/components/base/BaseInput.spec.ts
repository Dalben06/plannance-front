// src/components/base/__tests__/BaseInput.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { BaseInput } from '@/components/base';

type MountOpts = {
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
};

const mountBaseInput = (opts: MountOpts = {}): VueWrapper => {
  const { props = {}, slots = {} } = opts;

  return mount(BaseInput, {
    props: {
      modelValue: '',
      ...props,
    },
    slots,
  });
};

const getInput = (wrapper: VueWrapper) => wrapper.get('input');
const getGroup = (wrapper: VueWrapper) => wrapper.get('.group');
const getLabel = (wrapper: VueWrapper) => wrapper.get('label');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BaseInput', () => {
  describe('label + id', () => {
    it('renders label, required asterisk, and wires "for" to input id', () => {
      const wrapper = mountBaseInput({
        props: { label: 'Email', required: true, id: 'email' },
      });

      const label = getLabel(wrapper);
      expect(label.text()).toContain('Email');
      expect(label.text()).toContain('*');
      expect(label.attributes('for')).toBe('email');

      expect(getInput(wrapper).attributes('id')).toBe('email');
    });

    it('does not render a label when label prop is missing', () => {
      const wrapper = mountBaseInput();
      expect(wrapper.find('label').exists()).toBe(false);
    });

    it('generates a deterministic uid when id is not provided', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 -> "0.8" -> "8"
      const wrapper = mountBaseInput({ props: { label: 'Name' } });

      const inputId = getInput(wrapper).attributes('id');
      expect(inputId).toBe('in_8');

      const label = getLabel(wrapper);
      expect(label.attributes('for')).toBe('in_8');
    });
  });

  describe('help text (hint/error) + aria', () => {
    it('renders hint and wires aria-describedby', () => {
      const wrapper = mountBaseInput({
        props: { id: 'username', hint: 'Enter your username' },
      });

      const input = getInput(wrapper);
      expect(input.attributes('aria-describedby')).toBe('username-help');

      const help = wrapper.get('#username-help');
      expect(help.text()).toBe('Enter your username');
      expect(input.attributes('aria-invalid')).toBe('false');
    });

    it('renders error message (string) over hint and sets aria-invalid', () => {
      const wrapper = mountBaseInput({
        props: {
          id: 'amount',
          hint: 'Hint should be hidden',
          error: 'Required field',
        },
      });

      const input = getInput(wrapper);
      expect(input.attributes('aria-invalid')).toBe('true');
      expect(input.attributes('aria-describedby')).toBe('amount-help');

      const help = wrapper.get('#amount-help');
      expect(help.text()).toBe('Required field');
      expect(wrapper.text()).not.toContain('Hint should be hidden');
    });

    it('when error is boolean true, sets aria-invalid and does not render help text nor aria-describedby', () => {
      const wrapper = mountBaseInput({
        props: { id: 'x', error: true },
      });

      const input = getInput(wrapper);
      expect(input.attributes('aria-invalid')).toBe('true');
      expect(input.attributes('aria-describedby')).toBeUndefined();
      expect(wrapper.find('#x-help').exists()).toBe(false);
    });
  });

  describe('styling / size / disabled UI', () => {
    it('applies size classes (sm)', () => {
      const wrapper = mountBaseInput({ props: { size: 'sm' } });

      const cls = getInput(wrapper).attributes('class') ?? '';
      expect(cls).toContain('px-3');
      expect(cls).toContain('py-2');
      expect(cls).toContain('rounded-xl');
    });

    it('removes bg-white from the group container when disabled', () => {
      const wrapper = mountBaseInput({ props: { disabled: true } });
      expect(getGroup(wrapper).classes()).not.toContain('bg-white');
    });
  });

  describe('native attribute forwarding', () => {
    it('forwards name/type/placeholder/autocomplete', () => {
      const wrapper = mountBaseInput({
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
      const wrapper = mountBaseInput({
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
    });

    it('renders empty string when modelValue is null/undefined', () => {
      const wrapperNull = mountBaseInput({ props: { modelValue: null } });
      expect((getInput(wrapperNull).element as HTMLInputElement).value).toBe('');

      const wrapperUndef = mountBaseInput({ props: { modelValue: undefined } });
      expect((getInput(wrapperUndef).element as HTMLInputElement).value).toBe('');
    });
  });

  describe('slots', () => {
    it('renders prefix/suffix slots', () => {
      const wrapper = mountBaseInput({
        slots: {
          prefix: '<span data-testid="prefix">P</span>',
          suffix: '<span data-testid="suffix">S</span>',
        },
      });

      expect(wrapper.get('[data-testid="prefix"]').text()).toBe('P');
      expect(wrapper.get('[data-testid="suffix"]').text()).toBe('S');
    });
  });

  describe('emits', () => {
    it('emits update:modelValue on input (no modifiers)', async () => {
      const wrapper = mountBaseInput({ props: { modelValue: '' } });

      await getInput(wrapper).setValue('hello');

      const events = wrapper.emitted('update:modelValue');
      expect(events).toBeTruthy();
      expect(events![0]).toEqual(['hello']);
    });

    it('supports trim modifier', async () => {
      const wrapper = mountBaseInput({
        props: { modelValue: '', modelModifiers: { trim: true } },
      });

      await getInput(wrapper).setValue('  hi  ');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hi']);
    });

    it('supports number modifier (empty -> null)', async () => {
      const wrapper = mountBaseInput({
        props: { modelValue: '', modelModifiers: { number: true } },
      });

      await getInput(wrapper).setValue('12.5');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([12.5]);

      await getInput(wrapper).setValue('');
      expect(wrapper.emitted('update:modelValue')![1]).toEqual([null]);
    });

    it('supports trim + number together (trim before number)', async () => {
      const wrapper = mountBaseInput({
        props: { modelValue: '', modelModifiers: { trim: true, number: true } },
      });

      await getInput(wrapper).setValue('  42  ');
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([42]);
    });

    it('re-emits focus/blur/keydown', async () => {
      const wrapper = mountBaseInput();

      await getInput(wrapper).trigger('focus');
      await getInput(wrapper).trigger('blur');
      await getInput(wrapper).trigger('keydown');

      expect(wrapper.emitted('focus')).toHaveLength(1);
      expect(wrapper.emitted('blur')).toHaveLength(1);
      expect(wrapper.emitted('keydown')).toHaveLength(1);
    });
  });
});
