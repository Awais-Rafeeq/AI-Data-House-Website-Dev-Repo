// The security boundary for article bodies written as HTML.
//
// The blog's structured blocks are safe by construction: they hold plain text
// that React renders as a text node, so markup in them cannot execute. An HTML
// body is the opposite — it exists precisely to become real elements — so it is
// the one place submitted content reaches the DOM as markup, and every path
// that renders one goes through sanitizeArticleHtml() here.
//
// Assume the row is hostile. The site is a public SPA with a published anon
// key, so a determined submitter can write straight to Supabase and skip the
// studio entirely; the reviewer who publishes a post is looking at prose, not
// auditing markup. That means sanitising on the way IN is a nicety and
// sanitising on the way OUT is the actual defence. Everything here runs at
// render time, every time, on whatever the row happens to contain.
//
// This module needs a DOM, so it is deliberately kept out of lib/blogSanitize.ts
// (which stays DOM-free so the security tests can run under plain Node).

import DOMPurify from 'dompurify';
import { headingIdOf } from './articleHeadings';
import { scopeCss } from './cssScope';

/**
 * The container every submitted stylesheet is confined to. It is the base class
 * both article modes carry, so one scope covers both.
 */
const ARTICLE_SCOPE = '.article-html';

/**
 * Elements an article body may use. Deliberately a little wider than the visual
 * editor emits, because HTML-source authors legitimately reach for layout
 * wrappers (`div`, `section`, `figure`) that the structured blocks never had.
 *
 * `style` is not here because DOMPurify removes style elements outright in 3.x
 * whatever the allowlist says — it sanitises markup, not CSS. The author's
 * stylesheet is therefore lifted out before this runs and put back afterwards,
 * scoped (see splitStyles / scopeCss). Dropping it instead was the earlier
 * behaviour and it made every pasted page arrive with its entire design
 * missing, which is not a security win — just a worse article.
 *
 * Not here, and not by accident: `script`, `link`, `base`, `meta`, `object`,
 * `embed`, `iframe`, `form`, `input`, `button`. Form controls are excluded
 * because a convincing fake form on a real aidatahouse.com URL is a phishing
 * primitive, not a formatting feature — and without scripts they could not
 * function anyway.
 */
const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'span', 'div', 'section', 'article', 'header', 'footer', 'main', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'abbr',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'q', 'cite',
  'pre', 'code', 'kbd', 'samp', 'var',
  'a', 'img', 'figure', 'figcaption', 'picture', 'source',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  'time', 'address', 'details', 'summary',
];

/**
 * `style` is allowed so pasted layout survives (it cannot leak past its own
 * element). Every `on*` handler is excluded by omission — DOMPurify drops any
 * attribute not on this list, so there is no handler-by-handler blocklist to
 * keep up to date, which is the point of allowlisting.
 */
const ALLOWED_ATTR = [
  'href', 'src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading', 'decoding',
  'colspan', 'rowspan', 'headers', 'scope', 'span',
  'class', 'style', 'id', 'lang', 'dir', 'datetime', 'cite', 'open',
  'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden', 'role',
];

/** Attributes whose value is a URL, and so must clear the scheme allowlist below. */
const URL_ATTRS = ['href', 'src', 'srcset'] as const;

/** Schemes an href/src may use. Everything else — javascript:, vbscript:, data:, file: — is dropped. */
const ALLOWED_URI_REGEXP = /^(?:https?:|mailto:|tel:|#|\/(?!\/))/i;

const PURIFY_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOWED_URI_REGEXP,
  // Keep the children of a disallowed element rather than deleting the text
  // inside it — dropping a stray <font> should not silently delete a paragraph.
  KEEP_CONTENT: true,
  // Belt and braces on top of the tag allowlist: even if one of these were
  // added to ALLOWED_TAGS by mistake, it would still be removed with its
  // contents rather than being emptied and left in place.
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'base', 'link', 'meta'],
  FORBID_ATTR: ['srcdoc', 'formaction', 'ping', 'http-equiv'],
  // No USE_PROFILES here, deliberately. Setting it makes DOMPurify build the
  // allowlist from the profile and ignore ALLOWED_TAGS entirely, which silently
  // dropped <style> no matter what the list above said. ALLOWED_TAGS is already
  // an explicit HTML-only list, so SVG and MathML — the reason the profile was
  // here — are excluded by not being on it.
  // Return a string, not a DocumentFragment.
  RETURN_DOM: false as const,
  RETURN_DOM_FRAGMENT: false as const,
};

