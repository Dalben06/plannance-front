<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@/ui/icons';
import {
  addCalendarMonths,
  buildCalendarGrid,
  formatIsoDate,
  getMonthStart,
  getWeekdayShortLabels,
  isDateInRange,
  isSameCalendarDay,
  normalizeToNoon,
  parseDateValue,
} from './date-picker/datePickerUtils';
import type { WeekStartsOn } from '@/types/types.p';

type ModelValue = string | Date | null | undefined;

const props = withDefaults(
  defineProps<{
    modelValue: ModelValue;
    label?: string;
    hint?: string;
    error?: string | boolean;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;

    weekStartsOn?: WeekStartsOn; // 0=Sun, 1=Mon
    min?: string | Date;
    max?: string | Date;
  }>(),
  {
    placeholder: 'Select date',
    disabled: false,
    required: false,
    weekStartsOn: 0,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | Date | null): void;
}>();

const isPopoverOpen = ref(false);

const selectedDay = computed<Date | null>(() => parseDateValue(props.modelValue));
const today = normalizeToNoon(new Date());

const minAllowedDate = computed<Date | null>(() => parseDateValue(props.min));
const maxAllowedDate = computed<Date | null>(() => parseDateValue(props.max));

const viewMonth = ref<Date>(
  selectedDay.value ? getMonthStart(selectedDay.value) : getMonthStart(today),
);

watch(
  () => props.modelValue,
  (nextValue) => {
    const nextDate = parseDateValue(nextValue);
    if (nextDate) viewMonth.value = getMonthStart(nextDate);
  },
);

const weekdayLabels = computed(() => getWeekdayShortLabels(props.weekStartsOn));
const calendarDays = computed(() => buildCalendarGrid(viewMonth.value, props.weekStartsOn));

const monthLabel = computed(() =>
  new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewMonth.value),
);

const inputLabel = computed(() => {
  if (!selectedDay.value) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(selectedDay.value);
});

function isDateSelectable(day: Date): boolean {
  return isDateInRange(day, minAllowedDate.value, maxAllowedDate.value);
}

function closePopover(): void {
  isPopoverOpen.value = false;
}

function togglePopover(): void {
  if (props.disabled) return;
  isPopoverOpen.value = !isPopoverOpen.value;
}

function goToPreviousMonth(): void {
  viewMonth.value = addCalendarMonths(viewMonth.value, -1);
}

function goToNextMonth(): void {
  viewMonth.value = addCalendarMonths(viewMonth.value, 1);
}

function selectDate(day: Date): void {
  if (!isDateSelectable(day)) return;

  const current = props.modelValue;
  if (current instanceof Date) {
    emit('update:modelValue', new Date(day.getTime()));
  } else {
    emit('update:modelValue', formatIsoDate(day));
  }
  closePopover();
}
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" class="mb-1.5 block text-sm font-medium text-slate-800">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>

    <button data-testid="datepicker-trigger" type="button" class="w-full text-left" :disabled="disabled"
      @click="togglePopover">
      <div class="flex items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 text-sm shadow-sm transition
               placeholder:text-slate-400 focus-within:ring-2 focus-within:ring-slate-900/10
               disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        :class="[error ? 'border-rose-300' : 'border-slate-200']">
        <CalendarIcon class="h-5 w-5 text-slate-500" />
        <span class="flex-1 truncate" :class="inputLabel ? 'text-slate-900' : 'text-slate-400'">
          {{ inputLabel || placeholder }}
        </span>
        <span class="text-slate-500" aria-hidden="true">▾</span>
      </div>
    </button>

    <p v-if="error && typeof error === 'string'" class="mt-1.5 text-sm text-rose-600">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-sm text-slate-500">
      {{ hint }}
    </p>

    <!-- Popover -->
    <div v-if="isPopoverOpen" data-testid="datepicker-popover"
      class="absolute z-40 mt-2 w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div class="flex items-center justify-between gap-2 p-3 border-b border-slate-200">
        <button data-testid="datepicker-prev" type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          @click="goToPreviousMonth">
          <ChevronLeftIcon class="h-5 w-5" />
        </button>

        <div data-testid="datepicker-month-title" class="text-sm font-semibold text-slate-900">
          {{ monthLabel }}
        </div>

        <button data-testid="datepicker-next" type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          @click="goToNextMonth">
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="p-3">
        <div class="grid grid-cols-7 gap-1 text-xs text-slate-500 mb-2">
          <div v-for="d in weekdayLabels" :key="d" class="text-center py-1">{{ d }}</div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button v-for="day in calendarDays" :key="formatIsoDate(day)" type="button"
            class="h-9 w-9 rounded-xl text-sm transition" :data-date="formatIsoDate(day)" :class="[
              day.getMonth() === viewMonth.getMonth() ? 'text-slate-900' : 'text-slate-400',
              isSameCalendarDay(day, today) ? 'ring-1 ring-slate-900/15' : '',
              selectedDay && isSameCalendarDay(day, selectedDay) ? 'bg-slate-900 text-white' : 'hover:bg-slate-100',
              !isDateSelectable(day) ? 'opacity-40 pointer-events-none' : '',
            ]" @click="selectDate(day)">
            {{ day.getDate() }}
          </button>
        </div>

        <div class="mt-3 flex justify-end">
          <button data-testid="datepicker-close" type="button"
            class="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50" @click="closePopover">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
