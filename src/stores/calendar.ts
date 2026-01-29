import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { CalendarEvent } from '@/types/types.p'

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref<CalendarEvent[]>([])
  const month = ref(new Date().getMonth()) // 0-11
  const fetchingEvents = ref(false);
  const isLoading = computed(() => fetchingEvents.value);
  const date = computed(() => {
    return new Date(new Date().getFullYear(), month.value, 1)
  })

  function goToday() {
    month.value = new Date().getMonth();
  }

  function getEventsFromMonth() {
    events.value = []; // Fetch or filter events for the current month
  }
  const expenses = computed(() => {
    return sumAmounts(events.value.filter(event => event.type === 'debit'))
  })

  const income = computed(() => {
    return sumAmounts(events.value.filter(event => event.type === 'credit'))
  })

  function sumAmounts(events: CalendarEvent[]) {
    return events.reduce((sum, event) => sum + event.amount, 0)
  }

  watch(month, async () => {
    fetchingEvents.value = true;
    await getEventsFromMonth();
    fetchingEvents.value = false;
  })

  return { events, month, date, goToday, expenses, income, isLoading  }
})
