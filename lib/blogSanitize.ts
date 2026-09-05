// Pure blog logic: text hygiene, block sanitising, slugs, derived fields and
// draft validation. Deliberately free of any I/O and of any Supabase import, so
// it can be exercised by scripts/test-blog-sanitizer.ts under plain Node — the
// security-critical half of the blog is the half that gets tested.
//
// lib/blogStore.ts re-exports everything here, so callers import from one place.

import type { Block } from '../data/blog';

export const BLOCK_TYPES_ALLOWED = ['p', 'h2', 'list', 'quote', 'table'] as const;
export type SubmittableBlockType = typeof BLOCK_TYPES_ALLOWED[number];

/**
 * The block types a public submitter may use. `callout` and `links` are
 * deliberately excluded: a callout renders a CTA button that navigates into our
 * funnel, and a links block is an open invitation to inject SEO backlinks. Both
 * stay editorial-only. Anything else that somehow arrives is dropped on read.
 *
 * `html` is submittable but is NOT one of the structured types above: it carries
 * a whole article body as a single HTML string, which is what the submission
 * studio writes. It is deliberately handled apart from them everywhere.
 */
const SUBMITTABLE = new Set<string>([...BLOCK_TYPES_ALLOWED, 'html']);

const HTML_MODES = new Set(['editorial', 'custom']);

// ─── Text hygiene ────────────────────────────────────────────────────────────
/**
 * Blocks hold plain text that React renders as a text node, so markup in a
 * string cannot execute. It can still *look* like markup in the page, and can
 * carry invisible direction-override characters, so strings are normalised:
 * control/bidi characters stripped, whitespace collapsed, length capped.
 */
export const cleanText = (value: unknown, max: number): string =>
  String(value ?? '')
    // C0/C1 controls and the bidi overrides used for spoofing, minus \n and \t.
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max);

export const LIMITS = {
  title: 160,
  excerpt: 400,
  author: 80,
  authorRole: 80,
  category: 60,
  tag: 32,
  email: 160,
  seoTitle: 160,
  seoDescription: 320,
  blockText: 4000,
  listItem: 500,
  cell: 200,
  /**
   * Ceiling for a whole article written as HTML. Kept well under the table's
   * `pg_column_size(blocks) < 200000` CHECK, since the string is stored inside
   * a jsonb array and JSON escaping inflates it.
   */
  html: 120000,
} as const;

/**
 * Text hygiene for an HTML body. Unlike cleanText this must NOT collapse
 * whitespace or trim aggressively — inside <pre> that would change what the
 * author wrote — so it only strips the control and bidi characters that exist
 * to spoof, and caps the length.
 */
export const cleanHtml = (value: unknown, max: number): string =>
  String(value ?? '')
    // The same C0/C1 + bidi set cleanText strips, but newlines and tabs are
    // left alone: inside <pre> they are content, not formatting.
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/\r\n?/g, '\n')
    .slice(0, max);

/**
 * Rough text content of an HTML string, for word counts and "is this empty"
 * checks ONLY. This is not a sanitiser and must never be used as one: tag
 * stripping by regex is exactly the mistake that lets markup through. The
 * security boundary is DOMPurify in lib/htmlSanitize.ts, at render time.
 */
export const htmlToPlainText = (html: string): string =>
  html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z0-9#]{1,8};/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Normalise arbitrary input into the block union, dropping anything that is not
 * a submittable type or that ends up empty. Returns only well-formed blocks, so
 * the renderer never has to defend itself.
 */
export function sanitizeBlocks(input: unknown): Block[] {
  if (!Array.isArray(input)) return [];
  const out: Block[] = [];

  for (const raw of input.slice(0, 200)) {
    if (!raw || typeof raw !== 'object') continue;
    const type = (raw as { type?: unknown }).type;
    if (typeof type !== 'string' || !SUBMITTABLE.has(type)) continue;
    const b = raw as Record<string, unknown>;

    if (type === 'html') {
      // Structural only. The tag/attribute scrub is DOMPurify's job at render
      // time (lib/htmlSanitize.ts) — this module stays DOM-free so the security
      // tests can run under plain Node, and a regex "sanitiser" here would only
      // buy false confidence. All this does is bound the size and drop a body
      // with no actual words in it.
      const html = cleanHtml(b.html, LIMITS.html);
      if (htmlToPlainText(html)) {
        const mode = typeof b.mode === 'string' && HTML_MODES.has(b.mode) ? b.mode : 'editorial';
        out.push({ type: 'html', html, mode } as Block);
      }
      continue;
    }

    if (type === 'p' || type === 'h2' || type === 'quote') {
      const text = cleanText(b.text, LIMITS.blockText);
      if (text) out.push({ type, text } as Block);
      continue;
    }

    if (type === 'list') {
      const items = (Array.isArray(b.items) ? b.items : [])
        .slice(0, 40)
        .map((i) => cleanText(i, LIMITS.listItem))
        .filter(Boolean);
      if (items.length) out.push({ type: 'list', items });
      continue;
    }

    if (type === 'table') {
      const head = (Array.isArray(b.head) ? b.head : [])
        .slice(0, 6)
        .map((h) => cleanText(h, LIMITS.cell));
      const rows = (Array.isArray(b.rows) ? b.rows : [])
        .slice(0, 40)
        .map((r) => (Array.isArray(r) ? r.slice(0, 6).map((c) => cleanText(c, LIMITS.cell)) : []))
        // Pad/trim every row to the header width so the table cannot render ragged.
        .map((r) => Array.from({ length: head.length }, (_, i) => r[i] ?? ''))
        .filter((r) => r.some(Boolean));
      if (head.filter(Boolean).length && rows.length) out.push({ type: 'table', head, rows });
    }
  }

  return out;
}

