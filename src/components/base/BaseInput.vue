<script setup lang="ts">
import { computed } from 'vue';
import { parseInputValue, type ModelModifiers } from '@/components/base/input/parseInputValue';
import type { BaseInputSize, BaseInputSlots } from '@/components/base/BaseInput.types';

defineSlots<BaseInputSlots>();

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
    modelModifiers?: ModelModifiers;
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

const sizeClassMap: Record<BaseInputSize, string> = {
  sm: 'px-3 py-2 text-sm rounded-xl',
  md: 'px-3.5 py-2.5 text-sm rounded-2xl',
  lg: 'px-4 py-3 text-base rounded-2xl',
};

const sizeClass = computed(() => sizeClassMap[props.size]);

const baseClass = computed(() => {
  const common =
    'w-full border bg-white shadow-sm outline-none placeholder:text-slate-400 ' +
    'transition focus:ring-2 focus:ring-slate-900/10 text-slate-900';

  const ok = 'border-slate-200 focus:border-slate-300';
  const bad = 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/10';

  const disabled =
    'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';

  return [common, sizeClass.value, hasError.value ? bad : ok, disabled].join(' ');
});

const errorMessage = computed(() =>
  typeof props.error === 'string' ? props.error : '',
);

const showErrorMessage = computed(() => !!errorMessage.value);
const showHint = computed(() => !showErrorMessage.value && !!props.hint);

// only set describedby if we actually render a help <p>
const helpId = computed(() =>
  showErrorMessage.value || showHint.value ? `${uid.value}-help` : undefined,
);

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  const next = parseInputValue(el.value, props.modelModifiers);
  emit('update:modelValue', next);
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
        :autofocus="autofocus" :aria-invalid="hasError ? 'true' : 'false'" :aria-describedby="helpId" :class="baseClass"
        @input="onInput" @blur="emit('blur', $event)" @focus="emit('focus', $event)"
        @keydown="emit('keydown', $event)" />

      <slot name="suffix" />
    </div>

    <p v-if="showErrorMessage" :id="helpId" class="mt-1.5 text-sm text-rose-600">
      {{ errorMessage }}
    </p>

    <p v-else-if="showHint" :id="helpId" class="mt-1.5 text-sm text-slate-500">
      {{ hint }}
    </p>
  </div>
</template>
