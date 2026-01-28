<script lang="ts" setup>
import type { CalendarDay, CalendarEvent } from '@/types/types.p';
import { buildMonthGrid, parseDate, toKey } from '@/utils/calendar-utils';
import { computed } from 'vue';
import CalendarDayRow from '@/components/calendar/CalendarDayRow.vue';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/stores/calendar';

const props = defineProps<{
  weekStartsOn: 0 | 1;
  maxChipsPerDay: number;
}>();

const calendarStore = useCalendarStore();
const { date,events } = storeToRefs(calendarStore);
const gridDays = computed(() => buildMonthGrid(date.value, props.weekStartsOn));

const eventsByDay = computed(() => {
  const map = new Map<string, CalendarEvent[]>();
  for (const ev of events.value) {
    const d = parseDate(ev.start);
    const key = toKey(d);
    const arr = map.get(key) ?? [];
    arr.push(ev);
    map.set(key, arr);
  }
  return map;
});

const calendarDays = computed<CalendarDay[]>(() =>
  gridDays.value.map((day) => {
    const events = eventsByDay.value.get(toKey(day)) ?? [];

    const { expense, income } = events.reduce(
      (acc, e) => {
        if (e.amount == null) return acc;
        if (e.type === 'debit') acc.expense += e.amount;
        if (e.type === 'credit') acc.income += e.amount;
        return acc;
      },
      { expense: 0, income: 0 },
    );

    return { date: day, events, expense, income, id: toKey(day) };
  }),
);
</script>

<template>
  <div class="min-h-0 overflow-auto p-5 pt-4">
    <div class="grid grid-cols-7 grid-rows-6 gap-[5px]" role="grid" aria-label="Month view calendar">
      <calendar-day-row :days="calendarDays" :current-date="date" :max-chips-per-day="props.maxChipsPerDay" />
    </div>
  </div>
</template>
<style scoped></style>
