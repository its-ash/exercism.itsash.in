// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,
  // Fully static site — disable features that require a Nitro server runtime
  experimental: { appManifest: false, payloadExtraction: false },
  modules: ['~/modules/exercism-data', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#5624D0' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://exercism.itsash.in' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'My Exercism Log', href: '/rss.xml' },
      ],
    },
  },
  googleFonts: {
    families: {
      Poppins: [500, 600, 700, 800, 900],
      'Source Sans 3': [400, 500, 600, 700],
      'JetBrains Mono': [400, 500, 600, 700],
    },
    display: 'swap',
    preconnect: true,
    download: true,
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/tracks', '/solutions', '/about', '/404.html'],
    },
  },
  site: {
    url: 'https://exercism.itsash.in',
    name: 'My Exercism Log',
    description: 'A running archive of Exercism practice exercises — pulled in, refactored, and documented for anyone following along.',
  },
  typescript: { strict: true },
  tailwindcss: { cssPath: '~/assets/css/main.css', exposePlugin: false },
});