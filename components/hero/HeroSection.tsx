import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendToN8n, ACTIONS } from '../../lib/n8n';
import { HERO_SCENARIOS, HERO_PRIMARY_CTA, HERO_SECONDARY_CTA } from './heroScenarios';
import { useHeroScrollStory } from './useHeroScrollStory';
import HeroHtmlAnimation from './HeroHtmlAnimation';

// Real, existing Clutch data (also shown further down the homepage in the
// review bar) — do not replace with placeholder numbers.
const CLUTCH_URL = 'https://clutch.co/profile/ai-data-house';
const CLUTCH_RATING = '5.0';

// Below this width the hero content is taller than the viewport, so pinning it
// would trap the visitor in a very long scroll. Narrow screens fall back to a
// gentle auto-advance instead.
const PIN_MIN_WIDTH = 1024;
const FALLBACK_INTERVAL_MS = 7000;

/**
 * One scenario's visual, wrapped so the whole scenario is a single stacking
 * layer. Memoised because it must never re-render: these mount once, on page
 * load, and from then on only their opacity and transform change (see
 * useHeroScrollStory for why that matters).
 */
const VisualLayer = React.memo(function VisualLayer({
  scenario,
  active,
  layerRef,
}: {
  scenario: typeof HERO_SCENARIOS[number];
  active: boolean;
  layerRef: (el: HTMLDivElement | null) => void;
}) {
  const Visual = scenario.Visual;
  return (
    <div className={`flow-layer${active ? ' is-active' : ''}`} ref={layerRef}>
      <div className={`flow${scenario.animation ? ' flow-animation' : ''}`}>
        {scenario.animation ? <HeroHtmlAnimation {...scenario.animation} /> : Visual ? <Visual /> : null}
      </div>
    </div>
  );
});

const CopyLayer = React.memo(function CopyLayer({
  scenario,
  active,
  layerRef,
}: {
  scenario: typeof HERO_SCENARIOS[number];
  active: boolean;
  layerRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className={`hero-copy${active ? ' is-active' : ''}`} ref={layerRef}>
      <div className="badge">
        <span className="pulse-dot"><span></span></span>
        {scenario.eyebrow}
      </div>
      <h1>{scenario.heading}</h1>
      <p className="hero-sub">{scenario.description}</p>
    </div>
  );
});

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [wideEnough, setWideEnough] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const width = window.matchMedia(`(min-width: ${PIN_MIN_WIDTH}px)`);
    const sync = () => {
      setReduceMotion(motion.matches);
      setWideEnough(width.matches);
    };
    sync();
    motion.addEventListener?.('change', sync);
    width.addEventListener?.('change', sync);
    return () => {
      motion.removeEventListener?.('change', sync);
      width.removeEventListener?.('change', sync);
    };
  }, []);

  // The pinned scroll story is the desktop experience. Reduced-motion visitors
  // and narrow screens get the un-pinned hero instead (no tall scroll track).
  const pinned = wideEnough && !reduceMotion;

  const { trackRef, stickyRef, stackRef, actionsRef, ctaRef, clutchRef, setCopyRef, setVisualRef } = useHeroScrollStory({
    count: HERO_SCENARIOS.length,
    enabled: pinned,
    reduceMotion,
  });

  // Fallback only: when the hero is not pinned there is no scroll position to
  // read, so scenarios advance on a slow timer. This never runs alongside the
  // scroll story, so a timer can never fight the visitor's scroll position.
  const [fallbackIndex, setFallbackIndex] = useState(0);
  useEffect(() => {
    if (pinned || reduceMotion || HERO_SCENARIOS.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setFallbackIndex((i) => (i + 1) % HERO_SCENARIOS.length);
    }, FALLBACK_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [pinned, reduceMotion]);

  // Only meaningful off the pinned path; while pinned the hook drives the
  // layers directly and this value is ignored.
  const activeFallback = pinned ? -1 : fallbackIndex;

  const handleCtaClick = (label: string, href: string) => (e: React.MouseEvent) => {
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'Hero', label });
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      window.scrollTo(0, 0);
    } else if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div
      ref={trackRef}
      className={`hero-track${pinned ? ' is-pinned' : ''}`}
      style={pinned ? ({ ['--hero-steps' as string]: HERO_SCENARIOS.length }) : undefined}
    >
      <div className="hero-sticky" ref={stickyRef}>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              {/* Every scenario is rendered once and stays mounted, stacked in
                  a single grid cell so the block stays as tall as the longest
                  one. While pinned, each layer travels through the full sticky
                  hero viewport; the hero itself remains the containment edge. */}
              <div className="hero-copy-stack" ref={stackRef}>
                {HERO_SCENARIOS.map((s, i) => (
                  <CopyLayer
                    key={s.id}
                    scenario={s}
                    active={i === activeFallback}
                    layerRef={setCopyRef[i]}
                  />
                ))}
              </div>

              {/* CTAs and proof are one group, rendered once. While pinned the
                  scroll story rides it upward with scenario 1's copy and docks
                  the buttons at the top of the column for every scenario after,
                  retiring the Clutch badge on the way — all driven by the same
                  scroll position as the copy, so it reverses on the way back
                  up. Un-pinned (narrow / reduced motion) it just sits here. */}
              <div className="hero-actions" ref={actionsRef}>
                <div className="hero-cta" ref={ctaRef}>
                  <a
                    className="btn btn-primary"
                    href={HERO_PRIMARY_CTA.href}
                    onClick={handleCtaClick(HERO_PRIMARY_CTA.label, HERO_PRIMARY_CTA.href)}
                  >
                    {HERO_PRIMARY_CTA.label} <span className="arrow">→</span>
                  </a>
                  <a
                    className="btn btn-ghost"
                    href={HERO_SECONDARY_CTA.href}
                    onClick={handleCtaClick(HERO_SECONDARY_CTA.label, HERO_SECONDARY_CTA.href)}
                  >
                    {HERO_SECONDARY_CTA.label}
                  </a>
                </div>

                <a
                  className="hero-clutch"
                  ref={clutchRef}
                  href={CLUTCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${CLUTCH_RATING} out of 5 on Clutch, verified reviews — opens the AI Data House Clutch profile in a new tab`}
                >
                  <span className="hero-clutch-badge" aria-hidden="true">
                    <img src="/images/home/clutch-wordmark.png" alt="" loading="lazy" />
                  </span>
                  <span className="hero-clutch-rating" aria-hidden="true">{CLUTCH_RATING}</span>
                  <span className="hero-clutch-body">
                    <span className="hero-clutch-stars" aria-hidden="true">★★★★★</span>
                    <span className="hero-clutch-text">Verified reviews on <b>Clutch</b></span>
                  </span>
                  <span className="hero-clutch-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="flow-layers hero-flow-layers">
              {HERO_SCENARIOS.map((s, i) => (
                <VisualLayer
                  key={s.id}
                  scenario={s}
                  active={i === activeFallback}
                  layerRef={setVisualRef[i]}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeroSection;
