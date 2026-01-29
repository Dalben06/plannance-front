<script lang="ts" setup>
import { useCalendarStore } from '@/stores/calendar';
import { formatCurrency } from '@/utils/calendar-utils';
import { storeToRefs } from 'pinia';

import { ChartBarIcon, ArrowTrendingUpIcon, ChartPieIcon, BanknotesIcon } from '@/ui/icons';
import { useCalendarSummaryState } from '@/composable/calendar/useCalendarSummaryState';

const { expenses, income, isLoading } = storeToRefs(useCalendarStore());

const { expenseFormatted, incomeFormatted } = useCalendarSummaryState({
  expenses,
  income,
  isLoading,
  formatCurrency,
});
</script>

<template>
  <section class="py-16">
    <div class="mx-auto w-full max-w-6xl px-4">
      <div class="grid gap-4 md:grid-cols-4">
        <!-- Expenses -->
        <article class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <div class="text-xl" aria-hidden="true">
            <ChartBarIcon class="h-6 w-6 text-white/85" aria-hidden="true" />
          </div>
          <h3 class="mt-2 text-base font-bold tracking-tight">
            <template v-if="isLoading">
              <span class="block h-4 w-24 rounded bg-white/20 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>Expenses</template>
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-white/70">
            <template v-if="isLoading">
              <span class="block h-6 w-32 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>{{ expenseFormatted }}</template>
          </p>
        </article>

        <!-- Income -->
        <article class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <div class="text-xl" aria-hidden="true">
            <ArrowTrendingUpIcon class="h-6 w-6 text-white/85" aria-hidden="true" />
          </div>
          <h3 class="mt-2 text-base font-bold tracking-tight">
            <template v-if="isLoading">
              <span class="block h-4 w-20 rounded bg-white/20 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>Income</template>
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-white/70">
            <template v-if="isLoading">
              <span class="block h-6 w-28 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>{{ incomeFormatted }}</template>
          </p>
        </article>

        <!-- Budget -->
        <article class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <div class="text-xl" aria-hidden="true">
            <ChartPieIcon class="h-6 w-6 text-white/85" aria-hidden="true" />
          </div>
          <h3 class="mt-2 text-base font-bold tracking-tight">
            <template v-if="isLoading">
              <span class="block h-4 w-20 rounded bg-white/20 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>Budget</template>
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-white/70">
            <template v-if="isLoading">
              <span class="block h-6 w-28 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>$4,000.00</template>
          </p>
        </article>

        <!-- Balance -->
        <article class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <div class="text-xl" aria-hidden="true">
            <BanknotesIcon class="h-6 w-6 text-white/85" aria-hidden="true" />
          </div>
          <h3 class="mt-2 text-base font-bold tracking-tight">
            <template v-if="isLoading">
              <span class="block h-4 w-20 rounded bg-white/20 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>Balance</template>
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-white/70">
            <template v-if="isLoading">
              <span class="block h-6 w-32 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
            </template>
            <template v-else>$10,000.00</template>
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
