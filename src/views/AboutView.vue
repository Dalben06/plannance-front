<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Component } from 'vue';

import TheAboutContainer from '@/components/TheAboutContainer.vue';

// Heroicons (v2) - outline set
import {
  CalendarDaysIcon,
  TagIcon,
  ChartBarIcon,
  ArrowPathIcon,
  LockClosedIcon,
  BoltIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ReceiptPercentIcon,
} from '@/ui/icons';

const router = useRouter();
const year = new Date().getFullYear();

const mission = computed(
  () =>
    'Plannance helps you plan your money like a calendar—so you can see what’s coming, avoid surprises, and make better decisions with confidence.',
);

type Principle = { title: string; desc: string; icon: Component };
type RoadmapItem = { title: string; items: string[]; icon: Component };

const principles: Principle[] = [
  {
    title: 'Planning-first',
    desc: 'Budgeting often looks backward. Plannance looks forward—what will happen, and when.',
    icon: MagnifyingGlassIcon,
  },
  {
    title: 'Clarity over complexity',
    desc: 'Simple flows, clear totals, and a calendar view that makes decisions obvious.',
    icon: MagnifyingGlassIcon,
  },
  {
    title: 'Control & ownership',
    desc: 'Your plan should feel safe and understandable. No hidden logic—just your numbers.',
    icon: ReceiptPercentIcon,
  },
  {
    title: 'Fast to update',
    desc: 'Change an event, see the impact instantly, and keep moving.',
    icon: BoltIcon,
  },
  {
    title: 'Built for real life',
    desc: 'Bills, paychecks, subscriptions, and one-time surprises—all in one place.',
    icon: HomeIcon,
  },
  {
    title: 'Privacy by default',
    desc: 'Your financial planning is personal. We aim for minimal data and maximum transparency.',
    icon: LockClosedIcon,
  },
];

const roadmap: RoadmapItem[] = [
  {
    title: 'Calendar cash flow',
    items: ['Credits & debits by day', 'Monthly totals', 'Quick add / edit events'],
    icon: CalendarDaysIcon,
  },
  {
    title: 'Recurring events',
    items: ['Weekly / monthly repeats', 'Upcoming bill reminders', 'Edit series or single occurrence'],
    icon: ArrowPathIcon,
  },
  {
    title: 'Categories & notes',
    items: ['Tags for filtering', 'Search & quick filters', 'Optional notes for context'],
    icon: TagIcon,
  },
  {
    title: 'Insights',
    items: ['Spending patterns', 'Projected end-of-month balance', 'Best/worst weeks overview'],
    icon: ChartBarIcon,
  },
];

const faqs = [
  {
    q: 'What’s the difference between Plannance and a typical budgeting app?',
    a: 'Plannance focuses on “when” money moves. Instead of only tracking categories, it shows cash flow on a calendar so you can anticipate tight days and plan ahead.',
  },
  {
    q: 'Do I need to connect a bank account?',
    a: 'No. You can plan manually with events. If you add account connections later, it should enhance—not replace—your planning flow.',
  },
  {
    q: 'Is it only for monthly planning?',
    a: 'Monthly is the core view, but the same approach works for weekly planning and recurring bills.',
  },
];

function goToApp(): void {
  router.push({ path: '/calendar' }).catch(() => { });
}

function goToHome(): void {
  router.push({ path: '/' }).catch(() => { });
}
</script>

<template>
  <TheAboutContainer :year="year" :mission="mission" :principles="principles" :roadmap="roadmap" :faqs="faqs"
    :onGoToApp="goToApp" :onGoToHome="goToHome" />
</template>
