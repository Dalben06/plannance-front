<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import DesktopToolbar from '@/components/toolbar/DesktopToolbar.vue';
import MobileToolbar from '@/components/toolbar/MobileToolbar.vue';

const route = useRoute();

const mobileOpen = ref(false);

const title = computed(() => (route.meta.title as string) || 'Plannance');


</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-[#0b1220]/80 backdrop-blur">
    <desktop-toolbar :title="title" />
    <mobile-toolbar  v-if="mobileOpen"/>
  </header>
</template>
<style scoped></style>
