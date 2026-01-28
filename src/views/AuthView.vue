<script lang="ts" setup>
import { computed, ref } from 'vue';
import {
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

type Tab = 'login' | 'register';

const tab = ref<Tab>('login');

const isLogin = computed(() => tab.value === 'login');

function switchTab(newTab: Tab) {
  tab.value = newTab;
}
</script>

<template>
  <main class="min-h-screen bg-[#0b1220] text-[#e9eefc]">
    <!-- background glow -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-30"
        style="background: radial-gradient(circle at center, rgba(96,165,250,.9), transparent 60%);"
        aria-hidden="true" />
      <div class="absolute right-[-220px] top-[-180px] h-[560px] w-[560px] rounded-full blur-3xl opacity-30"
        style="background: radial-gradient(circle at center, rgba(167,139,250,.9), transparent 60%);"
        aria-hidden="true" />
      <div class="absolute left-[40%] top-[55%] h-[560px] w-[560px] rounded-full blur-3xl opacity-20"
        style="background: radial-gradient(circle at center, rgba(34,211,238,.9), transparent 60%);"
        aria-hidden="true" />
    </div>

    <div class="relative mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-12">
      <section class="w-full rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4">
          <div>
            <div
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90">
              <ShieldCheckIcon class="h-4 w-4 text-white/80" aria-hidden="true" />
              Plannance
            </div>
            <h1 class="mt-4 text-2xl font-extrabold tracking-tight">
              {{ isLogin ? 'Welcome back' : 'Create your account' }}
            </h1>
            <p class="mt-2 text-sm text-white/70">
              {{ isLogin ? 'Log in to continue planning your month.' : 'Register to start planning your finances.' }}
            </p>
          </div>

        </div>

        <!-- Tabs -->
        <div class="mt-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1">
          <button type="button" class="rounded-xl px-3 py-2 text-sm font-extrabold transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
            :class="isLogin ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'" @click="switchTab('login')">
            Log in
          </button>
          <button type="button" class="rounded-xl px-3 py-2 text-sm font-extrabold transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
            :class="!isLogin ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'"
            @click="switchTab('register')">
            Register
          </button>
        </div>

        <!-- Forms -->

        <login-form v-if="isLogin" />
        <register-form v-else />
      </section>
    </div>
  </main>
</template>
<style scoped></style>
