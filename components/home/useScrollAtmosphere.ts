import { useEffect, useRef } from 'react';

/**
 * Drives a section's background "atmosphere" from the page's own scroll
 * position: a soft field that grows in as the section approaches, holds at full
 * strength while the content sits around the middle of the viewport, then
 * recedes as the section leaves. Scrolling back up reverses it, because the
 * value is *derived* from position rather than played on a timer.
 *
 * Built on the same primitives the hero scroll story already uses (see
 * useHeroScrollStory): a continuous rAF loop gated by an IntersectionObserver,
 * writing straight to the DOM rather than through React state, so a scroll
 * costs no renders. No library is involved.
 *
 * It writes two custom properties on the section:
 *
 *   --atm        0 → 1   overall intensity (opacity, expansion, spread)
 *   --atm-shift -1 → 1   signed position through the section, for parallax
 *
 * The stylesheet turns those into opacity/transform/clip-path with amplitudes
 * chosen per breakpoint, which is what keeps the effect tunable per device
 * without any of those numbers living in here.
 */

/**
 * Intensity envelope. `t` is the section's progress through the viewport:
 * 0 as its top reaches the bottom of the screen, 1 as its bottom leaves the
 * top. The ramps are deliberately asymmetric to the middle so there is a
 * genuine hold either side of centre rather than a single peak the eye can
 * catch as a spike.
 */
const IN_FROM = 0.06;
const IN_TO = 0.4;
const OUT_FROM = 0.62;
const OUT_TO = 0.96;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const ramp = (t: number, a: number, b: number) => smoothstep(clamp01((t - a) / (b - a)));

/** Trapezoid: rises in, holds across the middle, falls out. */
export const atmosphereAt = (t: number) =>
  ramp(t, IN_FROM, IN_TO) * (1 - ramp(t, OUT_FROM, OUT_TO));

/** Easing rate per second — light, just enough to take the edge off a flick. */
const DAMP = 11;
const EPSILON = 0.0005;

export function useScrollAtmosphere<T extends HTMLElement>(reduceMotion: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Reduced motion still gets the full gradient treatment — it is part of the
    // design, not decoration — just held at a constant, already-arrived state
    // with nothing scaling or drifting.
    if (reduceMotion) {
      el.style.setProperty('--atm', '0.92');
      el.style.setProperty('--atm-shift', '0');
      return () => {
        el.style.removeProperty('--atm');
        el.style.removeProperty('--atm-shift');
      };
    }

    let raf = 0;
    let lastTime = 0;
    let eased = -1; // < 0 → not initialised, snap on the first frame

    const targetAt = () => {
      const rect = el.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      if (span <= 0) return 0;
      // 0 when the section's top is at the bottom edge of the viewport,
      // 1 once its bottom has passed the top edge.
      return clamp01((window.innerHeight - rect.top) / span);
    };

    const write = (t: number) => {
      el.style.setProperty('--atm', atmosphereAt(t).toFixed(4));
      // -1 before centre, +1 after, for a gentle counter-drift.
      el.style.setProperty('--atm-shift', (t * 2 - 1).toFixed(4));
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const target = targetAt();
      if (eased < 0) {
        eased = target;
      } else {
        const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
        eased += (target - eased) * (1 - Math.exp(-DAMP * dt));
        if (Math.abs(target - eased) < EPSILON) eased = target;
      }
      lastTime = now;
      write(eased);
    };

    const start = () => { if (!raf) { lastTime = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else {
            stop();
            // Settle on the exact end state so the field is never left mid-fade
            // once the section is off screen.
            write(targetAt());
          }
        },
        { rootMargin: '25% 0px' },
      );
      io.observe(el);
    } else {
      start();
    }

    write(targetAt());

    return () => {
      stop();
      io?.disconnect();
      el.style.removeProperty('--atm');
      el.style.removeProperty('--atm-shift');
    };
  }, [reduceMotion]);

  return ref;
}
