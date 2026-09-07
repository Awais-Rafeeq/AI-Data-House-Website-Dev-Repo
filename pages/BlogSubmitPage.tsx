import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Code2, Columns2,
  Eye, FileText, Loader2, PanelRightClose, PanelRightOpen, Play, Save, ShieldCheck, Sparkles, Trash2,
} from 'lucide-react';
import type { Block } from '../data/blog';
import { useSeo, breadcrumbJsonLd } from '../lib/seo';
import { invalidateBlogCache } from '../lib/useBlogPosts';
import { isBeyondEditorial, isFullDocument, normalizeArticleImages } from '../lib/htmlSanitize';
import {
  IMAGE_MAX_BYTES, IMAGE_MIME_TYPES, LIMITS, MIN_ARTICLE_CHARS, estimateReadTime,
  formatDateLabel, htmlToPlainText, isBlogStoreConfigured, isSlugAvailable, resolveImageType,
  slugify, submitPost, uploadCoverImage, validateDraft,
  type FieldErrors, type SubmissionDraft,
} from '../lib/blogStore';
import Inspector, { type SlugStatus } from '../components/blog/studio/Inspector';
import ArticlePreview, { DEVICE_OPTIONS, type PreviewDevice } from '../components/blog/studio/ArticlePreview';
import PreviewFrame from '../components/blog/studio/PreviewFrame';

// Both editors are heavy (ProseMirror, CodeMirror) and most authors only ever
// open one of them, so each arrives as its own chunk when its tab is first
// opened rather than in the page's initial payload.
const VisualEditor = lazy(() => import('../components/blog/studio/VisualEditor'));
const HtmlSourceEditor = lazy(() => import('../components/blog/studio/HtmlSourceEditor'));

const DRAFT_KEY = 'adh:blog-studio-draft:v1';
const todayIso = () => new Date().toISOString().slice(0, 10);

type Workspace = 'write' | 'html' | 'preview';
/** How the HTML tab splits code against rendered output, W3Schools-style. */
type SplitMode = 'split' | 'code' | 'output';

interface StoredDraft {
  title: string; excerpt: string; category: string; tagsRaw: string;
  author: string; authorRole: string; submitterEmail: string;
  date: string; readTimeOverride: string; image: string; slug: string; slugTouched: boolean;
  seoTitle: string; seoDescription: string; bodyHtml: string; savedAt: string;
}