let hooksInstalled = false;

/**
 * Every link out of a submitted article gets `rel="nofollow ugc noopener
 * noreferrer"` and opens in a new tab. The rel is the SEO half — a public
 * submission form is otherwise an open invitation to farm backlinks — and
 * noopener is the security half, so a linked page cannot reach back through
 * `window.opener`. Internal links are left alone: they are ours.
 */
function installHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (!(node instanceof Element)) return;

    // DOMPurify allows `data:` URIs on media tags (its own DATA_URI_TAGS list)
    // even when ALLOWED_URI_REGEXP would reject them, so the allowlist is
    // re-applied here by hand. `data:` is refused outright, matching the rule
    // isSafeImage() already enforces for cover images: it is an exfiltration and
    // spoofing surface with no upside for an article body.
    for (const attr of URL_ATTRS) {
      const value = node.getAttribute(attr);
      if (value === null) continue;
      // Strip control characters and whitespace before testing, so `java\nscript:`
      // and friends cannot smuggle a scheme past the allowlist.
      const trimmed = value.replace(/[\u0000-\u0020\u00a0\u200b-\u200f\ufeff]/g, '');
      if (!ALLOWED_URI_REGEXP.test(trimmed)) node.removeAttribute(attr);
    }

    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || '';
      const external = /^https?:/i.test(href);
      if (external) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'nofollow ugc noopener noreferrer');
      } else {
        node.removeAttribute('target');
        node.removeAttribute('rel');
      }
    }

    if (node.tagName === 'IMG') {
      // Submitted images are third-party bytes on our page; never let one block
      // first paint, and never leak the reader's referrer to wherever it lives.
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
      node.setAttribute('referrerpolicy', 'no-referrer');
    }
  });
}

/**
 * A pasted full document is common — people copy a whole page out of another
 * editor. DOMPurify would keep the body's contents anyway, but pulling the body
 * out first means the preview and the stored string agree on what the article
 * actually is, instead of silently carrying a dead <head> around.
 */
export function extractBodyHtml(html: string): string {
  if (!/<html[\s>]|<body[\s>]|<!doctype/i.test(html)) return html;
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body?.innerHTML ?? html;
  } catch {
    return html;
  }
}

/**
 * Separate a submission into markup and stylesheet.
 *
 * Two problems are solved in one pass. A standalone document keeps its <style>
 * in the head, and taking `body.innerHTML` — the obvious reading of "extract
 * the article" — silently threw the entire design away. And DOMPurify removes
 * style elements regardless of the allowlist, because it sanitises markup, not
 * CSS. So the CSS is lifted out here, before DOMPurify ever sees it, and put
 * back afterwards once scopeCss has confined it to the article.
 *
 * That split is also the cleaner division of responsibility: DOMPurify owns the
 * markup, the CSSOM-based scoper owns the stylesheet, and neither is asked to
 * reason about the other's syntax.
 */
export function splitStyles(html: string): { markup: string; css: string } {
  if (!/<style[\s>]/i.test(html) && !isFullDocument(html)) return { markup: html, css: '' };
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const styles = Array.from(doc.querySelectorAll('style'));
    const css = styles.map((el) => el.textContent || '').join('\n');
    styles.forEach((el) => el.remove());
    return { markup: doc.body?.innerHTML ?? html, css };
  } catch {
    return { markup: html, css: '' };
  }
}

/** True when the string looks like a whole document rather than a fragment. */
export const isFullDocument = (html: string): boolean =>
  /<!doctype\s+html|<html[\s>]/i.test(html);

/**
 * The one function that turns a submitted HTML string into markup we are
 * willing to put on the page. Anything that renders an article body calls this
 * — there is no second path, and no "trusted" caller that skips it.
 */
