import React from 'react';
import { Calendar, Clock, ImageIcon, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { Block } from '../../../data/blog';
import BlockRenderer from '../BlockRenderer';

/**
 * What the article will actually look like once it is published.
 *
 * The body goes through the same BlockRenderer the live post page mounts, so
 * this is not a mock-up of the design — it is the design, including the HTML
 * sanitiser that runs on submitted markup. Anything the sanitiser strips is
 * therefore missing here too, which is the point: the author sees the
 * published truth before they submit, not an optimistic version of it.
 */

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

export const DEVICE_OPTIONS: { id: PreviewDevice; label: string; Icon: typeof Monitor }[] = [
  { id: 'desktop', label: 'Desktop', Icon: Monitor },
  { id: 'tablet', label: 'Tablet', Icon: Tablet },
  { id: 'mobile', label: 'Mobile', Icon: Smartphone },
];

export interface ArticlePreviewData {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  dateLabel: string;
  readTime: string;
  image: string;
  tags: string[];
  blocks: Block[];
}

const initialsOf = (name: string): string =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || 'AU';

const ArticlePreview: React.FC<{ data: ArticlePreviewData; device: PreviewDevice }> = ({ data, device }) => (
  <div className="h-full overflow-y-auto bg-slate-100 p-4 sm:p-6">
    <div
      className="mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm transition-[max-width] duration-300"
      style={{ maxWidth: DEVICE_WIDTH[device] }}
    >
      <article className="px-5 py-8 sm:px-8 sm:py-10 md:px-12">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">
          {data.category || 'Uncategorised'}
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-[2.6rem] font-black text-slate-900 leading-[1.08] tracking-tight mb-5">
          {data.title || 'Your article title will appear here'}
        </h1>

        {data.excerpt && (
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-[1.6] mb-8">{data.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pb-7 mb-9 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="flex-none grid place-items-center w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 font-black text-sm border border-emerald-100"
              aria-hidden="true"
            >
              {initialsOf(data.author || 'Author')}
            </span>
            <span className="min-w-0">
              <span className="block font-bold text-slate-900 text-[0.95rem] truncate">{data.author || 'Your name'}</span>
              <span className="block text-sm text-slate-400 font-medium truncate">{data.authorRole || 'Contributor'}</span>
            </span>
          </div>
          <span className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5"><Calendar size={13} aria-hidden="true" /> {data.dateLabel}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden="true" /> {data.readTime} read</span>
          </span>
        </div>

        <figure className="mb-10">
          <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            {data.image ? (
              <img src={data.image} alt="" className="w-full h-auto object-cover" />
            ) : (
              <div className="grid place-items-center h-48 text-slate-300">
                <ImageIcon size={26} aria-hidden="true" />
              </div>
            )}
          </div>
        </figure>

        {/* The published renderer, not a preview-only copy of it. */}
        <BlockRenderer blocks={data.blocks} />

        {data.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-100">
            {data.tags.map((t) => (
              <li key={t} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                {t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  </div>
);

export default ArticlePreview;
