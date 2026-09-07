import React from 'react';
import { BadgeCheck, ExternalLink, Quote, Star } from 'lucide-react';
import { TECH_MARKS } from './techLogoData';
import {
  CLUTCH_REVIEWS_URL,
  SOURCE_LABEL,
  TESTIMONIALS,
  UPWORK_AGENCY_URL,
  type Testimonial,
} from './testimonialsData';

/** Filled stars for the rating the source actually published, out of five. */
const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="tst-stars" aria-label={`${rating} out of 5 rating`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={15}
        fill={index < rating ? 'currentColor' : 'none'}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    ))}
  </span>
);

/** Upwork's "Up" glyph, the same mark the credibility bar uses. */
const UpworkMark: React.FC = () => {
  const mark = TECH_MARKS['Upwork Glyph'];
  if (!mark) return null;
  return (
    <svg viewBox={mark.viewBox} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: mark.body }} />
  );
};

/** Initials, for reviews whose client publishes no logo. */
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

/**
 * One review. `clone` marks the copies the marquee needs to loop seamlessly:
 * they are visually identical but taken out of the tab order, and their
 * container is aria-hidden, so a keyboard or screen-reader user meets each
 * review exactly once.
 */
const ReviewCard: React.FC<{ item: Testimonial; clone?: boolean }> = ({ item, clone }) => {
  // Clutch names the client, Upwork only the contract — so each is announced by
  // whatever its source actually publishes.
  const subject = item.source === 'clutch' ? item.client : item.project;
  const releaseFocus = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.blur();
  };
  return (
  <a
    className={`testimonial-card tst-card tst-card-${item.source}`}
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={releaseFocus}
    tabIndex={clone ? -1 : undefined}
    aria-label={clone ? undefined : `Read the ${subject} review on ${SOURCE_LABEL[item.source]}`}
  >
    <span className="tst-card-head">
      <span className="testimonial-quote-icon" aria-hidden="true">
        <Quote size={19} strokeWidth={2.2} />
      </span>
      <span className={`tst-source tst-source-${item.source}`}>
        <span className="tst-source-mark" aria-hidden="true">
          {item.source === 'clutch'
            ? <img src="/images/home/clutch-wordmark.png" alt="" loading="lazy" />
            : <UpworkMark />}
        </span>
        <span className="tst-source-label">{SOURCE_LABEL[item.source]}</span>
      </span>
    </span>

    <p className="testimonial-quote">{item.quote}</p>
    {item.impact ? <p className="testimonial-impact">{item.impact}</p> : null}

    <span className="testimonial-foot">
      <span className="testimonial-logo">
        {item.logoSrc
          ? <img src={item.logoSrc} alt={`${item.client} logo`} loading="lazy" />
          : <span className="testimonial-initials" aria-hidden="true">{initialsOf(item.client)}</span>}
      </span>
      <span className="testimonial-person">
        <span className="testimonial-name">
          {item.reviewer}
          <BadgeCheck size={16} strokeWidth={2.3} aria-hidden="true" />
        </span>
        <span className="testimonial-role">{item.role}, {item.client}</span>
        <span className="testimonial-project">{item.project}</span>
      </span>
      <span className="testimonial-rating">
        <Stars rating={item.rating} />
        <span>{item.date}</span>
      </span>
    </span>
  </a>
  );
};

/**
 * How many copies of the set the track holds. The loop shifts by exactly one
 * set, so the seam is invisible whatever the count — but a short set has to be
 * repeated more times, or a wide monitor would run out of cards before the
 * cycle restarts.
 */
const setsFor = (count: number) => (count >= 6 ? 2 : count >= 4 ? 3 : 4);
/** Seconds of travel per card. Slow on purpose: this is a proof rail, not a ticker. */
const SECONDS_PER_CARD = 9;

const ReviewsMarquee: React.FC<{ items: Testimonial[] }> = ({ items }) => {
  const sets = setsFor(items.length);
  return (
    <div className="tst-marquee">
      <div
        className="tst-marquee-track"
        style={{
          // One set's worth of travel, as a share of the whole track.
          ['--tst-shift' as string]: `-${(100 / sets).toFixed(4)}%`,
          animationDuration: `${items.length * SECONDS_PER_CARD}s`,
        }}
      >
        {items.map((item) => (
          <ReviewCard key={`${item.source}-${item.project}`} item={item} />
        ))}
        {Array.from({ length: sets - 1 }).map((_, copy) => (
          <div className="tst-marquee-clone" key={`clone-${copy}`} aria-hidden="true">
            {items.map((item) => (
              <ReviewCard key={`${item.source}-${item.project}`} item={item} clone />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => (
  <section className="testimonials" aria-labelledby="testimonials-heading">
    <div className="wrap">
      <div className="testimonials-head">
        <div>
          <p className="eyebrow">Verified client reviews</p>
          <h2 id="testimonials-heading">What clients say after the system ships.</h2>
        </div>
        <div className="testimonials-sources">
          <a
            className="testimonials-source"
            href={CLUTCH_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Ai Data House reviews on Clutch in a new tab"
          >
            <img src="/images/home/clutch-wordmark.png" alt="" loading="lazy" />
            <span>5.0 on Clutch</span>
            <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
          </a>
          <a
            className="testimonials-source testimonials-source-upwork"
            href={UPWORK_AGENCY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the Ai Data House Upwork agency profile in a new tab"
          >
            <span className="tst-source-mark" aria-hidden="true"><UpworkMark /></span>
            <span>Top Rated on Upwork</span>
            <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>

    <ReviewsMarquee items={TESTIMONIALS} />
  </section>
);

export default TestimonialsSection;
