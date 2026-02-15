<script lang="ts" setup>
import { atNoon, isSameDay, toISODate, toKey } from '@/utils/calendar-utils';
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

const today = atNoon(new Date());

function isOutsideMonth(d: Date | string): boolean {
  const date = toISODate(d);

  return (
    date.getMonth() !== props.currentDate.getMonth() ||
    date.getFullYear() !== props.currentDate.getFullYear()
  );
}

function isToday(d: Date | string): boolean {
  return isSameDay(d, today);
}

function toKeyDate(d: Date | string): string {
  return toKey(d);
}

function cellClass(d: Date | string): string {
  const classes: string[] = [];
  if (isToday(d)) {
    classes.push('ring-2 ring-[rgba(96,165,250,0.35)] shadow-[0_10px_30px_rgba(59,130,246,0.12)]');
  }
  if (isOutsideMonth(d)) classes.push('opacity-50');
  return classes.join(' ');
}

function dayBadgeClass(d: Date | string): string {
  return isToday(d) ? 'bg-blue-500/10 text-blue-200' : 'bg-white/5 text-white/85';
}
</script>

<template>
  <div v-for="day in props.days" :key="toKeyDate(day.date)" role="gridcell" data-testid="day-cell"
      class="min-h-32 rounded-2xl border border-white/10 bg-white/5 p-2
           shadow-[0_1px_2px_rgba(0,0,0,0.25)]
           transition hover:-translate-y-0.5 hover:bg-white/7 hover:border-[rgba(147,197,253,0.6)]
           hover:shadow-[0_10px_15px_rgba(0,0,0,0.35)]
           grid grid-rows-[auto_1fr_auto] gap-1" :class="cellClass(day.date)">
    <div class="flex items-center justify-between">
      <template v-if="isLoading">
        <span data-testid="day-skeleton" class="h-8 w-8 rounded-lg bg-white/10 animate-pulse" aria-hidden="true"></span>
      </template>
      <template v-else>
        <span data-testid="day-number" class="grid h-8 w-8 place-items-center rounded-lg text-sm font-extrabold"
          :class="dayBadgeClass(day.date)">
          {{ toISODate(day.date).getDate() }}
        </span>
      </template>
    </div>

    <template v-if="!isLoading">
      <CalendarEventDay data-testid="event-day" :events="day.events" :max-chips-per-day="props.maxChipsPerDay" />
    </template>
    <template v-else>
      <div data-testid="events-skeleton" class="mt-2 space-y-1">
        <span class="block h-3 w-20 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
        <span class="block h-3 w-14 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
      </div>
    </template>

    <template v-if="!isLoading">
      <CalendarSummaryDay data-testid="summary-day" :expense="day.expense" :income="day.income" />
    </template>
    <template v-else>
      <div data-testid="summary-skeleton" class="mt-2 flex items-center gap-2">
        <span class="inline-block h-3 w-10 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
        <span class="inline-block h-3 w-10 rounded bg-white/10 animate-pulse" aria-hidden="true"></span>
      </div>
    </template>
  </div>
</template>
