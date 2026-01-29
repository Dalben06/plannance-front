// src/tests/components/base/BaseModal.spec.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { h, nextTick, type VNode } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue'; // adjust path if needed

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

type BaseModalProps = {
  modelValue: boolean;
  title?: string;
  description?: string;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showClose?: boolean;
};

type Slots = {
  header?: () => VNode[];
  body?: () => VNode[];
  footer?: () => VNode[];
};

type MountOptions = {
  props?: Partial<BaseModalProps>;
  slots?: Slots;
};

function mountModal(options: MountOptions = {}): VueWrapper {
  const { props = {}, slots } = options;

  const mergedProps: BaseModalProps = {
    modelValue: false,
    size: 'md',
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
    title: props.title,
    description: props.description,
    ...props,
  };

  return mount(BaseModal, {
    props: mergedProps,
    slots,
    global: {
      stubs: {
        teleport: true,
        // Make BaseButton clickable in tests
        BaseButton: {
          name: 'BaseButton',
          props: {
            ariaLabel: { type: String, required: false },
          },
          emits: ['click'],
          setup(_, { emit }) {
            return () =>
              h(
                'button',
                { 'data-testid': 'close-btn', onClick: () => emit('click') },
                'X',
              );
          },
        },
      },
    },
  });
}

function isScrollLocked(): boolean {
  return document.documentElement.classList.contains('overflow-hidden');
}

afterEach(() => {
  document.documentElement.classList.remove('overflow-hidden');
  vi.restoreAllMocks();
});

describe('BaseModal', () => {
  it('does not render when closed', () => {
    const wrapper = mountModal({ props: { modelValue: false } });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    expect(isScrollLocked()).toBe(false);
  });

  it('renders title/description and slots when open', () => {
    const wrapper = mountModal({
      props: { modelValue: true, title: 'Title', description: 'Desc' },
      slots: {
        header: () => [h('div', { 'data-testid': 'header-slot' }, 'Header')],
        body: () => [h('div', { 'data-testid': 'body-slot' }, 'Body')],
        footer: () => [h('div', { 'data-testid': 'footer-slot' }, 'Footer')],
      },
    });

    expect(wrapper.text()).toContain('Title');
    expect(wrapper.text()).toContain('Desc');
    expect(wrapper.get('[data-testid="header-slot"]').text()).toBe('Header');
    expect(wrapper.get('[data-testid="body-slot"]').text()).toBe('Body');
    expect(wrapper.get('[data-testid="footer-slot"]').text()).toBe('Footer');
  });

  it('locks scroll when opened and unlocks when closed', async () => {
    const wrapper = mountModal({ props: { modelValue: false } });
    expect(isScrollLocked()).toBe(false);

    await wrapper.setProps({ modelValue: true });
    await nextTick();
    expect(isScrollLocked()).toBe(true);

    await wrapper.setProps({ modelValue: false });
    await nextTick();
    expect(isScrollLocked()).toBe(false);
  });

  it('closes on overlay click when closeOnOverlay=true', async () => {
    const wrapper = mountModal({ props: { modelValue: true, closeOnOverlay: true } });

    await wrapper.get('[data-testid="overlay"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.length).toBe(1);
  });

  it('does NOT close on overlay click when closeOnOverlay=false', async () => {
    const wrapper = mountModal({ props: { modelValue: true, closeOnOverlay: false } });

    await wrapper.get('[data-testid="overlay"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('close')).toBeUndefined();
  });

  it('closes on Escape when closeOnEsc=true', async () => {
    const wrapper = mountModal({ props: { modelValue: true, closeOnEsc: true } });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.length).toBe(1);
  });

  it('does NOT close on Escape when closeOnEsc=false', async () => {
    const wrapper = mountModal({ props: { modelValue: true, closeOnEsc: false } });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('close')).toBeUndefined();
  });

  it('renders close button only when showClose=true and clicking it closes', async () => {
    const wrapper = mountModal({ props: { modelValue: true, showClose: true } });
    expect(wrapper.find('[data-testid="close-btn"]').exists()).toBe(true);

    await wrapper.get('[data-testid="close-btn"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')?.length).toBe(1);
  });

  it('does not render close button when showClose=false', () => {
    const wrapper = mountModal({ props: { modelValue: true, showClose: false } });
    expect(wrapper.find('[data-testid="close-btn"]').exists()).toBe(false);
  });

  it('applies size classes (sm/md/lg/xl)', async () => {
    const wrapper = mountModal({ props: { modelValue: true, size: 'sm' } });
    expect(wrapper.get('[role="dialog"]').classes()).toContain('max-w-sm');

    await wrapper.setProps({ size: 'md' });
    await nextTick();
    expect(wrapper.get('[role="dialog"]').classes()).toContain('max-w-lg');

    await wrapper.setProps({ size: 'lg' });
    await nextTick();
    expect(wrapper.get('[role="dialog"]').classes()).toContain('max-w-2xl');

    await wrapper.setProps({ size: 'xl' });
    await nextTick();
    expect(wrapper.get('[role="dialog"]').classes()).toContain('max-w-4xl');
  });

  it('cleans up scroll lock on unmount', () => {
    const wrapper = mountModal({ props: { modelValue: true } });
    expect(isScrollLocked()).toBe(true);

    wrapper.unmount();
    expect(isScrollLocked()).toBe(false);
  });
});
