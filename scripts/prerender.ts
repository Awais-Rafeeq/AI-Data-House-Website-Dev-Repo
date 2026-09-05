// Post-build prerender. After `vite build`, this bakes a correct, route-specific
// <head> (title, description, canonical, Open Graph, Twitter, robots) and the
// route's JSON-LD into a static HTML file per route. The body is still the SPA
// shell that hydrates client-side, but every crawler and link unfurler now sees
// the right meta and structured data without executing JavaScript.
//
// Vercel serves dist/<route>/index.html for that URL (cleanUrls) before applying
// the SPA rewrite, so these files take precedence. Routes without a static file
// fall back to the SPA as before.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRERENDER_ROUTES, type PrerenderRoute } from '../lib/seoConfig';

const SITE = 'https://www.aidatahouse.com';
const DEFAULT_IMAGE = `${SITE}/images/og/og-homepage.png`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteImage(image?: string): string {
  if (!image) return DEFAULT_IMAGE;
  return image.startsWith('http') ? image : `${SITE}${image}`;
}

// Replace the content of a <meta name|property="key" content="..."> tag.
function setMetaTag(html: string, attr: 'name' | 'property', key: string, content: string): string {
  const re = new RegExp(`(<meta\\s+${attr}=["']${key}["']\\s+content=")[^"]*("\\s*/?>)`, 'i');
  if (re.test(html)) return html.replace(re, `$1${escapeAttr(content)}$2`);
  // Tag not present in template: insert it before </head>.
  return html.replace('</head>', `    <meta ${attr}="${key}" content="${escapeAttr(content)}">\n  </head>`);
}

function buildHtml(template: string, route: PrerenderRoute): string {
  const url = `${SITE}${route.path === '/' ? '/' : route.path}`;
  const image = absoluteImage(route.image);
  const type = route.type || 'website';
  let html = template;

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(route.title)}</title>`);

  // Core meta
  html = setMetaTag(html, 'name', 'description', route.description);
  html = setMetaTag(html, 'name', 'robots', route.noindex ? 'noindex, follow' : 'index, follow');

  // Canonical
  const canonicalRe = /(<link\s+rel=["']canonical["']\s+href=")[^"]*(")/i;
  if (canonicalRe.test(html)) {
    html = html.replace(canonicalRe, `$1${url}$2`);
  } else {
    html = html.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);
  }

  // Open Graph
  html = setMetaTag(html, 'property', 'og:type', type);
  html = setMetaTag(html, 'property', 'og:url', url);
  html = setMetaTag(html, 'property', 'og:title', route.title);
  html = setMetaTag(html, 'property', 'og:description', route.description);
  html = setMetaTag(html, 'property', 'og:image', image);

  // Twitter
  html = setMetaTag(html, 'property', 'twitter:url', url);
  html = setMetaTag(html, 'property', 'twitter:title', route.title);
  html = setMetaTag(html, 'property', 'twitter:description', route.description);
  html = setMetaTag(html, 'property', 'twitter:image', image);

  // JSON-LD
  if (route.jsonLd) {
    const blocks = Array.isArray(route.jsonLd) ? route.jsonLd : [route.jsonLd];
    const scripts = blocks
      .map((b) => `    <script type="application/ld+json" data-seo="prerender">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`)
      .join('\n');
    html = html.replace('</head>', `${scripts}\n  </head>`);
  }

  return html;
}

async function run() {
  const templatePath = path.join(DIST, 'index.html');
  const template = await fs.readFile(templatePath, 'utf8');

  let count = 0;
  for (const route of PRERENDER_ROUTES) {
    const html = buildHtml(template, route);
    if (route.path === '/') {
      await fs.writeFile(templatePath, html, 'utf8');
    } else {
      const dir = path.join(DIST, route.path);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'index.html'), html, 'utf8');
    }
    count++;
  }

  console.log(`Prerendered ${count} routes with per-route head + JSON-LD.`);
}

run().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
