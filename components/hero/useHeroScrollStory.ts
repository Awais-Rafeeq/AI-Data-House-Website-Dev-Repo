import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

/**
 * Scroll-driven story controller for the hero.
 *
 * A tall outer track provides the scroll distance; the hero inside it is
 * `position: sticky` so it stays pinned while that distance is consumed. The
 * story position is *derived* from the track's position in the viewport, which
 * is what makes scrolling back up walk the scenarios backwards for free and
 * keeps the browser's own scrolling completely untouched.
 *
 * Three things make it smooth under a fast flick, all of them copied from how
 * lite.ego.app builds the same effect:
 *
 *  1. EVERY scenario layer is mounted up front and stays mounted. The previous
 *     version rendered one scenario at a time, so crossing a band boundary made
 *     React swap the component and remount a whole SVG (SMIL `animateMotion`
 *     included). Flicking through five scenarios meant five remounts back to
 *     back, which is what made fast scrolling stutter. Now nothing mounts,
 *     unmounts or reflows while scrolling — only opacity and transform change.
 *
 *  2. Nothing goes through React state while scrolling. Styles are written
 *     straight to the layer nodes from the animation loop, so a fast scroll
 *     costs no renders at all.
 *
 *  3. A continuous rAF loop, not a scroll listener. Scroll events are delivered
 *     irregularly (and can coalesce badly during a fast flick), so driving
 *     paint from them makes motion arrive in lumps. The loop instead eases the
 *     rendered position toward the scroll-derived target every frame with
 *     frame-rate-independent damping, so a flick glides to its destination and
 *     a slow scroll still tracks the finger exactly.
 *
 * Nothing is hardcoded to a scenario count: the track's height comes from
 * `count` (see .hero-track in home-redesign.css), so adding scenarios
 * lengthens the story automatically.
 *
 * The CTA group is part of the same single scroll state. It starts where the
 * design puts it — under scenario 1's copy, with the Clutch badge below it —
 * rides upward with that copy as the story starts, and docks at the top of the
 * column for every scenario after, with the copy window scrolling underneath
 * it. See the docking block in `paint` for the geometry that keeps the two from
 * ever overlapping. Nothing is measured in scenario counts or timers, so the
 * whole move runs backwards on the way up without a second code path.
 */
interface HeroScrollStoryOptions {
  count: number;
  /** Pinned scroll-story on (desktop, motion allowed) or fallback mode off. */
  enabled: boolean;
  reduceMotion: boolean;
}

/**
 * Cross-fade half-widths, in scenario units (neighbours are 1.0 apart). The two
 * columns want opposite treatments:
 *
 *  - The copy is a vertical STACK inside a clipping window: each scenario is a
 *    full window-height apart, so at the hand-off the outgoing text is halfway
 *    out of the top and the incoming is halfway in from the bottom. They never
 *    occupy the same space, so the fade can stay wide (0.95 keeps both near 45%
 *    mid-transition) and the eye reads travel rather than a dissolve.
 *
 *  - The visuals slide only a little sideways, so they DO overlap in the panel.
 *    A tight fade (0.70 → ~20% each at the hand-off) keeps their numbers from
 *    ghosting through each other, which a wider value demonstrably did.
 */
const COPY_FADE = 0.95;
const VISUAL_FADE = 0.7;
/**
 * Horizontal travel of a scenario visual across one scenario. The incoming
 * panel enters from the right and the outgoing leaves to the left; `.flow`
 * clips them, so they slide in and out of the panel's own edge.
 */
const VISUAL_SLIDE = 56;
/**
 * Share of the first transition over which the Clutch badge fades out. It has
 * to be gone before the CTA row finishes docking, because the badge's own slot
 * ends up underneath the incoming scenario's copy window.
 */
const CLUTCH_FADE = 0.42;
/** Extra upward drift the badge takes on as it fades, so it leaves rather than blinks. */
const CLUTCH_SLIDE = 10;
/**
 * Easing rate, per second. Higher tracks the scrollbar more literally; lower
 * glides more. ~9 settles a fast flick in about a quarter of a second.
 */
