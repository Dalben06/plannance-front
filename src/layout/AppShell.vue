<script setup lang="ts">
import ToolbarMenu from '@/layout/ToolbarMenu.vue';
</script>

<template>
  <div class="min-h-screen bg-[#0b1220] text-[#e9eefc]">
    <toolbar-menu />
    <main class="mx-auto w-full max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
<style scoped></style>
