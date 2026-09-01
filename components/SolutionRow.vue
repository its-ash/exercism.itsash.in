<script setup lang="ts">
import type { SolutionData } from '~/server-utils/data';

const props = defineProps<{
  solution: SolutionData;
}>();
</script>

<template>
  <NuxtLink
    :to="solution.url"
    class="flex items-center justify-between gap-4 bg-white rounded-2xl p-5 sticker-sm"
  >
    <div class="flex items-center gap-4 min-w-0">
      <TrackBadge :track="solution.trackSlug" size="sm" />
      <div class="min-w-0">
        <p class="font-display font-bold truncate">{{ solution.title }}</p>
        <p class="text-sm text-ink/50 truncate font-medium capitalize">
          {{ solution.trackSlug }} &middot; {{ solution.difficulty }}
        </p>
      </div>
    </div>
    <StatusBadge :status="solution.status" :difficulty="solution.difficulty" />
  </NuxtLink>
</template>