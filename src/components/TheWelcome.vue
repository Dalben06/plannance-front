<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
// Heroicons (v2) - outline set
import {
  CalendarDaysIcon,
  TagIcon,
  ChartBarIcon,
  ArrowPathIcon,
  FlagIcon,
  LockClosedIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();

const year = new Date().getFullYear();
const tagline = computed(() => 'Plan your money. See your cash flow. Stay ahead.');

// Use the imported icon components instead of emoji strings
const features = [
  { title: 'Cash-flow calendar', desc: 'Visualize credits and debits by day, week, and month—so you always know what’s coming.', icon: CalendarDaysIcon },
  { title: 'Smart categories', desc: 'Organize events as income or expense, add notes, and keep your plan clean and searchable.', icon: TagIcon },
  { title: 'Monthly snapshot', desc: 'Track totals at a glance: income, expenses, and what’s left—without spreadsheets.', icon: ChartBarIcon },
  { title: 'Recurring bills', desc: 'Set repeating events for rent, subscriptions, paychecks, or anything that happens regularly.', icon: ArrowPathIcon },
  { title: 'Goals & reminders', desc: 'Create targets and reminders so you don’t miss a bill or drift from your plan.', icon: FlagIcon },
  { title: 'Private by default', desc: 'Your planning should feel safe—simple controls and clear data ownership.', icon: LockClosedIcon },
];

const steps = [
  { number: '1', title: 'Add your first event', desc: 'Create an income or expense event with a date and amount.' },
  { number: '2', title: 'Review your month', desc: 'See day-by-day cash flow and monthly totals instantly.' },
  { number: '3', title: 'Improve and repeat', desc: 'Turn one-time events into recurring items and keep refining.' },
];

const faqs = [
  { q: 'Is Plannance a budgeting app?', a: 'It’s planning-first: you schedule income/expenses on a calendar to understand cash flow before it happens.' },
  { q: 'Can I track both income and expenses?', a: 'Yes. Events are marked as credit (income) or debit (expense), with totals shown by day and month.' },
  { q: 'What’s the main benefit?', a: 'Clarity. You can quickly spot tight weeks, upcoming bills, and how decisions change your month.' },
];

function goToApp(): void {
  // Update this route to whatever your “main” screen is (ex: /calendar)
  router.push({ path: '/calendar' }).catch(() => { });
}

function goToDocs(): void {
  // Update to /about or /docs if you have it
  router.push({ path: '/about' }).catch(() => { });
}
</script>

<template>
  <main class="min-h-screen bg-[#0b1220] text-[#e9eefc]">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <!-- glow blobs -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
          style="background: radial-gradient(circle at center, rgba(96,165,250,.9), transparent 60%);"
          aria-hidden="true" />
        <div class="absolute right-[-200px] top-[-160px] h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
          style="background: radial-gradient(circle at center, rgba(167,139,250,.9), transparent 60%);"
          aria-hidden="true" />
        <div class="absolute left-[40%] top-[40%] h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
          style="background: radial-gradient(circle at center, rgba(34,211,238,.9), transparent 60%);"
          aria-hidden="true" />
      </div>

      <div class="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <!-- Copy -->
          <div>
            <div
              class="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90">
              Plannance
            </div>

            <h1 class="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Your finances, planned like a calendar.
            </h1>

            <p class="mt-3 max-w-xl text-base text-white/75">
              {{ tagline }}
            </p>

            <div class="mt-5 flex flex-wrap gap-3">
              <button type="button" class="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 font-semibold text-[#081022]
                       shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                       transition active:translate-y-px
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
                style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
                @click="goToApp">
                Start now
              </button>

              <button type="button" class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-2 font-semibold
                       transition hover:bg-white/5 active:translate-y-px
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
                @click="goToDocs">
                Learn more
              </button>
            </div>

            <div class="mt-6 grid gap-2 text-sm text-white/70">
              <div class="flex items-center gap-3">
                <span class="h-2 w-2 rounded-full bg-[rgba(96,165,250,0.9)] shadow-[0_0_0_6px_rgba(96,165,250,0.12)]" />
                <span>Credits & debits, day-by-day</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-2 w-2 rounded-full bg-[rgba(96,165,250,0.9)] shadow-[0_0_0_6px_rgba(96,165,250,0.12)]" />
                <span>Monthly income/expense totals</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-2 w-2 rounded-full bg-[rgba(96,165,250,0.9)] shadow-[0_0_0_6px_rgba(96,165,250,0.12)]" />
                <span>Recurring bills & reminders</span>
              </div>
            </div>
          </div>

          <!-- Preview Card -->
          <div class="rounded-3xl border border-white/10 bg-white/5 p-4
                   shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div class="flex items-center justify-between gap-3">
              <div class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/85">
                January
              </div>
              <div class="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70">
                Cash flow
              </div>
            </div>

            <div class="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div class="grid grid-cols-7 gap-2" aria-hidden="true">
                <div v-for="i in 35" :key="i" class="min-h-[56px] rounded-xl border border-white/10 bg-white/5 p-2">
                  <div class="text-xs font-bold text-white/60">
                    {{ (i % 30) + 1 }}
                  </div>

                  <div class="mt-2 flex gap-2">
                    <span class="h-1.5 flex-1 rounded-full bg-cyan-400/75" />
                    <span class="h-1.5 flex-1 rounded-full bg-rose-400/75" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-3 gap-3">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div class="text-xs font-bold text-white/60">Income</div>
                <div class="mt-1 text-sm font-extrabold tracking-tight">+$4,200</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div class="text-xs font-bold text-white/60">Expenses</div>
                <div class="mt-1 text-sm font-extrabold tracking-tight">-$2,980</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div class="text-xs font-bold text-white/60">Balance</div>
                <div class="mt-1 text-sm font-extrabold tracking-tight">$1,220</div>
              </div>
            </div>

            <p class="mt-3 text-xs text-white/60">
              This is a simple preview card. Replace with your real calendar component when ready.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="py-16">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div class="mb-6">
          <h2 class="text-2xl font-bold tracking-tight">What you can do with Plannance</h2>
          <p class="mt-2 max-w-2xl text-white/70">
            Build a plan you can actually follow: schedule money events and make decisions with confidence.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="f in features" :key="f.title"
            class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div class="text-xl" aria-hidden="true">
              <component :is="f.icon" class="h-6 w-6 text-white/90" aria-hidden="true" />
            </div>
            <h3 class="mt-2 text-base font-bold tracking-tight">{{ f.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/70">{{ f.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="border-y border-white/10 bg-white/[0.03] py-16">
      <div class="mx-auto w-full max-w-6xl px-4">
        <div class="mb-6">
          <h2 class="text-2xl font-bold tracking-tight">How it works</h2>
          <p class="mt-2 max-w-2xl text-white/70">
            Start simple. Add events. See your month instantly.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="s in steps" :key="s.number" class="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div class="grid h-9 w-9 place-items-center rounded-xl text-sm font-extrabold text-[#081022]"
              style="background: linear-gradient(135deg, rgba(34,211,238,.95), rgba(96,165,250,.95));">
              {{ s.number }}
            </div>
            <h3 class="mt-3 text-base font-bold">{{ s.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/70">{{ s.desc }}</p>
          </article>
        </div>

        <div
          class="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-lg font-bold tracking-tight">Ready to plan your next month?</h3>
            <p class="mt-1 text-sm text-white/70">
              Jump into the calendar and create your first credit or debit event.
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
          <p class="mt-2 text-white/70">Quick answers before you start.</p>
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
            @click="goToDocs">
            About
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
