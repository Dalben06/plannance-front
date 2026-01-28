<!-- src/views/AboutView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const year = new Date().getFullYear();

const mission = computed(
  () =>
    'Plannance helps you plan your money like a calendar—so you can see what’s coming, avoid surprises, and make better decisions with confidence.',
);

const principles = [
  {
    title: 'Planning-first',
    desc: 'Budgeting often looks backward. Plannance looks forward—what will happen, and when.',
    icon: '🧭',
  },
  {
    title: 'Clarity over complexity',
    desc: 'Simple flows, clear totals, and a calendar view that makes decisions obvious.',
    icon: '🔎',
  },
  {
    title: 'Control & ownership',
    desc: 'Your plan should feel safe and understandable. No hidden logic—just your numbers.',
    icon: '🧾',
  },
  {
    title: 'Fast to update',
    desc: 'Change an event, see the impact instantly, and keep moving.',
    icon: '⚡️',
  },
  {
    title: 'Built for real life',
    desc: 'Bills, paychecks, subscriptions, and one-time surprises—all in one place.',
    icon: '🏡',
  },
  {
    title: 'Privacy by default',
    desc: 'Your financial planning is personal. We aim for minimal data and maximum transparency.',
    icon: '🔒',
  },
];

const roadmap = [
  {
    title: 'Calendar cash flow',
    items: ['Credits & debits by day', 'Monthly totals', 'Quick add / edit events'],
    icon: '📅',
  },
  {
    title: 'Recurring events',
    items: ['Weekly / monthly repeats', 'Upcoming bill reminders', 'Edit series or single occurrence'],
    icon: '🔁',
  },
  {
    title: 'Categories & notes',
    items: ['Tags for filtering', 'Search & quick filters', 'Optional notes for context'],
    icon: '🏷️',
  },
  {
    title: 'Insights',
    items: ['Spending patterns', 'Projected end-of-month balance', 'Best/worst weeks overview'],
    icon: '📈',
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
  <main class="min-h-screen bg-[#0b1220] text-[#e9eefc]">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
          style="background: radial-gradient(circle at center, rgba(96,165,250,.9), transparent 60%);"
          aria-hidden="true" />
        <div class="absolute right-[-200px] top-[-160px] h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
          style="background: radial-gradient(circle at center, rgba(167,139,250,.9), transparent 60%);"
          aria-hidden="true" />
        <div class="absolute left-[40%] top-[45%] h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
          style="background: radial-gradient(circle at center, rgba(34,211,238,.9), transparent 60%);"
          aria-hidden="true" />
      </div>

      <div class="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div class="flex flex-col gap-10">
          <div>
            <button type="button"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85
                     hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
              @click="goToHome">
              ← Back to home
            </button>

            <div
              class="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90">
              About
            </div>

            <h1 class="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Plan money with clarity.
            </h1>

            <p class="mt-3 max-w-3xl text-base text-white/75">
              {{ mission }}
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <button type="button" class="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 font-semibold text-[#081022]
                       shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                       transition active:translate-y-px
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
                style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
                @click="goToApp">
                Open app
              </button>

              <button type="button" class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-2 font-semibold
                       transition hover:bg-white/5 active:translate-y-px
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
                @click="goToHome">
                Home
              </button>
            </div>

            <div class="mt-8 grid gap-3 md:grid-cols-3">
              <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs font-bold text-white/60">Core idea</div>
                <div class="mt-1 text-sm font-extrabold tracking-tight">Cash flow on a calendar</div>
              </div>
              <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs font-bold text-white/60">Focus</div>
                <div class="mt-1 text-sm font-extrabold tracking-tight">Upcoming events, not just history</div>
              </div>
              <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs font-bold text-white/60">Outcome</div>
                <div class="mt-1 text-sm font-extrabold tracking-tight">Fewer surprises, better decisions</div>
              </div>
            </div>
          </div>

          <!-- Principles -->
          <div class="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <h2 class="text-xl font-bold tracking-tight">Principles</h2>
            <p class="mt-2 max-w-3xl text-sm text-white/70">
              A simple set of rules that keeps Plannance focused on what matters.
            </p>

            <div class="mt-4 grid gap-4 md:grid-cols-3">
              <article v-for="p in principles" :key="p.title"
                class="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div class="text-xl" aria-hidden="true">{{ p.icon }}</div>
                <h3 class="mt-2 text-base font-bold">{{ p.title }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-white/70">{{ p.desc }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ROADMAP -->
    <section class="border-y border-white/10 bg-white/[0.03] py-16">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div class="mb-6">
          <h2 class="text-2xl font-bold tracking-tight">Roadmap</h2>
          <p class="mt-2 max-w-2xl text-white/70">
            The next pieces we’re building to make planning faster and smarter.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="r in roadmap" :key="r.title" class="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl text-base font-extrabold text-[#081022]"
                style="background: linear-gradient(135deg, rgba(34,211,238,.95), rgba(96,165,250,.95));"
                aria-hidden="true">
                {{ r.icon }}
              </div>
              <h3 class="text-base font-bold tracking-tight">{{ r.title }}</h3>
            </div>

            <ul class="mt-4 space-y-2 text-sm text-white/70">
              <li v-for="(item, idx) in r.items" :key="idx" class="flex items-start gap-2">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40"></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>

        <div
          class="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-lg font-bold tracking-tight">Start planning today</h3>
            <p class="mt-1 text-sm text-white/70">
              Open the calendar and create your first credit or debit event.
            </p>
          </div>

          <button type="button" class="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 font-semibold text-[#081022]
                   transition active:translate-y-px
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
            style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));" @click="goToApp">
            Open calendar
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div class="mb-6">
          <h2 class="text-2xl font-bold tracking-tight">FAQ</h2>
          <p class="mt-2 text-white/70">Quick answers about the product.</p>
        </div>

        <div class="grid gap-3">
          <details v-for="item in faqs" :key="item.q" class="group rounded-3xl border border-white/10 bg-white/5 p-4">
            <summary class="cursor-pointer select-none font-bold text-white/90">
              {{ item.q }}
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-white/70">
              {{ item.a }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-white/10 bg-black/20 py-8">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="font-extrabold tracking-tight">Plannance</div>
          <div class="mt-1 text-xs text-white/60">© {{ year }} Plannance. All rights reserved.</div>
        </div>

        <div class="flex gap-2">
          <button type="button" class="rounded-xl px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/5
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
            @click="goToHome">
            Home
          </button>
          <button type="button" class="rounded-xl px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/5
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
            @click="goToApp">
            Start
          </button>
        </div>
      </div>
    </footer>
  </main>
</template>
