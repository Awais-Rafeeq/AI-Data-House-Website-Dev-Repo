// Tests for the HTML article sanitiser — the boundary that decides what a
// public submission is allowed to turn into real markup on aidatahouse.com.
//
// lib/blogSanitize.ts is DOM-free and covered by test-blog-sanitizer.ts. This
// file covers the other half, lib/htmlSanitize.ts, which needs a DOM: a jsdom
// window is installed as the global *before* the module is imported, because
// DOMPurify binds to `window` at import time. That means these tests exercise
// the exact production configuration, not a re-implementation of it.
//
// If one of these fails, a submitted article could execute script or phish on a
// real aidatahouse.com URL. Treat a failure as a release blocker.

import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
const g = globalThis as unknown as Record<string, unknown>;
g.window = dom.window;
g.document = dom.window.document;
g.DOMParser = dom.window.DOMParser;
g.Node = dom.window.Node;
g.Element = dom.window.Element;
g.HTMLElement = dom.window.HTMLElement;

// Imported after the globals exist, for the reason above.
const { sanitizeArticleHtml, extractHeadings, isBeyondEditorial, isFullDocument, extractBodyHtml } =
  await import('../lib/htmlSanitize');

let passed = 0;
const failures: string[] = [];

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) { passed++; return; }
  failures.push(`${name}\n      expected: ${e}\n      actual:   ${a}`);
}
const ok = (name: string, value: boolean) => check(name, value, true);
const notOk = (name: string, value: boolean) => check(name, value, false);

/** Case-insensitive "the output does not contain this substring". */
const lacks = (name: string, html: string, needle: string) =>
  notOk(name, sanitizeArticleHtml(html).toLowerCase().includes(needle.toLowerCase()));

// ─── Script execution ────────────────────────────────────────────────────────
lacks('drops <script>', '<p>hi</p><script>alert(1)</script>', '<script');
lacks('drops the body of a <script>', '<script>alert("pwned")</script>', 'alert');
lacks('drops <script src>', '<script src="https://evil.example/x.js"></script>', 'evil.example');
lacks('drops nested/broken script tags', '<scr<script>ipt>alert(1)</script>', '<script');
lacks('drops <iframe>', '<iframe src="https://evil.example"></iframe>', '<iframe');
lacks('drops iframe srcdoc', '<iframe srcdoc="<script>alert(1)</script>"></iframe>', 'srcdoc');
lacks('drops <object>', '<object data="x.swf"></object>', '<object');
lacks('drops <embed>', '<embed src="x.swf">', '<embed');
lacks('drops <base>', '<base href="https://evil.example/">', '<base');
lacks('drops <meta http-equiv refresh>', '<meta http-equiv="refresh" content="0;url=https://evil.example">', '<meta');

// ─── Event handlers ──────────────────────────────────────────────────────────
lacks('drops onclick', '<p onclick="alert(1)">text</p>', 'onclick');
lacks('drops onerror on an image', '<img src="x" onerror="alert(1)">', 'onerror');
lacks('drops onload', '<div onload="alert(1)">x</div>', 'onload');
lacks('drops onmouseover', '<a href="/x" onmouseover="alert(1)">x</a>', 'onmouseover');
lacks('drops uppercase ONERROR', '<img src=x ONERROR=alert(1)>', 'onerror');
lacks('drops onfocus/autofocus combo', '<input autofocus onfocus="alert(1)">', 'onfocus');
lacks('drops onanimationstart', '<div onanimationstart="alert(1)">x</div>', 'onanimationstart');

