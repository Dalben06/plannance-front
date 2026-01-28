<script lang="ts" setup>
import { useCalendarStore } from '@/stores/calendar';
import { storeToRefs } from 'pinia';
import { ChevronLeftIcon, ChevronRightIcon } from '@/ui/icons';

const props = withDefaults(
  defineProps<{
    month?: string;
  }>(),
  { month: 'December' },
);

const calendarStore = useCalendarStore();
const { month: currentMonth , isLoading} = storeToRefs(calendarStore);
function prevMonth() {
  calendarStore.month = currentMonth.value - 1;
}

function nextMonth() {
  calendarStore.month = currentMonth.value + 1
}

function goToday() {
  calendarStore.goToday();
}

</script>

<template>
  <header
    class="grid items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
    style="grid-template-columns: 1fr auto 1fr"
    :aria-busy="isLoading"
  >
    <div class="flex items-center gap-2">
      <button type="button" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 font-bold text-white/90
               transition hover:bg-white/10 active:translate-y-px
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
        aria-label="Previous month"
        :disabled="isLoading"
        @click="prevMonth">
        <ChevronLeftIcon class="h-5 w-5 text-white/85" aria-hidden="true" />
      </button>

      <button type="button" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 font-bold text-white/90
               transition hover:bg-white/10 active:translate-y-px
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
        aria-label="Next month"
        :disabled="isLoading"
        @click="nextMonth">
        <ChevronRightIcon class="h-5 w-5 text-white/85" aria-hidden="true" />
      </button>

      <button type="button" class="rounded-full border border-white/10 bg-transparent px-3 py-2 text-sm font-semibold text-white/80
               transition hover:bg-white/5 active:translate-y-px
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
        :disabled="isLoading"
        @click="goToday">
        Today
      </button>
    </div>

    <h2 class="m-0 text-center text-lg font-semibold tracking-tight text-white/90">
      <template v-if="isLoading">
        <span class="inline-block h-6 w-48 rounded bg-white/20 animate-pulse" aria-hidden="true"></span>
      </template>
      <template v-else>{{ props.month }}</template>
    </h2>

    <div class="flex justify-end">
      <!-- future: search / filters -->
    </div>
  </header>
</template>
<style scoped></style>
