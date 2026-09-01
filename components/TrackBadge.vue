<script setup lang="ts">
import { useTrack } from '~/composables/useData';

const props = defineProps<{
  track: string;
  size?: 'sm' | 'md' | 'lg';
  rotate?: boolean;
}>();

const trackData = useTrack(props.track);
const short = trackData?.short ?? props.track.slice(0, 2).toUpperCase();
const color = trackData?.color ?? 'purple';
const textClass = ['yellow'].includes(color) ? 'text-ink' : 'text-white';
const colorClass = `bg-${color}`;
const sizeClass = ({
  sm: 'w-11 h-11 text-xs rounded-lg',
  md: 'w-12 h-12 text-lg rounded-xl',
  lg: 'w-14 h-14 text-xl rounded-2xl',
}[props.size ?? 'md'])!;
const rotateClass = props.rotate ? (Math.random() > 0.5 ? 'rotate-3' : '-rotate-3') : '';
</script>

<template>
  <div
    class="shrink-0 border-[3px] border-ink flex items-center justify-center font-display font-extrabold"
    :class="[colorClass, textClass, sizeClass, rotateClass]"
  >
    {{ short }}
  </div>
</template>