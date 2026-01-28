<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline';
import { BaseInput } from '@/components/base';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { BaseButton } from '@/components/base';

const registrationSchema = toTypedSchema(
  yup.object({
    name: yup.string().required().min(3).max(100),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    acceptTerms: yup
      .boolean()
      .oneOf([true], 'You must accept the terms and conditions to proceed'),
  }),
);

const {
  handleSubmit: handleRegisterSubmit,
  defineField: defineRegisterField,
  errors: regErrors,
  isSubmitting
} = useForm({ validationSchema: registrationSchema });

const [regName] = defineRegisterField('name');
const [regEmail] = defineRegisterField('email');
const [regPassword] = defineRegisterField('password');
const [regConfirmPassword] = defineRegisterField('confirmPassword');
const [acceptTerms] = defineRegisterField('acceptTerms');

const router = useRouter();
const auth = useAuthStore();
const onRegister = handleRegisterSubmit(async (values) => {
  console.log('success');
  auth.setUser({ id: 'u-' + Date.now(), name: values.name, email: values.email });
  router.push({ path: '/calendar' }).catch(() => { });
});



</script>

<template>
  <form class="mt-6 space-y-4" @submit.prevent="onRegister">
    <!-- Name -->
    <div class="space-y-2">
      <label class="text-sm font-bold text-white/85">Name</label>

      <BaseInput v-model.trim="regName" placeholder="Your name" autocomplete="name" :error="regErrors.name"
        :disabled="isSubmitting">
        <template #prefix>
          <UserIcon class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true" />
        </template>
      </BaseInput>
    </div>

    <!-- Email -->
    <div class="space-y-2">
      <label class="text-sm font-bold text-white/85">Email</label>

      <BaseInput v-model.trim="regEmail" type="email" placeholder="you@example.com" autocomplete="email"
        :error="regErrors.email" :disabled="isSubmitting">
        <template #prefix>
          <EnvelopeIcon class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true" />
        </template>
      </BaseInput>
    </div>

    <!-- Password -->
    <div class="space-y-2">
      <label class="text-sm font-bold text-white/85">Password</label>

      <BaseInput v-model="regPassword" type="password" placeholder="••••••••" autocomplete="new-password"
        :error="regErrors.password" :disabled="isSubmitting">
        <template #prefix>
          <LockClosedIcon class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true" />
        </template>
      </BaseInput>
    </div>

    <!-- Confirm Password -->
    <div class="space-y-2">
      <label class="text-sm font-bold text-white/85">Confirm password</label>

      <BaseInput v-model="regConfirmPassword" type="password" placeholder="••••••••" autocomplete="new-password"
        :error="regErrors.confirmPassword" :disabled="isSubmitting">
        <template #prefix>
          <LockClosedIcon class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true" />
        </template>
      </BaseInput>
    </div>

    <!-- Terms -->
    <div class="space-y-2">
      <label class="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
        <input v-model="acceptTerms" type="checkbox" class="mt-1 h-4 w-4 accent-[rgba(96,165,250,0.9)]"
          :disabled="isSubmitting" />
        <span class="text-sm text-white/75">
          I accept the terms and understand this is a planning tool.
        </span>
      </label>

      <p v-if="regErrors.acceptTerms" class="text-xs font-semibold text-rose-200">
        {{ regErrors.acceptTerms }}
      </p>
    </div>

    <!-- Submit -->
     <base-button
     style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
     class="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)] rounded-lg px-4 py-2 font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="isSubmitting">
      Create account
    </base-button>

  </form>
</template>
<style scoped></style>
