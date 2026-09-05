// Single source of truth for per-route SEO, usable from plain Node (no React, no
// window/document). The prerender script (scripts/prerender.ts) reads this to
// bake the correct <head> + JSON-LD into a static HTML file per route, so every
// crawler and link unfurler sees the right meta even before JS runs.
//
// Keep this aligned with the useSeo() calls in the page components. Where the
// content comes from data/*, it is derived here so it cannot drift.

import { SOLUTIONS } from '../data/solutions';
import { INDUSTRIES } from '../data/industries';
import { CASE_STUDIES } from '../data/caseStudies';
import { POSTS as BLOG_POSTS } from '../data/blog';
import { COMMERCIAL_PAGES } from '../data/commercialPages';
import { TOOLS } from '../data/tools';
import {
  ORG_JSONLD,
  faqJsonLd,
  serviceJsonLd,
  breadcrumbJsonLd,
  articleJsonLd,
} from './seo';

export interface PrerenderRoute {
  path: string;
  title: string;
  description: string;
  image?: string;          // root-relative or absolute
  type?: 'website' | 'article';
  jsonLd?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
}

const HOME_FAQS = [
  { q: 'How long does it take to deploy an AI system?', a: 'Most automations go live within 2-4 weeks. Complex multi-system integrations typically take 4-8 weeks. We provide a detailed timeline during your free audit call.' },
  { q: 'Do I need technical knowledge to work with you?', a: 'No. We handle all architecture, engineering, and deployment. You describe the business problem; we build the solution and train your team.' },
  { q: 'What tools and platforms do you integrate with?', a: 'Virtually any platform with an API, including HubSpot, Salesforce, Shopify, NetSuite, Slack, WhatsApp, Google Workspace, and hundreds more via n8n and custom Python bridges.' },
  { q: 'How do you ensure data security and privacy?', a: 'All workflows run on your own infrastructure or dedicated cloud instances. We never store client data on shared servers. HIPAA-compliant pipelines available on request.' },
];

// Static / hand-authored routes. Mirrors the useSeo() calls in the components.
const STATIC_ROUTES: PrerenderRoute[] = [
  {
    path: '/',
    title: 'AI Automation Services for US Businesses | AI Data House',
    description: 'AI Data House builds workflow automations, AI agents, internal web apps, and dashboards that replace manual operations for US businesses. 500+ systems delivered. Book a free audit.',
    image: '/images/og/og-homepage.png',
    jsonLd: [ORG_JSONLD, faqJsonLd(HOME_FAQS)],
  },
  {
    path: '/solutions',
    title: 'AI Automation Solutions for US Businesses | AI Data House',
    description: 'Workflow automation, AI chatbots, AI voice agents, internal web apps, CRM automation, and live dashboards. Pick the system your business needs.',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions' }]),
  },
  {
    path: '/industries',
    title: 'AI Automation by Industry | AI Data House',
    description: 'AI automation built for real estate, e-commerce, marketing agencies, restaurants, professional services, and healthcare. See exactly what we build for your industry.',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries' }]),
  },
  {
    path: '/case-studies',
    title: 'AI Automation Case Studies — Real Results | AI Data House',
    description: 'Real before-and-after numbers from US businesses we have automated: real estate, e-commerce, restaurants, and agencies. NDA-anonymized, results verified.',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Case Studies', path: '/case-studies' }]),
  },
  {
    path: '/about',
    title: 'About AI Data House — AI Transformation Partner for US Businesses',
    description: 'AI Data House was built by a team that has automated over 500 business operations across the US. Meet the people behind the work.',
    image: '/images/og/og-about.png',
    jsonLd: [ORG_JSONLD, breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
  },
  {
    path: '/contact',
    title: 'Book a Free AI Audit | AI Data House',
    description: 'Book a 30-minute AI Transformation Audit. We will map your biggest automation opportunity and tell you exactly what to build first. Free, no obligation.',
    jsonLd: faqJsonLd([
      { q: 'Is the audit really free?', a: 'Yes. No credit card, no contract. The audit is useful regardless of whether you hire us.' },
      { q: 'What if I am not sure what I want to automate?', a: 'That is exactly what the audit is for. Come with a frustration, not a solution. We will find the opportunity together.' },
      { q: 'Do you work with businesses outside the US?', a: 'Our focus is US-based businesses. If you are outside the US, email us and we will let you know whether your project is a fit.' },
    ]),
  },
  {
    path: '/resources',
    title: 'Resources — AI Automation Guides & Case Studies | AI Data House',
    description: 'Guides, case studies, and the ROI calculator for US business owners exploring AI automation. Practical, first-hand, no fluff.',
    image: '/images/blog/blog-featured-cornerstone.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }]),
  },
  {
    path: '/resources/blog',
    title: 'The Transformation Playbook — AI Automation Guides | AI Data House',
    description: 'Real automation cases, how-to guides, and honest tool comparisons for US business owners. One real automation, explained, every week.',
    image: '/images/blog/blog-featured-cornerstone.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }, { name: 'Blog', path: '/resources/blog' }]),
  },
  {
    path: '/tools',
    title: 'Free AI & Automation Tools | AI Data House',
    description: 'Free, practical tools from AI Data House: ROI calculators that show what manual work and missed calls cost you, and what automation would return.',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Tools', path: '/tools' }]),
  },
  {
    path: '/security',
    title: 'Security & Data Handling | AI Data House',
    description: 'How AI Data House protects client data, deploys securely, and handles compliance for automation and AI projects.',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Security & Data Handling', path: '/security' }]),
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | AI Data House',
    description: 'How AI Data House collects, uses, and protects information submitted through aidatahouse.com.',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy' }]),
  },
  {
    path: '/terms',
    title: 'Terms of Service | AI Data House',
    description: 'The terms governing use of the AI Data House website and the information presented on it.',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Terms of Service', path: '/terms' }]),
  },
];

// Data-driven routes, derived so they cannot drift from the page content.
const SOLUTION_ROUTES: PrerenderRoute[] = SOLUTIONS.map((s) => {
  const path = `/solutions/${s.slug}`;
  return {
    path,
    title: s.metaTitle,
    description: s.metaDescription,
    image: s.image,
    jsonLd: [
      serviceJsonLd(s.navLabel, s.metaDescription, path),
      faqJsonLd(s.faqs),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Solutions', path: '/solutions' },
        { name: s.navLabel, path },
      ]),
    ],
  };
});

