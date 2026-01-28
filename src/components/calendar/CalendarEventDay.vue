<script lang="ts" setup>
import type { CalendarEvent } from '@/types.p';

const props = defineProps<{
  events: CalendarEvent[];
  maxChipsPerDay: number;
}>();

function eventChipClass(ev: CalendarEvent): string {
  const base =
    'truncate rounded-xl border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/85 border-l-4 ' +
    'transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]';

  if (ev.type === 'debit') return base + ' bg-rose-400/10 border-l-rose-400/60';
  return base + ' bg-emerald-400/10 border-l-emerald-400/60';
}
</script>

<template>
  <div class="min-h-0 overflow-hidden">
    <div class="flex min-h-0 flex-col gap-1 overflow-hidden">
      <template v-if="props.events?.length">
        <div v-for="eventDay in props.events.slice(0, props.maxChipsPerDay)" :key="eventDay.id"
          :class="eventChipClass(eventDay)" :style="eventDay.color ? { borderLeftColor: eventDay.color } : undefined"
          :title="eventDay.title">
          {{ eventDay.title }}
        </div>

        <button v-if="props.events.length > props.maxChipsPerDay" type="button" class="inline-flex w-fit items-center rounded-full border border-[rgba(147,197,253,0.35)]
                 bg-blue-500/10 px-2 py-1 text-[11px] font-extrabold text-blue-200
                 transition hover:bg-blue-500/15 active:translate-y-px
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
          :title="`Show ${props.events.length - props.maxChipsPerDay} more`">
          +{{ props.events.length - props.maxChipsPerDay }} more
        </button>
      </template>
    </div>
  </div>
</template>
<style scoped></style>
