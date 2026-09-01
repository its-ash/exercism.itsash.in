<template>
  <div class="min-h-screen flex flex-col bg-cream text-ink">
    <AppNav />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>