<script setup lang="ts">
const nav = [
  { label: 'Overview', to: '/' },
  { label: 'Languages', to: '/tracks' },
  { label: 'All Solutions', to: '/solutions' },
  { label: 'About', to: '/about' },
];
</script>

<template>
  <header class="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b-[3px] border-ink">
    <div class="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple border-[3px] border-ink flex items-center justify-center rotate-3">
          <span class="text-white text-lg font-display font-extrabold">E</span>
        </div>
        <span class="font-display font-extrabold text-lg tracking-tight">my-exercism-log</span>
      </NuxtLink>
      <nav class="hidden md:flex items-center gap-8 text-sm font-bold font-display">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="hover:text-coral transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
      <a
        href="https://exercism.org"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:inline-flex items-center rounded-full bg-ink text-white font-display text-sm font-bold px-6 py-2.5 sticker-sm"
      >
        Follow along
      </a>
    </div>
  </header>
</template>