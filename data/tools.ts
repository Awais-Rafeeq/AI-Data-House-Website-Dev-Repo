// The /tools directory, data-driven so a new tool is one entry here plus one
// component registration in pages/ToolsPages.tsx — the hub page, the routes and
// the prerendered SEO all read from this list and need no edits.
//
// Kept free of JSX and of React imports on purpose: lib/seoConfig.ts imports it
// to derive the prerender routes, and that runs in plain Node. `icon` is
// therefore a key, resolved to a lucide component at render time (same pattern
// CredibilitySection uses for its platform marks).

export type ToolIconKey = 'workflow' | 'calling';

export interface Tool {
  slug: string;
  title: string;
  /** One line under the title on the card and at the top of the tool page. */
  description: string;
  /** What the visitor walks away with. Rendered as the card's checklist. */
  outputs: string[];
  icon: ToolIconKey;
  category: string;
  seoTitle: string;
  seoDescription: string;
}

export const TOOLS: Tool[] = [
  {
    slug: 'automation-roi-calculator',
    title: 'Automation ROI Calculator',
    description:
      'Put a number on what manual work is costing you every month, and what automating it would give back.',
    outputs: [
      'Annual operational savings from automating repetitive work',
      'Hours per month your team gets back',
      'Direct monthly profit lift at your own staff rate',
    ],
    icon: 'workflow',
    category: 'ROI calculator',
    seoTitle: 'Automation ROI Calculator | AI Data House',
    seoDescription:
      'Estimate what manual work is costing you and what workflow automation could return. Three inputs, fifteen seconds, a real number before you spend anything.',
  },
  {
    slug: 'ai-calling-roi-calculator',
    title: 'AI Calling ROI Calculator',
    description:
      'See what unanswered calls are worth, and how much of that revenue an AI voice agent would recover.',
    outputs: [
      'Additional annual revenue captured from missed calls',
      'New customers per month recovered by an AI agent',
      'Monthly growth at your own average customer value',
    ],
    icon: 'calling',
    category: 'ROI calculator',
    seoTitle: 'AI Calling ROI Calculator | AI Data House',
    seoDescription:
      'Estimate the revenue your business loses to missed and unanswered calls, and what an AI voice agent could recover. Four inputs, an instant number, no signup.',
  },
];

export const getTool = (slug?: string): Tool | undefined =>
  TOOLS.find((tool) => tool.slug === slug);
