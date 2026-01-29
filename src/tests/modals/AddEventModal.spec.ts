
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { reactive, ref, nextTick, type Ref } from 'vue';
import { baseComponentStubs } from '@/tests/stubs/base';

// ----------------------
// vee-validate mocks (typed)
// ----------------------
type FieldMap = Record<string, Ref<string>>;

const fields: FieldMap = {};
const isSubmittingRef = ref(false);
const errorsObj = reactive<{ amount?: string }>({ amount: 'Amount is required' });

vi.mock('vee-validate', () => {
  return {
    useForm: () => ({
      handleSubmit: (fn: () => void) => () => fn(),
      defineField: (name: string) => {
        if (!fields[name]) fields[name] = ref('');
        return [fields[name]] as const;
      },
      errors: errorsObj,
      isSubmitting: isSubmittingRef,
    }),
  };
});

vi.mock('@vee-validate/yup', () => ({
  toTypedSchema: (schema: unknown) => schema,
}));

// minimal yup mock (no any)
type YupChain = {
  email(): YupChain;
  required(): YupChain;
  default(_v: unknown): YupChain;
  oneOf(_v: readonly string[]): YupChain;
};

vi.mock('yup', () => {
  const chain = (): YupChain => ({
    email() {
      return this;
    },
    required() {
      return this;
    },
    default() {
      return this;
    },
    oneOf() {
      return this;
    },
  });

  return {
    object: (shape: unknown) => shape,
    string: chain,
    date: chain,
    number: chain,
  };
});

// IMPORTANT: import after mocks
import AddEventModal from '@/components/modals/AddEventModal.vue';

function mountModal(modelValue = true) {
  return mount(AddEventModal, {
    props: { modelValue },
    global: { stubs: baseComponentStubs },
  });
}

function findBaseInputById(wrapper: ReturnType<typeof mountModal>, id: string) {
  const inputs = wrapper.findAll('[data-stub="base-input"]');
  const target = inputs.find((w) => w.attributes('data-input-id') === id);
  if (!target) throw new Error(`BaseInput stub not found for id="${id}"`);
  return target;
}

describe('AddEventModal', () => {
  beforeEach(() => {
    isSubmittingRef.value = false;
    errorsObj.amount = 'Amount is required';
    Object.values(fields).forEach((r) => (r.value = ''));
  });

  it('does not render when modelValue is false', () => {
    const wrapper = mountModal(false);
    expect(wrapper.find('[data-stub="base-modal"]').exists()).toBe(false);
  });

  it('renders modal + header + fields when open', () => {
    const wrapper = mountModal(true);

    // must exist => use get()
    wrapper.get('[data-stub="base-modal"]');
    expect(wrapper.get('[data-testid="modal-header"]').text()).toContain('Add New Event');

    wrapper.get('#event-title');
    wrapper.get('#event-date');
    wrapper.get('#event-amount');
    wrapper.get('#event-type');

    // prefix "$" rendered inside Amount BaseInput
    expect(wrapper.get('[data-testid="input-prefix"]').text()).toContain('$');

    const options = wrapper.get('#event-type').findAll('option').map((o) => o.text());
    expect(options).toEqual(['Income', 'Expense']);
  });

  it('emits update:modelValue=false when BaseModal emits close', async () => {
    const wrapper = mountModal(true);

    await wrapper.get('[data-testid="modal-close"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('Cancel closes the modal', async () => {
    const wrapper = mountModal(true);

    const buttons = wrapper.findAll('[data-stub="base-button"]');
    const cancel = buttons.find((b) => b.text().trim() === 'Cancel');
    if (!cancel) throw new Error('Cancel button not found');

    await cancel.trigger('click');

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('Add Event closes the modal', async () => {
    const wrapper = mountModal(true);

    const buttons = wrapper.findAll('[data-stub="base-button"]');
    const add = buttons.find((b) => b.text().trim() === 'Add Event');
    if (!add) throw new Error('Add Event button not found');

    await add.trigger('click');

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('passes amount error + disabled state into Amount input', async () => {
    const wrapper = mountModal(true);

    const amountBaseInput = findBaseInputById(wrapper, 'event-amount');
    expect(amountBaseInput.attributes('data-error')).toBe('true');

    // disabled initially false
    expect(wrapper.get('#event-amount').attributes('disabled')).toBeUndefined();

    // when submitting -> disabled true
    isSubmittingRef.value = true;
    await nextTick();

    expect(wrapper.get('#event-amount').attributes('disabled')).toBeDefined();
  });
});
