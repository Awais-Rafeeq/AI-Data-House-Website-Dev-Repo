import React from 'react';
import { useSeo, ORG_JSONLD, faqJsonLd } from '../lib/seo';
import HeroSection from '../components/hero/HeroSection';
import CredibilitySection from '../components/home/CredibilitySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CaseStudiesSection from '../components/home/CaseStudiesSection';
import IndustrySelector from '../components/home/IndustrySelector';
import TeamSection from '../components/home/TeamSection';
import ReelsSection from '../components/home/ReelsSection';
import FinalCtaSection from '../components/home/FinalCtaSection';
import NewsletterSection from '../components/home/NewsletterSection';
import './home-redesign.css';

const HOME_FAQS = [
  { q: 'How long does it take to deploy an AI system?', a: 'Most automations go live within 2-4 weeks. Complex multi-system integrations typically take 4-8 weeks. We provide a detailed timeline during your free audit call.' },
  { q: 'Do I need technical knowledge to work with you?', a: 'No. We handle all architecture, engineering, and deployment. You describe the business problem; we build the solution and train your team.' },
  { q: 'What tools and platforms do you integrate with?', a: 'Virtually any platform with an API, HubSpot, Salesforce, Shopify, NetSuite, Slack, WhatsApp, Google Workspace, and hundreds more via n8n and custom Python bridges.' },
  { q: 'How do you ensure data security and privacy?', a: 'All workflows run on your own infrastructure or dedicated cloud instances. We never store client data on shared servers. HIPAA-compliant pipelines available on request.' },
];

// The homepage is a stack of self-contained sections, each owning its own
// markup, navigation and analytics. They render inside a scoped `.adhx`
// container so the redesign's styles never touch the other routes. This
// component only supplies the real SEO for the route.
const HomePage = () => {
  useSeo({
    title: 'AI Automation Services for US Businesses | AI Data House',
    description: 'AI Data House builds workflow automations, AI agents, internal web apps, and dashboards that replace manual operations for US businesses. 500+ systems delivered. Book a free audit.',
    path: '/',
    image: '/images/og/og-homepage.png',
    jsonLd: [ORG_JSONLD, faqJsonLd(HOME_FAQS)],
  });

  return (
    <div className="adhx">
      <HeroSection />
      <CredibilitySection />
      <CaseStudiesSection />
      <IndustrySelector />
      <TestimonialsSection />
      <TeamSection />
      <ReelsSection />
      <FinalCtaSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
