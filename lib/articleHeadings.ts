/**
 * Anchor ids for article headings.
 *
 * Lives on its own because two different renderers have to agree on it: the
 * structured block renderer stamps ids onto its own <h2>s, and the HTML
 * sanitiser stamps them onto the headings inside a submitted HTML body. If
 * these ever disagreed, an article's table of contents would link to anchors
 * that do not exist. One function, both callers.
 *
 * Kept free of DOM and React imports so anything can use it.
 */
export const headingIdOf = (text: string): string => {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return slug ? `s-${slug}` : '';
};
