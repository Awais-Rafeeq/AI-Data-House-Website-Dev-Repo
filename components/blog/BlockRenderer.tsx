import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Block } from '../../data/blog';
import { isSafeHref } from '../../lib/blogSanitize';
import { headingIdOf } from '../../lib/articleHeadings';
import { extractHeadings, sanitizeArticleHtml } from '../../lib/htmlSanitize';

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
                id={headingIdOf(b.text)}
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
          case 'html':
            return <ArticleHtml key={i} html={b.html} mode={b.mode} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

/**
 * An article body that was authored as HTML rather than as structured blocks.
 *
 * This is the only place in the app where submitted content becomes real
 * markup, so it is sanitised here, at render time, on every render — not once
 * on the way into the database. A row can be written by something other than
 * the studio (the anon key is public), so what is stored is treated as input,
 * never as output.
 *
 * `mode` decides styling only, never trust. An 'editorial' body came out of the
 * visual editor, so it is a known element set and gets the blog's own prose
 * styling. A 'custom' body was written as HTML source and may carry its own
 * inline layout, so it only gets a light baseline and is left to look like
 * itself — see `.article-html` in index.css.
 */
const ArticleHtml: React.FC<{ html: string; mode?: 'editorial' | 'custom' }> = ({ html, mode }) => {
  const clean = useMemo(() => sanitizeArticleHtml(html), [html]);
  return (
    <div
      className={`article-html${mode === 'custom' ? ' article-html-custom' : ''}`}
      // Safe by construction: `clean` is the output of sanitizeArticleHtml,
      // which allowlists tags, attributes and URI schemes. Never pass anything
      // else to this prop.
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

/** Stable anchor id for a heading. Re-exported from lib so the HTML sanitiser
 *  and this renderer can never drift apart on what an anchor is called. */
export const headingId = headingIdOf;

/** The headings of a post, in order — the table of contents' source. Works for
 *  both shapes: structured h2 blocks, and the h2/h3s inside an HTML body. */
export const tableOfContents = (blocks: Block[]): { id: string; text: string }[] =>
  blocks.flatMap((b) => {
    if (b.type === 'h2') return [{ id: headingIdOf(b.text), text: b.text }];
    // Read the ids off the sanitised output rather than recomputing them, so
    // the links always point at anchors that were actually rendered.
    if (b.type === 'html') {
      return extractHeadings(sanitizeArticleHtml(b.html))
        .filter((h) => h.level === 2)
        .map((h) => ({ id: h.id, text: h.text }));
    }
    return [];
  }).filter((h) => h.id);

export default BlockRenderer;
