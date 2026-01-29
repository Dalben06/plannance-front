<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import { useRouter } from 'vue-router';

import { BaseButton } from '@/components/base';
import { useAuthStore } from '@/stores/auth';
import {
  ArrowLeftEndOnRectangleIcon,
  CalendarIcon,
  Cog6ToothIcon,
} from '@/ui/icons';

type MenuItem =
  | {
    key: 'settings' | 'calendar';
    label: string;
    to: string;
    icon: Component;
  }
  | {
    key: 'logout';
    label: string;
    onClick: () => void | Promise<void>;
    icon: Component;
  };

const auth = useAuthStore();
const router = useRouter();

const detailsRef = ref<HTMLDetailsElement | null>(null);

const userName = computed(() => auth.user?.name ?? 'Guest');
const userEmail = computed(() => auth.user?.email ?? 'Not signed in');

function closeMenu() {
  if (detailsRef.value) detailsRef.value.open = false;
}

async function logout() {
  auth.logout();
  closeMenu();
  try {
    await router.push({ path: '/' });
  } catch {
    // ignore navigation duplicates / cancellations
  }
}

const items = computed<MenuItem[]>(() => [
  { key: 'settings', label: 'Settings', to: '/settings', icon: Cog6ToothIcon },
  { key: 'calendar', label: 'Calendar', to: '/calendar', icon: CalendarIcon },
  { key: 'logout', label: 'Sign out', onClick: logout, icon: ArrowLeftEndOnRectangleIcon },
]);

const summaryClass =
  'list-none cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 ' +
  'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]';

const panelClass =
  'absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0b1220] p-2 ' +
  'shadow-[0_18px_60px_rgba(0,0,0,0.35)]';

const itemClass =
  'w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/75 hover:bg-white/5';
</script>

<template>
  <details ref="detailsRef" class="relative">
    <summary :class="summaryClass">
      <span class="inline-flex items-center gap-2">
        <span class="hidden sm:inline">{{ userName }}</span>
      </span>
    </summary>

    <div :class="panelClass">
      <div class="px-3 py-2">
        <div class="text-sm font-bold text-white/90">{{ userName }}</div>
        <div class="text-xs text-white/60">{{ userEmail }}</div>
      </div>

      <div class="my-2 h-px bg-white/10"></div>

      <template v-for="item in items" :key="item.key">
        <!-- link items -->
        <BaseButton v-if="'to' in item" as="router-link" :to="item.to" variant="ghost" :icon-left="item.icon"
          :class="itemClass" @click="closeMenu">
          {{ item.label }}
        </BaseButton>

        <!-- action item -->
        <BaseButton v-else as="button" type="button" variant="ghost" :icon-left="item.icon" :class="itemClass"
          @click="item.onClick">
          {{ item.label }}
        </BaseButton>
      </template>
    </div>
  </details>
</template>
