<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(
  defineProps<{
    modelValue: string | Date | null | undefined;
    label?: string;
    hint?: string;
    error?: string | boolean;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;

    weekStartsOn?: 0 | 1; // 0=Sun, 1=Mon
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

function toDate(v: string | Date | null | undefined): Date | null {
  if (!v) return null;
  if (v instanceof Date) return new Date(v.getTime());
  // Expect ISO-like "YYYY-MM-DD"
  const [y, m, d] = v.split('-').map((x) => Number(x));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0);
}

function addMonths(d: Date, months: number) {
  return new Date(d.getFullYear(), d.getMonth() + months, 1, 12, 0, 0, 0);
}

function startOfWeek(d: Date, weekStartsOn: 0 | 1) {
  const x = new Date(d.getTime());
  const day = x.getDay(); // 0..6
  const diff = (day - weekStartsOn + 7) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(12, 0, 0, 0);
  return x;
}

function buildMonthGrid(cursor: Date, weekStartsOn: 0 | 1) {
  const first = startOfMonth(cursor);
  const gridStart = startOfWeek(first, weekStartsOn);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getTime());
    d.setDate(gridStart.getDate() + i);
    d.setHours(12, 0, 0, 0);
    days.push(d);
  }
  return days;
}

function clampAllowed(d: Date) {
  const min = toDate(props.min);
  const max = toDate(props.max);
  if (min && d < min) return false;
  if (max && d > max) return false;
  return true;
}

const open = ref(false);
const selected = computed(() => toDate(props.modelValue));
const today = new Date();

const viewCursor = ref<Date>(selected.value ? startOfMonth(selected.value) : startOfMonth(today));

watch(
  () => props.modelValue,
  (v) => {
    const d = toDate(v);
    if (d) viewCursor.value = startOfMonth(d);
  },
);

const weekDays = computed(() => {
  const labelsSun = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (props.weekStartsOn === 0) return labelsSun;
  return [...labelsSun.slice(1), labelsSun[0]];
});

const grid = computed(() => buildMonthGrid(viewCursor.value, props.weekStartsOn));
const monthTitle = computed(() => {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewCursor.value);
});

const displayValue = computed(() => {
  if (!selected.value) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit', year: 'numeric' }).format(selected.value);
});

function pick(d: Date) {
  if (!clampAllowed(d)) return;
  // Emit the same shape the parent provided if possible.
  // If parent passed a Date, emit a Date. Otherwise default to ISO string.
  const current = props.modelValue;
  if (current instanceof Date) {
    emit('update:modelValue', new Date(d.getTime()));
  } else {
    emit('update:modelValue', toIso(d));
  }
  open.value = false;
}

function prevMonth() {
  viewCursor.value = addMonths(viewCursor.value, -1);
}
function nextMonth() {
  viewCursor.value = addMonths(viewCursor.value, 1);
}

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}
function close() {
  open.value = false;
}
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" class="mb-1.5 block text-sm font-medium text-slate-800">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>

    <button type="button" class="w-full text-left" :disabled="disabled" @click="toggle">
      <div class="flex items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 text-sm shadow-sm transition
               placeholder:text-slate-400 focus-within:ring-2 focus-within:ring-slate-900/10
               disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed" :class="[
                error ? 'border-rose-300' : 'border-slate-200',
              ]">
        <CalendarIcon class="h-5 w-5 text-slate-500" />
        <span class="flex-1 truncate" :class="displayValue ? 'text-slate-900' : 'text-slate-400'">
          {{ displayValue || placeholder }}
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
    <div v-if="open" class="absolute z-40 mt-2 w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div class="flex items-center justify-between gap-2 p-3 border-b border-slate-200">
        <button type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          @click="prevMonth">
          <ChevronLeftIcon class="h-5 w-5" />
        </button>

        <div class="text-sm font-semibold text-slate-900">
          {{ monthTitle }}
        </div>

        <button type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          @click="nextMonth">
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="p-3">
        <div class="grid grid-cols-7 gap-1 text-xs text-slate-500 mb-2">
          <div v-for="d in weekDays" :key="d" class="text-center py-1">{{ d }}</div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button v-for="d in grid" :key="d.toISOString()" type="button" class="h-9 w-9 rounded-xl text-sm transition"
            :class="[
              d.getMonth() === viewCursor.getMonth() ? 'text-slate-900' : 'text-slate-400',
              sameDay(d, today) ? 'ring-1 ring-slate-900/15' : '',
              selected && sameDay(d, selected) ? 'bg-slate-900 text-white' : 'hover:bg-slate-100',
              !clampAllowed(d) ? 'opacity-40 pointer-events-none' : '',
            ]" @click="pick(d)">
            {{ d.getDate() }}
          </button>
        </div>

        <div class="mt-3 flex justify-end">
          <button type="button" class="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            @click="close">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
