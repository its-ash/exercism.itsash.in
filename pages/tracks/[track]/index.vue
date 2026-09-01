<script setup lang="ts">
import { useTrack } from '~/composables/useData';
import { breadcrumbJsonLd } from '~/composables/useSEO';

const route = useRoute();
const trackSlug = computed(() => route.params.track as string);
const track = useTrack(trackSlug.value);

if (!track) {
  throw createError({ statusCode: 404, statusMessage: 'Track not found', fatal: true });
}

const solutions = computed(() => track.solutions);

useSEO({
  title: `${track.name} Solutions`,
  description: `${track.solvedCount} solved Exercism ${track.name} exercises. ${track.blurb}`,
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbJsonLd([
        { name: 'Tracks', url: '/tracks' },
        { name: track.name, url: `/tracks/${trackSlug.value}` },
      ])),
    },
  ],
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
    <nav class="mb-8 text-sm font-display font-bold text-ink/50 flex items-center gap-2">
      <NuxtLink to="/tracks" class="hover:text-coral">Tracks</NuxtLink>
      <span>/</span>
      <span class="text-ink">{{ track.name }}</span>
    </nav>

    <div class="flex items-center gap-4 mb-6">
      <TrackBadge :track="trackSlug" size="lg" :rotate="true" />
      <div>
        <h1 class="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">{{ track.name }}</h1>
        <p class="text-ink/60 font-medium">{{ track.blurb }}</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-6 mb-12">
      <div class="flex items-center gap-2">
        <span class="font-display font-extrabold text-2xl text-purple">{{ track.solvedCount }}</span>
        <span class="text-sm text-ink/60 font-semibold">solved</span>
      </div>
      <div class="flex-1 max-w-xs">
        <div class="w-full h-3 rounded-full bg-ink/10 overflow-hidden border-2 border-ink">
          <div class="h-full" :class="['bg-' + track.color]" :style="{ width: track.progress + '%' }" />
        </div>
      </div>
      <span class="text-sm font-display font-bold text-ink/60">{{ track.progress }}%</span>
    </div>

    <div v-if="solutions.length" class="flex flex-col gap-4">
      <SolutionRow v-for="s in solutions" :key="s.url" :solution="s" />
    </div>
    <div v-else class="rounded-2xl border-[3px] border-dashed border-ink/30 p-12 text-center">
      <p class="font-display font-bold text-ink/50">No solutions in this track yet.</p>
    </div>
  </div>
</template>