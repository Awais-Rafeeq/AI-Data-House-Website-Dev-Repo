export type ReviewSource = 'clutch' | 'upwork';

export interface Testimonial {
  /** Which platform the review was left on. Drives the card's badge and link. */
  source: ReviewSource;
  client: string;
  reviewer: string;
  role: string;
  project: string;
  quote: string;
  /** A second verbatim line, where the source publishes one. */
  impact?: string;
  /** Out of 5, exactly as the source states it. */
  rating: number;
  date: string;
  /** Client logo, where one is published. Cards fall back to initials without it. */
  logoSrc?: string;
  href: string;
}

export const CLUTCH_REVIEWS_URL = 'https://clutch.co/profile/ai-data-house#reviews';
export const UPWORK_AGENCY_URL = 'https://www.upwork.com/agencies/1531388452111929344/';

// Sourced from the public Ai Data House Clutch profile reviews.
export const CLUTCH_TESTIMONIALS: Testimonial[] = [
  {
    source: 'clutch',
    client: 'Apex Heat and A/C',
    reviewer: 'Reginald Lowe',
    role: 'Owner',
    project: 'AI Automation Development for HVAC Company',
    quote: "I'm very satisfied with their work.",
    impact: 'Automated business processes and streamlined workflows, saving 40+ hours each week.',
    rating: 5,
    date: 'Apr 23, 2026',
    logoSrc: '/images/home/apex-logo.webp',
    href: CLUTCH_REVIEWS_URL,
  },
  {
    source: 'clutch',
    client: 'Good Care Ventures',
    reviewer: 'Nelly David',
    role: 'Investor',
    project: 'AI Automation for Venture Capital Firm',
    quote: 'Ai Data House has delivered on time.',
    impact: 'Improved public-data collection and operating efficiency by 100%.',
    rating: 5,
    date: 'Apr 26, 2026',
    logoSrc: '/images/home/good-care-ventures-mark.svg',
    href: CLUTCH_REVIEWS_URL,
  },
  {
    source: 'clutch',
    client: 'Sinergizar',
    reviewer: 'Annette Schmidt',
    role: 'CEO',
    project: 'AI Consulting for Real Estate Marketing Firm',
    quote: 'They were very helpful.',
    impact: 'Completed Claude Code setup and basic training with smooth online communication.',
    rating: 5,
    date: 'Apr 28, 2026',
    logoSrc: '/images/home/sinergizar-wordmark.png',
    href: CLUTCH_REVIEWS_URL,
  },
];

/**
 * Work-history feedback published on the Ai Data House Upwork agency profile
 * (UPWORK_AGENCY_URL), read off the live page.
 *
 * Every field is copied from that page. Upwork does not publish client names
 * or companies on a public agency profile, so `reviewer`/`client` carry the
 * contract facts it does publish instead of a name — and no client logo
 * exists, so these cards render initials. `quote` and `impact` are contiguous,
 * verbatim sentences from the client's feedback; the Slack Bot review is long
 * enough that only part of it fits a card, so it is excerpted, never reworded.
 *
 * Only two of the three published contracts are here. The third
 * ("Spreadsheets as previous offer", 4.0, Jan 11 2024 - May 11 2026) carries a
 * rating but no written feedback, so there is nothing to quote.
 */
export const UPWORK_TESTIMONIALS: Testimonial[] = [
  {
    source: 'upwork',
    client: 'Fixed-price contract',
    reviewer: 'Upwork client',
    role: 'Verified hire',
    project: 'Slack Bot Automation',
    quote: 'Setup was clean, triggers were accurate, and zero false alerts after launch.',
    impact:
      'Fast turnaround, clear communication, and he documented the workflow so our team can maintain it.',
    rating: 5,
    date: 'Feb 6 - Apr 29, 2026',
    href: UPWORK_AGENCY_URL,
  },
  {
    source: 'upwork',
    client: 'Hourly contract',
    reviewer: 'Upwork client',
    role: 'Verified hire',
    project: 'Ongoing support',
    quote: 'Super easy to work with',
    rating: 5,
    date: 'Nov 15, 2025 - Jul 29, 2026',
    href: UPWORK_AGENCY_URL,
  },
];

/** Everything the reviews marquee shows, Clutch first. */
export const TESTIMONIALS: Testimonial[] = [...CLUTCH_TESTIMONIALS, ...UPWORK_TESTIMONIALS];

export const SOURCE_LABEL: Record<ReviewSource, string> = {
  clutch: 'Clutch',
  upwork: 'Upwork',
};
