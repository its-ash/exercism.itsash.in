<script setup lang="ts">
import type { TrackData } from '~/server-utils/data';

const props = defineProps<{
  track: TrackData;
}>();
</script>

<template>
  <NuxtLink :to="track.url" class="group block rounded-2xl bg-white p-6 sticker">
    <div class="flex items-center justify-between mb-6">
      <TrackBadge :track="track.slug" size="md" :rotate="true" />
      <span class="text-xs font-display font-bold tracking-widest uppercase bg-ink text-white rounded-full px-3 py-1">
        {{ track.solvedCount }} solved
      </span>
    </div>
    <h3 class="font-display text-lg font-bold mb-1">{{ track.name }}</h3>
    <p class="text-sm text-ink/60 mb-4 font-medium">{{ track.blurb ?? 'Practice exercises.' }}</p>
    <div class="w-full h-3 rounded-full bg-ink/10 overflow-hidden border-2 border-ink">
      <div class="h-full" :class="['bg-' + track.color]" :style="{ width: track.progress + '%' }" />
    </div>
  </NuxtLink>
</template>