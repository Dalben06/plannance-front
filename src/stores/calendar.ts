import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CalendarEvent } from '@/types.p'
import { generateMockCalendarEvents } from '@/mocks/calendarMocks'

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref<CalendarEvent[]>([])
  const month = ref(new Date().getMonth()) // 0-11
  const fetchingEvents = ref(false);
  const isLoading = computed(() => fetchingEvents.value);
  const date = computed(() => {
    return new Date(new Date().getFullYear(), month.value, 1)
  })

  function goToday() {
    const today = new Date()
    changeMonth(today.getMonth());
  }

  function changeMonth(newMonth: number) {
    month.value = newMonth
    fetchingEvents.value = true;
    // Simulate fetching delay
    setTimeout(() => {
      fetchingEvents.value = false;
      getEventsFromMonth();
    }, 15000);

  }
  function getEventsFromMonth() {
    events.value = generateMockCalendarEvents(month.value); // Fetch or filter events for the current month
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

  return { events, month, date, goToday, changeMonth, expenses, income, isLoading  }
})
