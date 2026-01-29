<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'vee-validate';
import {
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline';
import { BaseInput, BaseButton } from '@/components/base';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
const loginSchema = toTypedSchema(
  yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
);

const {
  handleSubmit: handleLoginSubmit,
  defineField: defineLoginField,
  errors: loginErrors,
  isSubmitting
} = useForm({ validationSchema: loginSchema });

const [loginEmail] = defineLoginField('email');
const [loginPassword] = defineLoginField('password');

const router = useRouter();
const auth = useAuthStore();
const onLogin = handleLoginSubmit((values) => {
  // Implement login logic here, e.g., call auth store action
  auth.setUser({ id: 'u-' + Date.now(), name: values.email, email: values.email });
  router.push({ path: '/calendar' }).catch(() => { });
});

const onLoginAsGuest = () => {
  // Implement guest login logic here
  auth.loginAsDemo();
  router.push({ path: '/calendar' }).catch(() => { });
};

</script>

<template>
  <form class="mt-6 space-y-4" @submit.prevent="onLogin">
    <!-- Email -->
    <div class="space-y-2">
      <label class="text-sm font-bold text-white/85">Email</label>

      <BaseInput v-model.trim="loginEmail" type="email" placeholder="you@example.com" autocomplete="email"
        :error="loginErrors.email" :disabled="isSubmitting">
        <template #prefix>
          <EnvelopeIcon class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true" />
        </template>
      </BaseInput>
    </div>

    <!-- Password -->
    <div class="space-y-2">
      <label class="text-sm font-bold text-white/85">Password</label>

      <BaseInput v-model="loginPassword" type="password" placeholder="••••••••" autocomplete="current-password"
        :error="loginErrors.password" :disabled="isSubmitting">
        <template #prefix>
          <LockClosedIcon class="ml-3 h-5 w-5 text-slate-500" aria-hidden="true" />
        </template>
      </BaseInput>
    </div>

    <!-- Submit -->
     <base-button
     style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
     class="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)] rounded-lg px-4 py-2 font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="isSubmitting">
      Log in
    </base-button>
    <base-button style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
      class="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)] rounded-lg px-4 py-2 font-extrabold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      @click="onLoginAsGuest">
      Log in as guest
    </base-button>

    <!-- Footer actions -->
    <div class="flex items-center justify-between pt-2">
      <base-button variant="link" class="text-sm font-semibold text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)] rounded-lg px-2 py-1"
        @click="$emit('forgot-password')">
        Forgot your password?
      </base-button>
    </div>
  </form>
</template>
<style scoped></style>
