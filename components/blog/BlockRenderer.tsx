import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Block } from '../../data/blog';
import { isSafeHref } from '../../lib/blogSanitize';

/**
 * The one article renderer. The published post page and the live preview on the
 * submission form both mount this, so what a writer previews is literally what
 * a reader gets — there is no second rendering path to keep in sync.
 *
 * Every branch renders its content as a JSX text child, never as markup. That
 * is the whole XSS story for the blog: a submitted post is structured data, so
 * there is no HTML to sanitise on the way out. The one exception is the `links`
 * block, whose href reaches an anchor, and that is guarded below.
 */

interface BlockRendererProps {
  blocks: Block[];
  /** Omitted in preview: callout buttons are inert until the post is live. */
  onCta?: (label: string) => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks, onCta }) => {
  const navigate = useNavigate();
  const goInternal = (e: React.MouseEvent, href: string) => {
    // Real anchors for crawlers; intercept for client-side navigation.
    if (href.startsWith('/')) { e.preventDefault(); navigate(href); }
  };

  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <h2
                key={i}
                id={headingId(b.text)}
                className="scroll-mt-28 text-[1.6rem] md:text-[2rem] font-black text-slate-900 leading-[1.2] tracking-tight mt-14 mb-5 first:mt-0"
              >
                {b.text}
              </h2>
            );
          case 'p':
            return (
              <p key={i} className="text-[1.0625rem] md:text-[1.125rem] text-slate-600 leading-[1.75] mb-6">
                {b.text}
              </p>
            );
          case 'list':
            return (
              <ul key={i} className="my-7 space-y-3.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-3.5 text-[1.0625rem] text-slate-600 leading-[1.7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-[0.7em] flex-shrink-0" aria-hidden="true" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-10 border-l-[3px] border-emerald-500 pl-6 md:pl-7 text-xl md:text-[1.4rem] font-semibold text-slate-800 leading-[1.5]"
              >
                {b.text}
              </blockquote>
            );
          case 'table':
            return (
              <div key={i} className="my-9 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
                      {b.head.map((h, j) => <th key={j} className="p-4 font-black whitespace-nowrap">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {b.rows.map((r, j) => (
                      <tr key={j} className="hover:bg-slate-50">
                        {r.map((c, k) => (
                          <td key={k} className={`p-4 align-top ${k === 0 ? 'font-black text-slate-900' : 'text-slate-600 font-medium'}`}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'callout':
            return (
              <div key={i} className={`my-10 rounded-[2rem] p-8 md:p-10 ${b.variant === 'cta' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                {b.title && <p className="text-xl font-black mb-3 leading-snug">{b.title}</p>}
                <p className={`font-medium leading-relaxed mb-6 ${b.variant === 'cta' ? 'text-emerald-50' : 'text-slate-300'}`}>{b.text}</p>
                <button
                  type="button"
                  disabled={!onCta}
                  onClick={() => onCta?.(b.button || 'Book Free Audit')}
                  className={`px-7 py-3.5 font-black rounded-xl inline-flex items-center gap-2 transition-all disabled:opacity-60 disabled:cursor-default ${b.variant === 'cta' ? 'bg-white text-emerald-700 hover:bg-emerald-50' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                >
                  {b.button || 'Book Free Audit'} <ArrowRight size={16} />
                </button>
              </div>
            );
          case 'links': {
            const items = b.items.filter((it) => isSafeHref(it.href));
            if (items.length === 0) return null;
            return (
              <div key={i} className="my-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 md:p-8">
                {b.title && <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">{b.title}</p>}
                <ul className="space-y-2">
                  {items.map((it, j) => {
                    const external = !it.href.startsWith('/');
                    return (
                      <li key={j}>
                        <a
                          href={it.href}
                          onClick={(e) => goInternal(e, it.href)}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer nofollow ugc' } : {})}
                          className="group flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 px-5 py-4 font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          <span>{it.label}</span>
                          <ArrowRight size={16} className="text-emerald-500 flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
};

/** Stable anchor id for an h2, so the table of contents can jump to it. */
export const headingId = (text: string): string =>
  `s-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)}`;

/** The h2s of a post, in order — the table of contents' source. */
export const tableOfContents = (blocks: Block[]): { id: string; text: string }[] =>
  blocks.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')
    .map((b) => ({ id: headingId(b.text), text: b.text }));

export default BlockRenderer;
