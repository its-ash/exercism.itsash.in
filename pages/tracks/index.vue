<script setup lang="ts">
import { useTracks } from '~/composables/useData';
import { collectionJsonLd } from '~/composables/useSEO';

const tracks = useTracks();

useSEO({
  title: 'Language Tracks',
  description: 'Browse every Exercism language track with solved exercises, progress, and difficulty breakdowns.',
});

useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(collectionJsonLd(tracks)) }],
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
    <h1 class="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">Language tracks</h1>
    <p class="text-base text-ink/70 font-medium mb-12 max-w-2xl">
      Every language folder on the log. Each card links to the track’s full exercise list with solutions.
    </p>

    <div v-if="tracks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <TrackCard v-for="track in tracks" :key="track.slug" :track="track" />
    </div>
    <div v-else class="rounded-2xl border-[3px] border-dashed border-ink/30 p-12 text-center">
      <p class="font-display font-bold text-ink/50">No tracks yet. Add a solution folder to get started.</p>
    </div>
  </div>
</template>