// Bottom-funnel commercial landing pages (transactional "hire us" intent).
// Distinct from solution pages: solution pages explain WHAT a service is and how
// it works; these answer WHO do I hire. One intent per URL (see
// CONTENT_TOPICAL_MAP.md). Rendered by pages/CommercialPage.tsx, prerendered via
// lib/seoConfig.ts.

export interface CommercialPage {
  slug: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  hero: { eyebrow: string; headline: string; sub: string; cta: string };
  intro: string[];
  servicesHeading: string;
  services: { title: string; desc: string }[];
  whyUs: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  proof: { metric: string; label: string }[];
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
  cta: { headline: string; sub: string; button: string };
}

export const COMMERCIAL_PAGES: CommercialPage[] = [
  {
    slug: 'ai-automation-agency',
    navLabel: 'AI Automation Agency',
    metaTitle: 'AI Automation Agency for US Businesses | AI Data House',
    metaDescription:
      'AI Data House is an AI automation agency for US businesses. We build workflow automation, AI agents, internal apps, and dashboards that replace manual work. 500+ systems delivered. Book a free audit.',
    keyword: 'ai automation agency',
    hero: {
      eyebrow: 'AI Automation Agency',
      headline: 'The AI Automation Agency US Businesses Hire to Stop Doing Things by Hand',
      sub: 'We design and build the automations, AI agents, internal apps, and dashboards that take the manual work off your team. Over 500 systems delivered for US businesses, with US-hours coverage and code you own.',
      cta: 'Book a Free AI Audit',
    },
    intro: [
      'An AI automation agency does one thing: it finds the repetitive, rule-based work in your business and hands it to software, so your team spends its time where judgment actually matters. We do that end to end, from mapping the workflow to building it, integrating it with the tools you already use, and supporting it after launch.',
      'Most businesses try to solve this with another subscription or by asking an already-stretched team member to "figure out automation" on the side. That rarely sticks. Hiring an agency means the system gets scoped properly, built once, and documented, instead of becoming one more half-finished project.',
    ],
    servicesHeading: 'What We Build',
    services: [
      { title: 'Workflow Automation', desc: 'Multi-step processes automated end to end, so data moves between your tools without anyone copying it by hand.' },
      { title: 'AI Agents (Chat + Voice)', desc: 'Chatbots that qualify website leads and voice agents that answer every call, book appointments, and log everything.' },
      { title: 'Custom Internal Web Apps', desc: 'Role-based tools that replace fragile spreadsheets your team has outgrown.' },
      { title: 'CRM & Lead Automation', desc: 'Every lead captured, contacted in under 90 seconds, qualified, and followed up automatically.' },
      { title: 'Dashboards & Reporting', desc: 'Live dashboards and automated reports that pull from every tool, so no one builds reports by hand.' },
    ],
    whyUs: [
      { title: 'You own everything we build', desc: 'Code, credentials, workflows, and documentation are yours. When the project ends, it belongs to you.' },
      { title: 'US-hours coverage', desc: 'We align with US business hours, so collaboration and support happen in real time, not on a 12-hour delay.' },
      { title: 'Phased, fixed-scope builds', desc: 'We start with the highest-ROI workflow and prove it before scaling, so you are never committing blind.' },
      { title: '500+ systems delivered', desc: 'Four years building for US businesses across real estate, e-commerce, restaurants, agencies, and clinics.' },
    ],
    process: [
      { step: '01', title: 'Free Audit', desc: 'A 30-minute call where we map your biggest bottleneck and give you a clear ROI estimate. No pitch.' },
      { step: '02', title: 'Phased Build', desc: 'We scope, build, integrate, and test the highest-ROI workflow first, then expand from there.' },
      { step: '03', title: 'Handoff', desc: 'You get documentation, a walkthrough, and full ownership. No lock-in.' },
      { step: '04', title: 'Support', desc: 'A defined support path and the option of a monthly retainer for ongoing improvements.' },
    ],
    proof: [
      { metric: '500+', label: 'Systems delivered' },
      { metric: '5.0', label: 'Average Clutch rating' },
      { metric: 'EST-PST', label: 'US-hours coverage' },
    ],
    faqs: [
      { q: 'What does an AI automation agency actually do?', a: 'We identify the repetitive, rule-based work in your operations and build software that handles it: workflow automation, AI chat and voice agents, internal apps, and dashboards. We scope it, build it, integrate it with your existing tools, and support it after launch.' },
      { q: 'How much does it cost to hire you?', a: 'Projects start at $1,000 for a focused automation and scale with scope. We work in phases so you prove ROI on the first build before committing to more. The free audit gives you a real estimate before you spend anything.' },
      { q: 'Do we own the code and systems?', a: 'Yes. Code, credentials, workflows, and documentation are all yours. We do not lock you into proprietary software you cannot leave.' },
      { q: 'You are based outside the US. How does that work?', a: 'We cover US business hours, communicate in clear English, and have built for US clients for four years. You own all the work, references are available, and the free audit lets you judge the fit before any commitment.' },
      { q: 'How long does a build take?', a: 'Most single automations go live in 1 to 3 weeks. Larger multi-system builds run 4 to 8 weeks. You get a timeline during the audit.' },
    ],
    related: [
      { label: 'Service: AI Workflow Automation', href: '/solutions/ai-workflow-automation' },
      { label: 'Service: AI Chatbots', href: '/solutions/ai-chatbots' },
      { label: 'Guide: Business Process Automation', href: '/resources/business-process-automation-guide' },
      { label: 'See our case studies', href: '/case-studies' },
    ],
    cta: {
      headline: 'Hire the agency that builds it once and builds it right.',
      sub: 'Book a free 30-minute AI Audit. We map your highest-ROI automation and tell you exactly what it would take to build, before you spend a dollar.',
      button: 'Book a Free AI Audit',
    },
  },
  {
    slug: 'hire-n8n-developer',
    navLabel: 'Hire n8n Developer',
    metaTitle: 'Hire an n8n Developer | n8n Development Services | AI Data House',
    metaDescription:
      'Hire experienced n8n developers to build, fix, and scale your workflow automations. Custom nodes, API integrations, Zapier and Make migrations, self-hosting. US-hours coverage. Book a free audit.',
    keyword: 'hire n8n developer',
    hero: {
      eyebrow: 'n8n Development Services',
      headline: 'Hire n8n Developers Who Build Automations That Do Not Break',
      sub: 'We design, build, fix, and scale n8n workflows for US businesses: custom nodes, deep API integrations, migrations off Zapier and Make, and self-hosted deployments. You own every workflow we build.',
      cta: 'Book a Free Audit',
    },
    intro: [
      'n8n is the most flexible workflow automation platform available, which is exactly why it rewards an experienced developer. The difference between a workflow that runs for years and one that silently breaks is in the error handling, the data mapping, and the architecture. That is what you are hiring for.',
      'We build n8n automations as our core stack. Whether you need a single workflow built, a tangle of broken ones fixed, a migration off a tool you have outgrown, or n8n self-hosted on your own infrastructure, we have done it for US businesses across industries.',
    ],
    servicesHeading: 'n8n Services We Offer',
    services: [
      { title: 'Workflow Builds', desc: 'New n8n workflows architected with proper error handling, retries, and logging, not just happy-path automations.' },
      { title: 'Custom Nodes & Code', desc: 'Custom nodes and Code-node logic for anything the standard nodes cannot do, including bespoke API work.' },
      { title: 'API Integrations', desc: 'Connecting n8n to your CRM, database, payment, and internal systems, including auth and pagination edge cases.' },
      { title: 'Migrations', desc: 'Moving you off Zapier or Make to n8n to cut per-task costs and remove limits, with no loss of functionality.' },
      { title: 'Self-Hosting & DevOps', desc: 'n8n deployed on your own VPS or cloud, secured, backed up, and monitored, so your data stays yours.' },
      { title: 'Debugging & Maintenance', desc: 'Fixing flaky workflows and ongoing maintenance so automations keep running as your business changes.' },
    ],
    whyUs: [
      { title: 'n8n is our core stack', desc: 'We do not dabble. n8n is what we build on every day, including the self-hosting and custom-node work most teams avoid.' },
      { title: 'Self-hosting expertise', desc: 'We run n8n in production on our own infrastructure and can deploy and secure it on yours.' },
      { title: 'US-hours coverage', desc: 'Real-time collaboration and support during US business hours.' },
      { title: 'You own the workflows', desc: 'Every workflow, credential, and doc is yours, exportable and documented. No lock-in.' },
    ],
    process: [
      { step: '01', title: 'Free Audit', desc: 'We review what you have or what you need and map the build. 30 minutes, no pitch.' },
      { step: '02', title: 'Build & Integrate', desc: 'We build the workflows with proper error handling and wire them into your stack.' },
      { step: '03', title: 'Handoff', desc: 'Documented, exportable workflows and a walkthrough. Self-hosted if you want it on your infrastructure.' },
      { step: '04', title: 'Maintain', desc: 'Optional retainer for monitoring, fixes, and new automations.' },
    ],
    proof: [
      { metric: '500+', label: 'Systems delivered' },
      { metric: 'Self-host', label: 'Run in production' },
      { metric: 'EST-PST', label: 'US-hours coverage' },
    ],
    faqs: [
      { q: 'Can you self-host n8n on our own infrastructure?', a: 'Yes. We run n8n self-hosted in production ourselves and can deploy, secure, back up, and monitor it on your VPS or cloud so your data never leaves your environment.' },
      { q: 'Can you migrate us from Zapier or Make to n8n?', a: 'Yes. We rebuild your existing automations in n8n, usually cutting per-task costs and removing the task limits that come with Zapier and Make, with no loss of functionality.' },
      { q: 'Can you build custom nodes or custom code?', a: 'Yes. When the standard nodes cannot do something, we build custom nodes and use the Code node for bespoke logic and API work.' },
      { q: 'Do you charge hourly or fixed price?', a: 'Most projects are fixed-scope so you know the cost up front. Ongoing maintenance is available on a monthly retainer. We confirm the model during the free audit.' },
      { q: 'Do we own the workflows?', a: 'Completely. Every workflow is exportable, documented, and yours. There is no proprietary layer locking you in.' },
    ],
    related: [
      { label: 'Service: AI Workflow Automation', href: '/solutions/ai-workflow-automation' },
      { label: 'Guide: Business Process Automation', href: '/resources/business-process-automation-guide' },
      { label: 'See our case studies', href: '/case-studies' },
    ],
    cta: {
      headline: 'Get an n8n developer who builds it to last.',
      sub: 'Book a free 30-minute audit. We review your workflows or your goal and tell you exactly what to build and what it would take.',
      button: 'Book a Free Audit',
    },
  },
  {
    slug: 'ai-chatbot-development-company',
    navLabel: 'AI Chatbot Development',
    metaTitle: 'AI Chatbot Development Company for US Businesses | AI Data House',
    metaDescription:
      'AI chatbot development company building lead-qualifying, CRM-integrated chatbots for US businesses. Website, WhatsApp, and support bots that convert, not just answer FAQs. Book a free audit.',
    keyword: 'ai chatbot development company',
    hero: {
      eyebrow: 'AI Chatbot Development',
      headline: 'An AI Chatbot Development Company That Builds Bots That Convert',
      sub: 'We build AI chatbots that qualify leads, book calls, answer support questions, and log everything to your CRM, on your website, WhatsApp, and social. Not FAQ toys. Bots that move revenue.',
      cta: 'Book a Free Audit',
    },
    intro: [
      'Most chatbots businesses buy are glorified FAQ widgets. They answer a question and stop. The chatbots that pay for themselves do something different: they qualify the visitor, route the hot lead, book the call, and hand your team a person who is ready to talk, with the full context attached.',
      'We build that second kind. Connected to your CRM and your real data, deployed where your customers actually are, and designed around conversion, not just deflection.',
    ],
    servicesHeading: 'Chatbots We Build',
    services: [
      { title: 'Website Lead Bots', desc: 'Bots that engage every visitor, ask the few questions that qualify a lead, and book a call or route the hot ones to your CRM.' },
      { title: 'Support Bots', desc: 'Bots trained on your real knowledge base that resolve common questions and escalate only the ones that need a human.' },
      { title: 'WhatsApp & Social', desc: 'Chatbots on WhatsApp, Instagram, and Messenger so you respond where your customers already are.' },
      { title: 'CRM-Integrated Bots', desc: 'Every conversation logged, every lead tagged and routed, so nothing lives only in a chat window.' },
      { title: 'Knowledge (RAG) Bots', desc: 'Bots grounded in your documents and data so answers are accurate and specific, not generic.' },
    ],
    whyUs: [
      { title: 'Built to convert, not deflect', desc: 'We design around qualifying and booking, so the bot drives pipeline instead of just reducing tickets.' },
      { title: 'CRM-integrated by default', desc: 'Leads and conversations flow into your CRM with the right tags and owners, automatically.' },
      { title: 'We also build voice', desc: 'If the phone is your real channel, we build AI voice agents too, so you are not forced into the wrong tool.' },
      { title: 'You own it', desc: 'The bot, its logic, and its data are yours, documented and exportable.' },
    ],
    process: [
      { step: '01', title: 'Free Audit', desc: 'We look at where your leads come from and whether a chatbot is even the right tool. 30 minutes, no pitch.' },
      { step: '02', title: 'Build & Train', desc: 'We build the bot, train it on your data, and connect it to your CRM and channels.' },
      { step: '03', title: 'Launch', desc: 'We deploy, test with real conversations, and hand over documentation.' },
      { step: '04', title: 'Improve', desc: 'Optional retainer to refine the bot as you learn what your customers ask.' },
    ],
    proof: [
      { metric: '500+', label: 'Systems delivered' },
      { metric: '24/7', label: 'Lead capture' },
      { metric: 'EST-PST', label: 'US-hours coverage' },
    ],
    faqs: [
      { q: 'What platforms do you build chatbots on?', a: 'We build on the platform that fits your use case, including Botpress and custom builds, integrated with OpenAI and other models. We choose based on your needs, not a single vendor.' },
      { q: 'Will the chatbot connect to our CRM?', a: 'Yes. CRM integration is standard. Every conversation is logged and every qualified lead is tagged, routed, and owned automatically.' },
      { q: 'How is this different from an off-the-shelf chatbot widget?', a: 'Off-the-shelf widgets answer FAQs and stop. We build bots that qualify leads, book calls, and feed your pipeline, grounded in your real data and connected to your systems.' },
      { q: 'Do you build AI voice agents too?', a: 'Yes. If your customers reach you mostly by phone, a voice agent often returns more than a chatbot. We build both and help you pick the right one in the audit.' },
      { q: 'How much does a chatbot build cost?', a: 'Chatbot projects typically start around $1,500 depending on scope and integrations. The free audit gives you a real estimate before you commit.' },
    ],
    related: [
      { label: 'Service: AI Chatbots', href: '/solutions/ai-chatbots' },
      { label: 'Service: AI Voice Agents', href: '/solutions/ai-voice-agents' },
      { label: 'Guide: AI Agents for Business', href: '/resources/ai-agents-for-business' },
      { label: 'See our case studies', href: '/case-studies' },
    ],
    cta: {
      headline: 'Build a chatbot that earns its keep.',
      sub: 'Book a free 30-minute audit. We tell you whether a chatbot is the right tool and what it would take to build one that converts.',
      button: 'Book a Free Audit',
    },
  },
];

export function getCommercialPage(slug?: string) {
  return COMMERCIAL_PAGES.find((p) => p.slug === slug);
}