// ─── Dangerous URLs ──────────────────────────────────────────────────────────
lacks('drops javascript: href', '<a href="javascript:alert(1)">click</a>', 'javascript:');
lacks('drops JaVaScRiPt: href (mixed case)', '<a href="JaVaScRiPt:alert(1)">click</a>', 'javascript:');
lacks('drops javascript: with an embedded newline', '<a href="java\nscript:alert(1)">click</a>', 'javascript:');
lacks('drops vbscript: href', '<a href="vbscript:msgbox(1)">click</a>', 'vbscript:');
lacks('drops data: URI in an img', '<img src="data:text/html;base64,PHNjcmlwdD4=">', 'data:');
lacks('drops a data: URI anchor', '<a href="data:text/html,<script>alert(1)</script>">x</a>', 'data:');
ok('keeps an https link', sanitizeArticleHtml('<a href="https://example.com">x</a>').includes('https://example.com'));
ok('keeps an internal link', sanitizeArticleHtml('<a href="/solutions">x</a>').includes('href="/solutions"'));
ok('keeps a mailto link', sanitizeArticleHtml('<a href="mailto:a@b.com">x</a>').includes('mailto:'));

// ─── Style isolation ─────────────────────────────────────────────────────────
// A submitted <style> is kept (dropping it deleted the design of every pasted
// page) but every rule in it is rewritten to sit under .article-html. The
// invariant that has to hold either way — whether the stylesheet was scoped and
// kept, or could not be parsed and was therefore dropped — is that nothing in
// the output can select outside the article.
function stylesCannotEscape(html: string): boolean {
  const out = sanitizeArticleHtml(html);
  const blocks = out.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
  if (blocks.length === 0) return true; // dropped entirely: fail-closed, still safe
  return blocks.every((block) => {
    const css = block.replace(/<\/?style\b[^>]*>/gi, '');
    // Every selector (the text before each "{") must be anchored to the article.
    const selectors = css.split('}').map((s) => s.split('{')[0]).filter((s) => s.trim() && !s.trim().startsWith('@'));
    return selectors.every((sel) => sel.includes('.article-html'));
  });
}

ok('a pasted body{display:none} cannot blank the site',
  stylesCannotEscape('<style>body{display:none}</style><p>x</p>'));
ok('a pasted rule targeting our own classes cannot reach them',
  stylesCannotEscape('<style>.hero, nav a { display: none }</style><p>x</p>'));
ok('an @media block cannot escape either',
  stylesCannotEscape('<style>@media(max-width:900px){body{display:none}}</style><p>x</p>'));
lacks('drops <link rel=stylesheet>', '<link rel="stylesheet" href="https://evil.example/x.css">', '<link');
ok('keeps an inline style attribute (cannot escape its own element)',
  sanitizeArticleHtml('<p style="text-align:center">x</p>').includes('style='));

// ─── Phishing surface ────────────────────────────────────────────────────────
lacks('drops <form>', '<form action="https://evil.example"><input name="pw"></form>', '<form');
lacks('drops <input>', '<input type="password" name="pw">', '<input');
lacks('drops <button>', '<button>Pay now</button>', '<button');
lacks('drops formaction', '<button formaction="https://evil.example">x</button>', 'formaction');

// ─── SVG / MathML vectors ────────────────────────────────────────────────────
lacks('drops <svg> entirely', '<svg><circle r="10"/></svg>', '<svg');
lacks('drops svg foreignObject script', '<svg><foreignObject><script>alert(1)</script></foreignObject></svg>', 'alert');
lacks('drops <math>', '<math><mtext></mtext></math>', '<math');

// ─── Content preservation ────────────────────────────────────────────────────
ok('keeps ordinary prose', sanitizeArticleHtml('<p>Hello <strong>world</strong></p>').includes('<strong>world</strong>'));
ok('keeps headings', sanitizeArticleHtml('<h2>Section</h2>').includes('Section'));
ok('keeps lists', sanitizeArticleHtml('<ul><li>one</li></ul>').includes('<li>one</li>'));
ok('keeps tables', sanitizeArticleHtml('<table><tr><td>cell</td></tr></table>').includes('cell'));
ok('keeps code blocks', sanitizeArticleHtml('<pre><code>npm run build</code></pre>').includes('npm run build'));
ok('keeps layout wrappers a source author would use',
  sanitizeArticleHtml('<section><div class="grid">x</div></section>').includes('<section>'));
