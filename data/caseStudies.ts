// Case study detail content. Anonymized per NDA guidance in the PRD.
// Numbers drawn from the proof anchors in the solution + industry copy.

export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  image: string;
  metaDescription: string;
  client: string;
  companySize: string;
  duration: string;
  summary: string;
  challenge: string[];
  baseline: { label: string; value: string }[];
  solution: string[];
  tools: string[];
  results: { metric: string; before: string; after: string }[];
  quote?: { text: string; author: string; role: string };
  relatedSolution: { label: string; slug: string };
  // Condensed copy for the homepage preview card. Keeps the homepage and the
  // detail page in sync so links can never drift apart again.
  homeCard: { badge: string; problem: string; system: string; result: string; metric: string };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'real-estate-speed-to-lead',
    title: 'Real Estate Team Cuts Lead Response From 47 Minutes to 90 Seconds',
    industry: 'Real Estate',
    image: '/images/industries/industry-real-estate.png',
    metaDescription:
      'A 4-agent real estate team generating 200+ leads/month reclaimed 8 hours a week and recovered overnight leads with speed-to-lead and follow-up automation.',
    client: 'Confidential, Real Estate Brokerage, USA',
    companySize: '4 agents · 200+ leads/month',
    duration: '3 weeks',
    summary:
      'A real estate team was spending 18 hours a week combined on manual CRM entry, scheduling, and follow-up, and losing leads that came in overnight. We built speed-to-lead and follow-up automation that responds in 90 seconds, any hour.',
    challenge: [
      'New leads from Zillow, Facebook Lead Ads, and website forms landed in different inboxes and were entered into the CRM by hand.',
      'Average response time was 47 minutes, well past the window where leads convert at 21x the rate.',
      'Leads that arrived after 6pm sat untouched until the next morning, by which point they had already spoken to two other agents.',
    ],
    baseline: [
      { label: 'Avg response time', value: '47 min' },
      { label: 'Weekly manual hours', value: '18 hrs' },
      { label: 'Overnight leads', value: 'Lost' },
    ],
    solution: [
      'Built a single intake hub in n8n that captures every lead from every source and creates a tagged CRM record in under 90 seconds.',
      'Automated first-touch SMS and a conditional 4-step follow-up sequence that stops the moment a lead responds or books.',
      'Added a Slack notification with the full lead profile so agents only have to respond, and a Sunday-evening automated pipeline report.',
    ],
    tools: ['n8n', 'GoHighLevel', 'Twilio', 'Calendly', 'Slack'],
    results: [
      { metric: 'Lead response time', before: '47 minutes', after: '90 seconds' },
      { metric: 'Weekly manual hours', before: '18 hrs', after: '10 hrs' },
      { metric: 'Overnight leads', before: 'Lost', after: 'Captured 24/7' },
      { metric: 'Attributed deals (month 1)', before: ', ', after: '2 recovered' },
    ],
    quote: { text: 'Two deals in the first month came from leads that would have gone cold overnight under the old system.', author: 'Director', role: 'Real Estate Brokerage' },
    relatedSolution: { label: 'CRM & Lead Automation', slug: 'crm-lead-automation' },
    homeCard: {
      badge: 'Real Estate · USA',
      problem: 'Leads from Zillow and forms entered by hand, 47-minute response time, overnight leads lost',
      system: 'Speed-to-lead + follow-up automation (n8n + GoHighLevel)',
      result: 'Lead response cut from 47 minutes to 90 seconds',
      metric: '8 hrs/week reclaimed · 2 deals recovered in month 1',
    },
  },
  {
    slug: 'ecommerce-order-fulfillment',
    title: 'E-Commerce Brand Scales From 120 to 200 Orders a Day Without New Hires',
    industry: 'E-Commerce',
    image: '/images/industries/industry-ecommerce.png',
    metaDescription:
      'A Shopify + Amazon brand reclaimed 18 of 22 weekly hours and dropped human-handled support 71% with order-to-fulfillment, inventory, and AI support automation.',
    client: 'Confidential, E-Commerce Brand, USA',
    companySize: '6-person team · 120 orders/day',
    duration: '5 weeks',
    summary:
      'An e-commerce brand selling on Shopify and Amazon was burning 22 hours a week on order communication, inventory updates, and customer support. We automated the backend so it could scale as fast as the ads.',
    challenge: [
      'Staff manually relayed orders between the store and the fulfillment team, and copied tracking numbers back into Shopify.',
      'Inventory was checked by hand every morning; high-velocity SKUs still went out of stock.',
      'The support inbox carried 140+ messages a week, the majority asking "where is my order?"',
    ],
    baseline: [
      { label: 'Weekly manual hours', value: '22 hrs' },
      { label: 'Order errors', value: 'Frequent' },
      { label: 'Support volume', value: '140+/wk' },
    ],
    solution: [
      'Built an order-to-fulfillment pipeline: Shopify webhook → inventory check → fulfillment task → tracking sync → customer notification, with zero manual steps.',
      'Added an inventory intelligence sweep that alerts purchasing before a SKU runs out, with velocity and days-to-stockout.',
      'Deployed an AI support agent on live order data that handles status, returns, and shipping questions and escalates only edge cases.',
    ],
    tools: ['n8n', 'Shopify API', 'Botpress', 'OpenAI', 'Klaviyo', 'Looker Studio'],
    results: [
      { metric: 'Order processing errors', before: 'Frequent', after: 'Zero' },
      { metric: 'Human-handled support', before: '100%', after: '29%' },
      { metric: 'Weekly hours reclaimed', before: ', ', after: '18 of 22' },
      { metric: 'Daily order volume', before: '120', after: '200 (no new hires)' },
    ],
    quote: { text: 'We scaled to 6x our previous order velocity without adding a single new person to the team.', author: 'COO', role: 'E-Commerce Brand' },
    relatedSolution: { label: 'AI Workflow Automation', slug: 'ai-workflow-automation' },
    homeCard: {
      badge: 'E-Commerce · USA',
      problem: 'Orders relayed by hand, recurring stockouts, 140+ support messages a week',
      system: 'Order-to-fulfillment pipeline + AI support agent (Shopify + n8n)',
      result: 'Scaled from 120 to 200 orders a day with no new hires',
      metric: 'Human-handled support dropped from 100% to 29%',
    },
  },
  {
    slug: 'restaurant-ai-voice-agent',
    title: 'Fine Dining Restaurant Recovers $14K in a Month by Answering Every Call',
    industry: 'Restaurants',
    image: '/images/industries/industry-restaurants.png',
    metaDescription:
      'A US fine-dining restaurant missing 15-20 calls a day deployed an AI voice agent that handled 440 calls and booked 127 reservations in the first 30 days.',
    client: 'Confidential, Fine Dining, USA',
    companySize: '80 covers',
    duration: '2 weeks',
    summary:
      'A fine-dining restaurant was missing an estimated 15-20 calls per day during dinner service. We deployed a VAPI AI voice agent to answer every inbound call after 5pm and on weekends.',
    challenge: [
      'During peak service the host could not answer the phone, so reservation calls went unanswered.',
      'After-hours voicemails piled up and were rarely returned before the customer booked elsewhere.',
      'Every missed call represented a table of ~2.5 guests at $45 average spend.',
    ],
    baseline: [
      { label: 'Missed calls/day', value: '15-20' },
      { label: 'After-hours answer', value: 'Voicemail' },
      { label: 'Revenue exposure', value: 'High' },
    ],
    solution: [
      'Routed the restaurant number to a VAPI + ElevenLabs voice agent that knows hours, menu, dietary options, and live availability.',
      'Connected the agent to the reservation system to book, modify, and cancel in real time, with SMS confirmations.',
      'Added review-request automation 2 hours after each reservation to grow Google reviews.',
    ],
    tools: ['VAPI', 'ElevenLabs', 'OpenTable API', 'Twilio', 'n8n'],
    results: [
      { metric: 'Calls handled (30 days)', before: '0', after: '440' },
      { metric: 'Reservations booked by AI', before: '0', after: '127' },
      { metric: 'Average answer time', before: 'Voicemail', after: '1 ring' },
      { metric: 'Revenue recovered (month 1)', before: ', ', after: '$14,000' },
    ],
    quote: { text: 'The host now focuses entirely on the guests in front of them. The phone takes care of itself.', author: 'Owner', role: 'Fine Dining Restaurant' },
    relatedSolution: { label: 'AI Voice Agents', slug: 'ai-voice-agents' },
    homeCard: {
      badge: 'Restaurants · USA',
      problem: '15-20 calls missed every day during service, after-hours bookings lost to voicemail',
      system: 'VAPI AI voice agent integrated with the reservation system',
      result: '440 calls handled and 127 reservations booked in 30 days',
      metric: '$14,000 in revenue recovered in month 1',
    },
  },
  {
    slug: 'agency-automated-reporting',
    title: 'Marketing Agency Gets Its Fridays Back and Adds 3 Clients in 6 Weeks',
    industry: 'Marketing Agencies',
    image: '/images/industries/industry-agencies.png',
    metaDescription:
      'An 11-person agency managing 26 retainer clients reclaimed 14 hours a week by automating multi-client reporting, then used the time to win 3 new clients.',
    client: 'Confidential, Digital Marketing Agency, USA',
    companySize: '11 people · 26 retainer clients',
    duration: '3 weeks',
    summary:
      'An 11-person agency was spending 14 hours a week across the team building client reports by hand, a full-time employee\'s worth of time, every week. We automated reporting end to end.',
    challenge: [
      'Every Friday, team members exported CSVs from multiple ad platforms and rebuilt the same reports for 26 clients.',
      'Reports were inconsistent and occasionally went out with errors that turned into client conversations.',
      'The time spent on reporting was time not spent on client work or new business.',
    ],
    baseline: [
      { label: 'Weekly reporting hours', value: '14 hrs' },
      { label: 'Clients', value: '26' },
      { label: 'Delivery', value: 'Manual' },
    ],
    solution: [
      'Connected Google Ads, Facebook, LinkedIn, GA4, and HubSpot to a parameterized Looker Studio reporting model.',
      'Automated branded, per-client report generation and scheduled delivery with zero manual steps.',
      'Added a manual-send mode for the few clients who preferred a human to press send.',
    ],
    tools: ['Looker Studio', 'Supermetrics', 'HubSpot', 'n8n'],
    results: [
      { metric: 'Weekly reporting hours', before: '14 hrs', after: '~0' },
      { metric: 'Report delivery', before: 'Manual, Friday', after: 'Automated, on schedule' },
      { metric: 'Report errors', before: 'Occasional', after: 'Eliminated' },
      { metric: 'New clients (6 weeks)', before: ', ', after: '+3' },
    ],
    quote: { text: 'We took the reclaimed time straight into new business development and signed three clients in six weeks.', author: 'Managing Partner', role: 'Digital Marketing Agency' },
    relatedSolution: { label: 'Dashboards & Reporting', slug: 'data-dashboards-reporting' },
    homeCard: {
      badge: 'Marketing Agencies · USA',
      problem: '14 hours a week rebuilding the same reports by hand across 26 retainer clients',
      system: 'Automated multi-client reporting (Looker Studio + n8n)',
      result: 'Reporting time dropped from 14 hours a week to near zero',
      metric: '+3 new clients won in 6 weeks with the reclaimed time',
    },
  },
];

export function getCaseStudy(slug?: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
