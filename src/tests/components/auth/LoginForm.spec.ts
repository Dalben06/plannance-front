import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import type { Ref } from 'vue';

// Module-scoped mocks so tests can assert against them
const mockPush = vi.fn(() => Promise.resolve());
vi.mock('vue-router', () => ({ useRouter: () => ({ push: mockPush }) }));

const mockSetUser = vi.fn();
const mockLoginAsDemo = vi.fn();
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ setUser: mockSetUser, loginAsDemo: mockLoginAsDemo }) }));

type LastForm = { emailRef: Ref<string>; passwordRef: Ref<string>; errors: Ref<Record<string, string>>; isSubmitting: Ref<boolean> } | undefined;
let lastForm: LastForm;
vi.mock('vee-validate', () => {
  return {
    useForm: () => {
      const emailRef = ref('');
      const passwordRef = ref('');
      const errors = ref<Record<string, string>>({});
      const isSubmitting = ref(false);

      lastForm = { emailRef, passwordRef, errors, isSubmitting };

      const handleSubmit = (fn: (vals: { email: string; password: string }) => unknown) => {
        return async () => {
          await fn({ email: emailRef.value, password: passwordRef.value });
        };
      };

      const defineField = (name: string) => {
        if (name === 'email') return [emailRef];
        if (name === 'password') return [passwordRef];
        return [ref('')];
      };

      return { handleSubmit, defineField, errors, isSubmitting };
    },
  };
});

// Now import the component under test
import LoginForm from '@/components/auth/LoginForm.vue';

describe('LoginForm.vue', () => {
  beforeEach(() => {
    // clear mocks
    mockPush.mockClear();
    mockSetUser.mockClear();
    mockLoginAsDemo.mockClear();
    lastForm = undefined;
  });

  function makeStubs() {
    // BaseInput stub that proxies update:modelValue and shows error text in .err
    const BaseInput = {
      props: ['modelValue', 'error', 'disabled', 'type', 'placeholder'],
      emits: ['update:modelValue'],
      template: `<div>
        <input data-test-input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
        <span class="err">{{ error }}</span>
        <slot name="prefix" />
      </div>`,
    };

    // BaseButton stub that emits click and renders slot
    const BaseButton = {
      props: ['disabled', 'variant'],
      emits: ['click'],
      template: `<button @click="$emit('click')"><slot /></button>`,
    };

    // Heroicon stubs
    const EnvelopeIcon = { template: '<svg />' };
    const LockClosedIcon = { template: '<svg />' };

    return { global: { components: { BaseInput, 'base-button': BaseButton, BaseButton, EnvelopeIcon, LockClosedIcon } } };
  }

  it('submits the form and navigates on successful login', async () => {
    const wrapper = mount(LoginForm, makeStubs());

    // Access the mocked form created during component setup
    const last = lastForm;
    expect(last).toBeDefined();

    // Set email and password values via the refs
    last!.emailRef.value = 'test@example.com';
    last!.passwordRef.value = 'password123';

    // Trigger form submit
    await wrapper.find('form').trigger('submit');

    // auth.setUser should be called and router.push should have been called to /calendar
    expect(mockSetUser).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith({ path: '/calendar' });
  });

  it('login as guest calls auth.loginAsDemo and navigates', async () => {
    const wrapper = mount(LoginForm, makeStubs());

    const guestBtn = wrapper.findAll('button').find((b) => b.text().includes('Log in as guest'));
    expect(guestBtn).toBeTruthy();
    await guestBtn!.trigger('click');

    expect(mockLoginAsDemo).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith({ path: '/calendar' });
  });

  // it('displays validation errors from vee-validate', async () => {
  //   const wrapper = mount(LoginForm, makeStubs());
  //   const last = lastForm;
  //   expect(last).toBeDefined();

  //   // simulate validation errors
  //   last!.errors.value = { email: 'Invalid email', password: 'Too short' };
  //   await nextTick();

  //   const errs = wrapper.findAll('.err').map((n) => n.text());
  //   // At least one of the err spans should contain the email error
  //   expect(errs.join(' ')).toContain('Invalid email');
  //   expect(errs.join(' ')).toContain('Too short');
  // });
});
