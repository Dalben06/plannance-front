import { useCalendarSummaryDayState } from '@/composable/calendar/useCalendarSummaryDayState';
import { describe, it, expect } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';

describe('useCalendarSummaryDayState', () => {
  it('showExpense/showIncome are true only when values are > 0', () => {
    const expense = ref(0);
    const income = ref(0);

    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarSummaryDayState({
        expense,
        income,
        format: (n) => `$${n.toFixed(2)}`,
      }),
    );
    if (!state) throw new Error('state not created');

    expect(state.showExpense.value).toBe(false);
    expect(state.showIncome.value).toBe(false);

    expense.value = 1;
    income.value = 10;
    expect(state.showExpense.value).toBe(true);
    expect(state.showIncome.value).toBe(true);

    expense.value = 0;
    income.value = -1;
    expect(state.showExpense.value).toBe(false);
    expect(state.showIncome.value).toBe(false);

    scope.stop();
  });

  it('formats amounts and builds titles using the formatter', () => {
    const expense = ref(12.5);
    const income = ref(100);

    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarSummaryDayState({
        expense,
        income,
        format: (n) => `USD(${n})`,
      }),
    );
    if (!state) throw new Error('state not created');

    expect(state.expenseFormat.value).toBe('USD(12.5)');
    expect(state.incomeFormat.value).toBe('USD(100)');

    expect(state.expenseTitle.value).toBe('Spent: USD(12.5)');
    expect(state.incomeTitle.value).toBe('Income: USD(100)');

    scope.stop();
  });

  it('reacts when expense/income change', async () => {
    const expense = ref(1);
    const income = ref(2);

    const scope = effectScope();
    const state = scope.run(() =>
      useCalendarSummaryDayState({
        expense,
        income,
        format: (n) => `$${n.toFixed(2)}`,
      }),
    );
    if (!state) throw new Error('state not created');

    expect(state.expenseTitle.value).toBe('Spent: $1.00');
    expect(state.incomeTitle.value).toBe('Income: $2.00');

    expense.value = 10;
    income.value = 0;
    await nextTick();

    expect(state.expenseTitle.value).toBe('Spent: $10.00');
    expect(state.showIncome.value).toBe(false);

    scope.stop();
  });
});