const DAMP = 9;
/** Below this the eased value has arrived; snap and stop accumulating error. */
const EPSILON = 0.0004;
/**
 * Share of the track held at each end, on the first and last scenario. Without
 * it the last scenario would only be fully readable on the final pixel of the
 * track, the instant before the hero unpins. The tail is the longer of the two
 * on purpose: it is what turns the release into the next section from a snap
 * into a settle, because the last scenario has finished moving well before the
 * sticky hero reaches the bottom of its track.
 */
const HOLD_START = 0.08;
const HOLD_END = 0.14;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smoothstep = (t: number) => t * t * (3 - 2 * t);
/** Track progress (0→1) to continuous scenario position (0→count-1). */
const toPosition = (progress: number, span: number) =>
  clamp01((progress - HOLD_START) / (1 - HOLD_START - HOLD_END)) * span;

export function useHeroScrollStory({ count, enabled, reduceMotion }: HeroScrollStoryOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<Array<HTMLElement | null>>([]);
  const visualRefs = useRef<Array<HTMLElement | null>>([]);
  /** The stacked copy layers; travel is measured from the sticky hero viewport. */
  const stackRef = useRef<HTMLDivElement>(null);
  /** The full sticky viewport the left copy travels through while pinned. */
  const stickyRef = useRef<HTMLDivElement>(null);
  /** CTA + Clutch group, which docks to the top across the first transition. */
  const actionsRef = useRef<HTMLDivElement>(null);
  /** The button row alone — measured, so the copy window knows how far to drop. */
  const ctaRef = useRef<HTMLDivElement>(null);
  /** The Clutch badge, which leaves once the buttons have docked. */
  const clutchRef = useRef<HTMLAnchorElement>(null);

  // Stable callback refs, so React does not detach/reattach them on re-render.
  const setCopyRef = useMemo(
    () => Array.from({ length: count }, (_, i) => (el: HTMLElement | null) => { copyRefs.current[i] = el; }),
    [count],
  );
  const setVisualRef = useMemo(
    () => Array.from({ length: count }, (_, i) => (el: HTMLElement | null) => { visualRefs.current[i] = el; }),
    [count],
  );

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const eachLayer = (fn: (el: HTMLElement) => void) => {
      copyRefs.current.forEach((el) => el && fn(el));
      visualRefs.current.forEach((el) => el && fn(el));
    };
    const clearInline = () => {
      eachLayer((el) => {
        el.style.removeProperty('opacity');
        el.style.removeProperty('transform');
        el.style.removeProperty('pointer-events');
        el.removeAttribute('aria-hidden');
      });
      actionsRef.current?.style.removeProperty('transform');
      actionsRef.current?.style.removeProperty('opacity');
      actionsRef.current?.style.removeProperty('visibility');
      actionsRef.current?.style.removeProperty('pointer-events');
      actionsRef.current?.removeAttribute('aria-hidden');
      stackRef.current?.style.removeProperty('transform');
      const clutch = clutchRef.current;
      if (clutch) {
        clutch.style.removeProperty('opacity');
        clutch.style.removeProperty('--clutch-shift');
        clutch.style.removeProperty('visibility');
        clutch.style.removeProperty('pointer-events');
        clutch.removeAttribute('aria-hidden');
      }
    };

    if (!enabled) {
      // Hand styling back to the stylesheet for the un-pinned fallback.
      clearInline();
      return undefined;
    }

    const span = Math.max(count - 1, 1);
    let raf = 0;
    let lastTime = 0;
    let eased = -1; // < 0 means "not initialised yet": snap on the first frame
    let shownIndex = -1;
    let clutchGone = false;

    /**
     * One scenario's worth of vertical travel for the copy: nearly the full
     * sticky hero viewport, so incoming copy starts near the hero's lower
     * boundary and outgoing copy leaves through the upper boundary.
     */
    let step = 0;
    /**
     * How far the CTA group rises to dock at the top of the column. It sits
     * directly under the copy window in the flow, so the window's own height is
     * exactly the distance from its resting position to the column's top edge.
     */
    let dock = 0;
    /**
     * How far the copy window drops to clear the docked buttons: the button
     * row's height plus the gap the design already puts under it. Taking the
     * gap from the computed margin keeps this in step with the stylesheet
     * instead of duplicating a number that could drift.
     */
    let clearance = 0;
    const measure = () => {
      const stack = stackRef.current;
      const sticky = stickyRef.current;
      step = (sticky?.clientHeight || window.innerHeight) * 0.92;
      dock = stack?.offsetHeight || 0;
      const cta = ctaRef.current;
      clearance = cta
        ? cta.offsetHeight + (parseFloat(window.getComputedStyle(cta).marginBottom) || 0)
        : 0;
    };

    /** Write one frame of the story at continuous position `pos` (0 → count-1). */
    const paint = (pos: number) => {
      for (let i = 0; i < count; i++) {
        // d > 0 : this scenario is behind us and travelling up out of the
        // window. d < 0 : still below, waiting to come up into view.
        const d = pos - i;
        const copy = copyRefs.current[i];
        const visual = visualRefs.current[i];
        if (copy) {
          copy.style.opacity = String(smoothstep(clamp01(1 - Math.abs(d) / COPY_FADE)));
          // The whole stack slides upward as the story advances, so the next
          // scenario's eyebrow/headline/sub rise into the window from below and
          // the previous one returns from above when scrolling back.
          copy.style.transform = `translate3d(0, ${(-d * step).toFixed(2)}px, 0)`;
        }
        if (visual) {
          visual.style.opacity = String(smoothstep(clamp01(1 - Math.abs(d) / VISUAL_FADE)));
          // Enters from the right, leaves to the left, in step with the copy.
          visual.style.transform = `translate3d(${(-d * VISUAL_SLIDE).toFixed(2)}px, 0, 0)`;
        }
      }

      // ── CTA docking ────────────────────────────────────────────────────
      // Across the first transition only (and linearly, not eased), the CTA
      // group rises the full height of the copy window while the copy window
      // itself drops far enough to clear the buttons. Linear is deliberate: it
      // makes the buttons travel in lockstep with the first scenario's copy, so
      // the move reads as one connected piece of content leaving rather than as
      // a separate widget animating. Two consequences fall out of the geometry
      // and are what keep the buttons from ever sitting on top of the text:
      //
      //   - the buttons ride exactly at the outgoing scenario's bottom edge, so
      //     they are always below its last line;
      //   - once docked, the window's top edge sits a full gap BELOW the
      //     buttons, so from scenario 2 on the copy is clipped away before it
      //     can reach them — the text genuinely scrolls under the buttons.
      //
      // Because it is derived from `pos` and nothing else, scrolling back up
      // undocks the buttons along the identical path.
      const swap = clamp01(pos);
      const actions = actionsRef.current;
      if (actions) {
        actions.style.transform = `translate3d(0, ${(-dock * swap).toFixed(2)}px, 0)`;
      }
      const stack = stackRef.current;
      if (stack) {
        stack.style.transform = `translate3d(0, ${(clearance * swap).toFixed(2)}px, 0)`;
      }

      // The Clutch badge belongs to scenario 1 only: its slot ends up under the
      // incoming copy window, so it leaves early in the swap and comes back on
      // the way up.
      const clutch = clutchRef.current;
      if (clutch) {
        const gone = smoothstep(clamp01(swap / CLUTCH_FADE));
        const hidden = gone >= 1;
        if (actions) {
          actions.style.opacity = String(1 - gone);
          actions.style.visibility = hidden ? 'hidden' : 'visible';
          actions.style.pointerEvents = hidden ? 'none' : 'auto';
          actions.setAttribute('aria-hidden', hidden ? 'true' : 'false');
        }
        clutch.style.opacity = String(1 - gone);
        // Written as a custom property rather than `transform` so the badge's
        // own hover lift still composes with it (see .hero-clutch while pinned).
        clutch.style.setProperty('--clutch-shift', `${(-CLUTCH_SLIDE * gone).toFixed(2)}px`);
        // Discrete, so it is not written every frame: once invisible the badge
        // leaves the a11y tree and stops taking the pointer.
        if (hidden !== clutchGone) {
          clutchGone = hidden;
          clutch.style.visibility = hidden ? 'hidden' : 'visible';
          clutch.style.pointerEvents = hidden ? 'none' : 'auto';
          clutch.setAttribute('aria-hidden', hidden ? 'true' : 'false');
        }
      }

      // Discrete bookkeeping — only when the nearest scenario actually changes,
      // never per frame. Keeps the invisible layers out of the a11y tree and
      // out of the way of the pointer.
      const nearest = Math.min(count - 1, Math.max(0, Math.round(pos)));
      if (nearest !== shownIndex) {
        shownIndex = nearest;
        for (let i = 0; i < count; i++) {
          const on = i === nearest;
          const copy = copyRefs.current[i];
          const visual = visualRefs.current[i];
          if (copy) {
            copy.setAttribute('aria-hidden', on ? 'false' : 'true');
            copy.style.pointerEvents = on ? 'auto' : 'none';
          }
          if (visual) visual.setAttribute('aria-hidden', on ? 'false' : 'true');
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;

      const target = toPosition(-rect.top / travel, span);

      if (eased < 0) {
        eased = target; // first frame: no glide in from nowhere
      } else {
        const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
        // Exponential decay toward the target. Framing it this way (rather than
        // a fixed per-frame fraction) keeps the feel identical at 60Hz and
        // 144Hz, and after a dropped frame.
        eased += (target - eased) * (1 - Math.exp(-DAMP * dt));
        if (Math.abs(target - eased) < EPSILON) eased = target;
      }
      lastTime = now;
      paint(eased);
    };

    const start = () => {
      if (!raf) { lastTime = 0; raf = requestAnimationFrame(frame); }
    };
    const stop = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };

    // The loop only runs while the track is anywhere near the viewport, so the
    // rest of the page scrolls with nothing of ours on the main thread.
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else {
            stop();
            // Settle on the exact end state so a layer is never left mid-fade.
            const rect = track.getBoundingClientRect();
            const travel = rect.height - window.innerHeight;
            if (travel > 0) paint(toPosition(-rect.top / travel, span));
          }
        },
        { rootMargin: '120px 0px' },
      );
      io.observe(track);
    } else {
      start();
    }

    // The sticky viewport, stack, and button row can all change with viewport
    // size and font loading, so keep the geometry measured.
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(() => {
        measure();
        if (eased >= 0) paint(eased);
      });
      if (stickyRef.current) ro.observe(stickyRef.current);
      if (stackRef.current) ro.observe(stackRef.current);
      // The button row is measured too, and can reflow on its own (font
      // loading, a label wrapping), so watch it as well.
      if (ctaRef.current) ro.observe(ctaRef.current);
    }

    // Paint once immediately so the hero is correct before the first frame.
    measure();
    const rect = track.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    paint(travel > 0 ? toPosition(-rect.top / travel, span) : 0);

    return () => {
      stop();
      io?.disconnect();
      ro?.disconnect();
      clearInline();
    };
  }, [enabled, count]);

  /** Jump the page to a scenario's resting position. Only meaningful while
   *  pinned; off that path the caller owns which scenario is showing. */
  const goToScenario = useCallback((index: number) => {
    const track = trackRef.current;
    if (!enabled || !track) return;
    const rect = track.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 0) return;
    const trackTop = rect.top + window.scrollY;
    // Inverse of toPosition(): land in the middle of that scenario's dwell.
    const progress = HOLD_START + (index / Math.max(count - 1, 1)) * (1 - HOLD_START - HOLD_END);
    const target = trackTop + progress * travel;
    // 'instant' rather than 'auto': the site sets `scroll-behavior: smooth`
    // globally, and 'auto' would inherit it.
    window.scrollTo({ top: target, behavior: reduceMotion ? 'instant' : 'smooth' });
  }, [enabled, count, reduceMotion]);

  return { trackRef, stickyRef, stackRef, actionsRef, ctaRef, clutchRef, setCopyRef, setVisualRef, goToScenario };
}
