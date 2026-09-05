// Runtime half of the blog. The 11 editorial posts still live in data/blog.ts
// as source; community submissions live in the `blog_posts` Supabase table
// created by supabase/migrations/0001_blog_posts.sql. Both become the same
// `Post` shape here, so the listing, the detail page and the renderer only ever
// deal with one type.
//
// Everything in this file assumes the client is hostile: it is a public SPA, so
// a determined submitter can call Supabase directly with the anon key and skip
// every check below. That is why the same rules exist as CHECK constraints and
// RLS policies in the migration. The validation here is for honest users to get
// good error messages; the database is what actually enforces it.

import { POSTS, type Block, type Post } from '../data/blog';

/** True when the deployment actually has Supabase credentials wired up. */
export const isBlogStoreConfigured = (): boolean => {
  const env = (import.meta as unknown as { env: Record<string, string> }).env;
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder') && key !== 'placeholder');
};

/**
 * The Supabase client is imported lazily, and only after the configured check
 * has passed. A static import would put the whole supabase-js library into the
 * eager bundle — it costs ~230 kB, and the blog is the first thing many
 * visitors load. This way a deployment without credentials never downloads it
 * at all, and one with credentials fetches it alongside the first query.
 */
const getClient = async () => (await import('./supabase')).supabase;

// ─── Shape stored in Supabase ────────────────────────────────────────────────
export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  author_role: string | null;
  date: string;
  read_time: string;
  image: string;
  blocks: Block[];
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  status: 'pending' | 'published' | 'rejected';
  created_at: string;
}

/** A community post, once it is on the page, is just a Post with extra bits. */
export interface CommunityPost extends Post {
  id: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  /** Only ever used to pick a byline label, never to change the design. */
  community: true;
}


// The pure half — text hygiene, block sanitising, slugs, derived fields and
// draft validation — lives in blogSanitize.ts so it can be unit-tested under
// plain Node without pulling Supabase in. Re-exported so callers import from
// one place.
export * from './blogSanitize';
import {
  FALLBACK_IMAGE, LIMITS, cleanText, estimateReadTime, formatDateLabel,
  isSafeImage, isValidSlug, sanitizeBlocks, slugify, validateDraft,
  type FieldErrors, type SubmissionDraft,
} from './blogSanitize';

// ─── Slugs (availability needs the table) ───────────────────────────────────
/** Slugs already taken by the editorial posts, which live outside the table. */
const STATIC_SLUGS = new Set(POSTS.map((p) => p.slug));

/**
 * Is this slug free? Checks the static posts first (no round trip), then the
 * table — including pending rows, so two submissions cannot race for the same
 * URL. The unique index is still the real arbiter; this is for a good message.
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  if (STATIC_SLUGS.has(slug)) return false;
  if (!isBlogStoreConfigured()) return true;
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('slug', slug)
    .limit(1);
  if (error) return true; // don't block submission on a lookup failure
  return !data || data.length === 0;
}

/** A free slug near the requested one, e.g. `my-post-2`. */
export async function findAvailableSlug(base: string): Promise<string> {
  const root = slugify(base) || 'post';
  if (await isSlugAvailable(root)) return root;
  for (let n = 2; n <= 25; n++) {
    const candidate = `${root.slice(0, 76)}-${n}`;
    if (await isSlugAvailable(candidate)) return candidate;
  }
  return `${root.slice(0, 70)}-${Date.now().toString(36)}`;
}

// ─── Row → Post ──────────────────────────────────────────────────────────────
/**
 * Every field is re-sanitised on the way out, not just on the way in. A row
 * could have been written by something other than this form.
 */
export function rowToPost(row: BlogPostRow): CommunityPost {
  const blocks = sanitizeBlocks(row.blocks);
  return {
    id: row.id,
    slug: row.slug,
    title: cleanText(row.title, LIMITS.title),
    excerpt: cleanText(row.excerpt, LIMITS.excerpt),
    category: cleanText(row.category, LIMITS.category),
    keyword: '',
    author: cleanText(row.author, LIMITS.author) +
      (row.author_role ? `, ${cleanText(row.author_role, LIMITS.authorRole)}` : ''),
    date: row.date,
    dateLabel: formatDateLabel(row.date),
    readTime: cleanText(row.read_time, 16) || estimateReadTime(blocks),
    image: isSafeImage(row.image) ? row.image : FALLBACK_IMAGE,
    blocks,
    tags: (row.tags || []).slice(0, 8).map((t) => cleanText(t, LIMITS.tag)).filter(Boolean),
    seoTitle: row.seo_title ? cleanText(row.seo_title, LIMITS.seoTitle) : undefined,
    seoDescription: row.seo_description ? cleanText(row.seo_description, LIMITS.seoDescription) : undefined,
    community: true,
  };
}

// ─── Reads ───────────────────────────────────────────────────────────────────
/** Published community posts, newest first. Never throws: the blog must render
 *  from the static posts alone if Supabase is down or not yet configured. */
