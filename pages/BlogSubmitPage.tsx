import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, ChevronUp,
  Eye, ImageIcon, Loader2, Plus, ShieldCheck, Trash2, Upload, X,
} from 'lucide-react';
import { BLOG_CATEGORIES, type Block } from '../data/blog';
import { useSeo, breadcrumbJsonLd } from '../lib/seo';
import BlockRenderer from '../components/blog/BlockRenderer';
import { invalidateBlogCache } from '../lib/useBlogPosts';
import {
  BLOCK_TYPES_ALLOWED, IMAGE_MAX_BYTES, IMAGE_MIME_TYPES, estimateReadTime,
  formatDateLabel, isBlogStoreConfigured, isSlugAvailable, resolveImageType, slugify, submitPost,
  uploadCoverImage, validateDraft,
  type FieldErrors, type SubmissionDraft, type SubmittableBlockType,
} from '../lib/blogStore';

const CATEGORY_OPTIONS = BLOG_CATEGORIES.filter((c) => c.id !== 'all');

const BLOCK_LABELS: Record<SubmittableBlockType, string> = {
  p: 'Paragraph',
  h2: 'Section heading',
  list: 'Bullet list',
  quote: 'Pull quote',
  table: 'Table',
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const emptyBlock = (type: SubmittableBlockType): Block => {
  switch (type) {
    case 'list': return { type: 'list', items: [''] };
    case 'table': return { type: 'table', head: ['', ''], rows: [['', '']] };
    default: return { type, text: '' } as Block;
  }
};

// ─── Small form primitives, matching the site's input language ───────────────
const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 font-medium placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition';

const Field: React.FC<{
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  counter?: string;
  children: React.ReactNode;
}> = ({ label, hint, error, required, htmlFor, counter, children }) => (
  <div>
    <div className="flex items-baseline justify-between gap-3 mb-2">
      <label htmlFor={htmlFor} className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label} {required && <span className="text-emerald-600" aria-hidden="true">*</span>}
      </label>
      {counter && <span className="text-[11px] font-bold text-slate-300 tabular-nums">{counter}</span>}
    </div>
    {children}
    {error ? (
      <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs font-bold text-rose-600">
        <AlertCircle size={13} className="mt-px flex-none" aria-hidden="true" /> {error}
      </p>
    ) : hint ? (
      <p className="mt-2 text-xs font-medium text-slate-400">{hint}</p>
    ) : null}
  </div>
);

