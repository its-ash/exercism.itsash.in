<script setup lang="ts">
const props = defineProps<{
  status: 'solved' | 'in-progress';
  difficulty?: 'easy' | 'medium' | 'hard';
}>();

const statusClass = computed(() =>
  props.status === 'solved'
    ? 'bg-teal text-white'
    : 'bg-yellow text-ink'
);
const difficultyLabel = computed(() => props.difficulty ? props.difficulty.charAt(0).toUpperCase() + props.difficulty.slice(1) : '');
</script>

<template>
  <div class="flex items-center gap-2 shrink-0">
    <span v-if="difficulty" class="hidden sm:inline text-xs font-display font-bold text-ink/50">{{ difficultyLabel }}</span>
    <span
      class="text-xs font-display font-bold tracking-widest uppercase rounded-full px-3 py-1.5 border-2 border-ink"
      :class="statusClass"
    >
      {{ status === 'solved' ? 'Solved' : 'In progress' }}
    </span>
  </div>
</template>