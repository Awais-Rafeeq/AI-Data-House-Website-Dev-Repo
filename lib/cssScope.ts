// Confines a submitted stylesheet to the article it was written for.
//
// A pasted page usually keeps its whole design in one <style> block, so simply
// dropping that block leaves the author looking at their work with every visual
// rule gone. Keeping it as-is is not an option either: `body { display: none }`
// would blank the site, `.nav-container { ... }` would collide with our own
// class names, and a fixed-position overlay could sit on top of the real UI.
//
// So the stylesheet is kept and rewritten instead. Every selector is prefixed
// with the article's container, which makes it structurally incapable of
// matching anything outside the article — the guarantee comes from the shape of
// the selector, not from us predicting which rules would be harmful.
//
// The rewriting is done with the browser's own CSS parser (CSSOM), never with
// regexes: the parser already knows what a selector is, where a string ends and
// which at-rules nest, and quietly drops anything it cannot parse.

/**
 * Selectors that mean "the page", and therefore have to mean "the article"
 * instead. Deliberately just these three: `main`, `header` and friends look
 * page-level but are ordinary elements the author still has inside the article,
 * so they get prefixed like anything else rather than collapsed onto the root.
 */
const ROOT_SELECTORS = new Set([':root', 'html', 'body']);

/**
 * Declarations refused wherever they appear. `position: fixed` is the one that
 * matters: it escapes the container's box and can cover the real page with an
 * overlay, which is a spoofing primitive rather than a formatting choice. The
 * rest are legacy script-execution vectors that only old engines honour, kept
 * out on principle.
 */
const FORBIDDEN_VALUE = /javascript:|expression\s*\(|-moz-binding|behaviou?r\s*:|@import/i;

/**
 * Split on a separator that is not inside brackets, parens or quotes — so
 * `a, b:is(c, d)` splits into two selectors, and `background: url(a;b)` stays
 * one declaration.
 *
 * Exported for the tests: this and scopeSelector are the parts that can be
 * checked without a CSSOM, and they are the parts the containment guarantee
 * actually rests on.
 */
export function splitTopLevel(text: string, separator: ',' | ';'): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  let quote: string | null = null;

  for (const ch of text) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; current += ch; continue; }
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === separator && depth === 0) { parts.push(current); current = ''; continue; }
    current += ch;
  }
  parts.push(current);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/**
 * Rewrite one selector so it can only ever match inside `scope`.
 *
 * Page-level selectors collapse onto the container itself, so the author's
 * `body { font-family: … }` styles the article rather than being thrown away,
 * and `:root { --accent: … }` still defines the custom properties the rest of
 * their stylesheet reads.
 */
export function scopeSelector(selector: string, scope: string): string {
  const trimmed = selector.trim();
  if (!trimmed) return '';

  // Never let a submitted sheet reach outside its own subtree.
  if (/^:(?:host|host-context)\b/i.test(trimmed)) return '';

  const lower = trimmed.toLowerCase();
  if (ROOT_SELECTORS.has(lower)) return scope;

  // Anything that *starts* at the page — "body.dark .card", "html[dir=rtl] p",
  // ":root > .x". The page part collapses onto the article, its qualifiers ride
  // along, and whatever follows stays a descendant of that. Handled in one pass
  // rather than as separate cases, because splitting them left combinations
  // like "body.dark .card" to fall through and become a rule that could never
  // match anything.
  const rooted = trimmed.match(/^(?::root|html|body)\b((?:[.#:[][^\s>+~]*)*)([\s\S]*)$/i);
  if (rooted) {
    const qualifiers = rooted[1] || '';
    const rest = (rooted[2] || '').trim();
    const head = `${scope}${qualifiers}`;
    return rest ? `${head} ${rest}`.replace(/\s+/g, ' ') : head;
  }

  return `${scope} ${trimmed}`;
}

/**
 * Filter a declaration block, keeping it as the author wrote it.
 *
 * It works from `cssText` rather than walking the longhands, and that detail
 * matters: a shorthand containing a variable (`background: var(--card-bg)`)
 * cannot be expanded into longhands, so iterating them yields a row of empty
 * values and silently deletes the declaration. Reading the serialised block
 * keeps custom properties and shorthands intact, which is most of what a pasted
 * theme is made of.
 */
export function scopeDeclarationText(cssText: string): string {
  if (!cssText) return '';
  return splitTopLevel(cssText, ';')
    .filter((decl) => !FORBIDDEN_VALUE.test(decl))
    // Pinning to the viewport escapes the container; anchoring to the article
    // keeps the author's intended layering without the overlay risk.
    .map((decl) => decl.replace(/position\s*:\s*fixed/gi, 'position:absolute'))
    .join(';');
}

function scopeRule(rule: CSSRule, scope: string): string {
  // CSSRule type constants, spelled out so this does not depend on the
  // constructor being present in whichever DOM implementation is running.
  const STYLE_RULE = 1, IMPORT_RULE = 3, MEDIA_RULE = 4, FONT_FACE_RULE = 5,
    KEYFRAMES_RULE = 7, SUPPORTS_RULE = 12;

  switch (rule.type) {
    case STYLE_RULE: {
      const styleRule = rule as CSSStyleRule;
      const selectors = splitTopLevel(styleRule.selectorText, ',')
        .map((s) => scopeSelector(s, scope))
        .filter(Boolean);
      const body = scopeDeclarationText(styleRule.style.cssText);
      if (selectors.length === 0 || !body) return '';
      return `${selectors.join(',')}{${body}}`;
    }

    // Would fetch a remote stylesheet we never get to inspect.
    case IMPORT_RULE:
      return '';

    case MEDIA_RULE: {
      const mediaRule = rule as CSSMediaRule;
      const inner = Array.from(mediaRule.cssRules).map((r) => scopeRule(r, scope)).join('');
      return inner ? `@media ${mediaRule.conditionText}{${inner}}` : '';
    }

    case SUPPORTS_RULE: {
      const supportsRule = rule as CSSSupportsRule;
      const inner = Array.from(supportsRule.cssRules).map((r) => scopeRule(r, scope)).join('');
      return inner ? `@supports ${supportsRule.conditionText}{${inner}}` : '';
    }

    // Neither selects anything on its own, so both are safe to keep verbatim.
    case FONT_FACE_RULE:
    case KEYFRAMES_RULE:
      return rule.cssText;

    default:
      return '';
  }
}

/**
 * Rewrite `css` so every rule in it can only apply inside `scope`.
 *
 * Returns '' when the sheet is empty or unparseable — a stylesheet we could not
 * read is one we cannot vouch for, so it does not get rendered.
 */
export function scopeCss(css: string, scope: string): string {
  if (!css || !css.trim()) return '';

  try {
    // A detached document, so parsing a submitted sheet cannot affect this page.
    const doc = document.implementation.createHTMLDocument('css-scope');
    const el = doc.createElement('style');
    el.textContent = css;
    doc.head.appendChild(el);

    const sheet = el.sheet;
    if (!sheet) return '';

    const scoped = Array.from(sheet.cssRules).map((rule) => scopeRule(rule, scope)).join('');

    // `</style>` inside the text would end the element early and let the rest of
    // the string be parsed as markup. `<` has no meaning in CSS outside strings,
    // so removing it costs nothing and closes that door.
    return scoped.replace(/</g, '');
  } catch {
    return '';
  }
}
