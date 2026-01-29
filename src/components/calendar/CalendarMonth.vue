<script setup lang="ts">
import { computed, toRef } from 'vue';
import CalendarHeader from '@/components/calendar/CalendarHeader.vue';
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
import { useCalendarStore } from '@/stores/calendar';
import { storeToRefs } from 'pinia';
import { useCalendarMonthState } from '@/composable/calendar/useCalendarMonthState';
import type { WeekStartsOn } from '@/types/types.p';

const props = withDefaults(
  defineProps<{
    weekStartsOn?: WeekStartsOn; // 0=Sun, 1=Mon
    maxChipsPerDay?: number;
    locale?: string;
  }>(),
  {
    weekStartsOn: 0,
    maxChipsPerDay: 2,
    locale: 'en-US',
  },
);

const calendarStore = useCalendarStore();
const { month } = storeToRefs(calendarStore);

const { monthTitle, weekdayLabels } = useCalendarMonthState({
  month,
  weekStartsOn: computed(() => props.weekStartsOn),
  locale: toRef(props, 'locale'),
});
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 pb-16">
    <section class="grid min-h-[80vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5
             shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <calendar-header :month="monthTitle" />

      <div class="grid min-h-0 grid-rows-[auto_1fr]">
        <!-- Weekdays -->
        <div class="sticky top-0 z-10 grid grid-cols-7 gap-3 border-b border-white/10
                 bg-[#0b1220]/60 px-5 py-3 backdrop-blur" role="row">
          <div v-for="weekDay in weekdayLabels" :key="weekDay"
            class="px-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/55" role="columnheader">
            {{ weekDay }}
          </div>
        </div>

        <calendar-grid :week-starts-on="weekStartsOn" :max-chips-per-day="props.maxChipsPerDay" />
      </div>
    </section>
  </div>
</template>
