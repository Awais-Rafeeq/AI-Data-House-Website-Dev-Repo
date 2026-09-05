// Named, outcome-led "systems" — the buyer-facing product layer on the homepage.
// Each system maps to one existing solution page (SEO stays intact underneath).
// Sell the outcome, never the tech (Afroze Khan rule). No prices on the homepage:
// price surfaces on the call / solution page. See closer/productized-packages.md.

export interface SystemCard {
  name: string;          // the outcome name the buyer sees
  icon: string;          // reuses SOLUTION_ICONS keys in HomePage.tsx
  forWho: string;        // eyebrow: who it is for
  pain: string;          // the pain in the buyer's own words (shown as a quote)
  promise: string;       // the outcome they buy
  href: string;          // links to the existing solution page (SEO)
  hub?: boolean;         // Pipeline Command renders as a full-width band
  inside?: string[];     // hub only: what is inside
  connect?: string;      // hub only: how it plugs into the other systems
}

export const SYSTEMS: SystemCard[] = [
  {
    name: 'Lead Rescue System',
    icon: 'phone-call',
    forWho: 'For local service businesses',
    pain: 'We miss calls when we’re on the job. By the time we call back, they’ve booked someone else.',
    promise: 'Stop losing 2–3 jobs a day to slow response. Recover the calls you already paid for.',
    href: '/solutions/ai-voice-agents',
  },
  {
    name: 'Ops Autopilot',
    icon: 'zap',
    forWho: 'For founders buried in the day-to-day',
    pain: 'If I step away for a month, the business stops. Everything runs through me.',
    promise: 'Take the business off your own back. Systems run the work, you run the company.',
    href: '/solutions/ai-workflow-automation',
  },
  {
    name: 'Decision Dashboard',
    icon: 'bar-chart',
    forWho: 'For operators deciding on gut',
    pain: 'I have data everywhere and still can’t see what’s actually working.',
    promise: 'See your whole business in one view. Decide on numbers, not gut.',
    href: '/solutions/data-dashboards-reporting',
  },
  {
    name: 'Business OS',
    icon: 'layers',
    forWho: 'For teams running on spreadsheets',
    pain: 'My team, inventory, orders — it’s all scattered. I need one place.',
    promise: 'One system your whole team runs on. Owned by you, built to grow.',
    href: '/solutions/internal-web-apps',
  },
  {
    name: 'Pipeline Command',
    icon: 'target',
    forWho: 'The hub that connects them all',
    pain: 'Leads come from everywhere — Instagram, the website, referrals — and half of them fall through the cracks.',
    promise: 'Every lead in one place, qualified and worked. Nothing slips through the cracks.',
    href: '/solutions/crm-lead-automation',
    hub: true,
    inside: [
      'Every lead from every channel into one pipeline — social, website, forms, referrals',
      'Auto-qualified, so your team only spends time on the real ones',
      'Automatic nurture, so no lead ever goes cold',
      'An AI calling agent works each lead the moment it lands',
    ],
    connect: 'Plugs straight into Lead Rescue — the second a lead hits the pipeline, the calling agent picks it up. One funnel in, every system above working it.',
  },
];
