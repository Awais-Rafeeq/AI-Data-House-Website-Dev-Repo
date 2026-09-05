import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Clock, Calendar,
  BookOpen, Link2, Linkedin, Loader2, PenLine, Tag,
} from 'lucide-react';
import { UPCOMING_POSTS, BLOG_CATEGORIES } from '../data/blog';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import { useSeo, articleJsonLd, breadcrumbJsonLd } from '../lib/seo';
import BlockRenderer, { tableOfContents } from '../components/blog/BlockRenderer';
import { useBlogPost, useBlogPosts, type AnyPost } from '../lib/useBlogPosts';

const SUBMIT_PATH = '/resources/blog/submit';

/** Tags only exist on community posts; static posts carry none. */
const tagsOf = (post: AnyPost): string[] => ('tags' in post ? post.tags : []);
/** "Awais Rafeeq, Founder" → "AR", for the byline avatar. */
const initialsOf = (author: string): string =>
  author.split(',')[0].trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const Byline: React.FC<{ post: AnyPost; size?: 'sm' | 'md' }> = ({ post, size = 'sm' }) => {
  const [name, ...roleParts] = post.author.split(',');
  const role = roleParts.join(',').trim();
  const big = size === 'md';
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span
        className={`flex-none grid place-items-center rounded-full bg-emerald-50 text-emerald-700 font-black border border-emerald-100 ${big ? 'w-11 h-11 text-sm' : 'w-9 h-9 text-[11px]'}`}
        aria-hidden="true"
      >
        {initialsOf(post.author)}
      </span>
      <span className="min-w-0">
        <span className={`block font-bold text-slate-900 truncate ${big ? 'text-[0.95rem]' : 'text-sm'}`}>{name.trim()}</span>
        <span className={`block text-slate-400 font-medium truncate ${big ? 'text-sm' : 'text-xs'}`}>
          {role || 'Contributor'}
        </span>
      </span>
    </div>
  );
};

const MetaRow: React.FC<{ post: AnyPost; className?: string }> = ({ post, className = '' }) => (
  <span className={`flex items-center gap-4 text-xs font-bold text-slate-400 ${className}`}>
    <span className="flex items-center gap-1.5"><Calendar size={13} aria-hidden="true" /> {post.dateLabel}</span>
    <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden="true" /> {post.readTime} read</span>
  </span>
);

