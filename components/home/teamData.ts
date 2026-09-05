// Mirrors the team block already published on the About page
// (pages/StaticPages.tsx) so the homepage and /about never disagree.
//
// PHOTOS ARE PLACEHOLDERS. Each member renders an initials monogram until a
// real photo is supplied — set `photo` to a path under /public (there is an
// existing /images/about/about-team-placeholder.png if you want a stand-in
// image instead of the monogram) and the card swaps to the image with no
// other change needed.

export interface TeamMember {
  name: string;
  role: string;
  desc: string;
  /** Focus areas, shown as a small caption under the description. */
  tools: string;
  /** Optional path under /public. Falls back to an initials monogram. */
  photo?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Awais Rafeeq',
    role: 'Founder, CEO',
    desc: 'Strategy, AI architecture, and client relationships. Every build gets scoped against what the business actually needs before a line of it is wired up.',
    tools: 'n8n · GoHighLevel · VAPI · Supabase · system design',
  },
  {
    name: 'Automation Team',
    role: 'Workflow · Chatbots · Voice',
    desc: 'Specialists in workflow automation, AI chatbots, and voice agents. They build the systems that answer, qualify, and route without anyone watching them.',
    tools: 'n8n · Make.com · Botpress · Voiceflow · VAPI · GHL · Twilio',
  },
  {
    name: 'Data Team',
    role: 'BI · Dashboards',
    desc: 'Specialists in business intelligence dashboards and data pipelines. They turn scattered exports into one number you can actually make a decision on.',
    tools: 'Looker Studio · Power BI · Apps Script · Supabase · BigQuery',
  },
  {
    name: 'Development Team',
    role: 'Web Apps · Integrations',
    desc: 'Specialists in internal web applications and custom integrations. When something has no API, this is the team that builds the bridge anyway.',
    tools: 'React · TypeScript · Node.js · Python · Supabase · REST APIs',
  },
];

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
