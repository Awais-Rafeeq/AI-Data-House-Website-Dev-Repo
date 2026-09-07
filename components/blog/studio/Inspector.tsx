import React from 'react';
import { Check, Loader2, Upload } from 'lucide-react';
import { BLOG_CATEGORIES } from '../../../data/blog';
import type { FieldErrors } from '../../../lib/blogStore';
import { Field, InspectorSection, inputCls } from './StudioFields';

/**
 * Everything about the article that is not the article: cover, taxonomy,
 * byline, publishing details and SEO.
 *
 * These were previously stacked in the same column as the writing, which is
 * what made the page read as a long form. Moving them here keeps every field —
 * none were dropped — while leaving the centre of the screen for the words.
 */

const CATEGORY_OPTIONS = BLOG_CATEGORIES.filter((c) => c.id !== 'all');

export type SlugStatus = 'idle' | 'checking' | 'free' | 'taken';

export interface InspectorProps {
  errors: FieldErrors;
  configured: boolean;

  image: string;
  previewUrl: string | null;
  uploading: boolean;
  uploadError: string;
  onPickImage: () => void;
  onClearImage: () => void;

  category: string;
  setCategory: (v: string) => void;
  tagsRaw: string;
  setTagsRaw: (v: string) => void;
  tagCount: number;

  author: string;
  setAuthor: (v: string) => void;
  authorRole: string;
  setAuthorRole: (v: string) => void;
  submitterEmail: string;
  setSubmitterEmail: (v: string) => void;

  date: string;
  setDate: (v: string) => void;
  readTimeOverride: string;
  setReadTimeOverride: (v: string) => void;
  estimatedReadTime: string;

  slug: string;
  onSlugChange: (v: string) => void;
  slugStatus: SlugStatus;

  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
}

const Inspector: React.FC<InspectorProps> = (p) => (
  <div className="divide-y divide-slate-100">
    <InspectorSection title="Cover image">
      <Field label="Cover" required error={p.errors.image || p.uploadError}
        hint="JPG, PNG, WebP or AVIF. Up to 3 MB. Landscape works best.">
        {(p.previewUrl || p.image) ? (
          <div className="relative rounded-xl border border-slate-200 overflow-hidden">
            <img src={p.previewUrl || p.image} alt="Cover preview" className="w-full h-32 object-cover" />
            {p.uploading ? (
              <div className="absolute inset-0 bg-white/80 grid place-items-center" role="status">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Uploading…
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <Check size={12} aria-hidden="true" /> Uploaded
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={p.onPickImage} className="text-[11px] font-black text-slate-500 hover:text-emerald-600">Replace</button>
                  <button type="button" onClick={p.onClearImage} className="text-[11px] font-black text-slate-400 hover:text-rose-600">Remove</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={p.onPickImage}
            className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-7 text-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-lg bg-white border border-slate-200 text-slate-400">
              <Upload size={16} aria-hidden="true" />
            </span>
            <span className="block font-black text-slate-700 text-xs">Choose an image from your computer</span>
            <span className="block text-[11px] font-medium text-slate-400 mt-0.5">
              {p.configured ? 'Uploads as soon as you pick it' : 'Needs Supabase credentials before upload can finish'}
            </span>
          </button>
        )}
      </Field>
    </InspectorSection>

    <InspectorSection title="Classification">
      <Field label="Category" required htmlFor="f-category" error={p.errors.category}>
        <select id="f-category" value={p.category} onChange={(e) => p.setCategory(e.target.value)} className={inputCls}>
          {CATEGORY_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Tags" htmlFor="f-tags" error={p.errors.tags} hint="Comma separated, up to 8." counter={`${p.tagCount}/8`}>
        <input id="f-tags" value={p.tagsRaw} onChange={(e) => p.setTagsRaw(e.target.value)}
          placeholder="n8n, reporting, dashboards" className={inputCls} />
      </Field>
    </InspectorSection>

    <InspectorSection title="About you">
      <Field label="Author name" required htmlFor="f-author" error={p.errors.author}>
        <input id="f-author" value={p.author} onChange={(e) => p.setAuthor(e.target.value)} maxLength={80}
          placeholder="Jane Okafor" className={inputCls} />
      </Field>
      <Field label="Role / title" htmlFor="f-role" hint="Shown under your name on the byline.">
        <input id="f-role" value={p.authorRole} onChange={(e) => p.setAuthorRole(e.target.value)} maxLength={80}
          placeholder="Head of Operations, Northwind" className={inputCls} />
      </Field>
      <Field label="Your email" required htmlFor="f-email" error={p.errors.submitterEmail}
        hint="Only used to reach you about this submission. Never published.">
        <input id="f-email" type="email" value={p.submitterEmail} onChange={(e) => p.setSubmitterEmail(e.target.value)}
          maxLength={160} placeholder="you@company.com" className={inputCls} />
      </Field>
    </InspectorSection>

    <InspectorSection title="Publishing">
      <Field label="Publish date" required htmlFor="f-date" error={p.errors.date}>
        <input id="f-date" type="date" value={p.date} onChange={(e) => p.setDate(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Read time" htmlFor="f-readtime" hint={`Leave blank to use the estimate (${p.estimatedReadTime}).`}>
        <input id="f-readtime" value={p.readTimeOverride} onChange={(e) => p.setReadTimeOverride(e.target.value)}
          maxLength={16} placeholder={p.estimatedReadTime} className={inputCls} />
      </Field>
      <Field
        label="URL slug"
        required
        htmlFor="f-slug"
        error={p.errors.slug}
        hint={p.slugStatus === 'taken' ? undefined : `Lives at /resources/${p.slug || '…'}`}
      >
        <div className="relative">
          <input id="f-slug" value={p.slug} onChange={(e) => p.onSlugChange(e.target.value)} maxLength={80}
            placeholder="how-we-cut-reporting-to-four-minutes" className={`${inputCls} pr-24`} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider">
            {p.slugStatus === 'checking' && <span className="text-slate-300">Checking…</span>}
            {p.slugStatus === 'free' && <span className="text-emerald-600">Available</span>}
            {p.slugStatus === 'taken' && <span className="text-rose-600">Taken</span>}
          </span>
        </div>
        {p.slugStatus === 'taken' && (
          <p className="mt-1.5 text-[11px] font-bold text-rose-600">
            That URL is in use. Edit it, or we will add a number when you submit.
          </p>
        )}
      </Field>
    </InspectorSection>

    <InspectorSection title="SEO" defaultOpen={false}>
      <Field label="SEO title" htmlFor="f-seotitle" error={p.errors.seoTitle} counter={`${p.seoTitle.length}/160`}
        hint="Optional. Defaults to the article title.">
        <input id="f-seotitle" value={p.seoTitle} onChange={(e) => p.setSeoTitle(e.target.value)} maxLength={160} className={inputCls} />
      </Field>
      <Field label="SEO description" htmlFor="f-seodesc" error={p.errors.seoDescription} counter={`${p.seoDescription.length}/320`}
        hint="Optional. Defaults to the summary.">
        <textarea id="f-seodesc" rows={3} value={p.seoDescription} onChange={(e) => p.setSeoDescription(e.target.value)}
          maxLength={320} className={`${inputCls} resize-y`} />
      </Field>
    </InspectorSection>
  </div>
);

export default Inspector;
