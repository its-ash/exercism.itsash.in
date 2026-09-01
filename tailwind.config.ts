import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        purple: { DEFAULT: '#5624D0', dark: '#3B1A96' },
        coral: '#FF6847',
        teal: '#00C2A8',
        yellow: '#FFC94A',
        pink: '#FF4D94',
        blue: '#2F8FFF',
        cream: '#FFF8EC',
        ink: '#1B1A21',
      },
      fontFamily: {
        display: ['Poppins', 'Source Sans 3', 'sans-serif'],
        sans: ['"Source Sans 3"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        sticker: '6px 6px 0 0 #1B1A21',
        'sticker-sm': '4px 4px 0 0 #1B1A21',
        'sticker-hover': '9px 9px 0 0 #1B1A21',
        'sticker-sm-hover': '7px 7px 0 0 #1B1A21',
      },
    },
  },
};

export default config;