/**
 * prerender.mjs
 * Static HTML prerendering for all routes.
 *
 * Run AFTER a normal client build:
 *   pnpm build && node scripts/prerender.mjs
 *
 * Or use the combined script:
 *   pnpm build:ssr
 *
 * How it works:
 * 1. Builds src/entry-server.tsx as an SSR bundle (Node-compatible).
 * 2. Imports the bundle and calls render(url) for each route.
 * 3. Injects the rendered HTML + Helmet meta tags into dist/public/index.html.
 * 4. Writes per-route index.html files, so bots see full HTML without JS.
 */
import { build } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const ROUTES = [
  '/',
  '/docs',
  '/tutorials',
  '/publications',
  '/develop',
  '/community',
  '/community/contributors',
  '/support',
  '/contact',
  '/cite',
  '/license',
];

// Provide env vars expected by vite.config.ts
process.env.PORT = process.env.PORT || '3000';
process.env.BASE_PATH = process.env.BASE_PATH || '/';

// ── 1. Build the SSR entry ────────────────────────────────────────────
console.log('\n[prerender] Building SSR entry…');
await build({
  root,
  configFile: join(root, 'vite.config.ts'),
  build: {
    ssr: join(root, 'src', 'entry-server.tsx'),
    outDir: join(root, 'dist', 'server'),
    minify: false,
    ssrEmitAssets: false,
    rollupOptions: {
      // Ensure CSS imports are stripped in the SSR bundle
      external: [/\.css$/],
    },
  },
  // Silence the cartographer / dev-banner plugins in build
  plugins: [],
});
console.log('[prerender] SSR entry built.\n');

// ── 2. Render each route ─────────────────────────────────────────────
const serverEntryPath = join(root, 'dist', 'server', 'entry-server.js');
const { render } = await import(serverEntryPath);

const template = readFileSync(
  join(root, 'dist', 'public', 'index.html'),
  'utf-8'
);

for (const route of ROUTES) {
  process.stdout.write(`  Rendering ${route}… `);
  try {
    const { html, helmet } = render(route);

    // Inject rendered HTML into the SPA shell
    let pageHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    // Inject Helmet-generated head tags (title, meta, canonical, etc.)
    if (helmet) {
      const headTags = [
        helmet.title?.toString() ?? '',
        helmet.priority?.toString() ?? '',
        helmet.meta?.toString() ?? '',
        helmet.link?.toString() ?? '',
        helmet.script?.toString() ?? '',
      ].filter(Boolean).join('\n    ');

      if (headTags) {
        // Replace the static fallback title inserted by index.html with the
        // per-route title from Helmet, then append the other tags.
        pageHtml = pageHtml.replace(
          /<title>[^<]*<\/title>/,
          helmet.title?.toString() ?? ''
        );
        pageHtml = pageHtml.replace(
          '</head>',
          `    ${headTags}\n  </head>`
        );
      }
    }

    // Write to the appropriate directory
    const segments = route === '/' ? [] : route.split('/').filter(Boolean);
    const outDir = join(root, 'dist', 'public', ...segments);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), pageHtml, 'utf-8');
    console.log('✓');
  } catch (err) {
    console.log('✗');
    console.error(`    Error: ${err.message}`);
    if (process.env.PRERENDER_DEBUG) console.error(err);
  }
}

console.log('\n[prerender] Done.\n');
