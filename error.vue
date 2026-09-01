<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>();
const handleError = () => clearError({ redirect: '/' });

useSEO({
  title: props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong',
  description: 'The page you were looking for could not be found.',
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-cream text-ink">
    <AppNav />
    <main class="flex-1 flex items-center justify-center px-4 py-24">
      <div class="text-center max-w-lg">
        <p class="inline-block bg-coral text-white text-xs font-display font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border-[3px] border-ink rotate-2 mb-6">
          Error {{ error.statusCode }}
        </p>
        <h1 class="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
          <span class="text-purple">Lost</span> in the<br class="hidden sm:block" />
          <span class="text-coral">exercise</span> folder.
        </h1>
        <p class="text-base text-ink/70 leading-relaxed mb-8 font-medium">
          {{ error.message || 'This page wandered off. Let’s get you back to the solutions.' }}
        </p>
        <button
          class="inline-flex items-center rounded-full bg-purple text-white font-display text-sm font-bold px-7 py-3.5 sticker"
          @click="handleError"
        >
          Back to home
        </button>
      </div>
    </main>
    <AppFooter />
  </div>
</template>