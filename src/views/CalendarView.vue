<script lang="ts" setup>
import CalendarSummary from '@/components/CalendarSummary.vue';
import CalendarMonth from '@/components/calendar/CalendarMonth.vue';
import { useCalendarStore } from '@/stores/calendar';
import { onMounted } from 'vue';

const calendarStore = useCalendarStore();
function generateDataRandom(month: number | undefined = undefined): void {
  const monthSelectedRaw = month ?? Math.floor(Math.random() * 12);
  calendarStore.changeMonth(monthSelectedRaw);
}

onMounted(() => {
  generateDataRandom();
});
</script>

<template>
  <main class="min-h-screen bg-[#0b1220] text-[#e9eefc]">
    <calendar-summary />
    <calendar-month :max-chips-per-day="2" />
  </main>
</template>
<style scoped></style>
