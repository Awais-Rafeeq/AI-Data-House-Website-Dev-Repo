import React, { useEffect, useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { sendToN8n, ACTIONS } from '../../lib/n8n';
import { REELS, YOUTUBE_CHANNEL_URL, reelThumb, reelEmbed, reelWatch } from './reelsData';
import { useScrollAtmosphere } from './useScrollAtmosphere';

/**
 * Horizontally running strip of vertical Short cards, in the same seamless
 * marquee mechanism the technology stack uses: the list is rendered twice and
 * the track animates to translateX(-50%), so the second copy lands exactly
 * where the first began and the loop never jumps.
 *
 * Cards show YouTube's vertical thumbnail until clicked; only then does an
 * iframe mount. Ten embeds on load would cost far more than ten images, and
 * nothing would autoplay anyway.
 */
const ReelCard: React.FC<{
  reel: typeof REELS[number];
  playing: boolean;
  onPlay: (id: string, title: string) => void;
  duplicate?: boolean;
}> = ({ reel, playing, onPlay, duplicate }) => (
  <div className="reel-card" aria-hidden={duplicate || undefined}>
    <div className="reel-media">
      {playing ? (
        <iframe
          className="reel-frame"
          src={reelEmbed(reel.id)}
          title={reel.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="reel-open"
          onClick={() => onPlay(reel.id, reel.title)}
          tabIndex={duplicate ? -1 : undefined}
          aria-label={`Play: ${reel.title}`}
        >
          <img src={reelThumb(reel.id)} alt="" loading="lazy" />
          {/* Scrim + overlaid topic chip: the card carries its own context, so
              only the title needs to sit underneath it. */}
          <span className="reel-scrim" aria-hidden="true" />
          <span className="reel-topic" aria-hidden="true">{reel.topic}</span>
          <span className="reel-play" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
          <span className="reel-watch" aria-hidden="true">Watch</span>
        </button>
      )}
    </div>
    <p className="reel-name">{reel.title}</p>
  </div>
);

const ReelsSection: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  // Background atmosphere follows the page's scroll position; nothing here is
  // on a timer, and scrolling back up unwinds it.
  const atmosphereRef = useScrollAtmosphere<HTMLElement>(reduceMotion);

  const handlePlay = (id: string, title: string) => {
    setPlayingId(id);
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'Field notes', label: `Short: ${title}`.slice(0, 48) });
  };

  return (
    <section className="reels" ref={atmosphereRef}>
      {/* Scroll-driven background field. Three soft layers rather than one flat
          gradient, all of them fading to nothing at their own edges, so the
          section never resolves into a coloured rectangle against the white
          page. Purely decorative. */}
      <div className="reel-atmos" aria-hidden="true">
        <span className="reel-atmos-field" />
        <span className="reel-atmos-core" />
        <span className="reel-atmos-warm" />
      </div>

      {/* One clipped stage holds the heading, the card strip and the footer
          together. The clip is what widens and narrows with scroll, so the
          reels are genuinely contained by the surface: as it closes, the strip
          is cut off at the rounded edge rather than running out past it. */}
      <div className="reel-stage">
        <span className="reel-stage-bg" aria-hidden="true" />

        <div className="wrap">
          <div className="sec-head center">
            <h2>What we learn building these systems, 60 seconds at a time.</h2>
            <p>
              Short, unpolished notes from the work itself - what we ship, what we would not
              automate yet, and which tools actually survive a client project.
            </p>
          </div>
        </div>

        {/* Wider than the stage on purpose: the strip is trimmed by the stage's
            own edge, which is what makes the container read as holding it. */}
        <div className="reel-marquee" aria-label="Shorts from our YouTube channel">
          <div className="reel-track">
            {REELS.map((r) => (
              <ReelCard key={r.id} reel={r} playing={playingId === r.id} onPlay={handlePlay} />
            ))}
            {!reduceMotion && REELS.map((r) => (
              <ReelCard key={`dup-${r.id}`} reel={r} playing={false} onPlay={handlePlay} duplicate />
            ))}
          </div>
        </div>

        <div className="wrap">
          <div className="reel-foot">
            <a
              className="reel-all"
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sendToN8n(ACTIONS.CTA_CLICK, { location: 'Field notes', label: 'All shorts on YouTube' })}
            >
              Watch all on YouTube <ArrowRight size={15} />
            </a>
            {playingId && (
              <a className="reel-all reel-all-quiet" href={reelWatch(playingId)} target="_blank" rel="noopener noreferrer">
                Open this one on YouTube <ArrowRight size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;
