<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppShell from '@/layout/AppShell.vue';
import PublicLayout from '@/layout/PublicLayout.vue';

const route = useRoute();

const layout = computed(() => {
  const key = (route.meta.layout as string) || 'public';
  return key === 'app' ? AppShell : PublicLayout;
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
<style scoped></style>
