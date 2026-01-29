import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';

// BaseButton stub: just emits click + renders slot
const BaseButtonStub = defineComponent({
  name: 'BaseButton',
  props: {
    iconLeft: { type: null, default: undefined },
    variant: { type: String, default: undefined },
    type: { type: String, default: undefined },
  },
  emits: ['click'],
  setup(props, { slots, emit, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          'data-stub': 'base-button',
          'data-variant': props.variant ?? '',
          type: props.type ?? 'button',
          onClick: (e: Event) => emit('click', e),
        },
        slots.default?.(),
      );
  },
});

// AddEventModal stub: supports v-model via modelValue + update:modelValue
const AddEventModalStub = defineComponent({
  name: 'AddEventModal',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('div', {
        ...attrs,
        'data-stub': 'add-event-modal',
        'data-open': String(props.modelValue),
        // helper for tests: clicking modal "closes" it
        onClick: () => emit('update:modelValue', false),
      });
  },
});

// IMPORTANT: import after stubs are declared in this file (no module mocks needed here)
import AddEventToolbar from '@/components/toolbar/AddEventToolbar.vue'; // adjust path if needed

function mountToolbar() {
  return mount(AddEventToolbar, {
    global: {
      stubs: {
        BaseButton: BaseButtonStub,
        AddEventModal: AddEventModalStub,
      },
    },
  });
}

describe('AddEventToolbar', () => {
  it('renders the "Add event" button', () => {
    const wrapper = mountToolbar();

    const btn = wrapper.get('[data-testid="add-event-button"]');
    expect(btn.text()).toContain('Add event');
    expect(btn.attributes('data-variant')).toBe('primary');
    expect(btn.attributes('type')).toBe('button');
  });

  it('starts with modal closed', () => {
    const wrapper = mountToolbar();
    const modal = wrapper.get('[data-testid="add-event-modal"]');

    expect(modal.attributes('data-open')).toBe('false');
  });

  it('opens modal when button is clicked', async () => {
    const wrapper = mountToolbar();

    await wrapper.get('[data-testid="add-event-button"]').trigger('click');
    await nextTick();

    const modal = wrapper.get('[data-testid="add-event-modal"]');
    expect(modal.attributes('data-open')).toBe('true');
  });

  it('closes modal when modal emits update:modelValue=false', async () => {
    const wrapper = mountToolbar();

    // open first
    await wrapper.get('[data-testid="add-event-button"]').trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="add-event-modal"]').attributes('data-open')).toBe('true');

    // our modal stub emits update:modelValue(false) on click
    await wrapper.get('[data-testid="add-event-modal"]').trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="add-event-modal"]').attributes('data-open')).toBe('false');
  });
});
