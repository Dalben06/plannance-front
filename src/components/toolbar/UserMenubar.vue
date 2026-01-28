<script setup lang="ts">
import { BaseButton } from '@/components/base';
import { useAuthStore } from '@/stores/auth';
import { ArrowLeftEndOnRectangleIcon, CalendarIcon, Cog6ToothIcon } from '@/ui/icons';
import { useRouter } from 'vue-router';
const auth = useAuthStore();
const router = useRouter();
function logout() {
  auth.logout();
  router.push({ path: '/' }).catch(() => { });
}
</script>
<template>

  <details class="relative">
    <summary
      class="list-none cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85
                   hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]">
      <span class="inline-flex items-center gap-2">

        <span class="hidden sm:inline">{{ auth.user?.name ?? 'Guest' }}</span>
      </span>
    </summary>

    <div
      class="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0b1220] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div class="px-3 py-2">
        <div class="text-sm font-bold text-white/90">
          {{ auth.user?.name ?? 'Guest' }}
        </div>
        <div class="text-xs text-white/60">
          {{ auth.user?.email ?? 'Not signed in' }}
        </div>
      </div>

      <div class="my-2 h-px bg-white/10"></div>

      <base-button
      class="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/75 hover:bg-white/5"
      as="router-link" to="/settings" :icon-left="Cog6ToothIcon"
      >Settings</base-button>

      <base-button as="router-link" to="/calendar"
      variant="ghost"  :icon-left="CalendarIcon"
        class="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/75 hover:bg-white/5">
        Calendar
      </base-button>
      <base-button as="router-link" @click="logout" variant="ghost"
      :icon-left="ArrowLeftEndOnRectangleIcon" class="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/75 hover:bg-white/5">
       Sign out
      </base-button>
    </div>
  </details>
</template>
