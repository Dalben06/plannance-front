<script lang="ts" setup>
import { PlusIcon } from '@/ui/icons';
import { ref } from 'vue';
import {BaseButton} from '@/components/base';
import AddEventModal from '@/components/modals/AddEventModal.vue';
const showModal = ref(false);

</script>

<template>
  <base-button :icon-left="PlusIcon" type="button" variant="primary" class="hidden sm:inline-flex"
    style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
    @click="showModal = true">
    Add event
  </base-button>

  <add-event-modal v-model="showModal"  />

</template>
