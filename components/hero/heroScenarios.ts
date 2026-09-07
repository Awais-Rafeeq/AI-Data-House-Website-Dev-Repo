import type { ComponentType } from 'react';
import type { HeroAnimationAsset } from './HeroHtmlAnimation';
import HeroQualifyVisual from './HeroQualifyVisual';
import HeroSupportVisual from './HeroSupportVisual';
import HeroSyncVisual from './HeroSyncVisual';
import HeroReportingVisual from './HeroReportingVisual';

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroScenario {
  id: string;
  /** Short uppercase label shown in the badge above the headline. */
  eyebrow: string;
  /** The business problem the visual on the right dramatizes. */
  heading: string;
  /** How AI Data House solves it, and the outcome. */
  description: string;
  /**
   * Right-side animation for this scenario — exactly one of the two below.
   * `Visual` is a React component (the original, hand-built scenarios).
   * `animation` points at a pre-built, self-contained HTML file under
   * /public/hero-animations (see HeroHtmlAnimation) for scenarios whose
   * visual is authored outside React. Adding scenario 06+ with its own HTML
   * animation is then just a new file plus one `animation` entry here — no
   * component or markup changes.
   */
  Visual?: ComponentType;
  animation?: HeroAnimationAsset;
}

// The CTAs and the Clutch badge stay identical across scenarios on purpose:
// only the story (eyebrow / heading / description / visual) changes as the
// visitor scrolls, so the conversion actions never move under their cursor.
export const HERO_PRIMARY_CTA: HeroCta = { label: 'Book a 30-Min Founder Call', href: '/contact' };
// Points at the case studies section — the old #proof section it used to
// target was replaced by it.
export const HERO_SECONDARY_CTA: HeroCta = { label: 'See real results', href: '#case-studies' };

// One source of truth for the hero scroll story. The active index is derived
// from scroll progress and drives BOTH the left copy and the right visual, so
// they can never drift apart. Add scenario 06+ by appending an entry here (and
// a Visual component beside this file) — the scroll track lengthens itself and
// the progress indicator picks it up automatically.
//
// Write every heading as the *business problem* the visual demonstrates, and
// the description as the solution and outcome. Never generic hero copy.
export const HERO_SCENARIOS: HeroScenario[] = [
  {
    id: 'lead-automation-make-inspired',
    eyebrow: 'Lead Automation',
    heading: 'A new lead should not wait for a human handoff.',
    description: 'AI Data House turns every form fill into a live workflow: CRM saved, AI call started, meeting booked, notes updated, and your team notified.',
    animation: {
      src: '/hero-animations/make-inspired-lead-automation.html',
      title: 'Automated lead workflow from Facebook lead to CRM, AI call, appointment booking, saved notes and email notification',
    },
  },
  {
    id: 'speed-to-lead',
    eyebrow: 'Speed to Lead',
    heading: 'Leads go cold before anyone replies.',
    description: 'AI answers, qualifies, and books every inbound lead in under two minutes — day, night, and weekends.',
    animation: {
      src: '/hero-animations/speed-to-lead.html',
      title: 'Automated lead journey from Facebook ad through GoHighLevel and n8n to a Vapi call, booked appointment, CRM notes and email notifications',
    },
  },
  {
    id: 'lead-qualification',
    eyebrow: 'Lead Qualification',
    heading: 'Your reps are chasing leads that never buy.',
    description: 'Every lead is scored on real intent the moment it lands, so sales only works the ones ready to close.',
    Visual: HeroQualifyVisual,
  },
  {
    id: 'ai-support',
    eyebrow: 'AI Customer Support',
    heading: 'The same questions, answered all day.',
    description: 'An AI agent trained on your business clears repeat questions across chat, WhatsApp, and email in seconds.',
    Visual: HeroSupportVisual,
  },
  {
    id: 'system-integration',
    eyebrow: 'System Integration',
    heading: 'Eight tools that refuse to talk to each other.',
    description: 'We wire your CRM, billing, and ops into one synced system, so a record entered once is right everywhere.',
    Visual: HeroSyncVisual,
  },
  {
    id: 'reporting-automation',
    eyebrow: 'Reporting Automation',
    heading: 'Monday starts by rebuilding the same report.',
    description: 'Your numbers assemble themselves overnight and land as a live dashboard before you open your laptop.',
    Visual: HeroReportingVisual,
  },
];
