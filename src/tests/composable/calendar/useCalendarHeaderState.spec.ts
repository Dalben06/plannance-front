import { useCalendarHeaderState, type CalendarHeaderStore } from '@/composable/calendar/useCalendarHeaderState';
import { describe, it, expect, vi } from 'vitest';
import { effectScope, ref, nextTick } from 'vue';

describe('useCalendarHeaderState', () => {
  function create(params: { month: number; isLoading: boolean }) {
    const store: CalendarHeaderStore = {
      month: params.month,
      goToday: vi.fn(),
    };

    const currentMonth = ref(params.month);
    const isLoading = ref(params.isLoading);

    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarHeaderState({
        store,
        currentMonth,
        isLoading,
      }),
    );

    if (!state) throw new Error('state not created');

    return { store, currentMonth, isLoading, state, scope };
  }

  it('prevMonth sets store.month = currentMonth - 1 when not loading', () => {
    const { store, state, scope } = create({ month: 10, isLoading: false });

    state.prevMonth();
    expect(store.month).toBe(9);

    scope.stop();
  });

  it('nextMonth sets store.month = currentMonth + 1 when not loading', () => {
    const { store, state, scope } = create({ month: 10, isLoading: false });

    state.nextMonth();
    expect(store.month).toBe(11);

    scope.stop();
  });

  it('goToday calls store.goToday when not loading', () => {
    const { store, state, scope } = create({ month: 10, isLoading: false });

    state.goToday();
    expect(store.goToday).toHaveBeenCalledTimes(1);

    scope.stop();
  });

  it('guards interactions when loading=true (no month change, no goToday)', () => {
    const { store, state, scope } = create({ month: 10, isLoading: true });

    state.prevMonth();
    state.nextMonth();
    state.goToday();

    expect(store.month).toBe(10);
    expect(store.goToday).not.toHaveBeenCalled();

    scope.stop();
  });

  it('reacts when loading toggles (canInteract changes)', async () => {
    const { store, state, isLoading, scope } = create({ month: 10, isLoading: true });

    expect(state.canInteract.value).toBe(false);

    isLoading.value = false;
    await nextTick();

    expect(state.canInteract.value).toBe(true);

    state.nextMonth();
    expect(store.month).toBe(11);

    scope.stop();
  });
});
