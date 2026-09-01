<script setup lang="ts">
import type { TrackData, SolutionData } from '~/server-utils/data';
import { useSiteData } from '~/composables/useData';
import { homeJsonLd } from '~/composables/useSEO';

const data = useSiteData();
const tracks = computed<TrackData[]>(() => data.tracks);
const solutions = computed<SolutionData[]>(() => data.solutions);
const stats = computed(() => data.stats);
const recent = computed(() => solutions.value.slice(0, 6));

useSEO({
  title: undefined,
  description: 'A running archive of Exercism practice exercises — pulled in, refactored, and documented for anyone following along.',
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(homeJsonLd(stats.value)),
    },
  ],
});

const followers = 9;
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
      <div class="absolute rounded-full z-0 bg-yellow w-40 h-40 sm:w-56 sm:h-56 -top-8 right-0 sm:right-8 opacity-80" />
      <div class="absolute rounded-full z-0 bg-teal w-24 h-24 sm:w-32 sm:h-32 top-40 right-20 sm:right-48 opacity-70" />
      <div class="absolute rounded-full z-0 bg-pink w-20 h-20 sm:w-28 sm:h-28 -bottom-4 left-4 opacity-70" />

      <div class="relative z-10 max-w-2xl">
        <p class="inline-block bg-coral text-white text-xs font-display font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border-[3px] border-ink rotate-2 mb-6">
          Public solution log
        </p>
        <h1 class="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
          Every exercise I solve,<br class="hidden sm:block" />
          <span class="text-purple">organized</span> &amp; kept <span class="text-coral">loud</span>.
        </h1>
        <p class="text-base sm:text-lg text-ink/70 leading-relaxed mb-8 font-medium">
          A running archive of Exercism practice exercises. Each solved problem lands in its
          language folder below &mdash; pulled in, refactored, and documented for anyone following along.
        </p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink to="/tracks" class="inline-flex items-center rounded-full bg-purple text-white font-display text-sm font-bold px-7 py-3.5 sticker">
            Browse languages
          </NuxtLink>
          <NuxtLink to="/solutions" class="inline-flex items-center rounded-full bg-white text-ink font-display text-sm font-bold px-7 py-3.5 sticker">
            Latest solutions
          </NuxtLink>
        </div>
      </div>

      <!-- Stats -->
      <div class="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-16 sm:mt-20">
        <div class="rounded-2xl bg-white p-6 sticker-sm rotate-2">
          <p class="font-display text-3xl sm:text-4xl font-extrabold text-purple">{{ stats.totalExercises }}</p>
          <p class="text-sm text-ink/60 mt-1 font-semibold">Exercises solved</p>
        </div>
        <div class="rounded-2xl bg-white p-6 sticker-sm -rotate-2">
          <p class="font-display text-3xl sm:text-4xl font-extrabold text-coral">{{ stats.totalTracks }}</p>
          <p class="text-sm text-ink/60 mt-1 font-semibold">Languages active</p>
        </div>
        <div class="rounded-2xl bg-white p-6 sticker-sm rotate-2">
          <p class="font-display text-3xl sm:text-4xl font-extrabold text-teal">{{ stats.streakDays }}</p>
          <p class="text-sm text-ink/60 mt-1 font-semibold">Day streak</p>
        </div>
        <div class="rounded-2xl bg-white p-6 sticker-sm -rotate-2">
          <p class="font-display text-3xl sm:text-4xl font-extrabold text-pink">{{ followers }}</p>
          <p class="text-sm text-ink/60 mt-1 font-semibold">Followers</p>
        </div>
      </div>
    </section>

    <!-- Language folders -->
    <section id="tracks" class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 border-t-[3px] border-ink border-dashed">
      <div class="flex items-end justify-between mb-10">
        <h2 class="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">Language folders</h2>
        <NuxtLink to="/tracks" class="text-sm font-display font-bold underline decoration-2 underline-offset-4 hover:text-coral hidden sm:inline">View all</NuxtLink>
      </div>

      <div v-if="tracks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrackCard v-for="track in tracks.slice(0, 5)" :key="track.slug" :track="track" />
        <div class="rounded-2xl border-[3px] border-dashed border-ink/30 p-6 flex flex-col items-center justify-center text-center min-h-[176px]">
          <div class="w-12 h-12 rounded-xl border-[3px] border-dashed border-ink/30 flex items-center justify-center mb-4">
            <span class="text-ink/30 font-display font-extrabold text-xl">+</span>
          </div>
          <p class="text-sm font-display font-bold text-ink/40">More tracks coming</p>
        </div>
      </div>

      <div v-else class="rounded-2xl border-[3px] border-dashed border-ink/30 p-12 text-center">
        <p class="font-display font-bold text-ink/50 mb-2">No solutions yet</p>
        <p class="text-sm text-ink/40 font-medium">Drop an exercise into <code class="bg-ink/5 px-1.5 py-0.5 rounded">content/solutions/&lt;track&gt;/&lt;exercise&gt;/</code> and it’ll show up here.</p>
      </div>
    </section>

    <!-- Recent solutions -->
    <section id="recent" class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 border-t-[3px] border-ink border-dashed">
      <div class="flex items-end justify-between mb-10">
        <h2 class="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">Latest solutions</h2>
        <NuxtLink to="/solutions" class="text-sm font-display font-bold underline decoration-2 underline-offset-4 hover:text-coral hidden sm:inline">View all</NuxtLink>
      </div>

      <div v-if="recent.length" class="flex flex-col gap-4">
        <SolutionRow v-for="s in recent" :key="s.path" :solution="s" />
      </div>
      <div v-else class="rounded-2xl border-[3px] border-dashed border-ink/30 p-12 text-center">
        <p class="font-display font-bold text-ink/50">Solutions will appear here as you solve exercises.</p>
      </div>
    </section>
  </div>
</template>