<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  expense: number;
  income: number;
}>();

function formatter(amount: number) {
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  return fmt.format(amount);
}

const expenseFormat = computed(() => formatter(props.expense));
const incomeFormat = computed(() => formatter(props.income));
</script>

<template>
  <div class="mt-1 flex min-h-0 flex-col gap-1 overflow-hidden">
    <div v-if="props.expense > 0"
      class="truncate rounded-xl border border-white/10 bg-rose-400/10 px-2 py-0.5 text-[10px] font-semibold text-white/85 border-l-4 border-l-rose-400/60"
      :title="`Spent: ${expenseFormat}`">
      Spent: {{ expenseFormat }}
    </div>

    <div v-if="props.income > 0"
      class="truncate rounded-xl border border-white/10 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-white/85 border-l-4 border-l-emerald-400/60"
      :title="`Income: ${incomeFormat}`">
      Income: {{ incomeFormat }}
    </div>
  </div>
</template>
<style scoped></style>
