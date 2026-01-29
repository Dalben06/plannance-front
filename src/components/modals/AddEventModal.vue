<script setup lang="ts">
import { BaseModal, BaseDatePicker, BaseInput, BaseButton, BaseSelect } from '@/components/base';

const props =  withDefaults(
  defineProps<{
    modelValue: boolean;
  }>(),
  {
    modelValue: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
}>();

import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
const loginSchema = toTypedSchema(
  yup.object({
    title: yup.string().email().required(),
    date: yup.date().default(new Date()).required(),
    amount: yup.number().required(),
    type : yup.string().oneOf(['income', 'expense']).required(),
  }),
);

const {
  handleSubmit: handleEventSubmit,
  defineField: defineEventField,
  errors: eventErrors,
  isSubmitting
} = useForm({ validationSchema: loginSchema });

const [title] = defineEventField('title');
const [date] = defineEventField('date');
const [amount] = defineEventField('amount');
const [type] = defineEventField('type');
const onAddEvent = handleEventSubmit(() => {
});

const options = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

function closeMoldal() {
  emit('update:modelValue', false);
}
</script>

<template>
  <base-modal v-if="props.modelValue" :model-value="props.modelValue" size="md" @close="closeMoldal">
    <template #header>
      <h2 class="text-lg font-semibold">Add New Event</h2>
    </template>
    <template #body>
      <form @submit.prevent="onAddEvent" class="mt-4" >
        <div class="mb-4">
          <base-input v-model="title" id="event-title" label="Title" class="w-full" />
        </div>
        <div class="mb-4">
          <base-date-picker v-model="date" id="event-date"
          label="Date" class="w-full" />
        </div>
        <div class="space-y-2">

        <BaseInput v-model.trim="amount" id="event-amount" label="Amount" type="number"
          :error="eventErrors.amount" :disabled="isSubmitting">
          <template #prefix>
            <span class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true">$</span>
          </template>
        </BaseInput>
        </div>

        <div class="mb-4">
          <base-select  v-model="type" id="event-type" label="Type" :options="options" class="w-full" />
        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <base-button variant="secondary" @click="closeMoldal">Cancel</base-button>
        <base-button variant="primary" @click="closeMoldal">Add Event</base-button>
      </div>
    </template>
  </base-modal>
</template>
