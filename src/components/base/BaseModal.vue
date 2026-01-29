<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { XMarkIcon } from '@/ui/icons';
import BaseButton from '@/components/base/BaseButton.vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    description?: string;
    size?: ModalSize;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    showClose?: boolean;
  }>(),
  {
    size: 'md',
    closeOnOverlay: true,
    closeOnEsc: true,
    showClose: true,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'close'): void;
}>();

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const panelClass = computed(() => {
  const base = 'w-[92vw] rounded-2xl bg-white shadow-xl border border-slate-200';
  return `${base} ${SIZE_CLASS[props.size]}`;
});

function emitClose() {
  emit('update:modelValue', false);
  emit('close');
}

function onOverlayClick() {
  if (props.closeOnOverlay) emitClose();
}

function onKeydown(e: KeyboardEvent) {
  if (!props.modelValue) return;
  if (!props.closeOnEsc) return;
  if (e.key !== 'Escape') return;
  emitClose();
}

function setScrollLocked(locked: boolean) {
  document.documentElement.classList.toggle('overflow-hidden', locked);
}

function addKeyListener() {
  window.addEventListener('keydown', onKeydown);
}

function removeKeyListener() {
  window.removeEventListener('keydown', onKeydown);
}

watch(
  () => props.modelValue,
  (open) => {
    setScrollLocked(open);
    if (open) addKeyListener();
    else removeKeyListener();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  setScrollLocked(false);
  removeKeyListener();
});
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-50">
        <!-- overlay -->
        <div data-testid="overlay" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="onOverlayClick" />

        <!-- panel -->
        <div class="relative h-full w-full flex items-center justify-center p-4">
          <Transition enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-2 scale-[0.98]" enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-2 scale-[0.98]">
            <div v-if="modelValue" :class="panelClass" role="dialog" aria-modal="true">
              <div class="flex items-start justify-between gap-3 p-5 border-b border-slate-200">
                <div class="min-w-0">
                  <slot name="header" />
                  <h3 v-if="title" class="text-lg font-semibold text-slate-900">
                    {{ title }}
                  </h3>
                  <p v-if="description" class="mt-1 text-sm text-slate-600">
                    {{ description }}
                  </p>
                </div>

                <BaseButton v-if="showClose" variant="ghost" :icon-left="XMarkIcon" aria-label="Close"
                  @click="emitClose" />
              </div>

              <div class="p-5">
                <slot name="body" />
              </div>

              <div v-if="$slots.footer" class="p-5 pt-0">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
