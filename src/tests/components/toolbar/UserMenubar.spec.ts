import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, reactive, nextTick } from 'vue';

// ------------------------
// Mocks (router + auth)
// ------------------------
const pushMock = vi.fn().mockResolvedValue(undefined);
const logoutMock = vi.fn();

const authState = reactive<{
  user: null | { name: string; email: string };
  logout: () => void;
}>({
  user: { name: 'Leo', email: 'leo@test.com' },
  logout: logoutMock,
});

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState,
}));

// ------------------------
// BaseButton stub
// - renders as <a> when as="router-link"
// - renders as <button> otherwise
// - emits click so parent handlers run
// ------------------------
const BaseButtonStub = defineComponent({
  name: 'BaseButton',
  props: {
    as: { type: String, default: 'button' },
    to: { type: [String, Object], default: undefined },
    iconLeft: { type: null, default: undefined },
    variant: { type: String, default: undefined },
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
          'data-testid': 'base-button',
          'data-as': props.as,
          'data-to': dataTo,
          type: tag === 'button' ? props.type ?? 'button' : undefined,
          onClick: (e: Event) => emit('click', e),
        },
        slots.default?.(),
      );
    };
  },
});

import UseMenubar from '@/components/toolbar/UserMenubar.vue'; // adjust if needed

type MountOpts = {
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
};

function mountMenu(opts: MountOpts = {}): VueWrapper {
  const { props = {}, slots = {} } = opts;

  return mount(UseMenubar, {
    props,
    slots,
    global: {
      stubs: {
        BaseButton: BaseButtonStub,
        'base-button': BaseButtonStub, // in case your template uses kebab-case
      },
    },
  });
}

function openDetails(wrapper: VueWrapper) {
  const details = wrapper.get('details').element as HTMLDetailsElement;
  details.open = true;
  return details;
}

function getButtons(wrapper: VueWrapper) {
  return wrapper.findAll('[data-testid="base-button"]');
}

function getButtonByText(wrapper: VueWrapper, text: string) {
  const btn = getButtons(wrapper).find((b) => b.text().trim() === text);
  if (!btn) throw new Error(`Button not found with text: "${text}"`);
  return btn;
}

beforeEach(() => {
  // reset state per test
  authState.user = { name: 'Leo', email: 'leo@test.com' };
  pushMock.mockReset().mockResolvedValue(undefined);
  logoutMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('UseMenubar', () => {
  it('renders user name in the summary (logged in)', () => {
    const wrapper = mountMenu();
    const summary = wrapper.get('summary');

    expect(summary.text()).toContain('Leo');
  });

  it('renders fallback values when user is not signed in', () => {
    authState.user = null;

    const wrapper = mountMenu();

    expect(wrapper.get('summary').text()).toContain('Guest');
    expect(wrapper.text()).toContain('Guest');
    expect(wrapper.text()).toContain('Not signed in');
  });

  it('renders menu items with correct labels and link targets', () => {
    const wrapper = mountMenu();

    const settings = getButtonByText(wrapper, 'Settings');
    expect(settings.attributes('data-as')).toBe('router-link');
    expect(settings.attributes('data-to')).toBe('/settings');

    const calendar = getButtonByText(wrapper, 'Calendar');
    expect(calendar.attributes('data-as')).toBe('router-link');
    expect(calendar.attributes('data-to')).toBe('/calendar');

    const signOut = getButtonByText(wrapper, 'Sign out');
    // in the refactor this should be a button (as="button"), but we won’t over-couple:
    expect(signOut.exists()).toBe(true);
  });

  it('closes the details menu when clicking a navigation item', async () => {
    const wrapper = mountMenu();
    const details = openDetails(wrapper);
    expect(details.open).toBe(true);

    await getButtonByText(wrapper, 'Settings').trigger('click');
    await nextTick();

    expect(details.open).toBe(false);
  });

  it('logout: calls auth.logout, closes menu, and navigates to "/"', async () => {
    const wrapper = mountMenu();
    const details = openDetails(wrapper);

    await getButtonByText(wrapper, 'Sign out').trigger('click');

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith({ path: '/' });
    expect(details.open).toBe(false);
  });

  it('logout: does not throw if router.push rejects', async () => {
    pushMock.mockRejectedValueOnce(new Error('navigation error'));

    const wrapper = mountMenu();
    openDetails(wrapper);

    await getButtonByText(wrapper, 'Sign out').trigger('click');

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledTimes(1);
    // test passes if no unhandled rejection / throw occurs
  });
});
