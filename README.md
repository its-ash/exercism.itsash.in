# My Exercism Log

A Nuxt.js web app that archives and showcases Exercism coding exercise solutions. Solutions are organized in language folders (`content/solutions/<track>/<exercise>/`) and auto-discovered at build time.

## Stack
- Nuxt 3 (SSR + static generate)
- Tailwind CSS (neo-brutalist Exercism-inspired theme)
- Shiki (syntax highlighting)
- gray-matter (solution front-matter)

## Structure
```
content/solutions/<track>/<exercise>/  ← drop an exercise here
  solution.*      ← the solved code
  README.md       ← front-matter: title, difficulty, status, tags
```

## Develop
```bash
npm run dev
```

## Build (static, GitHub Pages-ready)
```bash
npm run generate
```

Output is written to `docs/` (see Makefile) for GitHub Pages.