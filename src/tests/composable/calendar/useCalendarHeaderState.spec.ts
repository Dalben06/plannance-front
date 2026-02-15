import { useCalendarHeaderState, type CalendarHeaderStore } from '@/composable/calendar/useCalendarHeaderState';
import { describe, it, expect, vi } from 'vitest';
import { effectScope, ref, nextTick } from 'vue';

describe('useCalendarHeaderState', () => {
  function create(params: { month: number; isLoading: boolean }) {
    const date = new Date(2026, params.month, 15);
    const store: CalendarHeaderStore = {
      month: params.month,
      goToday: vi.fn(),
      date,
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

  it('prevMonth sets store.date to previous month when not loading', () => {
    const { store, state, scope } = create({ month: 10, isLoading: false });

    state.prevMonth();
    expect(store.date.getMonth()).toBe(9);
    expect(store.date.getFullYear()).toBe(2026);

    scope.stop();
  });

  it('nextMonth sets store.date to next month when not loading', () => {
    const { store, state, scope } = create({ month: 10, isLoading: false });

    state.nextMonth();
    expect(store.date.getMonth()).toBe(11);
    expect(store.date.getFullYear()).toBe(2026);

    scope.stop();
  });

  it('goToday calls store.goToday when not loading', () => {
    const { store, state, scope } = create({ month: 10, isLoading: false });

    state.goToday();
    expect(store.goToday).toHaveBeenCalledTimes(1);

    scope.stop();
  });

  it('guards interactions when loading=true (no date change, no goToday)', () => {
    const { store, state, scope } = create({ month: 10, isLoading: true });
    const initialTime = store.date.getTime();

    state.prevMonth();
    state.nextMonth();
    state.goToday();

    expect(store.date.getTime()).toBe(initialTime);
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
    expect(store.date.getMonth()).toBe(11);

    scope.stop();
  });
});
