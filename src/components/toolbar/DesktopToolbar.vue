
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { APP_NAV } from '@/nav';
import { BaseButton } from '@/components/base';
import UserMenubar from '@/components/toolbar/UserMenubar.vue';
import AddEventToolbar from '@/components/toolbar/AddEventToolbar.vue';

const props = defineProps<{
  title: string;
}>();

const router = useRouter();
function goHome() {
  router.push({ path: '/' }).catch(() => { });
}

</script>
<template>
  <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
    <!-- Left: Brand + current title -->
    <div class="flex items-center gap-3">
      <base-button type="button"
        class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-extrabold tracking-tight
                 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]" @click="goHome">
        <span class="text-base">Plannance</span>
      </base-button>

      <div class="hidden sm:block text-sm font-semibold text-white/70">
        {{ props.title }}
      </div>
    </div>
    <!-- Center: Nav (desktop) -->
    <nav class="hidden sm:flex items-center gap-3">

      <base-button v-for="item in APP_NAV" :key="item.to" :to="item.to" as="router-link"
        :icon-left="item.icon"
        class="pl-btn"
        :variant="router.currentRoute.value.fullPath === item.to ? 'secondary' : 'primary'"
        >
        {{ item.label }}
      </base-button>


    </nav>

    <!-- Right: actions + user -->
    <div class="flex items-center gap-2">
      <add-event-toolbar />
      <!-- User menu -->
      <user-menubar></user-menubar>

    </div>
  </div>
</template>
