import { computed, type ComputedRef, type Ref } from 'vue';

export type CalendarHeaderStore = {
  // month is a store state property (number)
  month: number;
  goToday: () => void;
};

export function useCalendarHeaderState(params: {
  store: CalendarHeaderStore;
  currentMonth: Ref<number>;
  isLoading: Ref<boolean>;
}): {
  isBusy: ComputedRef<boolean>;
  canInteract: ComputedRef<boolean>;
  prevMonth: () => void;
  nextMonth: () => void;
  goToday: () => void;
} {
  const isBusy = computed(() => params.isLoading.value);
  const canInteract = computed(() => !params.isLoading.value);

  function prevMonth(): void {
    if (!canInteract.value) return;
    params.store.month = params.currentMonth.value - 1;
  }

  function nextMonth(): void {
    if (!canInteract.value) return;
    params.store.month = params.currentMonth.value + 1;
  }

  function goToday(): void {
    if (!canInteract.value) return;
    params.store.goToday();
  }

  return { isBusy, canInteract, prevMonth, nextMonth, goToday };
}