export function sanitizeArticleHtml(html: string): string {
  if (!html) return '';
  installHooks();

  const { markup, css } = splitStyles(html);
  const clean = DOMPurify.sanitize(markup, PURIFY_CONFIG) as unknown as string;

  // The stylesheet is rebuilt from parsed CSSOM rules, every selector anchored
  // to the article, so what goes back in is generated markup rather than
  // author text. scopeCss returns '' for anything it could not parse, and a
  // sheet we cannot read is one we will not render.
  const scoped = scopeCss(css, ARTICLE_SCOPE);
  const styleTag = scoped ? `<style>${scoped}</style>` : '';

  return styleTag + addHeadingIds(clean);
}

/**
 * Give every h2/h3 a stable id so the article's table of contents can link to
 * it, matching the ids the structured renderer produces for its own headings.
 */
function addHeadingIds(html: string): string {
  if (!/<h[23][\s>]/i.test(html)) return html;
  try {
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    const seen = new Set<string>();
    doc.body.querySelectorAll('h2, h3').forEach((el) => {
      const base = headingIdOf(el.textContent || '');
      if (!base) return;
      let id = base;
      for (let n = 2; seen.has(id); n++) id = `${base}-${n}`;
      seen.add(id);
      el.setAttribute('id', id);
    });
    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** The h2/h3s of a sanitised HTML body, in order — the table of contents' source. */
export function extractHeadings(sanitizedHtml: string): ArticleHeading[] {
  if (!sanitizedHtml || !/<h[23][\s>]/i.test(sanitizedHtml)) return [];
  try {
    const doc = new DOMParser().parseFromString(`<body>${sanitizedHtml}</body>`, 'text/html');
    return Array.from(doc.body.querySelectorAll('h2[id], h3[id]')).map((el) => ({
      id: el.getAttribute('id') as string,
      text: (el.textContent || '').trim(),
      level: el.tagName === 'H3' ? (3 as const) : (2 as const),
    })).filter((h) => h.text);
  } catch {
    return [];
  }
}

/**
 * Everything the visual editor can represent and give back unchanged. Anything
 * outside this list survives a round trip through the WYSIWYG only by luck.
 */
const EDITORIAL_TAGS = new Set([
  'p', 'br', 'hr', 'h2', 'h3', 'h4',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'colgroup', 'col', 'p-span', 'span',
]);

/**
 * True when a body uses markup the visual editor would flatten or drop — a full
 * document, or layout elements (div/section/figure/…) that its schema has no
 * node for.
 *
 * This is what decides whether HTML stays authoritative. The studio uses it to
 * refuse to silently round-trip a hand-written body through the WYSIWYG, and
 * the renderer uses the resulting mode to decide how much of its own styling to
 * impose. It is a question about fidelity, never about safety: unsupported
 * markup is not dangerous markup, and both modes are sanitised identically.
 */
export function isBeyondEditorial(html: string): boolean {
  if (!html.trim()) return false;
  if (isFullDocument(html)) return true;
  try {
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    return Array.from(doc.body.querySelectorAll('*'))
      .some((el) => !EDITORIAL_TAGS.has(el.tagName.toLowerCase()));
  } catch {
    return false;
  }
}

/**
 * A complete, standalone document for the studio's preview iframe. Used only
 * for previewing — never for what gets stored or published — so it keeps the
 * author's own markup as-is and relies on the iframe's sandbox for isolation
 * rather than on stripping.
 */
export function buildPreviewDocument(html: string, styles: string): string {
  // A complete document is handed to the iframe untouched, head and all. The
  // frame is sandboxed without allow-scripts and without allow-same-origin, so
  // nothing in it can run or reach out; within those walls the honest thing to
  // show the author is exactly what they wrote, including their own stylesheet.
  // Wrapping it in our chrome instead — which is what dropping the head did —
  // showed them a page stripped of its design and called it a preview.
  if (isFullDocument(html)) return html;

  return `<!doctype html><html><head><meta charset="utf-8">`
    + `<meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<style>${styles}</style></head><body><article class="article-html">${html}</article></body></html>`;
}
