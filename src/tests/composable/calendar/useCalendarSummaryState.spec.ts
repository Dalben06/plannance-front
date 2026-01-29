import { useCalendarSummaryState } from '@/composable/calendar/useCalendarSummaryState';
import { describe, it, expect } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';

describe('useCalendarSummaryState', () => {
  it('returns "Loading..." for both values when isLoading=true', () => {
    const expenses = ref(100);
    const income = ref(200);
    const isLoading = ref(true);

    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarSummaryState({
        expenses,
        income,
        isLoading,
        formatCurrency: (n) => `USD(${n})`,
      }),
    );
    if (!state) throw new Error('state not created');

    expect(state.expenseFormatted.value).toBe('Loading...');
    expect(state.incomeFormatted.value).toBe('Loading...');

    scope.stop();
  });

  it('formats values using formatter when isLoading=false', () => {
    const expenses = ref(1234);
    const income = ref(5678);
    const isLoading = ref(false);

    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarSummaryState({
        expenses,
        income,
        isLoading,
        formatCurrency: (n) => `$${n.toFixed(2)}`,
      }),
    );
    if (!state) throw new Error('state not created');

    expect(state.expenseFormatted.value).toBe('$1234.00');
    expect(state.incomeFormatted.value).toBe('$5678.00');

    scope.stop();
  });

  it('reacts to changes of isLoading and amounts', async () => {
    const expenses = ref(10);
    const income = ref(20);
    const isLoading = ref(true);

    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarSummaryState({
        expenses,
        income,
        isLoading,
        formatCurrency: (n) => `FMT:${n}`,
      }),
    );
    if (!state) throw new Error('state not created');

    // starts loading
    expect(state.expenseFormatted.value).toBe('Loading...');
    expect(state.incomeFormatted.value).toBe('Loading...');

    // stop loading -> formatted
    isLoading.value = false;
    await nextTick();

    expect(state.expenseFormatted.value).toBe('FMT:10');
    expect(state.incomeFormatted.value).toBe('FMT:20');

    // change values -> formatted updates
    expenses.value = 99;
    income.value = 0;
    await nextTick();

    expect(state.expenseFormatted.value).toBe('FMT:99');
    expect(state.incomeFormatted.value).toBe('FMT:0');

    // loading again -> back to Loading...
    isLoading.value = true;
    await nextTick();

    expect(state.expenseFormatted.value).toBe('Loading...');
    expect(state.incomeFormatted.value).toBe('Loading...');

    scope.stop();
  });
});
