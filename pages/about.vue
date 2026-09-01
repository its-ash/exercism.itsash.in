<script setup lang="ts">
useSEO({
  title: 'About',
  description: 'What my-exercism-log is, how it works, and how solutions are organized and published.',
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
    <h1 class="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">About this log</h1>
    <p class="text-base text-ink/70 leading-relaxed font-medium mb-6">
      <strong class="text-ink">my-exercism-log</strong> is a public archive of
      <a href="https://exercism.org" target="_blank" rel="noopener noreferrer" class="text-purple font-bold underline decoration-2 underline-offset-2">Exercism</a>
      practice exercises. Each time I solve an exercise, I drop it into the matching language folder,
      add a short README, and the site publishes it — complete with syntax-highlighted code and metadata.
    </p>

    <div class="rounded-2xl bg-white p-6 sticker-sm mb-8">
      <h2 class="font-display text-lg font-bold mb-3">How solutions are organized</h2>
      <p class="text-sm text-ink/70 font-medium mb-4">
        Solutions live in <code class="bg-ink/5 px-1.5 py-0.5 rounded">content/solutions/&lt;track&gt;/&lt;exercise&gt;/</code>.
        Each folder contains the solved code and a <code class="bg-ink/5 px-1.5 py-0.5 rounded">README.md</code> with front-matter:
      </p>
      <pre class="bg-ink text-cream/90 rounded-xl p-4 text-xs font-mono overflow-x-auto border-2 border-ink">---
title: Two Fer
track: javascript
difficulty: easy
status: solved
tags: [strings, defaults]
date: 2026-08-31
---</pre>
    </div>

    <div class="rounded-2xl bg-white p-6 sticker-sm mb-8">
      <h2 class="font-display text-lg font-bold mb-3">What gets discovered</h2>
      <ul class="text-sm text-ink/70 font-medium space-y-2 list-disc pl-5">
        <li>Language tracks (auto-created from your folders)</li>
        <li>Per-track progress bars and solved counts</li>
        <li>Individual solution pages with highlighted code</li>
        <li>RSS feed, sitemap, and full SEO metadata</li>
      </ul>
    </div>

    <p class="text-sm text-ink/50 font-medium">
      Solutions are archived for learning, not submission.
    </p>
  </div>
</template>