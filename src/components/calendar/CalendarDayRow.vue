<script lang="ts" setup>
import { atNoon, isSameDay } from '@/utils/calendar-utils';
import type { CalendarDay } from '@/types/types.p';
import CalendarEventDay from '@/components/calendar/CalendarEventDay.vue';
import CalendarSummaryDay from '@/components/calendar/CalendarSummaryDay.vue';
import { useCalendarStore } from '@/stores/calendar';
import { storeToRefs } from 'pinia';

const { isLoading } = storeToRefs(useCalendarStore());

const props = defineProps<{
  currentDate: Date;
  days: CalendarDay[];
  maxChipsPerDay: number;
}>();

function isOutsideMonth(d: Date) {
  return d.getMonth() !== props.currentDate.getMonth() || d.getFullYear() !== props.currentDate.getFullYear();
}

const today = atNoon(new Date());
</script>

<template>
  <div v-for="day in days" :key="day.id" role="gridcell" class="min-h-0 rounded-2xl border border-white/10 bg-white/5 p-2
           shadow-[0_1px_2px_rgba(0,0,0,0.25)]
           transition hover:-translate-y-0.5 hover:bg-white/7 hover:border-[rgba(147,197,253,0.6)]
           hover:shadow-[0_10px_15px_rgba(0,0,0,0.35)]
           grid grid-rows-[auto_1fr_auto] gap-1" :class="[
            isSameDay(day.date, today)
              ? 'ring-2 ring-[rgba(96,165,250,0.35)] shadow-[0_10px_30px_rgba(59,130,246,0.12)]'
              : '',
            isOutsideMonth(day.date) ? 'opacity-50' : '',
          ]">
    <div class="flex items-center justify-between">
      <template v-if="isLoading">
        <span class="h-8 w-8 rounded-lg bg-white/10 animate-pulse" aria-hidden="true"></span>
      </template>
      <template v-else>
        <span class="grid h-8 w-8 place-items-center rounded-lg text-sm font-extrabold"
          :class="isSameDay(day.date, today) ? 'bg-blue-500/10 text-blue-200' : 'bg-white/5 text-white/85'">
          {{ day.date.getDate() }}
        </span>
      </template>
    </div>

    <template v-if="!isLoading">
      <calendar-event-day :events="day.events" :max-chips-per-day="props.maxChipsPerDay" />
    </template>
    <template v-else>
      <div class="mt-2 space-y-1">
        <span class="block h-3 w-20 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
        <span class="block h-3 w-14 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
      </div>
    </template>

    <template v-if="!isLoading">
      <calendar-summary-day :expense="day.expense" :income="day.income" />
    </template>
    <template v-else>
      <div class="mt-2 flex items-center gap-2">
        <span class="inline-block h-3 w-10 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
        <span class="inline-block h-3 w-10 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
      </div>
    </template>
  </div>
</template>
<style scoped></style>