// ─── Block editor ────────────────────────────────────────────────────────────
const BlockEditor: React.FC<{
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}> = ({ blocks, onChange }) => {
  const update = (i: number, next: Block) => onChange(blocks.map((b, j) => (j === i ? next : b)));
  const remove = (i: number) => onChange(blocks.filter((_, j) => j !== i));
  const move = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              {BLOCK_LABELS[block.type as SubmittableBlockType] || block.type}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move block ${i + 1} up`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition">
                <ChevronUp size={15} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label={`Move block ${i + 1} down`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition">
                <ChevronDown size={15} />
              </button>
              <button type="button" onClick={() => remove(i)} disabled={blocks.length === 1} aria-label={`Remove block ${i + 1}`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white disabled:opacity-30 transition">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="p-4">
            {(block.type === 'p' || block.type === 'h2' || block.type === 'quote') && (
              <textarea
                value={block.text}
                onChange={(e) => update(i, { ...block, text: e.target.value } as Block)}
                rows={block.type === 'p' ? 5 : 2}
                placeholder={block.type === 'h2' ? 'Section heading' : block.type === 'quote' ? 'A line worth pulling out' : 'Write a paragraph…'}
                className={`${inputCls} resize-y leading-relaxed`}
              />
            )}

            {block.type === 'list' && (
              <div className="space-y-2">
                {block.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none" aria-hidden="true" />
                    <input
                      value={item}
                      onChange={(e) => update(i, { ...block, items: block.items.map((it, k) => (k === j ? e.target.value : it)) })}
                      placeholder={`Point ${j + 1}`}
                      className={inputCls}
                    />
                    <button type="button" onClick={() => update(i, { ...block, items: block.items.filter((_, k) => k !== j) })}
                      disabled={block.items.length === 1} aria-label={`Remove point ${j + 1}`}
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-600 disabled:opacity-30 transition">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => update(i, { ...block, items: [...block.items, ''] })}
                  className="text-xs font-black text-emerald-600 hover:underline">+ Add point</button>
              </div>
            )}

            {block.type === 'table' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {block.head.map((h, j) => (
                    <input
                      key={j}
                      value={h}
                      onChange={(e) => update(i, { ...block, head: block.head.map((x, k) => (k === j ? e.target.value : x)) })}
                      placeholder={`Column ${j + 1}`}
                      className={`${inputCls} !py-2 text-sm font-bold`}
                    />
                  ))}
                </div>
                {block.rows.map((row, r) => (
                  <div key={r} className="flex gap-2 items-center">
                    {row.map((cell, c) => (
                      <input
                        key={c}
                        value={cell}
                        onChange={(e) => update(i, {
                          ...block,
                          rows: block.rows.map((rr, k) => (k === r ? rr.map((cc, m) => (m === c ? e.target.value : cc)) : rr)),
                        })}
                        placeholder="—"
                        className={`${inputCls} !py-2 text-sm`}
                      />
                    ))}
                    <button type="button" onClick={() => update(i, { ...block, rows: block.rows.filter((_, k) => k !== r) })}
                      disabled={block.rows.length === 1} aria-label={`Remove row ${r + 1}`}
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-600 disabled:opacity-30 transition">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-4">
                  <button type="button" onClick={() => update(i, { ...block, rows: [...block.rows, block.head.map(() => '')] })}
                    className="text-xs font-black text-emerald-600 hover:underline">+ Add row</button>
                  {block.head.length < 6 && (
                    <button type="button" onClick={() => update(i, { ...block, head: [...block.head, ''], rows: block.rows.map((r) => [...r, '']) })}
                      className="text-xs font-black text-emerald-600 hover:underline">+ Add column</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-1">
        {BLOCK_TYPES_ALLOWED.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange([...blocks, emptyBlock(t)])}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition"
          >
            <Plus size={13} aria-hidden="true" /> {BLOCK_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────
const BlogSubmitPage: React.FC = () => {
  const navigate = useNavigate();
  useSeo({
    title: 'Write for the Playbook — Submit an Article | AI Data House',
    description: 'Submit a guide, case study, or tool comparison to the AI Data House Transformation Playbook. Every submission is reviewed by our editors before it goes live.',
    path: '/resources/blog/submit',
    image: '/images/blog/blog-featured-cornerstone.png',
    noindex: true,
    jsonLd: breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Resources', path: '/resources' },
      { name: 'Blog', path: '/resources/blog' },
      { name: 'Submit', path: '/resources/blog/submit' },
    ]),
  });

  const configured = useMemo(() => isBlogStoreConfigured(), []);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]?.id || 'Guides');
  const [tagsRaw, setTagsRaw] = useState('');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [date, setDate] = useState(todayIso());
  const [readTimeOverride, setReadTimeOverride] = useState('');
  const [image, setImage] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([emptyBlock('p')]);

  // Bots fill hidden fields; humans never see this one.
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  // A local object URL for the file the writer just picked, shown instantly
  // while the real upload is in flight — separate from `image`, which only
  // ever holds the final, hosted URL that gets submitted.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ slug: string } | null>(null);
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'free' | 'taken'>('idle');
  const [showPreview, setShowPreview] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const tags = useMemo(
    () => tagsRaw.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8),
    [tagsRaw],
  );
  const readTime = readTimeOverride.trim() || estimateReadTime(blocks);

  // The slug follows the title until the writer edits it themselves.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  // Debounced availability check, so the writer learns about a clash here
  // rather than after filling in the whole article.
  useEffect(() => {
    if (!slug) { setSlugStatus('idle'); return undefined; }
    setSlugStatus('checking');
    const t = window.setTimeout(async () => {
      const free = await isSlugAvailable(slug);
      setSlugStatus(free ? 'free' : 'taken');
    }, 450);
    return () => window.clearTimeout(t);
  }, [slug]);

  const draft: SubmissionDraft = useMemo(() => ({
    title, excerpt, category, tags, author, authorRole, submitterEmail,
    date, readTime, image, slug, seoTitle, seoDescription, blocks,
  }), [title, excerpt, category, tags, author, authorRole, submitterEmail, date, readTime, image, slug, seoTitle, seoDescription, blocks]);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setUploadError('');
    if (!resolveImageType(file)) {
      setUploadError('Use a JPG, PNG, WebP or AVIF image.');
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      setUploadError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 3 MB.`);
      return;
    }
    // Show the picked file immediately — the writer sees their image before
    // the network round trip finishes, not just after it succeeds.
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    const result = await uploadCoverImage(file);
    setUploading(false);
    setPreviewUrl(null);
    if (result.ok && result.url) {
      setImage(result.url);
      setErrors((e) => ({ ...e, image: undefined }));
    } else {
      setUploadError(result.error || 'Upload failed.');
    }
  }, []);

  // Release the local preview URL whenever it is replaced or the page is left
  // mid-upload, so a picked-but-not-yet-uploaded file doesn't leak memory.
  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (honeypot) { setFormError('Submission rejected.'); return; }

    const fieldErrors = validateDraft(draft);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setFormError('Please fix the highlighted fields.');
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    const result = await submitPost(draft);
    setSubmitting(false);

    if (result.ok && result.slug) {
      invalidateBlogCache();
      setDone({ slug: result.slug });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (result.fieldErrors) setErrors(result.fieldErrors);
    setFormError(result.error || 'Something went wrong. Please try again.');
  };

  // ── Success ──
  if (done) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-7 grid place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
            Submitted for review.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
            Thanks — your article is in the editorial queue. We read every submission and will email
            you at <strong className="text-slate-700">{submitterEmail}</strong> once it is reviewed.
            When it goes live it will appear in the Playbook at{' '}
            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-sm font-bold text-slate-700">/resources/{done.slug}</code>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/resources/blog" className="px-7 py-3.5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all inline-flex items-center justify-center gap-2">
              Back to the Playbook <ArrowRight size={17} />
            </Link>
            <button
              type="button"
              onClick={() => { setDone(null); window.scrollTo(0, 0); }}
              className="px-7 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-emerald-400 hover:text-emerald-600 transition-all"
            >
              Submit another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const previewPost = {
    title: title || 'Your article title will appear here',
    excerpt,
    category,
    author: author ? (authorRole ? `${author}, ${authorRole}` : author) : 'Your name',
    dateLabel: formatDateLabel(date),
    readTime,
    image,
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/resources/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold uppercase tracking-widest text-xs mb-9 transition-colors">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the Playbook
        </Link>

        <header className="max-w-3xl mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-5">Write for the Playbook</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.06] mb-5">
            Submit an article.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Share a real automation you built, a tool comparison you actually ran, or a guide that
            would have saved you a week. Every submission is read by our editors before it goes live.
          </p>
        </header>

        {!configured && (
          <div className="mb-10 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <AlertCircle size={18} className="text-amber-600 flex-none mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-black text-amber-900 text-sm mb-1">Submissions are not open yet.</p>
              <p className="text-sm text-amber-800 font-medium leading-relaxed">
                The article store is not configured on this deployment, so nothing can be saved. You
                can still write and preview below. Email{' '}
                <a href="mailto:info@aidatahouse.com" className="underline font-bold">info@aidatahouse.com</a> to pitch in the meantime.
              </p>
            </div>
          </div>
        )}

        <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-10 xl:gap-14 items-start">

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate className="min-w-0 space-y-12">

            {/* Honeypot: off-screen, not hidden via display, so bots still fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
              <label htmlFor="company-website">Company website</label>
              <input id="company-website" name="company-website" tabIndex={-1} autoComplete="off"
                value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <section aria-labelledby="sec-article" className="space-y-6">
              <h2 id="sec-article" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pb-3 border-b border-slate-100">
                The article
              </h2>

              <Field label="Title" required htmlFor="f-title" error={errors.title} counter={`${title.length}/160`}
                hint="What the post is about, in one specific sentence.">
                <input id="f-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160}
                  placeholder="How we cut a 6-hour reporting job to 4 minutes" className={inputCls} />
              </Field>

              <Field label="Summary" required htmlFor="f-excerpt" error={errors.excerpt} counter={`${excerpt.length}/400`}
                hint="Shown on the blog card and used as the meta description if you leave SEO blank.">
                <textarea id="f-excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={400} rows={3}
                  placeholder="Two or three sentences on what the reader gets out of this." className={`${inputCls} resize-y`} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Category" required htmlFor="f-category" error={errors.category}>
                  <select id="f-category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </Field>
                <Field label="Tags" htmlFor="f-tags" error={errors.tags} hint="Comma separated, up to 8." counter={`${tags.length}/8`}>
                  <input id="f-tags" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)}
                    placeholder="n8n, reporting, dashboards" className={inputCls} />
                </Field>
              </div>
            </section>

            <section aria-labelledby="sec-cover" className="space-y-6">
              <h2 id="sec-cover" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pb-3 border-b border-slate-100">
                Cover image
              </h2>

              <Field label="Cover" required error={errors.image || uploadError}
                hint="JPG, PNG, WebP or AVIF. Up to 3 MB. Landscape works best.">
                <input
                  ref={fileRef}
                  type="file"
                  accept={IMAGE_MIME_TYPES.join(',')}
                  className="sr-only"
                  onChange={(e) => { void handleFile(e.target.files?.[0]); e.target.value = ''; }}
                />
                {(previewUrl || image) ? (
                  <div className="relative rounded-2xl border border-slate-200 overflow-hidden">
                    <img src={previewUrl || image} alt="Cover preview" className="w-full h-52 object-cover" />
                    {uploading ? (
                      <div className="absolute inset-0 bg-white/80 grid place-items-center" role="status">
                        <span className="inline-flex items-center gap-2.5 font-bold text-slate-600">
                          <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Uploading…
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-100">
                        <span className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                          <Check size={14} aria-hidden="true" /> Uploaded
                        </span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => fileRef.current?.click()}
                            className="text-xs font-black text-slate-500 hover:text-emerald-600">Replace</button>
                          <button type="button" onClick={() => setImage('')}
                            className="text-xs font-black text-slate-400 hover:text-rose-600">Remove</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={!configured}
                    className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center hover:border-emerald-300 hover:bg-emerald-50/30 disabled:opacity-60 disabled:hover:border-slate-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white border border-slate-200 text-slate-400">
                      <Upload size={19} aria-hidden="true" />
                    </span>
                    <span className="block font-black text-slate-700 text-sm">Choose an image from your computer</span>
                    <span className="block text-xs font-medium text-slate-400 mt-1">
                      {configured ? 'Uploads as soon as you pick it' : 'Unavailable until the store is configured'}
                    </span>
                  </button>
                )}
              </Field>
            </section>

            <section aria-labelledby="sec-body" className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 id="sec-body" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Article body</h2>
              </div>
              {errors.blocks && (
                <p role="alert" className="flex items-start gap-1.5 text-xs font-bold text-rose-600">
                  <AlertCircle size={13} className="mt-px flex-none" aria-hidden="true" /> {errors.blocks}
                </p>
              )}
              <BlockEditor blocks={blocks} onChange={setBlocks} />
              <p className="text-xs font-medium text-slate-400">
                Articles are built from blocks, not raw HTML — that is what keeps every post on the
                site rendering the same way. Estimated read time: <strong className="text-slate-600">{readTime}</strong>.
              </p>
            </section>

            <section aria-labelledby="sec-author" className="space-y-6">
              <h2 id="sec-author" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pb-3 border-b border-slate-100">
                About you
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Author name" required htmlFor="f-author" error={errors.author}>
                  <input id="f-author" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={80}
                    placeholder="Jane Okafor" className={inputCls} />
                </Field>
                <Field label="Role / title" htmlFor="f-role" hint="Shown under your name on the byline.">
                  <input id="f-role" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} maxLength={80}
                    placeholder="Head of Operations, Northwind" className={inputCls} />
                </Field>
              </div>
              <Field label="Your email" required htmlFor="f-email" error={errors.submitterEmail}
                hint="Only used to reach you about this submission. Never published.">
                <input id="f-email" type="email" value={submitterEmail} onChange={(e) => setSubmitterEmail(e.target.value)}
                  maxLength={160} placeholder="you@company.com" className={inputCls} />
              </Field>
            </section>

            <section aria-labelledby="sec-publish" className="space-y-6">
              <h2 id="sec-publish" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pb-3 border-b border-slate-100">
                Publishing details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Publish date" required htmlFor="f-date" error={errors.date}>
                  <input id="f-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Read time" htmlFor="f-readtime" hint={`Leave blank to use the estimate (${estimateReadTime(blocks)}).`}>
                  <input id="f-readtime" value={readTimeOverride} onChange={(e) => setReadTimeOverride(e.target.value)}
                    maxLength={16} placeholder={estimateReadTime(blocks)} className={inputCls} />
                </Field>
              </div>

              <Field
                label="URL slug"
                required
                htmlFor="f-slug"
                error={errors.slug}
                hint={slugStatus === 'taken' ? undefined : `The post will live at /resources/${slug || '…'}`}
              >
                <div className="relative">
                  <input
                    id="f-slug"
                    value={slug}
                    onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
                    maxLength={80}
                    placeholder="how-we-cut-reporting-to-four-minutes"
                    className={`${inputCls} pr-28`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-black uppercase tracking-wider">
                    {slugStatus === 'checking' && <span className="text-slate-300">Checking…</span>}
                    {slugStatus === 'free' && <span className="text-emerald-600">Available</span>}
                    {slugStatus === 'taken' && <span className="text-rose-600">Taken</span>}
                  </span>
                </div>
                {slugStatus === 'taken' && (
                  <p className="mt-2 text-xs font-bold text-rose-600">
                    That URL is in use. Edit it, or we will add a number when you submit.
                  </p>
                )}
              </Field>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="SEO title" htmlFor="f-seotitle" error={errors.seoTitle} counter={`${seoTitle.length}/160`}
                  hint="Optional. Defaults to the article title.">
                  <input id="f-seotitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={160} className={inputCls} />
                </Field>
                <Field label="SEO description" htmlFor="f-seodesc" error={errors.seoDescription} counter={`${seoDescription.length}/320`}
                  hint="Optional. Defaults to the summary.">
                  <input id="f-seodesc" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} maxLength={320} className={inputCls} />
                </Field>
              </div>
            </section>

            {formError && (
              <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                <AlertCircle size={16} className="mt-px flex-none" aria-hidden="true" /> {formError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2.5"
              >
                {submitting ? <>Submitting <Loader2 size={17} className="animate-spin" /></> : <>Submit for review <ArrowRight size={17} /></>}
              </button>
              <p className="flex items-start gap-2 text-xs font-medium text-slate-400 max-w-sm leading-relaxed">
                <ShieldCheck size={14} className="mt-0.5 flex-none text-slate-300" aria-hidden="true" />
                Submissions are held for editorial review. Nothing is published to the site automatically.
              </p>
            </div>
          </form>

          {/* ── Live preview ── */}
          <aside className="min-w-0 xl:sticky xl:top-28">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                <Eye size={14} aria-hidden="true" /> Live preview
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="text-xs font-black text-slate-400 hover:text-emerald-600 xl:hidden"
              >
                {showPreview ? 'Hide' : 'Show'}
              </button>
            </div>

            {showPreview && (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white overflow-hidden">
                {/* Card, exactly as it will look in the listing grid. */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">Blog card</p>
                  <div className="rounded-[1.25rem] border border-slate-200/70 bg-white overflow-hidden">
                    <div className="h-32 bg-slate-100 grid place-items-center overflow-hidden">
                      {previewPost.image
                        ? <img src={previewPost.image} alt="" className="w-full h-full object-cover" />
                        : <ImageIcon size={22} className="text-slate-300" aria-hidden="true" />}
                    </div>
                    <div className="p-4">
                      <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-2">
                        {previewPost.category}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 leading-snug mb-1.5">{previewPost.title}</h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">{previewPost.excerpt || 'Your summary appears here.'}</p>
                      <p className="mt-3 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400">
                        {previewPost.author} · {previewPost.dateLabel} · {previewPost.readTime} read
                      </p>
                    </div>
                  </div>
                </div>

                {/* Article, rendered by the same component the live post uses. */}
                <div className="p-5 max-h-[34rem] overflow-y-auto">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-4">Article</p>
                  <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight mb-3">{previewPost.title}</h3>
                  {excerpt && <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5">{excerpt}</p>}
                  <div className="text-sm [&_h2]:text-lg [&_h2]:mt-8 [&_p]:text-sm [&_p]:mb-4 [&_blockquote]:text-base">
                    <BlockRenderer blocks={blocks} />
                  </div>
                </div>
              </div>
            )}

            <p className="mt-4 text-xs font-medium text-slate-400 leading-relaxed">
              The article panel uses the same renderer as a published post, so this is how it will read.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogSubmitPage;
