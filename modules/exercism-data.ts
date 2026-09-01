import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { defineNuxtModule } from '@nuxt/kit';
import { buildSiteData } from '../server-utils/data';

/**
 * Build-time module: scans `exercise/<track>/<exercise>/` at `nuxt generate`
 * time and writes `.data/solutions.json` + static SEO files into `public/`.
 * No server runtime is used — everything is prerendered to static HTML.
 */
export default defineNuxtModule({
  meta: { name: 'exercism-data' },
  setup(_options, nuxt) {
    nuxt.hook('build:before', async () => {
      const dataFile = resolve(nuxt.options.rootDir, '.data/solutions.json');
      const appDataFile = resolve(nuxt.options.rootDir, 'app/data.generated.json');
      if (!existsSync(dataFile) || !existsSync(appDataFile)) {
        console.log('[exercism-data] Scanning exercises and generating static data…');
        await buildSiteData();
      }
    });
  },
});