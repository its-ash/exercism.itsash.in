<script setup lang="ts">
import { useSolution, useSolutions } from '~/composables/useData';
import { breadcrumbJsonLd, solutionJsonLd } from '~/composables/useSEO';

const route = useRoute();
const trackSlug = computed(() => route.params.track as string);
const exerciseSlug = computed(() => route.params.solution as string);

const solution = useSolution(trackSlug.value, exerciseSlug.value);

if (!solution) {
  throw createError({ statusCode: 404, statusMessage: 'Solution not found', fatal: true });
}

const all = useSolutions();
const idx = all.findIndex((s) => s.url === solution.url);
const prev = computed(() => idx > 0 ? all[idx - 1] : null);
const next = computed(() => idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null);

const formattedDate = computed(() =>
  new Date(solution.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
);

useSEO({
  title: solution.title,
  description: `${solution.title} — ${solution.difficulty} ${solution.trackName} exercise. ${solution.blurb || solution.tags.join(', ')}.`,
  publishedTime: solution.date,
  tags: solution.tags,
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbJsonLd([
        { name: 'Tracks', url: '/tracks' },
        { name: solution.trackName, url: `/tracks/${trackSlug.value}` },
        { name: solution.title, url: `/tracks/${trackSlug.value}/${exerciseSlug.value}` },
      ])),
    },
    { type: 'application/ld+json', innerHTML: JSON.stringify(solutionJsonLd(solution)) },
  ],
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
    <nav class="mb-8 text-sm font-display font-bold text-ink/50 flex items-center gap-2 flex-wrap">
      <NuxtLink to="/tracks" class="hover:text-coral">Tracks</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/tracks/${trackSlug}`" class="hover:text-coral">{{ solution.trackName }}</NuxtLink>
      <span>/</span>
      <span class="text-ink">{{ solution.title }}</span>
    </nav>

    <!-- Header -->
    <div class="flex items-center justify-between gap-4 mb-8 flex-wrap">
      <div class="flex items-center gap-4">
        <TrackBadge :track="solution.trackSlug" size="lg" :rotate="true" />
        <div>
          <h1 class="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">{{ solution.title }}</h1>
          <p class="text-ink/60 font-medium capitalize">{{ solution.trackName }} &middot; {{ solution.difficulty }}</p>
        </div>
      </div>
      <StatusBadge :status="solution.status" :difficulty="solution.difficulty" />
    </div>

    <!-- Blurb -->
    <p v-if="solution.blurb" class="text-base text-ink/70 leading-relaxed font-medium mb-6">{{ solution.blurb }}</p>

    <!-- Tags -->
    <div v-if="solution.tags.length" class="flex flex-wrap gap-2 mb-6">
      <span
        v-for="tag in solution.tags"
        :key="tag"
        class="text-xs font-display font-bold uppercase tracking-wide bg-ink/5 text-ink/70 rounded-full px-3 py-1 border-2 border-ink/10"
      >{{ tag }}</span>
    </div>

    <!-- Meta grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
      <div class="rounded-xl bg-white p-4 sticker-sm">
        <p class="text-xs font-display font-bold uppercase tracking-widest text-ink/40 mb-1">Status</p>
        <p class="font-display font-bold capitalize">{{ solution.status }}</p>
      </div>
      <div class="rounded-xl bg-white p-4 sticker-sm">
        <p class="text-xs font-display font-bold uppercase tracking-widest text-ink/40 mb-1">Difficulty</p>
        <p class="font-display font-bold capitalize">{{ solution.difficulty }}</p>
      </div>
      <div class="rounded-xl bg-white p-4 sticker-sm">
        <p class="text-xs font-display font-bold uppercase tracking-widest text-ink/40 mb-1">Date</p>
        <p class="font-display font-bold text-sm">{{ formattedDate }}</p>
      </div>
      <div class="rounded-xl bg-white p-4 sticker-sm">
        <p class="text-xs font-display font-bold uppercase tracking-widest text-ink/40 mb-1">Solved</p>
        <p class="font-display font-bold">{{ solution.hasSolution ? 'Yes' : 'Skeleton' }}</p>
      </div>
    </div>

    <!-- Instructions -->
    <section v-if="solution.readmeHtml" class="mb-10">
      <h2 class="font-display text-xl font-bold mb-4">Instructions</h2>
      <div class="rounded-2xl bg-white p-6 sticker-sm">
        <div class="prose-exercism text-ink/80 leading-relaxed" v-html="solution.readmeHtml" />
      </div>
    </section>

    <!-- Solution code -->
    <section v-if="solution.solutionFiles.length" class="mb-10">
      <h2 class="font-display text-xl font-bold mb-4">Solution</h2>
      <div v-for="file in solution.solutionFiles" :key="file.name" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-mono text-sm font-bold text-ink/70 bg-ink/5 px-3 py-1 rounded-lg border-2 border-ink/10">{{ file.name }}</span>
          <span class="text-xs font-display font-bold text-ink/40 uppercase tracking-widest">{{ file.lang }}</span>
        </div>
        <div class="shiki" v-html="file.html" />
      </div>
    </section>

    <!-- Test code -->
    <section v-if="solution.testFiles.length" class="mb-10">
      <details class="group">
        <summary class="cursor-pointer list-none flex items-center gap-2 mb-4">
          <h2 class="font-display text-xl font-bold">Tests</h2>
          <span class="text-xs font-display font-bold text-ink/40 bg-ink/5 px-2 py-1 rounded group-open:bg-teal/10 group-open:text-teal">{{ solution.testFiles.length }} file{{ solution.testFiles.length === 1 ? '' : 's' }}</span>
        </summary>
        <div v-for="file in solution.testFiles" :key="file.name" class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-sm font-bold text-ink/70 bg-ink/5 px-3 py-1 rounded-lg border-2 border-ink/10">{{ file.name }}</span>
            <span class="text-xs font-display font-bold text-ink/40 uppercase tracking-widest">{{ file.lang }}</span>
          </div>
          <div class="shiki" v-html="file.html" />
        </div>
      </details>
    </section>

    <!-- Example / proof files -->
    <section v-if="solution.exampleFiles.length" class="mb-10">
      <details class="group">
        <summary class="cursor-pointer list-none flex items-center gap-2 mb-4">
          <h2 class="font-display text-xl font-bold">Reference solution</h2>
        </summary>
        <div v-for="file in solution.exampleFiles" :key="file.name" class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-sm font-bold text-ink/70 bg-ink/5 px-3 py-1 rounded-lg border-2 border-ink/10">{{ file.name }}</span>
          </div>
          <div class="shiki" v-html="file.html" />
        </div>
      </details>
    </section>

    <!-- Exercism link -->
    <a
      v-if="solution.exercismUrl"
      :href="solution.exercismUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-full bg-purple text-white font-display text-sm font-bold px-6 py-3 sticker mb-12"
    >
      View on Exercism →
    </a>

    <!-- Prev / Next -->
    <nav class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-if="prev"
        :to="prev.url"
        class="rounded-2xl bg-white p-5 sticker-sm flex flex-col"
      >
        <span class="text-xs font-display font-bold uppercase tracking-widest text-ink/40">← Previous</span>
        <span class="font-display font-bold mt-1">{{ prev.title }}</span>
        <span class="text-sm text-ink/50 capitalize">{{ prev.trackName }}</span>
      </NuxtLink>
      <div v-else />
      <NuxtLink
        v-if="next"
        :to="next.url"
        class="rounded-2xl bg-white p-5 sticker-sm flex flex-col text-right"
      >
        <span class="text-xs font-display font-bold uppercase tracking-widest text-ink/40">Next →</span>
        <span class="font-display font-bold mt-1">{{ next.title }}</span>
        <span class="text-sm text-ink/50 capitalize">{{ next.trackName }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>