ok('keeps the text inside a stripped element',
  sanitizeArticleHtml('<marquee>important words</marquee>').includes('important words'));

// ─── Link hardening ──────────────────────────────────────────────────────────
{
  const out = sanitizeArticleHtml('<a href="https://example.com">x</a>');
  ok('external links get rel="nofollow ugc noopener noreferrer"',
    out.includes('nofollow') && out.includes('ugc') && out.includes('noopener'));
  ok('external links open in a new tab', out.includes('target="_blank"'));
}
{
  const out = sanitizeArticleHtml('<a href="/resources/blog" target="_blank" rel="dofollow">x</a>');
  notOk('internal links do not keep an author-set target', out.includes('target='));
}
{
  const out = sanitizeArticleHtml('<img src="https://example.com/a.png">');
  ok('images are lazy-loaded and do not leak a referrer',
    out.includes('loading="lazy"') && out.includes('referrerpolicy="no-referrer"'));
}

// ─── Full documents ──────────────────────────────────────────────────────────
ok('isFullDocument spots a doctype', isFullDocument('<!doctype html><html><body>x</body></html>'));
notOk('isFullDocument ignores a fragment', isFullDocument('<p>x</p>'));
check('extractBodyHtml pulls the body out',
  extractBodyHtml('<!doctype html><html><head><title>t</title></head><body><p>x</p></body></html>').trim(),
  '<p>x</p>');
lacks('a pasted document loses its head scripts',
  '<!doctype html><html><head><script>alert(1)</script></head><body><p>x</p></body></html>', 'alert');
ok('a pasted document keeps its body text',
  sanitizeArticleHtml('<!doctype html><html><body><p>kept</p></body></html>').includes('kept'));

// ─── Headings / table of contents ────────────────────────────────────────────
{
  const out = sanitizeArticleHtml('<h2>First Section</h2><p>x</p><h3>Sub</h3>');
  ok('headings are given ids', out.includes('id="s-first-section"'));
  const heads = extractHeadings(out);
  check('extractHeadings reads them back', heads.map((h) => `${h.level}:${h.id}`), ['2:s-first-section', '3:s-sub']);
}
{
  const out = sanitizeArticleHtml('<h2>Same</h2><h2>Same</h2>');
  ok('duplicate headings get unique ids', out.includes('id="s-same"') && out.includes('id="s-same-2"'));
}

// ─── Editorial vs custom classification ──────────────────────────────────────
notOk('plain prose is editorial', isBeyondEditorial('<p>hello</p><h2>hi</h2><ul><li>x</li></ul>'));
notOk('a table is still editorial', isBeyondEditorial('<table><tbody><tr><td>x</td></tr></tbody></table>'));
ok('a div makes it custom', isBeyondEditorial('<div class="grid"><p>x</p></div>'));
ok('a section makes it custom', isBeyondEditorial('<section><p>x</p></section>'));
ok('a full document is custom', isBeyondEditorial('<!doctype html><html><body><p>x</p></body></html>'));
notOk('empty content is not custom', isBeyondEditorial('   '));

// ─── CSS scoping ─────────────────────────────────────────────────────────────
// A submitted stylesheet is kept but confined to the article. The containment
// guarantee is the selector rewriting, and that is pure string work, so it is
// tested directly here. Full scopeCss() needs a real CSSOM, which jsdom does
// not provide (see the note where those tests are skipped, below).
const { scopeSelector, splitTopLevel, scopeDeclarationText } = await import('../lib/cssScope');
const S = '.article-html';

check('page selectors collapse onto the article', scopeSelector('body', S), S);
check('html collapses too', scopeSelector('html', S), S);
check(':root collapses, so custom properties still resolve', scopeSelector(':root', S), S);
check('an ordinary class is prefixed', scopeSelector('.blog-card', S), '.article-html .blog-card');
check('an element selector is prefixed', scopeSelector('h2', S), '.article-html h2');
check('a page selector keeps its qualifier', scopeSelector('body.dark', S), '.article-html.dark');
check('a page selector keeps qualifier AND descendant',
  scopeSelector('body.dark .card', S), '.article-html.dark .card');
