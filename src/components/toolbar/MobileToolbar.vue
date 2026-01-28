<script setup lang="ts">
import UserMenubar from '@/components/toolbar/UserMenubar.vue';
import AddEventToolbar from '@/components/toolbar/AddEventToolbar.vue';
import { useRouter } from 'vue-router';
import { APP_NAV } from '@/nav';
import { BaseButton } from '@/components/base';

const emit = defineEmits<{
  (e: 'close-mobile'): void;
}>();
const router = useRouter();
function closeMobile() {
  emit('close-mobile');
}
</script>
<template>
  <div class="md:hidden">
    <div class="fixed inset-0 z-50 bg-black/50" @click="closeMobile"></div>

    <aside
      class="fixed right-0 top-0 z-50 h-full w-[320px] border-l border-white/10 bg-[#0b1220] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div class="flex items-center justify-between">
        <div class="text-sm font-extrabold">Plannance</div>
        <button type="button"
          class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
          @click="closeMobile">
          ✕
        </button>
      </div>

      <add-event-toolbar class="mt-4"></add-event-toolbar>

      <nav class="mt-4 grid gap-1">
        <base-button v-for="item in APP_NAV" :key="item.to" :to="item.to" as="router-link" :icon-left="item.icon"
          class="rounded-xl px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/5"
          :variant="router.currentRoute.value.fullPath === item.to ? 'secondary' : 'primary'">
          {{ item.label }}
        </base-button>
      </nav>

      <user-menubar class="mt-6"></user-menubar>
    </aside>
  </div>
</template>
