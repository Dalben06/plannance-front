<script setup lang="ts">
import { BaseModal, BaseDatePicker, BaseInput, BaseButton, BaseSelect } from '@/components/base';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const props = withDefaults(
  defineProps<{ modelValue: boolean }>(),
  { modelValue: false },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
}>();

const eventSchema = toTypedSchema(
  yup.object({
    // NOTE: title being email() looks wrong, but leaving as-is for now
    title: yup.string().email().required(),
    date: yup.date().default(new Date()).required(),
    amount: yup.number().required(),
    type: yup.string().oneOf(['income', 'expense']).required(),
  }),
);

const {
  handleSubmit: handleEventSubmit,
  defineField: defineEventField,
  errors: eventErrors,
  isSubmitting,
} = useForm({ validationSchema: eventSchema });

const [title] = defineEventField('title');
const [date] = defineEventField('date');
const [amount] = defineEventField('amount');
const [type] = defineEventField('type');

const onAddEvent = handleEventSubmit(() => {
  // later: submit logic
});

const options = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

function closeModal() {
  emit('update:modelValue', false);
}
</script>

<template>
  <BaseModal v-if="props.modelValue" data-testid="add-event-modal" :model-value="props.modelValue" size="md"
    @close="closeModal">
    <template #header>
      <h2 class="text-lg font-semibold">Add New Event</h2>
    </template>

    <template #body>
      <form data-testid="event-form" class="mt-4" @submit.prevent="onAddEvent">
        <div class="mb-4">
          <BaseInput v-model="title" id="event-title" label="Title" class="w-full" />
        </div>

        <div class="mb-4">
          <BaseDatePicker v-model="date" id="event-date" label="Date" class="w-full" />
        </div>

        <div class="space-y-2">
          <BaseInput v-model.trim="amount" id="event-amount" label="Amount" type="number" :error="eventErrors.amount"
            :disabled="isSubmitting">
            <template #prefix>
              <span class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true">$</span>
            </template>
          </BaseInput>
        </div>

        <div class="mb-4">
          <BaseSelect v-model="type" id="event-type" label="Type" :options="options" class="w-full" />
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton data-testid="cancel" variant="secondary" @click="closeModal">Cancel</BaseButton>
        <BaseButton data-testid="add" variant="primary" @click="closeModal">Add Event</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
