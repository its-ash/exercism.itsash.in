---
name: My Exercism Log conventions
description: Nuxt 3 site archiving Exercism solutions; neo-brutalist Exercism-inspired theme
applyTo: "*"
---

# Project: my-exercism-log

## Stack
- Nuxt 3, Vue 3 `<script setup lang="ts">`, Tailwind CSS.
- Static site generation (`nuxt generate`) → `docs/` for GitHub Pages.
- Solutions live in `content/solutions/<track>/<exercise>/`.

## Theme tokens
- Colors: purple #5624D0, coral #FF6847, teal #00C2A8, yellow #FFC94A, pink #FF4D94, blue #2F8FFF, cream #FFF8EC, ink #1B1A21.
- Fonts: Poppins (display), Source Sans 3 (body).
- "Sticker" cards: 3px ink border + hard offset shadow; hover lifts -3px/-3px.

## Solution front-matter (README.md)
```
---
title: Two Fer
track: javascript
difficulty: easy      # easy | medium | hard
status: solved        # solved | in-progress
tags: [strings, defaults]
date: 2026-08-31
---
```

## SEO
- Every page sets `useSeoMeta` (title, description, og, twitter, canonical).
- `/sitemap.xml`, `/robots.txt`, `/rss.xml` are prerendered.
- `htmlAttrs.lang = 'en'`, canonical URLs, semantic landmarks, JSON-LD.

## Conventions
- Prefer Tailwind utility classes over custom CSS.
- Components are PascalCase, one per file under `components/`.
- Server routes under `server/api/` read the filesystem at build/runtime.
- Keep code concise; no TODOs/placeholders.