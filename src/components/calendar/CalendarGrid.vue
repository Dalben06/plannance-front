<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import CalendarDayRow from '@/components/calendar/CalendarDayRow.vue';
import { useCalendarStore } from '@/stores/calendar';
import { useCalendarGridState } from '@/composable/calendar/useCalendarGridState';

const props = defineProps<{
  weekStartsOn: 0 | 1;
  maxChipsPerDay: number;
}>();

const calendarStore = useCalendarStore();
const { date: currentDateRef, events: eventsRef } = storeToRefs(calendarStore);

const { calendarDays } = useCalendarGridState({
  currentDate: currentDateRef,
  events: eventsRef,
  weekStartsOn: computed(() => props.weekStartsOn),
});
</script>

<template>
  <div class="min-h-0 overflow-auto p-5 pt-4">
    <div class="grid grid-cols-7 grid-rows-6 gap-[5px]" role="grid" aria-label="Month view calendar">
      <CalendarDayRow :days="calendarDays" :current-date="currentDateRef" :max-chips-per-day="props.maxChipsPerDay" />
    </div>
  </div>
</template>
