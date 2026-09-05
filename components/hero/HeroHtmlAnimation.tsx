import React from 'react';

export interface HeroAnimationAsset {
  /** Path to a self-contained, static HTML/CSS/JS animation under /public. */
  src: string;
  /** Accessible name for the embedded document (used as the iframe's title). */
  title: string;
  /**
   * The animation's own native aspect ratio (CSS `aspect-ratio` value), e.g.
   * '1' for square or '16 / 9' for widescreen. Defaults to '1' — the shape the
   * first HTML animation (Speed-to-Lead) was authored for. Set per scenario
   * when a future animation is a different shape: the slot (and the iframe
   * inside it) takes that shape instead, since forcing a mismatched box is
   * exactly what would stretch or crop the embedded file's own layout.
   */
  aspectRatio?: string;
}

/**
 * Drops a pre-built, self-contained HTML animation into the hero's visual
 * slot, as an alternative to a React `Visual` component. This is what lets a
 * hero scenario point at a static asset (see `HeroScenario.animation` in
 * heroScenarios.ts) instead of a hand-ported component: add a new file under
 * /public/hero-animations and reference its path — nothing here changes.
 *
 * The slot is sized the same way `.flow-stage` is for the component-based
 * scenarios — `aspect-ratio` + `width: 100%`, a definite box regardless of
 * viewport — rather than a percentage height, which cannot resolve inside
 * this grid-stacked layout. The iframe then fills that box exactly at the
 * animation's own aspect ratio, because the file's internal layout (see its
 * `min(92vw, Npx)` sizing) assumes it owns a viewport close to its own shape;
 * handing it a mismatched one is what would crop or stretch it.
 *
 * Sandboxed to scripts-only: the file is trusted, first-party content
 * (authored for this hero), but the iframe still gets no access to the
 * parent document, storage, top-level navigation, or popups.
 */
const HeroHtmlAnimation: React.FC<HeroAnimationAsset> = ({ src, title, aspectRatio = '1' }) => (
  <div className="flow-stage-html" style={{ ['--flow-html-ratio' as string]: aspectRatio }}>
    <iframe src={src} title={title} loading="lazy" sandbox="allow-scripts" scrolling="no" />
  </div>
);

export default HeroHtmlAnimation;
