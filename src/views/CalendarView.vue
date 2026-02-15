<script lang="ts" setup>
import CalendarSummary from '@/components/calendar/CalendarSummary.vue';
import CalendarMonth from '@/components/calendar/CalendarMonth.vue';
import { useCalendarStore } from '@/stores/calendar';
import { onMounted } from 'vue';

const calendarStore = useCalendarStore();

onMounted(() => {
  calendarStore.getEventsFromMonth();
});
</script>

<template>
  <main class="min-h-screen bg-[#0b1220] text-[#e9eefc]">
    <calendar-summary />
    <calendar-month :max-chips-per-day="2" />
  </main>
</template>
<style scoped></style>
