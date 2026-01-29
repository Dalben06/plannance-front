import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick } from 'vue';

// --- Router mock (push + reactive currentRoute) ---
const pushMock = vi.fn().mockResolvedValue(undefined);
const currentRoute = ref({ fullPath: '/calendar' });

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
    currentRoute,
  }),
}));

// --- APP_NAV mock ---
vi.mock('@/nav', () => ({
  APP_NAV: [
    { to: '/calendar', label: 'Calendar', icon: {} },
    { to: '/settings', label: 'Settings', icon: {} },
  ],
}));

// --- BaseButton stub: renders button or anchor; exposes props via data-* ---
const BaseButtonStub = defineComponent({
  name: 'BaseButton',
  props: {
    as: { type: String, default: 'button' },
    to: { type: [String, Object], default: undefined },
    variant: { type: String, default: undefined },
    iconLeft: { type: null, default: undefined },
    type: { type: String, default: undefined },
  },
  emits: ['click'],
  setup(props, { slots, emit, attrs }) {
    return () => {
      const isLink = props.as === 'router-link';
      const tag = isLink ? 'a' : 'button';
      const dataTo =
        typeof props.to === 'string'
          ? props.to
          : props.to
            ? JSON.stringify(props.to)
            : '';

      return h(
        tag,
        {
          ...attrs,
          'data-as': props.as,
          'data-to': dataTo,
          'data-variant': props.variant ?? '',
          type: tag === 'button' ? props.type ?? 'button' : undefined,
          onClick: (e: Event) => emit('click', e),
        },
        slots.default?.(),
      );
    };
  },
});

// --- Child stubs ---
const AddEventToolbarStub = defineComponent({
  name: 'AddEventToolbar',
  setup(_, { attrs }) {
    return () => h('div', { ...attrs, 'data-stub': 'add-event-toolbar' }, 'AddEventToolbar');
  },
});

const UserMenubarStub = defineComponent({
  name: 'UserMenubar',
  setup(_, { attrs }) {
    return () => h('div', { ...attrs, 'data-stub': 'user-menubar' }, 'UserMenubar');
  },
});

// IMPORTANT: import after mocks
import DesktopToolbar from '@/components/toolbar/DesktopToolbar.vue'; // adjust path if needed

function mountToolbar(title = 'Dashboard') {
  return mount(DesktopToolbar, {
    props: { title },
    global: {
      stubs: {
        BaseButton: BaseButtonStub,
        AddEventToolbar: AddEventToolbarStub,
        UserMenubar: UserMenubarStub,
      },
    },
  });
}

describe('DesktopToolbar', () => {
  beforeEach(() => {
    pushMock.mockReset().mockResolvedValue(undefined);
    currentRoute.value.fullPath = '/calendar';
  });

  it('renders the title', () => {
    const wrapper = mountToolbar('My Page');
    expect(wrapper.get('[data-testid="toolbar-title"]').text()).toBe('My Page');
  });

  it('renders nav items from APP_NAV', () => {
    const wrapper = mountToolbar();

    const items = wrapper.findAll('[data-testid="nav-item"]');
    expect(items).toHaveLength(2);

    expect(items[0]?.text()).toContain('Calendar');
    expect(items[0]?.attributes('data-as')).toBe('router-link');
    expect(items[0]?.attributes('data-to')).toBe('/calendar');

    expect(items[1]?.text()).toContain('Settings');
    expect(items[1]?.attributes('data-as')).toBe('router-link');
    expect(items[1]?.attributes('data-to')).toBe('/settings');
  });

  it('sets variant="secondary" for active route and "primary" for others', () => {
    const wrapper = mountToolbar();

    const items = wrapper.findAll('[data-testid="nav-item"]');
    const calendar = items.find((n) => n.text().includes('Calendar'))!;
    const settings = items.find((n) => n.text().includes('Settings'))!;

    expect(calendar.attributes('data-variant')).toBe('secondary');
    expect(settings.attributes('data-variant')).toBe('primary');
  });

  it('reacts to route changes and updates active variants', async () => {
    const wrapper = mountToolbar();

    currentRoute.value.fullPath = '/settings';
    await nextTick();

    const items = wrapper.findAll('[data-testid="nav-item"]');
    const calendar = items.find((n) => n.text().includes('Calendar'))!;
    const settings = items.find((n) => n.text().includes('Settings'))!;

    expect(calendar.attributes('data-variant')).toBe('primary');
    expect(settings.attributes('data-variant')).toBe('secondary');
  });

  it('clicking the brand button navigates home', async () => {
    const wrapper = mountToolbar();

    await wrapper.get('[data-testid="brand-button"]').trigger('click');

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith({ path: '/' });
  });

  it('renders AddEventToolbar and UserMenubar', () => {
    const wrapper = mountToolbar();

    expect(wrapper.get('[data-testid="add-event-toolbar"]').attributes('data-stub')).toBe(
      'add-event-toolbar',
    );
    expect(wrapper.get('[data-testid="user-menubar"]').attributes('data-stub')).toBe('user-menubar');
  });

  it('goHome does not throw if router.push rejects', async () => {
    pushMock.mockRejectedValueOnce(new Error('navigation error'));

    const wrapper = mountToolbar();
    await wrapper.get('[data-testid="brand-button"]').trigger('click');

    expect(pushMock).toHaveBeenCalledTimes(1);
    // passing test = no unhandled rejection
  });
});