check('a page descendant is prefixed', scopeSelector('body .card', S), '.article-html .card');
check('a child combinator survives', scopeSelector('body > .card', S), '.article-html > .card');
check('an attribute selector on html rides along',
  scopeSelector('html[data-theme="dark"] .x', S), '.article-html[data-theme="dark"] .x');
check('a class merely starting with "body" is not treated as the page',
  scopeSelector('.bodybuilder', S), '.article-html .bodybuilder');
check('an element merely starting with "body" is not the page',
  scopeSelector('bodybuilder', S), '.article-html bodybuilder');
check(':host cannot be used to escape the shadow boundary', scopeSelector(':host', S), '');
check(':host-context is refused too', scopeSelector(':host-context(.x)', S), '');
check('main is an ordinary element, not the page', scopeSelector('main', S), '.article-html main');
check('header is an ordinary element, not the page', scopeSelector('header', S), '.article-html header');

check('selectors split on top-level commas only',
  splitTopLevel('a, b:is(c, d), e', ','), ['a', 'b:is(c, d)', 'e']);
check('declarations split on top-level semicolons only',
  splitTopLevel('background: url(a;b); color: red', ';'), ['background: url(a;b)', 'color: red']);

check('a var() shorthand survives intact (longhand expansion would erase it)',
  scopeDeclarationText('background: var(--bg); color: red'), 'background: var(--bg);color: red');
check('a multi-value declaration is not split on its internal commas',
  scopeDeclarationText('transition: background-color 0.3s, color 0.3s'),
  'transition: background-color 0.3s, color 0.3s');
check('position:fixed is anchored to the article instead of the viewport',
  scopeDeclarationText('position: fixed; top: 0'), 'position:absolute;top: 0');
check('a javascript: value is dropped, the rest of the rule kept',
  scopeDeclarationText('background: url(javascript:alert(1)); color: red'), 'color: red');
check('-moz-binding is dropped', scopeDeclarationText('-moz-binding: url(evil.xml); color: red'), 'color: red');

// scopeCss() itself parses via the CSSOM, which jsdom does not implement for
// detached documents (style.sheet is null there). Skipping loudly rather than
// silently: this half is verified in a real browser instead.
{
  const probe = document.implementation.createHTMLDocument('probe');
  const el = probe.createElement('style');
  el.textContent = '.a { color: red }';
  probe.head.appendChild(el);
  if (el.sheet) {
    const { scopeCss } = await import('../lib/cssScope');
    ok('scopeCss prefixes a rule', scopeCss('.a { color: red }', S).includes('.article-html .a'));
    ok('scopeCss drops @import', !scopeCss('@import url("https://evil.example/x.css");', S).includes('import'));
    ok('scopeCss keeps @media', scopeCss('@media (max-width:700px){.a{color:red}}', S).includes('@media'));
    ok('scopeCss cannot emit a closing style tag', !scopeCss('.a{content:"</style><script>"}', S).includes('</'));
    ok('a scoped stylesheet survives sanitising end to end',
      sanitizeArticleHtml('<style>.card{color:red}</style><p class="card">x</p>').includes('.article-html .card'));
  } else {
    console.log('  … 5 scopeCss() CSSOM tests skipped: this DOM has no stylesheet parser.');
    console.log('    (scopeCss fails closed without one — the stylesheet is dropped, never passed through.)');
  }
}

// ─── report ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error(`\n  ${failures.length} HTML sanitizer test(s) FAILED:\n`);
  failures.forEach((f) => console.error(`  ✗ ${f}\n`));
  process.exit(1);
}
console.log(`\n  ✓ ${passed} HTML sanitizer tests passed.\n`);