const EditorFallback = () => (
  <div className="grid place-items-center h-96 text-slate-400" role="status" aria-label="Loading editor">
    <Loader2 size={20} className="animate-spin" aria-hidden="true" />
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────
const BlogSubmitPage: React.FC = () => {
  const navigate = useNavigate();
  useSeo({
    title: 'Editorial Studio — Submit an Article | AI Data House',
    description: 'Write, format and preview a guide, case study, or tool comparison for the AI Data House Transformation Playbook. Every submission is reviewed by our editors before it goes live.',
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

  // ── Article metadata (unchanged set — only where it lives has moved) ──
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Guides');
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

  // ── The article body. One HTML string is the single source of truth for both
  // the visual tab and the source tab, so switching between them is two views
  // of one value rather than two documents to reconcile. ──
  const [bodyHtml, setBodyHtml] = useState('');
  const setArticleHtml = useCallback((next: string) => {
    setBodyHtml(normalizeArticleImages(next));
  }, []);

  // Bots fill hidden fields; humans never see this one.
  const [honeypot, setHoneypot] = useState('');

  const [workspace, setWorkspace] = useState<Workspace>('write');
  const [splitMode, setSplitMode] = useState<SplitMode>('split');
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [convertPrompt, setConvertPrompt] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ slug: string } | null>(null);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle');
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const tags = useMemo(
    () => tagsRaw.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8),
    [tagsRaw],
  );

  // 'custom' the moment the body uses markup the visual editor cannot represent
  // — a full document, or layout elements it has no node for. Derived, never a
  // manual switch, so it can never disagree with what is actually stored.
  const contentMode = useMemo(() => (isBeyondEditorial(bodyHtml) ? 'custom' : 'editorial'), [bodyHtml]);

  const blocks: Block[] = useMemo(
    () => (htmlToPlainText(bodyHtml) ? [{ type: 'html', html: bodyHtml, mode: contentMode }] : []),
    [bodyHtml, contentMode],
  );

  const estimatedReadTime = useMemo(() => estimateReadTime(blocks), [blocks]);
  const readTime = readTimeOverride.trim() || estimatedReadTime;
  const bodyChars = useMemo(() => htmlToPlainText(bodyHtml).length, [bodyHtml]);

  // The slug follows the title until the writer edits it themselves.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  // Debounced availability check, so the writer learns about a clash here
  // rather than after writing the whole article.
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

  // ── Drafts ────────────────────────────────────────────────────────────────
  // Local only, and deliberately so: nothing is written to the review queue
  // until the author actually submits.
  const snapshot = useCallback((): StoredDraft => ({
    title, excerpt, category, tagsRaw, author, authorRole, submitterEmail,
    date, readTimeOverride, image, slug, slugTouched, seoTitle, seoDescription,
    bodyHtml, savedAt: new Date().toISOString(),
  }), [title, excerpt, category, tagsRaw, author, authorRole, submitterEmail, date, readTimeOverride, image, slug, slugTouched, seoTitle, seoDescription, bodyHtml]);

  const saveDraft = useCallback(() => {
    try {
      const data = snapshot();
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      setDraftSavedAt(data.savedAt);
    } catch {
      /* private mode / quota — drafts are a convenience, never a requirement */
    }
  }, [snapshot]);

  // Restore once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<StoredDraft>;
      if (!d || typeof d !== 'object') return;
      setTitle(d.title || ''); setExcerpt(d.excerpt || '');
      setCategory(d.category || 'Guides'); setTagsRaw(d.tagsRaw || '');
      setAuthor(d.author || ''); setAuthorRole(d.authorRole || '');
      setSubmitterEmail(d.submitterEmail || ''); setDate(d.date || todayIso());
      setReadTimeOverride(d.readTimeOverride || ''); setImage(d.image || '');
      setSlug(d.slug || ''); setSlugTouched(Boolean(d.slugTouched));
      setSeoTitle(d.seoTitle || ''); setSeoDescription(d.seoDescription || '');
      setBodyHtml(normalizeArticleImages(d.bodyHtml || ''));
      setDraftSavedAt(d.savedAt || null);
      setDraftRestored(true);
    } catch {
      /* a corrupt draft should never block the page */
    }
  }, []);

  // Autosave, debounced, once there is something worth keeping.
  useEffect(() => {
    if (!title && !bodyHtml) return undefined;
    const t = window.setTimeout(saveDraft, 1200);
    return () => window.clearTimeout(t);
  }, [saveDraft, title, bodyHtml]);

  const discardDraft = () => {
    try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* nothing to do */ }
    setDraftSavedAt(null);
    setDraftRestored(false);
  };

  // ── Cover image ───────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setUploadError('');
    if (!resolveImageType(file)) { setUploadError('Use a JPG, PNG, WebP or AVIF image.'); return; }
    if (file.size > IMAGE_MAX_BYTES) {
      setUploadError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 3 MB.`);
      return;
    }
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

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // ── Mode switching ────────────────────────────────────────────────────────
  // Going to the visual editor with a body it cannot represent would silently
  // rewrite the author's markup, so that switch asks first. Every other switch
  // is free: both tabs edit the same string.
  const goToWorkspace = (next: Workspace) => {
    if (next === 'write' && contentMode === 'custom') { setConvertPrompt(true); return; }
    setWorkspace(next);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (honeypot) { setFormError('Submission rejected.'); return; }

    const fieldErrors = validateDraft(draft);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setFormError('Please fix the highlighted fields.');
      if (fieldErrors.image || fieldErrors.category || fieldErrors.author || fieldErrors.submitterEmail
        || fieldErrors.date || fieldErrors.slug || fieldErrors.tags) {
        setInspectorOpen(true);
      }
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    const result = await submitPost(draft);
    setSubmitting(false);

    if (result.ok && result.slug) {
      invalidateBlogCache();
      discardDraft();
      setDone({ slug: result.slug });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (result.fieldErrors) setErrors(result.fieldErrors);
    setFormError(result.error || 'Something went wrong. Please try again.');
  };

  // ── Success ───────────────────────────────────────────────────────────────
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
              Write another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const previewData = {
    title, excerpt, category,
    author: author || 'Your name',
    authorRole,
    dateLabel: formatDateLabel(date),
    readTime, image, tags, blocks,
  };

  const tabCls = (on: boolean) =>
    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-colors ${
      on ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    // The studio scrolls as one page on every viewport. The editor still gets
    // a definite minimum height, so CodeMirror/Tiptap can fill the workspace
    // without trapping the rest of the form behind an overflow-hidden shell.
    <form onSubmit={handleSubmit} noValidate className="min-h-screen bg-slate-50 flex flex-col">
      {/* Honeypot: off-screen, not display:none, so bots still fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="company-website">Company website</label>
        <input id="company-website" name="company-website" tabIndex={-1} autoComplete="off"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={IMAGE_MIME_TYPES.join(',')}
        className="sr-only"
        onChange={(e) => { void handleFile(e.target.files?.[0]); e.target.value = ''; }}
      />

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="flex items-center gap-3 px-4 sm:px-6 h-16 pt-[env(safe-area-inset-top)]">
          <Link
            to="/resources/blog"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 font-bold text-xs transition-colors flex-none"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Back to Blog</span>
          </Link>

          <span className="w-px h-6 bg-slate-200 hidden sm:block" aria-hidden="true" />

          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-2 text-sm font-black text-slate-900 truncate">
              <Sparkles size={14} className="text-emerald-600 flex-none" aria-hidden="true" />
              {title || 'New Article'}
            </h1>
            <p className="text-[11px] font-medium text-slate-400 truncate">
              {contentMode === 'custom' ? 'Custom HTML' : 'Editorial'} ·{' '}
              {bodyChars.toLocaleString()} characters ·{' '}
              {draftSavedAt ? `draft saved ${new Date(draftSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'not saved yet'}
            </p>
          </div>

          <button
            type="button"
            onClick={saveDraft}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-slate-600 border border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-700 transition-colors"
          >
            <Save size={14} aria-hidden="true" /> Save draft
          </button>

          <button
            type="button"
            onClick={() => goToWorkspace('preview')}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-slate-600 border border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-700 transition-colors"
          >
            <Eye size={14} aria-hidden="true" /> Preview
          </button>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-500 disabled:opacity-60 transition-colors flex-none"
          >
            {submitting ? <>Submitting <Loader2 size={14} className="animate-spin" /></> : <>Submit for review <ArrowRight size={14} /></>}
          </button>

          <button
            type="button"
            onClick={() => setInspectorOpen((v) => !v)}
            aria-label={inspectorOpen ? 'Hide article settings' : 'Show article settings'}
            className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-600 transition-colors flex-none"
          >
            {inspectorOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </button>
        </div>

        {!configured && (
          <div className="flex items-start gap-2.5 px-4 sm:px-6 py-2.5 bg-amber-50 border-t border-amber-200 text-amber-900">
            <AlertCircle size={15} className="flex-none mt-0.5" aria-hidden="true" />
            <p className="text-xs font-medium leading-relaxed">
              <strong className="font-black">Submissions are not open yet.</strong> The article store is not
              configured on this deployment, so nothing can be saved. You can still write and preview.
              Email <a href="mailto:info@aidatahouse.com" className="underline font-bold">info@aidatahouse.com</a> to pitch in the meantime.
            </p>
          </div>
        )}

        {draftRestored && (
          <div className="flex items-center gap-2.5 px-4 sm:px-6 py-2 bg-emerald-50 border-t border-emerald-100 text-emerald-800">
            <Check size={14} className="flex-none" aria-hidden="true" />
            <p className="text-xs font-bold">Draft restored from this browser.</p>
            <button type="button" onClick={discardDraft} className="ml-auto inline-flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-rose-600">
              <Trash2 size={12} aria-hidden="true" /> Discard
            </button>
          </div>
        )}
      </header>

      {/* ── Workspace ── */}
      <div className="flex-1 min-h-0 flex flex-col xl:flex-row xl:items-start">
        <main className="flex-1 min-w-0 min-h-0 flex flex-col p-4 sm:p-5 xl:p-6 gap-5">

          {/* Title + summary stay above the editor: they are the article, not settings. */}
          <div className="flex-none rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <label htmlFor="f-title" className="sr-only">Title</label>
            <input
              id="f-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={LIMITS.title}
              placeholder="How we cut a 6-hour reporting job to 4 minutes"
              className="w-full text-2xl sm:text-[1.8rem] font-black tracking-tight text-slate-900 placeholder:text-slate-300 bg-transparent outline-none leading-tight"
            />
            <label htmlFor="f-excerpt" className="sr-only">Summary</label>
            <textarea
              id="f-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={LIMITS.excerpt}
              rows={2}
              placeholder="Two or three sentences on what the reader gets out of this. Shown on the blog card and used as the meta description."
              className="mt-2 w-full resize-y min-h-16 text-base text-slate-500 font-medium leading-relaxed placeholder:text-slate-300 bg-transparent outline-none"
            />
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-bold">
              <span className={title.length >= 10 ? 'text-slate-400' : 'text-slate-300'}>
                Title {title.length}/{LIMITS.title}
              </span>
              <span className={excerpt.length >= 40 ? 'text-slate-400' : 'text-slate-300'}>
                Summary {excerpt.length}/{LIMITS.excerpt}
              </span>
              {(errors.title || errors.excerpt) && (
                <span role="alert" className="text-rose-600">{errors.title || errors.excerpt}</span>
              )}
            </div>
          </div>

          {/* Editor card */}
          <section className="h-[42rem] sm:h-[46rem] xl:h-[calc(100vh-8rem)] xl:min-h-[42rem] rounded-2xl border border-slate-200 bg-white flex flex-col overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100">
                <button type="button" onClick={() => goToWorkspace('write')} className={tabCls(workspace === 'write')}>
                  <FileText size={13} aria-hidden="true" /> Visual Editor
                </button>
                <button type="button" onClick={() => goToWorkspace('html')} className={tabCls(workspace === 'html')}>
                  <Code2 size={13} aria-hidden="true" /> HTML Source
                </button>
                <button type="button" onClick={() => goToWorkspace('preview')} className={tabCls(workspace === 'preview')}>
                  <Eye size={13} aria-hidden="true" /> Live Preview
                </button>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {workspace === 'html' && (
                  <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-100">
                    {([['split', Columns2, 'Split'], ['code', Code2, 'Editor'], ['output', Play, 'Result']] as const).map(([id, Icon, label]) => (
                      <button key={id} type="button" onClick={() => setSplitMode(id)} className={tabCls(splitMode === id)}>
                        <Icon size={13} aria-hidden="true" /> {label}
                      </button>
                    ))}
                  </div>
                )}

                {workspace === 'preview' && (
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100">
                    {DEVICE_OPTIONS.map(({ id, label, Icon }) => (
                      <button key={id} type="button" onClick={() => setDevice(id)} className={tabCls(device === id)} aria-label={label}>
                        <Icon size={13} aria-hidden="true" />
                        <span className="hidden lg:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {contentMode === 'custom' && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                    <Code2 size={11} aria-hidden="true" /> HTML authoritative
                  </span>
                )}
              </div>
            </div>

            {/* Switching to the visual editor would flatten this body, so ask. */}
            {convertPrompt && (
              <div role="alert" className="flex flex-wrap items-start gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200">
                <AlertCircle size={16} className="text-amber-600 flex-none mt-0.5" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-amber-900 mb-0.5">This body uses markup the visual editor cannot represent.</p>
                  <p className="text-xs font-medium text-amber-800 leading-relaxed">
                    {isFullDocument(bodyHtml)
                      ? 'It looks like a complete HTML document.'
                      : 'It contains layout elements (like div or section) that the visual editor has no equivalent for.'}{' '}
                    Opening it there would simplify your markup. Your HTML is kept exactly as written unless you choose to convert.
                  </p>
                </div>
                <div className="flex gap-2 flex-none">
                  <button type="button" onClick={() => setConvertPrompt(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-black text-amber-900 hover:border-amber-400">
                    Keep editing HTML
                  </button>
                  <button type="button" onClick={() => { setConvertPrompt(false); setWorkspace('write'); }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-black hover:bg-amber-700">
                    Convert anyway
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 min-h-[30rem] overflow-hidden">
              {workspace === 'write' && (
                <Suspense fallback={<EditorFallback />}>
                  <VisualEditor html={bodyHtml} onChange={setArticleHtml} onError={setUploadError} />
                </Suspense>
              )}

              {workspace === 'html' && (
                <div className={`h-full min-h-0 ${splitMode === 'split' ? 'grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200' : 'block'}`}>
                  {splitMode !== 'output' && (
                    <div className="min-h-[18rem] md:min-h-0 h-full overflow-hidden">
                      <Suspense fallback={<EditorFallback />}>
                        <HtmlSourceEditor value={bodyHtml} onChange={setArticleHtml} ariaLabel="Article HTML source" />
                      </Suspense>
                    </div>
                  )}
                  {splitMode !== 'code' && (
                    <div className="min-h-[18rem] md:min-h-0 h-full bg-slate-50">
                      {/* Sandboxed: no scripts, no same-origin. See PreviewFrame. */}
                      <PreviewFrame html={bodyHtml} title="Rendered HTML output" />
                    </div>
                  )}
                </div>
              )}

              {workspace === 'preview' && (
                <ArticlePreview data={previewData} device={device} />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 border-t border-slate-100 bg-white text-[11px] font-medium text-slate-400">
              {workspace === 'html' ? (
                <span>Paste article HTML or a whole document. Scripts, styles and event handlers are removed before anything is published.</span>
              ) : workspace === 'preview' ? (
                <span>Rendered with the same components as the published post, after sanitising — this is what a reader will see.</span>
              ) : (
                <span>Write here, or switch to HTML Source to paste your own markup.</span>
              )}
              <span className="ml-auto tabular-nums">
                {bodyChars.toLocaleString()} chars · {readTime} read
                {bodyChars > 0 && bodyChars < MIN_ARTICLE_CHARS && (
                  <span className="text-amber-600"> · needs {MIN_ARTICLE_CHARS - bodyChars} more</span>
                )}
              </span>
            </div>
          </section>

          {errors.blocks && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700">
              <AlertCircle size={14} className="mt-px flex-none" aria-hidden="true" /> {errors.blocks}
            </p>
          )}
          {formError && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
              <AlertCircle size={16} className="mt-px flex-none" aria-hidden="true" /> {formError}
            </p>
          )}

          <p className="flex items-start gap-2 text-[11px] font-medium text-slate-400 leading-relaxed">
            <ShieldCheck size={13} className="mt-0.5 flex-none text-slate-300" aria-hidden="true" />
            Submissions are held for editorial review. Nothing is published to the site automatically, and
            submitted markup is sanitised before it is ever rendered.
          </p>
        </main>

        {/* ── Inspector ── */}
        <aside
          className={`xl:w-[25rem] xl:flex-none xl:sticky xl:top-16 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto xl:border-l xl:border-t-0 border-t border-slate-200 bg-white ${inspectorOpen ? 'block' : 'hidden xl:block'}`}
          aria-label="Article settings"
        >
          <div>
            <div className="hidden xl:flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
              <ChevronDown size={13} className="text-emerald-600" aria-hidden="true" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Article settings</h2>
            </div>
            <Inspector
              errors={errors}
              configured={configured}
              image={image}
              previewUrl={previewUrl}
              uploading={uploading}
              uploadError={uploadError}
              onPickImage={() => fileRef.current?.click()}
              onClearImage={() => setImage('')}
              category={category}
              setCategory={setCategory}
              tagsRaw={tagsRaw}
              setTagsRaw={setTagsRaw}
              tagCount={tags.length}
              author={author}
              setAuthor={setAuthor}
              authorRole={authorRole}
              setAuthorRole={setAuthorRole}
              submitterEmail={submitterEmail}
              setSubmitterEmail={setSubmitterEmail}
              date={date}
              setDate={setDate}
              readTimeOverride={readTimeOverride}
              setReadTimeOverride={setReadTimeOverride}
              estimatedReadTime={estimatedReadTime}
              slug={slug}
              onSlugChange={(v) => { setSlugTouched(true); setSlug(slugify(v)); }}
              slugStatus={slugStatus}
              seoTitle={seoTitle}
              setSeoTitle={setSeoTitle}
              seoDescription={seoDescription}
              setSeoDescription={setSeoDescription}
            />
          </div>
        </aside>
      </div>
    </form>
  );
};

export default BlogSubmitPage;