const INDUSTRY_ROUTES: PrerenderRoute[] = INDUSTRIES.map((i) => {
  const path = `/industries/${i.slug}`;
  return {
    path,
    title: i.metaTitle,
    description: i.metaDescription,
    image: `/images/og/og-industry-${i.slug}.png`,
    jsonLd: [
      serviceJsonLd(`AI Automation for ${i.navLabel}`, i.metaDescription, path),
      faqJsonLd(i.faqs),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
        { name: i.navLabel, path },
      ]),
    ],
  };
});

const CASE_STUDY_ROUTES: PrerenderRoute[] = CASE_STUDIES.map((cs) => {
  const path = `/case-studies/${cs.slug}`;
  return {
    path,
    title: `${cs.title} | AI Data House`,
    description: cs.metaDescription,
    image: cs.image,
    type: 'article' as const,
    jsonLd: breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Case Studies', path: '/case-studies' },
      { name: cs.title, path },
    ]),
  };
});

const BLOG_ROUTES: PrerenderRoute[] = BLOG_POSTS.map((b) => {
  const path = `/resources/${b.slug}`;
  return {
    path,
    title: `${b.title} | AI Data House`,
    description: b.excerpt,
    image: b.image,
    type: 'article' as const,
    jsonLd: [
      articleJsonLd({
        title: b.title,
        description: b.excerpt,
        path,
        image: b.image,
        author: b.author,
        datePublished: b.date,
      }),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Resources', path: '/resources' },
        { name: 'Blog', path: '/resources/blog' },
        { name: b.title, path },
      ]),
    ],
  };
});

// One prerendered page per tool, derived from the same registry the /tools hub
// and the router read — so adding a tool cannot leave it without real <head>.
const TOOL_ROUTES: PrerenderRoute[] = TOOLS.map((t) => {
  const path = `/tools/${t.slug}`;
  return {
    path,
    title: t.seoTitle,
    description: t.seoDescription,
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Tools', path: '/tools' },
      { name: t.title, path },
    ]),
  };
});

const COMMERCIAL_ROUTES: PrerenderRoute[] = COMMERCIAL_PAGES.map((p) => {
  const path = `/${p.slug}`;
  return {
    path,
    title: p.metaTitle,
    description: p.metaDescription,
    image: `/images/og/og-${p.slug}.png`,
    jsonLd: [
      serviceJsonLd(p.navLabel, p.metaDescription, path),
      faqJsonLd(p.faqs),
      breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: p.navLabel, path }]),
    ],
  };
});

export const PRERENDER_ROUTES: PrerenderRoute[] = [
  ...STATIC_ROUTES,
  ...SOLUTION_ROUTES,
  ...INDUSTRY_ROUTES,
  ...CASE_STUDY_ROUTES,
  ...BLOG_ROUTES,
  ...TOOL_ROUTES,
  ...COMMERCIAL_ROUTES,
];