// ─── Blog index ──────────────────────────────────────────────────────────────
export const BlogIndexPage = () => {
  const [activeCat, setActiveCat] = useState('all');
  const { posts, loading } = useBlogPosts();

  useSeo({
    title: 'The Transformation Playbook, AI Automation Guides | AI Data House',
    description: 'Real automation cases, how-to guides, and honest tool comparisons for US business owners. One real automation, explained, every week.',
    path: '/resources/blog',
    image: '/images/blog/blog-featured-cornerstone.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }, { name: 'Blog', path: '/resources/blog' }]),
  });

  const featured = posts[0];
  const rest = useMemo(() => {
    const list = posts.slice(1);
    return activeCat === 'all' ? list : list.filter((p) => p.category === activeCat);
  }, [posts, activeCat]);

  const upcoming = useMemo(
    () => (activeCat === 'all' ? UPCOMING_POSTS : UPCOMING_POSTS.filter((p) => p.category === activeCat)),
    [activeCat]
  );

  // Only offer a filter that actually has posts behind it.
  const categories = useMemo(() => {
    const present = new Set(posts.map((p) => p.category));
    return BLOG_CATEGORIES.filter((c) => c.id === 'all' || present.has(c.id));
  }, [posts]);

  if (!featured) return null;

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero ── */}
        <header className="border-b border-slate-100 pb-14 mb-14">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-5">
                The Transformation Playbook
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.04] mb-6">
                What automation actually changes, explained in plain English.
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                Real cases, how-to guides, and honest tool comparisons. Written for the business
                owner, not the engineer.
              </p>
            </div>

            <Link
              to={SUBMIT_PATH}
              className="group inline-flex items-center gap-3 self-start lg:self-end flex-none rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <span className="w-10 h-10 flex-none grid place-items-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <PenLine size={18} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-black text-slate-900">Write for the Playbook</span>
                <span className="block text-xs font-medium text-slate-400">Submit an article for review</span>
              </span>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
            </Link>
          </div>
        </header>

        {/* ── Featured ── */}
        <section aria-labelledby="featured-heading" className="mb-16">
          <h2 id="featured-heading" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
            Featured
          </h2>
          <Link
            to={`/resources/${featured.slug}`}
            className="group block rounded-[2.5rem] overflow-hidden bg-slate-900 hover:shadow-2xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-full md:min-h-[24rem] overflow-hidden">
                <img
                  src={featured.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <span className="absolute top-5 left-5 inline-flex items-center rounded-full bg-white/95 backdrop-blur px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900">
                  {featured.category}
                </span>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center text-white">
                <h3 className="text-2xl md:text-[2.1rem] font-black leading-[1.15] tracking-tight mb-4 group-hover:text-emerald-400 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-8 line-clamp-3">{featured.excerpt}</p>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 flex-none grid place-items-center rounded-full bg-white/10 text-white text-[11px] font-black" aria-hidden="true">
                      {initialsOf(featured.author)}
                    </span>
                    <span className="text-sm font-bold text-white truncate">{featured.author.split(',')[0]}</span>
                  </div>
                  <span className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar size={13} aria-hidden="true" /> {featured.dateLabel}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden="true" /> {featured.readTime}</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* ── Latest ── */}
        <section aria-labelledby="latest-heading">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <h2 id="latest-heading" className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Latest articles
            </h2>
            {loading && (
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Loading more
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 mb-10" role="group" aria-label="Filter articles by category">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(c.id)}
                aria-pressed={activeCat === c.id}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                  activeCat === c.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {rest.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 py-20 text-center">
              <p className="font-bold text-slate-500">Nothing in this category yet.</p>
              <button onClick={() => setActiveCat('all')} className="mt-3 text-emerald-600 font-black text-sm hover:underline">
                Show all articles
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
              {rest.map((p) => (
                <article key={p.slug} className="group flex">
                  <Link
                    to={`/resources/${p.slug}`}
                    className="flex flex-col w-full bg-white rounded-[1.75rem] border border-slate-200/70 overflow-hidden hover:border-emerald-200 hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-50">
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-black text-slate-900 leading-snug mb-2.5 group-hover:text-emerald-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-5">{p.excerpt}</p>

                      {tagsOf(p).length > 0 && (
                        <ul className="flex flex-wrap gap-1.5 mb-5">
                          {tagsOf(p).slice(0, 3).map((t) => (
                            <li key={t} className="inline-flex items-center gap-1 rounded-md bg-slate-50 border border-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                              <Tag size={9} aria-hidden="true" /> {t}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                        <Byline post={p} />
                        <span className="flex-none text-right">
                          <span className="block text-[11px] font-bold text-slate-400">{p.dateLabel}</span>
                          <span className="block text-[11px] font-bold text-slate-400">{p.readTime} read</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── Upcoming ── */}
        {upcoming.length > 0 && (
          <section aria-labelledby="upcoming-heading" className="border-t border-slate-100 pt-14">
            <h2 id="upcoming-heading" className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
              More guides on the way
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <BookOpen size={16} className="text-slate-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{p.category}</p>
                    <p className="text-sm font-bold text-slate-600 leading-snug">{p.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ─── Share controls ──────────────────────────────────────────────────────────
const ShareBar: React.FC<{ title: string; slug: string }> = ({ title, slug }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/resources/${slug}` : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const btn = 'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mr-1">Share</span>
      <button type="button" onClick={copy} className={btn}>
        {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <Linkedin size={14} aria-hidden="true" /> LinkedIn
      </a>
      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <ArrowUpRight size={14} aria-hidden="true" /> Post on X
      </a>
    </div>
  );
};

// ─── Table of contents ───────────────────────────────────────────────────────
const TableOfContents: React.FC<{ items: { id: string; text: string }[] }> = ({ items }) => {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver !== 'function') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Band just under the sticky header, so the highlighted item is the one
      // whose section the reader is actually in.
      { rootMargin: '-120px 0px -70% 0px' },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">On this page</p>
      <ul className="space-y-1 border-l border-slate-200">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`block border-l-2 -ml-px pl-4 py-1.5 font-medium leading-snug transition-colors ${
                active === it.id
                  ? 'border-emerald-500 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// ─── Single post ─────────────────────────────────────────────────────────────
export const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading } = useBlogPost(slug);
  const { posts } = useBlogPosts();

  const seoTitle = post ? ('seoTitle' in post && post.seoTitle ? post.seoTitle : `${post.title} | AI Data House`) : 'Post Not Found';
  const seoDescription = post ? ('seoDescription' in post && post.seoDescription ? post.seoDescription : post.excerpt) : '';

  useSeo({
    title: seoTitle,
    description: seoDescription,
    path: `/resources/${slug}`,
    image: post?.image,
    type: 'article',
    jsonLd: post
      ? [
          articleJsonLd({ title: post.title, description: post.excerpt, path: `/resources/${post.slug}`, image: post.image, author: post.author, datePublished: post.date }),
          breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }, { name: 'Blog', path: '/resources/blog' }, { name: post.title, path: `/resources/${post.slug}` }]),
        ]
      : undefined,
  });

  const toc = useMemo(() => (post ? tableOfContents(post.blocks) : []), [post]);
  const related = useMemo(() => {
    if (!post) return [];
    const others = posts.filter((p) => p.slug !== post.slug);
    const sameCat = others.filter((p) => p.category === post.category);
    return [...sameCat, ...others.filter((p) => p.category !== post.category)].slice(0, 3);
  }, [posts, post]);

  // A community post may not be in memory yet on a cold deep link, so wait for
  // the fetch before deciding it does not exist.
  if (!post && loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-white" role="status" aria-label="Loading article">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 w-40 bg-slate-100 rounded mb-8" />
          <div className="h-12 bg-slate-100 rounded-xl mb-4" />
          <div className="h-12 w-2/3 bg-slate-100 rounded-xl mb-8" />
          <div className="h-64 bg-slate-100 rounded-[2rem]" />
        </div>
      </div>
    );
  }
  if (!post) return <Navigate to="/resources/blog" replace />;

  const onCta = (label: string) => {
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'BlogPost', label, post: post.slug });
    navigate('/contact');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-400">
            <li><Link to="/resources/blog" className="hover:text-emerald-600 transition-colors">Playbook</Link></li>
            <li aria-hidden="true"><ChevronRight size={12} /></li>
            <li className="text-emerald-600">{post.category}</li>
          </ol>
        </nav>

        {/* ── Article header ── */}
        <header className="max-w-[46rem] mb-10">
          <h1 className="text-[2.1rem] md:text-[3.2rem] font-black text-slate-900 leading-[1.06] tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-[1.6] mb-9">{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-5 pb-8 border-b border-slate-100">
            <Byline post={post} size="md" />
            <MetaRow post={post} />
          </div>
        </header>

        {/* ── Cover ── */}
        <figure className="max-w-[52rem] mb-14">
          <div className="rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100">
            <img src={post.image} alt="" className="w-full h-auto object-cover" />
          </div>
        </figure>

        {/* ── Body + TOC ── */}
        <div className="lg:grid lg:grid-cols-[minmax(0,46rem)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          <div className="min-w-0">
            {toc.length >= 3 && (
              <details className="lg:hidden mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <summary className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 cursor-pointer">
                  On this page
                </summary>
                <ul className="mt-4 space-y-2">
                  {toc.map((it) => (
                    <li key={it.id}>
                      <a href={`#${it.id}`} className="text-sm font-medium text-slate-600 hover:text-emerald-600">{it.text}</a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <BlockRenderer blocks={post.blocks} onCta={onCta} />

            {tagsOf(post).length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-100">
                {tagsOf(post).map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                    <Tag size={11} aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-12 pt-8 border-t border-slate-100">
              <ShareBar title={post.title} slug={post.slug} />
            </div>

            {/* ── Final CTA ── */}
            <div className="mt-14 bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 md:p-10 text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-3">Ready to map your own automation?</h2>
              <p className="text-slate-500 font-medium mb-7 max-w-lg mx-auto">
                Book a free 30-minute AI Audit. We'll tell you exactly what to build first.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <button onClick={() => onCta('Book Free Audit')} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all inline-flex items-center justify-center gap-2">
                  Book a Free AI Audit <ArrowRight size={18} />
                </button>
                {'relatedSolution' in post && post.relatedSolution && (
                  <button onClick={() => navigate(`/solutions/${post.relatedSolution!.slug}`)} className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-emerald-400 hover:text-emerald-600 transition-all">
                    Explore {post.relatedSolution.label}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sticky rail: TOC on desktop only. */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-20 pt-14 border-t border-slate-100">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <h2 id="related-heading" className="text-2xl font-black tracking-tight text-slate-900">Keep reading</h2>
              <Link to="/resources/blog" className="inline-flex items-center gap-1.5 text-sm font-black text-emerald-600 hover:gap-2.5 transition-all">
                <ChevronLeft size={14} aria-hidden="true" /> All articles
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/resources/${p.slug}`}
                  className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-200/70 overflow-hidden hover:border-emerald-200 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <div className="h-36 overflow-hidden bg-slate-50">
                    <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">{p.category}</span>
                    <h3 className="text-sm font-black text-slate-900 leading-snug flex-1 group-hover:text-emerald-600 transition-colors">{p.title}</h3>
                    <span className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                      <Clock size={11} aria-hidden="true" /> {p.readTime} read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