export async function fetchPublishedPosts(): Promise<CommunityPost[]> {
  if (!isBlogStoreConfigured()) return [];
  try {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, category, author, author_role, date, read_time, image, blocks, tags, seo_title, seo_description, status, created_at')
      .eq('status', 'published')
      .order('date', { ascending: false })
      .limit(200);
    if (error || !data) return [];
    return (data as BlogPostRow[]).map(rowToPost).filter((p) => isValidSlug(p.slug) && p.blocks.length > 0);
  } catch {
    return [];
  }
}

// ─── Image upload ────────────────────────────────────────────────────────────
export const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const IMAGE_EXTENSION_TYPES: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif',
};

/**
 * Some file pickers (older Android WebViews, some Windows shells) leave
 * `file.type` blank for newer formats like WebP/AVIF even though the file is
 * fine, which would otherwise reject a perfectly good image. Only fall back to
 * the extension when the browser gave us nothing — a mislabelled `file.type`
 * that isn't blank is trusted as a real rejection.
 */
export function resolveImageType(file: File): string | null {
  if (IMAGE_MIME_TYPES.includes(file.type)) return file.type;
  if (file.type) return null;
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return IMAGE_EXTENSION_TYPES[ext] || null;
}

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/**
 * Push a cover image straight into the public `blog-images` bucket and hand
 * back its URL. The checks here are duplicated by the bucket's own MIME and
 * size limits, so a file that slips past the browser still fails at Supabase.
 */
export async function uploadCoverImage(file: File): Promise<UploadResult> {
  if (!isBlogStoreConfigured()) {
    return { ok: false, error: 'Image uploads are not available yet — the blog store is not configured.' };
  }
  const resolvedType = resolveImageType(file);
  if (!resolvedType) {
    return { ok: false, error: 'Use a JPG, PNG, WebP or AVIF image.' };
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return { ok: false, error: `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 3 MB.` };
  }

  const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' } as Record<string, string>)[resolvedType];
  // Random name: never trust the client's filename as a storage path.
  const name = `submissions/${Date.now().toString(36)}-${crypto.randomUUID()}.${ext}`;

  const supabase = await getClient();
  const { error } = await supabase.storage
    .from('blog-images')
    .upload(name, file, { cacheControl: '31536000', contentType: resolvedType, upsert: false });

  if (error) return { ok: false, error: error.message || 'Upload failed. Please try again.' };

  const { data } = supabase.storage.from('blog-images').getPublicUrl(name);
  const url = data?.publicUrl;
  if (!url || !isSafeImage(url)) return { ok: false, error: 'Upload succeeded but the URL was rejected.' };
  return { ok: true, url };
}

// ─── Submission ──────────────────────────────────────────────────────────────
export interface SubmitResult {
  ok: boolean;
  slug?: string;
  error?: string;
  fieldErrors?: FieldErrors;
}

/**
 * Insert the post as `pending`. Status is not sent from the client at all — the
 * column default plus the RLS `with check (status = 'pending')` mean a public
 * submission cannot arrive already published, whatever the client says.
 */
export async function submitPost(draft: SubmissionDraft): Promise<SubmitResult> {
  const fieldErrors = validateDraft(draft);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, error: 'Please fix the highlighted fields.' };

  if (!isBlogStoreConfigured()) {
    return { ok: false, error: 'Submissions are closed right now — the blog store is not configured. Please email info@aidatahouse.com.' };
  }

  const blocks = sanitizeBlocks(draft.blocks);
  const slug = await findAvailableSlug(draft.slug);

  const supabase = await getClient();
  const { error } = await supabase.from('blog_posts').insert({
    slug,
    title: cleanText(draft.title, LIMITS.title),
    excerpt: cleanText(draft.excerpt, LIMITS.excerpt),
    category: cleanText(draft.category, LIMITS.category),
    author: cleanText(draft.author, LIMITS.author),
    author_role: draft.authorRole ? cleanText(draft.authorRole, LIMITS.authorRole) : null,
    date: draft.date,
    read_time: draft.readTime || estimateReadTime(blocks),
    image: draft.image,
    blocks,
    tags: draft.tags.slice(0, 8).map((t) => cleanText(t, LIMITS.tag)).filter(Boolean),
    seo_title: draft.seoTitle ? cleanText(draft.seoTitle, LIMITS.seoTitle) : null,
    seo_description: draft.seoDescription ? cleanText(draft.seoDescription, LIMITS.seoDescription) : null,
    submitter_email: cleanText(draft.submitterEmail, LIMITS.email),
  });

  if (error) {
    const message = error.message || '';
    if (message.includes('rate_limit_email')) return { ok: false, error: 'You have submitted a few posts already. Please try again in an hour.' };
    if (message.includes('rate_limit_global')) return { ok: false, error: 'The review queue is busy right now. Please try again later.' };
    if (message.includes('blog_posts_slug_key')) return { ok: false, error: 'That URL was just taken. Change the URL slug and submit again.', fieldErrors: { slug: 'Already in use.' } };
    return { ok: false, error: 'We could not save the post. Please try again.' };
  }

  return { ok: true, slug };
}
