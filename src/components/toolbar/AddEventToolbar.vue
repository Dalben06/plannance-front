<script lang="ts" setup>
import { ref } from 'vue';
import { PlusIcon } from '@/ui/icons';
import { BaseButton } from '@/components/base';
import AddEventModal from '@/components/modals/AddEventModal.vue';

const showModal = ref(false);

const buttonStyle =
  'background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));';

function openModal() {
  showModal.value = true;
}
</script>

<template>
  <BaseButton data-testid="add-event-button" :icon-left="PlusIcon" type="button" variant="primary"
    class="hidden sm:inline-flex" :style="buttonStyle" @click="openModal">
    Add event
  </BaseButton>

  <AddEventModal data-testid="add-event-modal" v-model="showModal" />
</template>
