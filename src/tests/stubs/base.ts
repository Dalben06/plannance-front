import { defineComponent, h, type PropType } from 'vue';

export type SelectOption = {
  label: string;
  value: string;
};

export const BaseModalStub = defineComponent({
  name: 'BaseModal',
  props: {
    modelValue: { type: Boolean, default: false },
    size: { type: String, default: 'md' },
  },
  emits: {
    close: () => true,
  },
  setup(props, { slots, emit, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-stub': 'base-modal',
          'data-open': String(props.modelValue),
          'data-size': props.size,
        },
        [
          h('button', { 'data-testid': 'modal-close', onClick: () => emit('close') }, 'x'),
          h('header', { 'data-testid': 'modal-header' }, slots.header?.()),
          h('section', { 'data-testid': 'modal-body' }, slots.body?.()),
          h('footer', { 'data-testid': 'modal-footer' }, slots.footer?.()),
        ],
      );
  },
});

export const BaseButtonStub = defineComponent({
  name: 'BaseButton',
  props: {
    variant: { type: String, default: undefined },
    type: { type: String, default: undefined },
  },
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

export const BaseInputStub = defineComponent({
  name: 'BaseInput',
  props: {
    modelValue: { type: [String, Number], default: '' },
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    type: { type: String, default: 'text' },
    error: { type: [String, Boolean] as PropType<string | boolean>, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, emit, attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-stub': 'base-input',
          'data-input-id': props.id ?? '',
          'data-error': String(Boolean(props.error)),
        },
        [
          props.label ? h('label', { for: props.id }, props.label) : null,
          slots.prefix ? h('span', { 'data-testid': 'input-prefix' }, slots.prefix()) : null,
          h('input', {
            id: props.id,
            type: props.type,
            disabled: props.disabled,
            value: String(props.modelValue ?? ''),
            onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
          }),
        ],
      );
  },
});

export const BaseDatePickerStub = defineComponent({
  name: 'BaseDatePicker',
  props: {
    modelValue: { type: [String, Date] as PropType<string | Date>, default: '' },
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
  },
  setup(props, { emit, attrs }) {
    return () =>
      h('div', { ...attrs, 'data-stub': 'base-date-picker' }, [
        props.label ? h('label', { for: props.id }, props.label) : null,
        h('input', {
          id: props.id,
          value: typeof props.modelValue === 'string' ? props.modelValue : props.modelValue.toISOString(),
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        }),
      ]);
  },
});

export const BaseSelectStub = defineComponent({
  name: 'BaseSelect',
  props: {
    modelValue: { type: String, default: '' },
    id: { type: String, default: undefined },
    label: { type: String, default: undefined },
    options: { type: Array as PropType<SelectOption[]>, default: () => [] },
  },
  setup(props, { emit, attrs }) {
    return () =>
      h('div', { ...attrs, 'data-stub': 'base-select' }, [
        props.label ? h('label', { for: props.id }, props.label) : null,
        h(
          'select',
          {
            id: props.id,
            value: props.modelValue,
            onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value),
          },
          props.options.map((o) => h('option', { key: o.value, value: o.value }, o.label)),
        ),
      ]);
  },
});

// handy export for tests
export const baseComponentStubs = {
  BaseModal: BaseModalStub,
  'base-modal': BaseModalStub,
  BaseButton: BaseButtonStub,
  'base-button': BaseButtonStub,
  BaseInput: BaseInputStub,
  'base-input': BaseInputStub,
  BaseDatePicker: BaseDatePickerStub,
  'base-date-picker': BaseDatePickerStub,
  BaseSelect: BaseSelectStub,
  'base-select': BaseSelectStub,
};
