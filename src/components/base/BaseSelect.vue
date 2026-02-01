<script setup lang="ts">
import { computed, useId } from 'vue';
import type { Component } from 'vue';
import { ChevronUpDownIcon } from '@/ui/icons';

type Primitive = string | number;

export type SelectOption<T extends Primitive = Primitive> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type Size = 'sm' | 'md' | 'lg';
type SelectModelValue = Primitive | '' | null | unknown | Primitive[];

const props = withDefaults(
  defineProps<{
    modelValue: SelectModelValue;
    options?: SelectOption[];
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    placeholderValue?: Primitive | ''; // default: ''
    id?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    multiple?: boolean;
    size?: Size;
    leadingIcon?: Component;
    selectClass?: string;
  }>(),
  {
    options: () => [],
    placeholderValue: '',
    disabled: false,
    required: false,
    multiple: false,
    size: 'md',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectModelValue): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'change', evt: Event): void;
}>();

const autoId = useId();
const inputId = computed(() => props.id ?? `select-${autoId}`);

const helpText = computed(() => props.error ?? props.hint ?? '');
const hasHelpText = computed(() => helpText.value.length > 0);

const describedById = computed(() => (hasHelpText.value ? `${inputId.value}-desc` : undefined));

const valueProxy = computed<SelectModelValue>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const baseSelect =
  'block w-full appearance-none bg-white text-slate-900 border shadow-sm ' +
  'border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ' +
  'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 text-sm rounded-xl px-3 pr-10',
  md: 'h-10 text-sm rounded-2xl px-3.5 pr-10',
  lg: 'h-11 text-base rounded-2xl px-4 pr-11',
};

const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500';

const selectClasses = computed(() =>
  [
    baseSelect,
    sizeClasses[props.size],
    props.error ? errorClasses : '',
    props.leadingIcon ? 'pl-10' : '',
    props.selectClass ?? '',
  ]
    .filter(Boolean)
    .join(' '),
);
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="mb-1.5 block text-sm font-medium text-slate-800">
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>

    <div class="relative">
      <!-- Leading icon -->
      <div v-if="leadingIcon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <component :is="leadingIcon" class="h-5 w-5 text-slate-400" aria-hidden="true" />
      </div>

      <select :id="inputId" v-model="valueProxy" :name="name" :disabled="disabled" :required="required"
        :multiple="multiple" :aria-invalid="!!error" :aria-describedby="describedById" :class="selectClasses"
        @blur="emit('blur', $event)" @focus="emit('focus', $event)" @change="emit('change', $event)">
        <!-- Placeholder (single select only) -->
        <option v-if="placeholder && !multiple" :value="placeholderValue" disabled hidden>
          {{ placeholder }}
        </option>

        <!-- Options via slot OR via prop -->
        <slot>
          <option v-for="opt in options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
            {{ opt.label }}
          </option>
        </slot>
      </select>

      <!-- Chevron -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
      </div>
    </div>

    <p v-if="hasHelpText" :id="describedById" class="mt-1.5 text-sm" :class="error ? 'text-red-600' : 'text-slate-500'">
      {{ helpText }}
    </p>
  </div>
</template>
