import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildPreviewDocument } from '../../../lib/htmlSanitize';

/**
 * The W3Schools-style result pane: whatever the author has written, rendered.
 *
 * It runs in an iframe with `sandbox="allow-popups"` — note the absence of
 * `allow-scripts` and `allow-same-origin`. That combination is the point:
 *
 *  - no scripts, so a pasted <script> (or an onerror= that slipped past a
 *    future refactor) cannot execute even here, in the author's own browser;
 *  - no same-origin, so the document lives in an opaque origin and cannot
 *    touch the studio around it, its storage, or its cookies.
 *
 * The preview therefore shows layout and styling faithfully while being unable
 * to *do* anything, which is what makes it safe to point at raw, unsanitised
 * author input. It is deliberately fed the raw source rather than the sanitised
 * output, so the author sees what they actually wrote — the Preview tab shows
 * them the sanitised, published result instead, and the difference between the
 * two panes is the honest answer to "what will survive review?".
 */

interface PreviewFrameProps {
  html: string;
  /** Debounce for live typing. 0 renders immediately (used by "Run"). */
  debounceMs?: number;
  title?: string;
  className?: string;
}

/**
 * Lift the article styles out of the page's own stylesheet so the preview
 * matches the real thing without a second copy of the CSS to keep in step.
 * Same-origin sheets are readable; if anything throws (or the rules are not
 * found), the fallback below keeps the preview legible rather than unstyled.
 */
function collectArticleStyles(): string {
  const collected: string[] = [];
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet; nothing to read
      }
      for (const rule of Array.from(rules)) {
        const text = rule.cssText;
        if (text.includes('.article-html')) collected.push(text);
      }
    }
  } catch {
    /* fall through to the baseline below */
  }

  const base = `
    :root { color-scheme: light; }
    body {
      margin: 0; padding: 28px 24px;
      background: #ffffff; color: #334155;
      font-family: 'Plus Jakarta Sans', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    img { max-width: 100%; height: auto; }
  `;
  return collected.length > 0
    ? base + collected.join('\n')
    : `${base}
      .article-html { font-size: 1.0625rem; line-height: 1.75; }
      .article-html h2 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 2.5rem 0 1rem; }
      .article-html h3 { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 2rem 0 .75rem; }
      .article-html p { margin: 0 0 1.5rem; }
      .article-html a { color: #1a7a3c; }
      .article-html ul, .article-html ol { padding-left: 1.5rem; margin: 1.5rem 0; }
      .article-html blockquote { border-left: 3px solid #1a7a3c; padding-left: 1.25rem; margin: 2rem 0; font-weight: 600; }
      .article-html pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: .75rem; overflow-x: auto; }
      .article-html table { border-collapse: collapse; width: 100%; }
      .article-html th, .article-html td { border-bottom: 1px solid #e2e8f0; padding: .75rem; text-align: left; }
    `;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({
  html, debounceMs = 350, title = 'Article preview', className = '',
}) => {
  const [rendered, setRendered] = useState(html);
  const styles = useRef<string>('');
  if (!styles.current) styles.current = collectArticleStyles();

  useEffect(() => {
    if (debounceMs <= 0) { setRendered(html); return undefined; }
    const t = window.setTimeout(() => setRendered(html), debounceMs);
    return () => window.clearTimeout(t);
  }, [html, debounceMs]);

  const srcDoc = useMemo(
    () => buildPreviewDocument(rendered, styles.current),
    [rendered],
  );

  return (
    <iframe
      title={title}
      // No allow-scripts and no allow-same-origin — see the note above.
      sandbox="allow-popups"
      srcDoc={srcDoc}
      className={`w-full h-full border-0 bg-white ${className}`}
    />
  );
};

export default PreviewFrame;
