// src/tests/components/base/BaseButton.spec.ts
import { describe, it, expect, vi, afterEach } from 'vitest';

// IMPORTANT: mock vue-router BEFORE importing the component
vi.mock('vue-router', async () => {
  const vue = await import('vue');
  return {
    RouterLink: vue.defineComponent({
      name: 'RouterLink',
      props: {
        to: { type: [String, Object], required: false },
      },
      setup(props, { slots, attrs }) {
        return () =>
          vue.h(
            'a',
            {
              ...attrs,
              'data-router-link': 'true',
              'data-to': typeof props.to === 'string' ? props.to : 'object',
            },
            slots.default?.(),
          );
      },
    }),
  };
});

import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, markRaw } from 'vue';
import { BaseButton } from '@/components/base';

const LeftIcon = markRaw(
  defineComponent({
    name: 'LeftIcon',
    setup() {
      return () => h('svg', { 'data-testid': 'left-icon' });
    },
  }),
);

const RightIcon = markRaw(
  defineComponent({
    name: 'RightIcon',
    setup() {
      return () => h('svg', { 'data-testid': 'right-icon' });
    },
  }),
);

type MountOptions = {
  props?: Record<string, unknown>;
  attrs?: Record<string, unknown>;
  slot?: string;
};

function mountButton(options: MountOptions = {}): VueWrapper {
  const { props = {}, attrs = {}, slot } = options;

  return mount(BaseButton, {
    props,
    attrs,
    slots: slot ? { default: slot } : undefined,
  });
}

function expectClass(wrapper: VueWrapper, klass: string) {
  expect(wrapper.classes()).toContain(klass);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BaseButton', () => {
  it('renders as <button> by default with primary + md classes', () => {
    const wrapper = mountButton({ slot: 'Save' });

    expect(wrapper.element.tagName.toLowerCase()).toBe('button');

    // variant: primary
    expectClass(wrapper, 'bg-slate-900');
    // size: md
    expectClass(wrapper, 'h-10');
    // label exists
    expect(wrapper.text()).toContain('Save');
  });

  it('supports variants and sizes', () => {
    const wrapper = mountButton({
      props: { variant: 'secondary', size: 'lg' },
      slot: 'Continue',
    });

    expectClass(wrapper, 'border-slate-200'); // secondary
    expectClass(wrapper, 'h-11'); // lg
    expectClass(wrapper, 'text-base'); // lg
  });

  it('adds w-full when block=true', () => {
    const wrapper = mountButton({ props: { block: true }, slot: 'Full' });
    expectClass(wrapper, 'w-full');
  });

  it('forwards arbitrary attrs (e.g., type, id, data-*)', () => {
    const wrapper = mountButton({
      attrs: { id: 'pay', type: 'submit', 'data-test': 'base-btn' },
      slot: 'Pay',
    });

    expect(wrapper.attributes('id')).toBe('pay');
    expect(wrapper.attributes('type')).toBe('submit');
    expect(wrapper.attributes('data-test')).toBe('base-btn');
  });

  it('renders left/right icons (and applies icon size classes)', () => {
    const wrapper = mountButton({
      props: { iconLeft: LeftIcon, iconRight: RightIcon, size: 'sm' },
      slot: 'Label',
    });

    const left = wrapper.get('[data-testid="left-icon"]');
    const right = wrapper.get('[data-testid="right-icon"]');

    expect(left.attributes('aria-hidden')).toBe('true');
    expect(right.attributes('aria-hidden')).toBe('true');

    // icon size for sm
    expect(left.classes()).toContain('h-4');
    expect(left.classes()).toContain('w-4');
  });

  it('shows spinner when loading=true and hides icons', () => {
    const wrapper = mountButton({
      props: { loading: true, iconLeft: LeftIcon, iconRight: RightIcon },
      slot: 'Loading',
    });

    // spinner exists
    expect(wrapper.find('svg.animate-spin').exists()).toBe(true);

    // icons hidden during loading
    expect(wrapper.find('[data-testid="left-icon"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="right-icon"]').exists()).toBe(false);

    // disabled on native button when loading
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('disabled=true disables <button>', () => {
    const wrapper = mountButton({ props: { disabled: true }, slot: 'Disabled' });
    expect(wrapper.element.tagName.toLowerCase()).toBe('button');
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('as="a": does NOT set disabled attr, but sets aria-disabled and tabindex when disabled', () => {
    const wrapper = mountButton({
      props: { as: 'a', disabled: true },
      attrs: { href: '/billing' },
      slot: 'Billing',
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('a');
    expect(wrapper.attributes('href')).toBe('/billing');

    expect(wrapper.attributes('disabled')).toBeUndefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBe('-1');
  });

  it('as="a": aria-disabled="false" and no tabindex when enabled', () => {
    const wrapper = mountButton({
      props: { as: 'a', disabled: false },
      attrs: { href: '/ok' },
      slot: 'Ok',
    });

    expect(wrapper.attributes('aria-disabled')).toBe('false');
    expect(wrapper.attributes('tabindex')).toBeUndefined();
  });

  it('as="router-link": renders using RouterLink mock and sets aria-disabled/tabindex when disabled', () => {
    const wrapper = mountButton({
      props: { as: 'router-link', disabled: true },
      attrs: { to: '/home' },
      slot: 'Home',
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('a');
    expect(wrapper.attributes('data-router-link')).toBe('true');

    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBe('-1');
  });

  it('sets aria-label only for icon-only buttons when ariaLabel is provided', () => {
    const wrapper = mountButton({
      props: { iconLeft: LeftIcon, ariaLabel: 'Open settings' },
      // no slot => icon-only
    });

    expect(wrapper.attributes('aria-label')).toBe('Open settings');
  });

  it('does NOT set aria-label when there is a default slot (not icon-only)', () => {
    const wrapper = mountButton({
      props: { iconLeft: LeftIcon, ariaLabel: 'Should not apply' },
      slot: 'Settings',
    });

    expect(wrapper.attributes('aria-label')).toBeUndefined();
  });
});
