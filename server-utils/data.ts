import { readdirSync, readFileSync, statSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import matter from 'gray-matter';
import { codeToHtml } from 'shiki';

export interface ExerciseFile {
  name: string;
  path: string;
  lang: string;
  content: string;
  html: string;
}

export interface SolutionData {
  slug: string;
  title: string;
  trackSlug: string;
  trackName: string;
  difficulty: string;
  status: string;
  tags: string[];
  date: string;
  url: string;
  blurb: string;
  source: string;
  sourceUrl: string;
  authors: string[];
  contributors: string[];
  exercismUrl: string;
  exercismId: string;
  instructions: string;
  readmeHtml: string;
  solutionFiles: ExerciseFile[];
  testFiles: ExerciseFile[];
  exampleFiles: ExerciseFile[];
  hasTests: boolean;
  hasSolution: boolean;
  packageJson: string | null;
  helpMd: string | null;
}

export interface TrackData {
  slug: string;
  name: string;
  short: string;
  color: string;
  blurb: string;
  solutions: SolutionData[];
  solvedCount: number;
  totalCount: number;
  progress: number;
  url: string;
}

export interface SiteData {
  tracks: TrackData[];
  solutions: SolutionData[];
  stats: {
    totalSolutions: number;
    totalTracks: number;
    totalExercises: number;
    streakDays: number;
  };
}

const EXERCISES_ROOT = resolve(process.cwd(), 'exercise');
const DATA_FILE = resolve(process.cwd(), '.data/solutions.json');
const APP_DATA_FILE = resolve(process.cwd(), 'app/data.generated.json');
const SITE_URL = 'https://exercism.itsash.in';

const CODE_EXTENSIONS: Record<string, string> = {
  '.js': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript', '.jsx': 'javascript',
  '.ts': 'typescript', '.tsx': 'typescript', '.mts': 'typescript', '.cts': 'typescript',
  '.py': 'python', '.rb': 'ruby', '.go': 'go', '.rs': 'rust',
  '.ex': 'elixir', '.exs': 'elixir', '.kt': 'kotlin', '.kts': 'kotlin',
  '.cs': 'csharp', '.java': 'java', '.cpp': 'cpp', '.cc': 'cpp', '.cxx': 'cpp',
  '.c': 'c', '.h': 'c', '.php': 'php', '.swift': 'swift', '.dart': 'dart',
  '.lua': 'lua', '.clj': 'clojure', '.cljs': 'clojure', '.cljc': 'clojure',
  '.hs': 'haskell', '.sh': 'bash', '.bash': 'bash', '.md': 'markdown',
  '.json': 'json', '.yml': 'yaml', '.yaml': 'yaml',
};

const TRACK_META: Record<string, { name: string; short: string; color: string; blurb: string }> = {
  javascript: { name: 'JavaScript', short: 'JS', color: 'yellow', blurb: 'Closures, async patterns, array drills.' },
  typescript: { name: 'TypeScript', short: 'TS', color: 'blue', blurb: 'Generics, utility types, strict modes.' },
  python: { name: 'Python', short: 'Py', color: 'blue', blurb: 'Data structures and generator practice.' },
  ruby: { name: 'Ruby', short: 'Rb', color: 'coral', blurb: 'Blocks, modules, and metaprogramming.' },
  go: { name: 'Go', short: 'Go', color: 'teal', blurb: 'Goroutines, channels, interfaces.' },
  rust: { name: 'Rust', short: 'Rs', color: 'pink', blurb: 'Ownership, borrowing, lifetimes.' },
  elixir: { name: 'Elixir', short: 'Ex', color: 'purple', blurb: 'Pattern matching, OTP, concurrency.' },
  kotlin: { name: 'Kotlin', short: 'Kt', color: 'purple', blurb: 'Coroutines, DSLs, null safety.' },
};

function getTrackMeta(slug: string) {
  return TRACK_META[slug] ?? {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    short: slug.slice(0, 2).toUpperCase(),
    color: 'purple',
    blurb: 'Practice exercises.',
  };
}

function safeReadDir(dir: string): string[] {
  try { return readdirSync(dir); } catch { return []; }
}

async function highlight(code: string, lang: string): Promise<string> {
  try {
    return await codeToHtml(code, { lang: lang || 'text', theme: 'github-light' });
  } catch {
    return `<pre class="shiki"><code>${code.replace(/</g, '&lt;')}</code></pre>`;
  }
}

async function readFileAsExercise(filePath: string, name: string): Promise<ExerciseFile> {
  const ext = name.slice(name.lastIndexOf('.'));
  const lang = CODE_EXTENSIONS[ext] || 'text';
  const content = readFileSync(filePath, 'utf-8');
  return { name, path: filePath, lang, content, html: await highlight(content, lang) };
}

function markdownToHtml(md: string): string {
  // Strip the "## Source" section onward — credits are shown separately in the Credits card
  let src = md.replace(/^##\s+Source[\s\S]*$/m, '').trim();
  // Resolve reference-style links: [text][id] ... [id]: url
  const refLinks = new Map<string, string>();
  src = src.replace(/^\[([^\]]+)\]:\s*(\S+)\s*$/gm, (_m, id: string, url: string) => {
    refLinks.set(id.toLowerCase(), url);
    return '';
  });
  src = src.replace(/\[([^\]]+)\]\[([^\]]+)\]/g, (_m, text: string, id: string) => {
    const url = refLinks.get(id.toLowerCase());
    return url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>` : text;
  });
  // Minimal, safe markdown → HTML (headings, bold, italic, code, inline links, lists)
  let html = src
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html
    .replace(/&lt;h1&gt;|&lt;h2&gt;|&lt;h3&gt;|&lt;ul&gt;|&lt;li&gt;|&lt;\/h1&gt;|&lt;\/h2&gt;|&lt;\/h3&gt;|&lt;\/ul&gt;|&lt;\/li&gt;/g, '') // clear if any leaked
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, '\n\n')
    .split('\n').map((line) =>
      line.startsWith('<') || line.trim() === '' ? line : `<p>${line}</p>`
    ).join('\n');
  return html.trim();
}

async function parseExercise(trackSlug: string, exDir: string, slug: string): Promise<SolutionData | null> {
  const metaPath = join(exDir, '.exercism', 'metadata.json');
  const configPath = join(exDir, '.exercism', 'config.json');
  const readmePath = join(exDir, 'README.md');
  const helpPath = join(exDir, 'HELP.md');
  const pkgPath = join(exDir, 'package.json');

  let exercismUrl = '';
  let exercismId = '';
  let trackName = trackSlug;
  if (existsSync(metaPath)) {
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
      exercismUrl = meta.url || '';
      exercismId = meta.id || '';
      trackName = meta.track || trackSlug;
    } catch {}
  }

  let blurb = '';
  let source = '';
  let sourceUrl = '';
  let authors: string[] = [];
  let contributors: string[] = [];
  let solutionPaths: string[] = [];
  let testPaths: string[] = [];
  let examplePaths: string[] = [];
  if (existsSync(configPath)) {
    try {
      const cfg = JSON.parse(readFileSync(configPath, 'utf-8'));
      blurb = cfg.blurb || '';
      source = cfg.source || '';
      sourceUrl = cfg.source_url || '';
      authors = cfg.authors || [];
      contributors = cfg.contributors || [];
      solutionPaths = cfg.files?.solution || [];
      testPaths = cfg.files?.test || [];
      examplePaths = cfg.files?.example || [];
    } catch {}
  }

  let title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  let instructions = '';
  let readmeHtml = '';
  if (existsSync(readmePath)) {
    const readme = readFileSync(readmePath, 'utf-8');
    // Strip front-matter if present
    const parsed = readme.startsWith('---') ? matter(readme) : { content: readme, data: {} as Record<string, unknown> };
    instructions = parsed.content;
    readmeHtml = markdownToHtml(instructions);
    // Extract title from first H1
    const h1 = instructions.match(/^#\s+(.+)$/m);
    if (h1) title = h1[1].trim();
    if (parsed.data.title) title = parsed.data.title as string;
  }

  const readFiles = async (paths: string[]) => {
    const out: ExerciseFile[] = [];
    for (const p of paths) {
      const fp = join(exDir, p);
      if (existsSync(fp)) out.push(await readFileAsExercise(fp, p));
    }
    return out;
  };

  const solutionFiles = await readFiles(solutionPaths);
  const testFiles = await readFiles(testPaths);
  const exampleFiles = await readFiles(examplePaths);

  // Fallback: if no solution paths defined, find the main code file
  if (solutionFiles.length === 0) {
    for (const file of safeReadDir(exDir)) {
      const dot = file.lastIndexOf('.');
      if (dot === -1) continue;
      const ext = file.slice(dot);
      const lang = CODE_EXTENSIONS[ext];
      if (!lang) continue;
      const lower = file.toLowerCase();
      if (lower.includes('spec') || lower.includes('test') || lower === 'package.json') continue;
      const fp = join(exDir, file);
      if (!statSync(fp).isFile()) continue;
      solutionFiles.push(await readFileAsExercise(fp, file));
      break;
    }
  }

  // Determine status: solved if solution file differs from skeleton (non-empty implementation)
  let status = 'solved';
  const statusMarkerPath = join(exDir, '.solved');
  if (existsSync(statusMarkerPath)) {
    status = 'solved';
  }

  let date = new Date().toISOString().slice(0, 10);
  if (existsSync(readmePath)) {
    const parsed = matter(readFileSync(readmePath, 'utf-8'));
    if (parsed.data.date) date = parsed.data.date as string;
  }

  let difficulty = 'easy';
  let tags: string[] = [];
  if (existsSync(readmePath)) {
    const parsed = matter(readFileSync(readmePath, 'utf-8'));
    if (parsed.data.difficulty) difficulty = parsed.data.difficulty as string;
    if (Array.isArray(parsed.data.tags)) tags = parsed.data.tags as string[];
  }

  let helpMd: string | null = null;
  if (existsSync(helpPath)) helpMd = readFileSync(helpPath, 'utf-8');

  let packageJson: string | null = null;
  if (existsSync(pkgPath)) packageJson = readFileSync(pkgPath, 'utf-8');

  return {
    slug,
    title,
    trackSlug,
    trackName,
    difficulty,
    status,
    tags,
    date,
    url: `/tracks/${trackSlug}/${slug}`,
    blurb,
    source,
    sourceUrl,
    authors,
    contributors,
    exercismUrl,
    exercismId,
    instructions,
    readmeHtml,
    solutionFiles,
    testFiles,
    exampleFiles,
    hasTests: testFiles.length > 0,
    hasSolution: solutionFiles.length > 0,
    packageJson,
    helpMd,
  };
}

export async function buildSiteData(): Promise<SiteData> {
  if (!existsSync(EXERCISES_ROOT)) {
    return { tracks: [], solutions: [], stats: { totalSolutions: 0, totalTracks: 0, totalExercises: 0, streakDays: 0 } };
  }

  const tracks: TrackData[] = [];
  const allSolutions: SolutionData[] = [];
  const trackDirs = safeReadDir(EXERCISES_ROOT).filter((d) => statSync(join(EXERCISES_ROOT, d)).isDirectory());

  for (const trackSlug of trackDirs) {
    const trackDir = join(EXERCISES_ROOT, trackSlug);
    const exDirs = safeReadDir(trackDir).filter((d) => statSync(join(trackDir, d)).isDirectory() && !d.startsWith('.'));
    const solutions: SolutionData[] = [];
    for (const exSlug of exDirs) {
      const exDir = join(trackDir, exSlug);
      const sol = await parseExercise(trackSlug, exDir, exSlug);
      if (sol) {
        solutions.push(sol);
        allSolutions.push(sol);
      }
    }
    solutions.sort((a, b) => (a.date < b.date ? 1 : -1));
    const meta = getTrackMeta(trackSlug);
    const solvedCount = solutions.filter((s) => s.status === 'solved').length;
    tracks.push({
      slug: trackSlug,
      name: meta.name,
      short: meta.short,
      color: meta.color,
      blurb: meta.blurb,
      solutions,
      solvedCount,
      totalCount: solutions.length,
      progress: solutions.length === 0 ? 0 : Math.round((solvedCount / solutions.length) * 100),
      url: `/tracks/${trackSlug}`,
    });
  }

  tracks.sort((a, b) => b.solvedCount - a.solvedCount);
  allSolutions.sort((a, b) => (a.date < b.date ? 1 : -1));

  // Streak
  const days = new Set(allSolutions.map((s) => s.date));
  let streakDays = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i++) {
    const d = cursor.toISOString().slice(0, 10);
    if (days.has(d)) { streakDays++; cursor.setDate(cursor.getDate() - 1); }
    else if (i === 0) { cursor.setDate(cursor.getDate() - 1); }
    else break;
  }

  const data: SiteData = {
    tracks,
    solutions: allSolutions,
    stats: {
      totalSolutions: allSolutions.length,
      totalTracks: tracks.length,
      totalExercises: allSolutions.length,
      streakDays,
    },
  };

  // Write the static JSON
  mkdirSync(resolve(DATA_FILE, '..'), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(data), 'utf-8');
  // Also write a copy inside app/ so it can be statically imported by composables
  mkdirSync(resolve(APP_DATA_FILE, '..'), { recursive: true });
  writeFileSync(APP_DATA_FILE, JSON.stringify(data), 'utf-8');

  // Write static SEO files into public/
  writeStaticSeo(data);

  // Regenerate the project README with the latest solution list
  writeReadme(data);

  return data;
}

function writeStaticSeo(data: SiteData) {
  const publicDir = resolve(process.cwd(), 'public');
  mkdirSync(publicDir, { recursive: true });

  // sitemap.xml
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/tracks', priority: '0.9', changefreq: 'weekly' },
    { loc: '/solutions', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    ...data.tracks.map((t) => ({ loc: t.url, priority: '0.8', changefreq: 'weekly' })),
    ...data.solutions.map((s) => ({ loc: s.url, priority: '0.7', changefreq: 'monthly' })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf-8');

  // robots.txt
  writeFileSync(join(publicDir, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${SITE_URL}/sitemap.xml`, 'utf-8');

  // rss.xml
  const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
  const items = data.solutions.map((s) => `    <item>
      <title>${esc(s.title)} — ${esc(s.trackName)}</title>
      <link>${SITE_URL}${s.url}</link>
      <guid>${SITE_URL}${s.url}</guid>
      <pubDate>${new Date(s.date).toUTCString()}</pubDate>
      <description>${esc(`${s.title} (${s.trackName}, ${s.difficulty}) — ${s.status}. Tags: ${s.tags.join(', ')}`)}</description>
    </item>`).join('\n');
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Exercism Log</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>A running archive of Exercism practice exercises.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;
  writeFileSync(join(publicDir, 'rss.xml'), rss, 'utf-8');
}

