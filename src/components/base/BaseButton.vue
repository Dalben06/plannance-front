<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { RouterLink } from 'vue-router';
import type { Component } from 'vue';

defineOptions({ inheritAttrs: false });

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link';
type Size = 'sm' | 'md' | 'lg';
type As = 'button' | 'a' | 'router-link';

const props = withDefaults(
  defineProps<{
    as?: As;
    variant?: Variant;
    size?: Size;

    // icons (Heroicons are Vue components)
    iconLeft?: Component;
    iconRight?: Component;

    loading?: boolean;
    disabled?: boolean;
    block?: boolean;

    // only needed for icon-only buttons (accessibility)
    ariaLabel?: string;
  }>(),
  {
    as: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
  }
);

const attrs = useAttrs();

const isDisabled = computed(() => props.disabled || props.loading);

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium ' +
  'transition select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-60 disabled:pointer-events-none cursor-pointer ';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-900',
  ghost:
    'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-900',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600',
  outline:
    'bg-transparent text-slate-900 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-900',
  link:
    'bg-transparent text-slate-900 hover:text-slate-800 focus-visible:ring-slate-900',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

const iconSizeClasses: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-5 w-5',
};

const classes = computed(() => [
  base,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block ? 'w-full' : '',
  attrs.class ?? '',
]);

const tag = computed(() => {
  if (props.as === 'router-link') return RouterLink;
  return props.as; // 'button' | 'a'
});

// If user forgets ariaLabel on icon-only buttons, we still render,
// but you should pass ariaLabel for accessibility.
const computedAriaLabel = computed(() => {
  const hasDefaultSlot = !!(attrs as any)?.default;
  const iconOnly = !hasDefaultSlot && (props.iconLeft || props.iconRight);
  return iconOnly ? props.ariaLabel : undefined;
});
</script>

<template>
  <component :is="tag" v-bind="attrs" :class="classes" :aria-label="computedAriaLabel"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :aria-disabled="tag !== 'button' ? String(isDisabled) : undefined"
    :tabindex="tag !== 'button' && isDisabled ? -1 : undefined">
    <!-- left icon -->
    <component v-if="iconLeft && !loading" :is="iconLeft" :class="iconSizeClasses[size]" aria-hidden="true" />

    <!-- loading spinner -->
    <svg v-if="loading" :class="['animate-spin', iconSizeClasses[size]]" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
    </svg>

    <!-- label -->
    <span v-if="$slots.default">
      <slot />
    </span>

    <!-- right icon -->
    <component v-if="iconRight && !loading" :is="iconRight" :class="iconSizeClasses[size]" aria-hidden="true" />
  </component>
</template>