// ─── Slugs ───────────────────────────────────────────────────────────────────
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

export const isValidSlug = (slug: string): boolean =>
  /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length >= 3 && slug.length <= 80;

// ─── Derived fields ──────────────────────────────────────────────────────────
export const formatDateLabel = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/** Words a minute matching the pace the editorial posts were timed at. */
const WPM = 220;
export function estimateReadTime(blocks: Block[]): string {
  let words = 0;
  for (const b of blocks) {
    if (b.type === 'p' || b.type === 'h2' || b.type === 'quote') words += b.text.split(/\s+/).length;
    else if (b.type === 'list') words += b.items.join(' ').split(/\s+/).length;
    else if (b.type === 'table') words += [...b.head, ...b.rows.flat()].join(' ').split(/\s+/).length;
    else if (b.type === 'html') {
      const text = htmlToPlainText(b.html);
      if (text) words += text.split(/\s+/).length;
    }
  }
  return `${Math.max(1, Math.round(words / WPM))} min`;
}

/** The article body written as one HTML string, if that is how it was authored. */
export const htmlBlockOf = (blocks: Block[]): Extract<Block, { type: 'html' }> | undefined =>
  blocks.find((b): b is Extract<Block, { type: 'html' }> => b.type === 'html');

export const FALLBACK_IMAGE = '/images/blog/blog-featured-cornerstone.png';

/**
 * An image may only be one of our own static assets or a file in our own
 * Supabase Storage bucket. Mirrors the CHECK constraint on the table, and is
 * what keeps `javascript:` / `data:` URIs out of an <img src>.
 */
export const isSafeImage = (value: string): boolean =>
  /^\/images\/[\w\-./]+$/.test(value) ||
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/blog-images\/[\w\-./]+$/i.test(value);

export interface SubmissionDraft {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  submitterEmail: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  blocks: Block[];
}

export type FieldErrors = Partial<Record<keyof SubmissionDraft | 'form', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shortest body we will take, measured in visible characters, not markup. */
export const MIN_ARTICLE_CHARS = 120;

/** Field-level validation for the form. Mirrors the database constraints. */
export function validateDraft(draft: SubmissionDraft): FieldErrors {
  const e: FieldErrors = {};
  const title = draft.title.trim();
  const excerpt = draft.excerpt.trim();

  if (title.length < 10) e.title = 'Give the post a title of at least 10 characters.';
  else if (title.length > LIMITS.title) e.title = `Titles are capped at ${LIMITS.title} characters.`;

  if (excerpt.length < 40) e.excerpt = 'Write a summary of at least 40 characters — it is what shows on the blog card.';
  else if (excerpt.length > LIMITS.excerpt) e.excerpt = `Summaries are capped at ${LIMITS.excerpt} characters.`;

  if (!draft.category.trim()) e.category = 'Pick a category.';
  if (draft.author.trim().length < 2) e.author = 'Add the author name.';
  if (!EMAIL_RE.test(draft.submitterEmail.trim())) e.submitterEmail = 'Add a valid email so we can reach you about the post.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) e.date = 'Pick a publish date.';
  if (!draft.image) e.image = 'Upload a cover image.';
  else if (!isSafeImage(draft.image)) e.image = 'That image could not be verified. Upload it again.';
  if (!isValidSlug(draft.slug)) e.slug = 'The URL can use lowercase letters, numbers and dashes only.';
  if (draft.tags.length > 8) e.tags = 'Eight tags maximum.';
  if (draft.seoTitle.length > LIMITS.seoTitle) e.seoTitle = `SEO titles are capped at ${LIMITS.seoTitle} characters.`;
  if (draft.seoDescription.length > LIMITS.seoDescription) e.seoDescription = `SEO descriptions are capped at ${LIMITS.seoDescription} characters.`;

  const blocks = sanitizeBlocks(draft.blocks);
  const html = htmlBlockOf(blocks);
  if (blocks.length === 0) {
    e.blocks = 'The article needs at least one paragraph.';
  } else if (html) {
    // An HTML body carries its own structure, so the "must contain a paragraph"
    // rule does not apply — but it does still have to contain actual writing.
    if (htmlToPlainText(html.html).length < MIN_ARTICLE_CHARS) {
      e.blocks = `The article body is too short — write at least ${MIN_ARTICLE_CHARS} characters.`;
    }
  } else if (!blocks.some((b) => b.type === 'p')) {
    e.blocks = 'Add at least one paragraph of body text.';
  }

  return e;
}


/**
 * Anchors are the only place submitted text becomes a live URL, so anything
 * that is not a plain internal path or an https link is dropped. This is what
 * keeps `javascript:`, `data:` and protocol-relative URLs out of the DOM.
 */
export const isSafeHref = (href: string): boolean => {
  const value = href.trim();
  // `//evil.com` is protocol-relative and `/\evil.com` is treated as one by
  // some browsers, so both are rejected before the internal-path branch.
  if (value.startsWith('//') || value.startsWith('/\\')) return false;
  if (value.startsWith('/')) return true;
  return /^https:\/\/[^\s]+$/i.test(value);
};