function writeReadme(data: SiteData) {
  const root = resolve(process.cwd());
  const tracks = [...data.tracks].sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [
    '# My Exercism Log',
    '',
    `> A running archive of [Exercism](https://exercism.org) practice exercises — built with Nuxt 3, Tailwind CSS, and Shiki.`,
    '',
    `**Live site:** [${SITE_URL.replace(/^https:\/\//, '')}](${SITE_URL})`,
    '',
    `| Tracks | Exercises | Solved | Streak |`,
    `| :---: | :---: | :---: | :---: |`,
    `| ${data.stats.totalTracks} | ${data.stats.totalExercises} | ${data.stats.totalSolutions} | ${data.stats.streakDays} days |`,
    '',
  ];

  for (const track of tracks) {
    lines.push(`## ${track.name}`);
    lines.push('');
    lines.push(track.blurb);
    lines.push('');
    lines.push(`| # | Exercise | Difficulty | Status | Date |`);
    lines.push(`| --: | :--- | :---: | :---: | :---: |`);
    track.solutions.forEach((s, i) => {
      const url = `${SITE_URL}${s.url}`;
      lines.push(`| ${i + 1} | [${s.title}](${url}) | ${s.difficulty} | ${s.status} | ${s.date} |`);
    });
    lines.push('');
  }

  lines.push('## Stack');
  lines.push('');
  lines.push('- Nuxt 3 (SSR + static generate → GitHub Pages)');
  lines.push('- Tailwind CSS — neo-brutalist Exercism-inspired theme');
  lines.push('- Shiki syntax highlighting');
  lines.push('- gray-matter for solution front-matter');
  lines.push('');
  lines.push('## Develop');
  lines.push('');
  lines.push('```bash');
  lines.push('make run');
  lines.push('```');
  lines.push('');
  lines.push('## Build & Deploy');
  lines.push('');
  lines.push('```bash');
  lines.push('make deploy   # build → docs/ → commit → push');
  lines.push('```');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`_This README is regenerated automatically on every \`make deploy\`._`);
  lines.push('');

  writeFileSync(join(root, 'README.md'), lines.join('\n'), 'utf-8');
}

export function loadSiteData(): SiteData {
  if (!existsSync(DATA_FILE)) {
    return { tracks: [], solutions: [], stats: { totalSolutions: 0, totalTracks: 0, totalExercises: 0, streakDays: 0 } };
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

export { SITE_URL, DATA_FILE };