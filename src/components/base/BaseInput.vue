<script setup lang="ts">
import { computed } from 'vue';

type BaseInputSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined;
    label?: string;
    hint?: string;
    error?: string | boolean;
    id?: string;
    name?: string;
    type?: string;
    placeholder?: string;
    autocomplete?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    size?: BaseInputSize;
    autofocus?: boolean;

    /** Vue v-model modifiers */
    modelModifiers?: { trim?: boolean; number?: boolean };
  }>(),
  {
    type: 'text',
    size: 'md',
    disabled: false,
    readonly: false,
    required: false,
    autofocus: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number | null): void;
  (e: 'blur', ev: FocusEvent): void;
  (e: 'focus', ev: FocusEvent): void;
  (e: 'keydown', ev: KeyboardEvent): void;
}>();

const uid = computed(() => props.id ?? `in_${Math.random().toString(16).slice(2)}`);
const hasError = computed(() => !!props.error);

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'px-3 py-2 text-sm rounded-xl';
  if (props.size === 'lg') return 'px-4 py-3 text-base rounded-2xl';
  return 'px-3.5 py-2.5 text-sm rounded-2xl';
});

const baseClass = computed(() => {
  const common =
    'w-full border bg-white shadow-sm outline-none placeholder:text-slate-400 ' +
    'transition focus:ring-2 focus:ring-slate-900/10 text-slate-900 ';

  const ok = 'border-slate-200 focus:border-slate-300';
  const bad = 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10';

  const disabled =
    'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';

  return `${common} ${sizeClass.value} ${hasError.value ? bad : ok} ${disabled}`;
});

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  let v: string | number | null = el.value;

  if (props.modelModifiers?.trim) v = v.trim();
  if (props.modelModifiers?.number) {
    v = el.value === '' ? null : Number(el.value);
  }

  emit('update:modelValue', v);
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="uid" class="mb-1.5 block text-sm font-medium text-slate-800">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>

    <div class="group flex items-center gap-2 rounded-2xl border border-transparent" :class="{ 'bg-white': !disabled }">
      <slot name="prefix" />

      <input :id="uid" :name="name" :type="type" :value="modelValue ?? ''" :placeholder="placeholder"
        :autocomplete="autocomplete" :disabled="disabled" :readonly="readonly" :required="required"
        :autofocus="autofocus" :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="hint || error ? `${uid}-help` : undefined" :class="baseClass" @input="onInput"
        @blur="(e) => emit('blur', e)" @focus="(e) => emit('focus', e)" @keydown="(e) => emit('keydown', e)" />

      <slot name="suffix" />
    </div>

    <p v-if="error && typeof error === 'string'" :id="`${uid}-help`" class="mt-1.5 text-sm text-rose-600">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${uid}-help`" class="mt-1.5 text-sm text-slate-500">
      {{ hint }}
    </p>
  </div>
</template>
