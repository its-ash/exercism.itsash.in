import type { SolutionData, TrackData } from '~/server-utils/data';

const SITE_URL = 'https://exercism.itsash.in';
const SITE_NAME = 'My Exercism Log';
const DEFAULT_DESC = 'A running archive of Exercism practice exercises — pulled in, refactored, and documented for anyone following along.';

export function useSEO(opts?: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  publishedTime?: string;
  tags?: string[];
}) {
  const route = useRoute();
  const fullTitle = opts?.title ? `${opts.title} — ${SITE_NAME}` : `${SITE_NAME} — Exercism Solutions Archive`;
  const desc = opts?.description || DEFAULT_DESC;
  const url = `${SITE_URL}${opts?.path ?? route.path}`;
  const image = opts?.image || `${SITE_URL}/og.svg`;

  useSeoMeta({
    title: fullTitle,
    description: desc,
    ogTitle: fullTitle,
    ogDescription: desc,
    ogType: 'website',
    ogUrl: url,
    ogImage: image,
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: desc,
    twitterImage: image,
    articlePublishedTime: opts?.publishedTime,
    articleTag: opts?.tags,
  });

  useHead({
    link: [{ rel: 'canonical', href: url }],
  });

  return { fullTitle, desc, url };
}

export function homeJsonLd(_stats: { totalSolutions: number; totalTracks: number; totalExercises: number; streakDays: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESC,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/tracks?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function collectionJsonLd(tracks: TrackData[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Exercism Solution Tracks',
    itemListElement: tracks.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: `${SITE_URL}${t.url}`,
    })),
  };
}

export function solutionJsonLd(solution: SolutionData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: solution.title,
    description: `${solution.title} — ${solution.difficulty} exercise in the ${solution.trackName} track. Tags: ${solution.tags.join(', ')}`,
    url: `${SITE_URL}${solution.url}`,
    datePublished: solution.date,
    keywords: solution.tags.join(', '),
    inLanguage: solution.solutionFiles[0]?.lang || 'en',
    author: { '@type': 'Person', name: 'my-exercism-log' },
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_DESC };