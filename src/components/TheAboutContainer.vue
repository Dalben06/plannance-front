<script setup lang="ts">
import type { Component } from 'vue';

type Principle = {
  title: string;
  desc: string;
  icon: Component;
};

type RoadmapItem = {
  title: string;
  items: string[];
  icon: Component;
};

type FaqItem = {
  q: string;
  a: string;
};

const props = defineProps<{
  year: number;
  mission: string;
  principles: Principle[];
  roadmap: RoadmapItem[];
  faqs: FaqItem[];
  onGoToApp?: () => void;
  onGoToHome?: () => void;
}>();
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
              @click="props.onGoToHome?.()">
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
              {{ props.mission }}
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <button type="button" class="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 font-semibold text-[#081022]
                       shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                       transition active:translate-y-px
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
                style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
                @click="props.onGoToApp?.()">
                Open app
              </button>

              <button type="button" class="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-2 font-semibold
                       transition hover:bg-white/5 active:translate-y-px
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
                @click="props.onGoToHome?.()">
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
              <article v-for="p in props.principles" :key="p.title"
                class="rounded-3xl border border-white/10 bg-black/20 p-4">
                <component :is="p.icon" class="h-6 w-6 text-white/85" aria-hidden="true" />
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
          <article v-for="r in props.roadmap" :key="r.title" class="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-2xl text-[#081022]"
                style="background: linear-gradient(135deg, rgba(34,211,238,.95), rgba(96,165,250,.95));"
                aria-hidden="true">
                <component :is="r.icon" class="h-5 w-5" aria-hidden="true" />
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
            style="background: linear-gradient(135deg, rgba(96,165,250,.95), rgba(167,139,250,.95));"
            @click="props.onGoToApp?.()">
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
          <details v-for="item in props.faqs" :key="item.q"
            class="group rounded-3xl border border-white/10 bg-white/5 p-4">
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
          <div class="mt-1 text-xs text-white/60">© {{ props.year }} Plannance. All rights reserved.</div>
        </div>

        <div class="flex gap-2">
          <button type="button" class="rounded-xl px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/5
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
            @click="props.onGoToHome?.()">
            Home
          </button>
          <button type="button" class="rounded-xl px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/5
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(96,165,250,0.5)]"
            @click="props.onGoToApp?.()">
            Start
          </button>
        </div>
      </div>
    </footer>
  </main>
</template>
