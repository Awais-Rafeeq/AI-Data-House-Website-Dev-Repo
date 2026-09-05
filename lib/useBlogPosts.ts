import { useEffect, useMemo, useState } from 'react';
import { POSTS, type Post } from '../data/blog';
import { fetchPublishedPosts, isBlogStoreConfigured, type CommunityPost } from './blogStore';

/**
 * The blog's single source of posts: the editorial posts compiled into the
 * bundle, plus whatever has been published in Supabase, merged into one list
 * sorted newest-first. Everything downstream — listing, detail page, renderer —
 * sees one `Post[]` and cannot tell the two apart, which is the point: there is
 * one blog architecture, not two.
 *
 * The static posts render on the first paint with no network wait, and remote
 * posts fold in when they arrive. If Supabase is unconfigured or unreachable
 * the blog is exactly what it is today.
 */

export type AnyPost = Post | CommunityPost;

const byNewest = (a: AnyPost, b: AnyPost) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

/**
 * Module-level cache so navigating listing → post → back does not refetch, and
 * so a post opened directly by URL can resolve without the listing having run.
 */
let cache: CommunityPost[] | null = null;
let inflight: Promise<CommunityPost[]> | null = null;

function loadCommunityPosts(): Promise<CommunityPost[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetchPublishedPosts()
      .then((posts) => { cache = posts; return posts; })
      .finally(() => { inflight = null; });
  }
  return inflight;
}

export interface UseBlogPosts {
  posts: AnyPost[];
  /** True only while the first remote fetch is outstanding. */
  loading: boolean;
}

export function useBlogPosts(): UseBlogPosts {
  const [community, setCommunity] = useState<CommunityPost[]>(() => cache || []);
  const [loading, setLoading] = useState(() => isBlogStoreConfigured() && cache === null);

  useEffect(() => {
    if (!isBlogStoreConfigured() || cache !== null) { setLoading(false); return undefined; }
    let live = true;
    loadCommunityPosts().then((posts) => {
      if (!live) return;
      setCommunity(posts);
      setLoading(false);
    });
    return () => { live = false; };
  }, []);

  const posts = useMemo(() => {
    if (community.length === 0) return POSTS as AnyPost[];
    // Editorial slugs win: a community row can never shadow an existing post,
    // even if one were inserted with a colliding slug.
    const taken = new Set(POSTS.map((p) => p.slug));
    return [...POSTS, ...community.filter((p) => !taken.has(p.slug))].sort(byNewest);
  }, [community]);

  return { posts, loading };
}

export interface UseBlogPost {
  post: AnyPost | undefined;
  /** True while we still might find this slug remotely — render a skeleton,
   *  not a 404, or a deep link to a community post would bounce on load. */
  loading: boolean;
}

export function useBlogPost(slug?: string): UseBlogPost {
  const staticPost = useMemo(() => POSTS.find((p) => p.slug === slug), [slug]);
  const [community, setCommunity] = useState<CommunityPost[]>(() => cache || []);
  const [loading, setLoading] = useState(() => !staticPost && isBlogStoreConfigured() && cache === null);

  useEffect(() => {
    if (staticPost || !isBlogStoreConfigured() || cache !== null) { setLoading(false); return undefined; }
    let live = true;
    setLoading(true);
    loadCommunityPosts().then((posts) => {
      if (!live) return;
      setCommunity(posts);
      setLoading(false);
    });
    return () => { live = false; };
  }, [slug, staticPost]);

  return {
    post: staticPost || community.find((p) => p.slug === slug),
    loading,
  };
}

/** Drops the cache so a just-published post shows without a reload. */
export function invalidateBlogCache() {
  cache = null;
}
