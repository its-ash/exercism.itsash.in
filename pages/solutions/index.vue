<script setup lang="ts">
import { useSolutions } from '~/composables/useData';

const solutions = useSolutions();
const all = computed(() => solutions);

const query = ref('');
const selectedTrack = ref<string>('');
const selectedDifficulty = ref<string>('');

const trackOptions = computed(() => Array.from(new Set(all.value.map((s) => s.trackSlug))).sort());

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim();
  return all.value.filter((s) => {
    if (selectedTrack.value && s.trackSlug !== selectedTrack.value) return false;
    if (selectedDifficulty.value && s.difficulty !== selectedDifficulty.value) return false;
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.trackSlug.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
});

useSEO({
  title: 'All Solutions',
  description: 'Every solved Exercism exercise across all language tracks — searchable and filterable.',
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
    <h1 class="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">All solutions</h1>
    <p class="text-base text-ink/70 font-medium mb-10 max-w-2xl">
      Every exercise across every track. Search by title, language, or tag.
    </p>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-10">
      <input
        v-model="query"
        type="search"
        placeholder="Search exercises, tags…"
        class="flex-1 rounded-full border-[3px] border-ink bg-white px-5 py-3 font-medium outline-none focus:shadow-sticker-sm transition-shadow"
      />
      <select
        v-model="selectedTrack"
        class="rounded-full border-[3px] border-ink bg-white px-5 py-3 font-medium outline-none capitalize"
      >
        <option value="">All languages</option>
        <option v-for="t in trackOptions" :key="t" :value="t" class="capitalize">{{ t }}</option>
      </select>
      <select
        v-model="selectedDifficulty"
        class="rounded-full border-[3px] border-ink bg-white px-5 py-3 font-medium outline-none capitalize"
      >
        <option value="">Any difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>

    <p class="text-sm text-ink/50 font-medium mb-6">{{ filtered.length }} solution{{ filtered.length === 1 ? '' : 's' }}</p>

    <div v-if="filtered.length" class="flex flex-col gap-4">
      <SolutionRow v-for="s in filtered" :key="s.path" :solution="s" />
    </div>
    <div v-else class="rounded-2xl border-[3px] border-dashed border-ink/30 p-12 text-center">
      <p class="font-display font-bold text-ink/50">No solutions match your filters.</p>
    </div>
  </div>
</template>