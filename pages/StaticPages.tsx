import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Star, Calendar, MapPin, ShieldCheck, Clock, Mail, Users, Cpu, Search, ChevronDown,
} from 'lucide-react';
import BookingFlow from '../components/BookingFlow';
import { INDUSTRY_NAV } from '../data/industries';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import { useSeo, ORG_JSONLD, faqJsonLd, breadcrumbJsonLd } from '../lib/seo';
import { initialsOf } from '../components/home/teamData';
import './contact.css';

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">{children}</p>
);

// ─── 404 NOT FOUND ────────────────────────────────────────────────────────────
// Real 404 instead of a silent redirect to home, so broken links surface and
// visitors can recover (see DESIGN_QA_BACKLOG A5).
export const NotFoundPage = () => {
  const navigate = useNavigate();
  useSeo({
    title: 'Page Not Found (404) | AI Data House',
    description: 'The page you are looking for does not exist or has moved. Find solutions, industries, case studies, and resources here.',
    path: '/404',
    noindex: true,
  });

  const topLinks = [
    { label: 'Solutions', desc: 'Workflow automation, AI agents, web apps, dashboards', href: '/solutions' },
    { label: 'Industries', desc: 'What we build for your specific business', href: '/industries' },
    { label: 'Case Studies', desc: 'Real systems, real numbers', href: '/case-studies' },
    { label: 'Resources', desc: 'Guides, blueprints, and the ROI calculator', href: '/resources' },
  ];

  return (
    <div className="pt-40 pb-24 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-7xl sm:text-8xl font-black text-emerald-600 mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
          This page took the day off.
        </h1>
        <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">
          The page you are looking for does not exist or has moved. Here is where most people are headed.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
          {topLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => navigate(link.href)}
              className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all flex items-start justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <span>
                <span className="block font-black text-slate-900 mb-1">{link.label}</span>
                <span className="block text-sm text-slate-500 font-medium leading-relaxed">{link.desc}</span>
              </span>
              <ArrowRight size={18} className="text-emerald-500 mt-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-emerald-600 transition-all inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Back to Home
          </button>
          <button
            type="button"
            onClick={() => { sendToN8n(ACTIONS.CTA_CLICK, { location: '404', label: 'Book Free Audit' }); navigate('/contact'); }}
            className="px-8 py-4 bg-transparent text-emerald-600 border-[1.5px] border-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Book a Free Audit <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ABOUT ───────────────────────────────────────────────────────────────────
export const AboutPage = () => {
  const navigate = useNavigate();
  useSeo({
    title: 'About AI Data House, AI Transformation Partner for US Businesses',
    description: 'AI Data House was built by a team that has automated over 500 business operations across the US. Meet the people behind the work.',
    path: '/about',
    image: '/images/og/og-about.png',
    jsonLd: [ORG_JSONLD, breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
  });

  const stats = [
    { v: '500+', l: 'Business operations automated' },
    { v: '4 years', l: 'Building for US clients' },
    { v: '$100K+', l: 'Earned on Upwork before ADH existed' },
    { v: '4.9★', l: 'Average Clutch review rating' },
  ];

  const teams = [
    { name: 'Awais Rafeeq', role: 'Founder, CEO', desc: 'Strategy, AI architecture, client relationships.', tools: 'n8n, GoHighLevel, VAPI, Supabase, system design' },
    { name: 'Automation Team', role: 'Workflow · Chatbots · Voice', desc: 'Specialists in workflow automation, AI chatbots, and voice agents.', tools: 'n8n, Make.com, Botpress, Voiceflow, VAPI, GHL, Zapier, Twilio' },
    { name: 'Data Team', role: 'BI · Dashboards', desc: 'Specialists in business intelligence dashboards and data pipelines.', tools: 'Looker Studio, Power BI, Apps Script, Supabase, BigQuery' },
    { name: 'Development Team', role: 'Web Apps · Integrations', desc: 'Specialists in internal web applications and custom integrations.', tools: 'React, TypeScript, Node.js, Python, Supabase, REST APIs' },
  ];

  const beliefs = [
    { t: 'Automation should make people more human, not less.', d: 'The goal is never to eliminate people from a business. It is to eliminate the work that didn\'t require people in the first place.' },
    { t: 'Simple beats clever.', d: 'The automation that runs for 3 years without breaking is better than the one that is impressive in a demo. We default to simple, reliable, and maintainable.' },
    { t: 'You should understand what we build.', d: 'If we build something you can\'t explain or maintain, we\'ve done the job wrong. Every build comes with documentation, a walkthrough, and a point of contact.' },
    { t: 'Start small, prove it, then expand.', d: 'Transformation doesn\'t happen in one project. It happens in phases. We build Phase 1 so well that Phase 2 becomes obvious.' },
  ];

  return (
    <div className="bg-white">
      {/* Opening statement */}
      <section className="pt-40 pb-24 md:pb-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600 blur-[180px] opacity-15" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-8">
              Most automation agencies will tell you what they build.<br />
              <span className="text-emerald-400">We'd rather show you what changes when it's running.</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-5">
              In the last 4 years, we've worked with over 500 US businesses, real estate teams, HVAC companies, e-commerce brands, agencies, clinics, restaurants, and consulting firms. In every case, the work was the same: find the places where manual effort is doing what a system could do, and replace it. Not with flashy technology. With operational logic.
            </p>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              The result is always a version of the same thing: the owner shows up to work and finds that the work is further along than when they left. Leads are responded to. Reports are ready. Tasks are routed. That's what AI transformation actually means. And that's what we build.
            </p>
          </div>
        </div>
      </section>

      {/* Founder story */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow>The Origin</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tight">It Started With a Spreadsheet That Was Holding a Business Hostage</h2>
            <div className="space-y-5 text-lg text-slate-600 font-medium leading-relaxed border-l-[3px] border-emerald-500 pl-6 md:pl-7">
              <p>Awais Rafeeq started AI Data House from Islamabad after spending years as a top-rated freelancer on Upwork, building automation systems for businesses across the US.</p>
              <p>The pattern he kept seeing: businesses spending more time on manual work than on the actual thing that made them money. A real estate brokerage where three people spent every morning manually entering leads into a CRM that could have done it automatically. An agency where every Friday was lost to building reports that should have built themselves. A restaurant where voicemails from missed calls sat unread until the next day.</p>
              <p>Awais earned over $100,000 on Upwork solving exactly this problem, one automation at a time, using every tool: n8n, Make.com, Zapier, VAPI, GoHighLevel, Power BI, Looker Studio, Botpress, Supabase. What he learned: the technology is never the hard part. Understanding how a business actually runs, and where the humans are doing the work that systems should be doing, that's the skill.</p>
              <p>AI Data House was built to do that at scale. A team of specialists in automation, AI, data, and internal applications, working across time zones to deliver systems that US businesses can trust and run.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — floating card so the page isn't a stack of full-bleed color bands */}
      <section className="pb-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-xl shadow-slate-900/10 border border-slate-800">
            <div className="absolute inset-x-0 top-0 h-[3px] gradient-brand" aria-hidden="true" />
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-white/10 md:divide-y-0 md:divide-x">
              {stats.map((s) => (
                <div key={s.l} className="px-6 py-10 md:py-12 text-center">
                  <p className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{s.v}</p>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow>How We Work</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tight">We Don't Start Building Until We Understand the Business</h2>
            <div className="space-y-5 text-lg text-slate-600 font-medium leading-relaxed mb-14">
              <p>Every engagement starts the same way: with a discovery session before a single line of automation is written. The most common reason AI projects fail is not the technology, it's building the wrong thing. So we map first. We ask questions that feel basic, what triggers this process? What tools are involved? What happens when it goes wrong?, because the answers reveal the real shape of the problem.</p>
              <p>Then we build, with the assumption that you need to understand what we built, not just use it. Every project ships with documentation, a walkthrough, and a handoff session. Phase 1 is almost always small, one automation, one workflow that was taking 6 hours a week and now takes none. From there we build in phases, each one building on the last.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Analysis', d: 'Deep-dive audit of your manual workflows.', i: <Search /> },
              { t: 'Engineering', d: 'Custom Python & n8n architecture, built to be maintainable.', i: <Cpu /> },
              { t: 'Deployment', d: 'Seamless integration, documentation, and 30-day support.', i: <CheckCircle /> },
            ].map((c, i) => (
              <div key={i} className="group relative bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                <span className="absolute top-6 right-7 text-4xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors select-none" aria-hidden="true">
                  0{i + 1}
                </span>
                <div className="relative w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors">{c.i}</div>
                <h3 className="relative text-xl font-black mb-2 text-slate-900">{c.t}</h3>
                <p className="relative text-slate-500 font-medium text-sm">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <Users size={15} aria-hidden="true" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">The Team</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 leading-tight tracking-tight">Specialists, Not Generalists</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teams.map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className="flex-none grid place-items-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 font-black text-sm border border-emerald-100"
                    aria-hidden="true"
                  >
                    {initialsOf(t.name)}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-xl font-black text-slate-900 leading-snug">{t.name}</h3>
                    <p className="text-emerald-600 font-black text-xs uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium mb-4">{t.desc}</p>
                <p className="text-xs text-slate-400 font-bold border-t border-slate-100 pt-3">Works in: {t.tools}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we work */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow>Where We Work</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tight">Built in Islamabad. Built for the US.</h2>
            <div className="space-y-5 text-lg text-slate-600 font-medium leading-relaxed">
              <p>AI Data House operates out of Islamabad, Pakistan, with a team that works across time zones to serve US business hours. When you send a message at 9pm Eastern, the team is active. When you have a launch on Monday morning, the work was done over the weekend. The time zone difference that most offshore teams apologize for is, for our clients, actually an advantage.</p>
              <p>We communicate in English, we understand US business norms, and we've been building for US clients long enough to know the difference between what a US business actually needs versus what a developer might assume they need. We are registered as <strong className="text-slate-900">AI Data House (CUIN 0253741)</strong> in Pakistan. We operate transparently, invoice professionally, and protect client data with the seriousness it deserves.</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <span className="inline-flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700"><MapPin size={18} className="text-emerald-600" aria-hidden="true" /> G-13, Islamabad</span>
              <span className="inline-flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700"><Clock size={18} className="text-emerald-600" aria-hidden="true" /> US business hours coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>What We Believe</Eyebrow>
          <h2 className="sr-only">What We Believe</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {beliefs.map((b, i) => (
              <div key={b.t} className="relative bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all overflow-hidden">
                <span className="absolute -top-3 -right-1 text-6xl font-black text-slate-50 select-none" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="relative text-xl font-black text-slate-900 mb-3 leading-snug max-w-sm">{b.t}</h3>
                <p className="relative text-slate-500 font-medium">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-emerald-600 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-white blur-[160px] opacity-10" aria-hidden="true" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-5 leading-tight tracking-tight">If this sounds like the kind of team you want working on your operations, </h2>
          <p className="text-emerald-50 font-medium mb-8">The next step is a 30-minute AI Audit. We'll look at your business, map the biggest automation opportunity, and give you a clear starting point. No pitch. No obligation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-white text-emerald-700 font-black rounded-2xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-50 hover:-translate-y-0.5 hover:shadow-xl transition-all inline-flex items-center justify-center gap-2">Book a Free AI Audit <ArrowRight size={18} aria-hidden="true" /></button>
            <button onClick={() => navigate(INDUSTRY_NAV[0].href)} className="px-8 py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 hover:-translate-y-0.5 transition-all">Browse how we work by industry</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────
export const ContactPage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSeo({
    title: 'Book a Free AI Audit | AI Data House',
    description: 'Book a 30-minute AI Transformation Audit. We\'ll map your biggest automation opportunity and tell you exactly what to build first. Free, no obligation.',
    path: '/contact',
    jsonLd: faqJsonLd([
      { q: 'Is the audit really free?', a: 'Yes. No credit card, no contract. The audit is useful regardless of whether you hire us.' },
      { q: 'What if I\'m not sure what I want to automate?', a: 'That\'s exactly what the audit is for. Come with a frustration, not a solution. We\'ll find the opportunity together.' },
      { q: 'Do you work with businesses outside the US?', a: 'Our focus is US-based businesses. If you\'re outside the US, email us and we\'ll let you know whether your project is a fit.' },
    ]),
  });

  const steps = [
    { t: 'You book a slot', d: 'Pick any available time. 30 minutes. Video or phone, your preference.', i: <Calendar /> },
    { t: 'We map your operations', d: 'We\'ll ask about your current workflow, where it breaks, and what tools you use. No prep needed.', i: <Search /> },
    { t: 'You get a clear starting point', d: 'Top 1-2 automation opportunities, a rough ROI estimate, and a recommended first build. Useful whether you hire us or not.', i: <CheckCircle /> },
  ];

  const trust = [
    { v: '4.9★', l: 'on Clutch', i: <Star /> },
    { v: '500+', l: 'automations built', i: <Cpu /> },
    { v: '<4hr', l: 'response time', i: <Clock /> },
    { v: '4 yrs', l: 'with US businesses', i: <Users /> },
  ];

  const faqs = [
    { q: 'Is the audit really free?', a: 'Yes. No card, no contract. The audit is useful regardless of whether you hire us, most businesses leave with something actionable either way.' },
    { q: 'What if I\'m not sure what I want to automate?', a: 'That\'s exactly what the audit is for. Come with a frustration, not a solution. We\'ll find the opportunity together.' },
    { q: 'Do you work with businesses outside the US?', a: 'Our focus is US-based businesses. If you\'re outside the US, email us and we\'ll let you know whether your project is a fit.' },
  ];

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await sendToN8n(ACTIONS.NEWSLETTER, { email, source: 'contact_page' });
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-shell">
        <div className="contact-hero">
          <p className="contact-eyebrow">Free 30-minute AI audit</p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight tracking-tight text-slate-900"><span>Get a Free Map of Your</span> <span className="text-emerald-600">Automation Opportunity</span></h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">30 minutes. No pitch. No sales deck. You describe your operations, we tell you what to automate first, what it costs, and what changes. Whether you work with us afterward or not, the audit is genuinely useful.</p>
        </div>

        <BookingFlow />

        {/* What to expect */}
        <div className="mt-20 contact-expect">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 text-center">What To Expect</p>
          <div className="grid md:grid-cols-3 gap-6 contact-process-grid">
            {steps.map((s, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-5">{s.i}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Step {String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-lg font-black text-slate-900 mb-2">{s.t}</h3>
                <p className="text-slate-500 font-medium text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 contact-trust-strip">
          {trust.map((t) => (
            <div key={t.l} className="bg-slate-900 text-white rounded-2xl p-6 text-center">
              <span className="contact-trust-icon" aria-hidden="true">{t.i}</span>
              <p className="text-2xl font-black text-emerald-400">{t.v}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{t.l}</p>
            </div>
          ))}
        </div>

        {/* Who this is for */}
        <div className="mt-16 bg-slate-50 rounded-[2.5rem] border border-slate-100 p-10 contact-fit">
          <h3 className="text-xl font-black text-slate-900 mb-6">The audit works best if you:</h3>
          <ul className="space-y-3">
            {[
              'Run a business doing $300K+ in annual revenue',
              'Have a team of 3 or more people',
              'Have at least one process that happens 10+ times per week and takes more than 20 minutes each time',
              'Are open to spending $1,000, $5,000 to build something that recovers 10x that amount per year',
            ].map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 font-medium"><CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" /> {p}</li>
            ))}
          </ul>
        </div>

        {/* Not ready */}
        <div className="mt-12 grid md:grid-cols-2 gap-6 contact-alternatives">
          <div className="bg-emerald-600 text-white rounded-[2rem] p-8">
            <h3 className="text-lg font-black mb-2">Not ready to book?</h3>
            <p className="text-emerald-50 font-medium text-sm mb-5">Get the Transformation Playbook every Tuesday. One real automation case, tools, steps, and what it cost.</p>
            {subscribed ? (
              <p className="font-bold">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={subscribe} className="flex gap-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="flex-1 px-4 py-3 rounded-xl text-slate-900 font-medium outline-none" />
                <button className="px-5 py-3 bg-white text-emerald-700 font-black rounded-xl hover:bg-emerald-50 transition-all">Subscribe</button>
              </form>
            )}
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-center">
            <h3 className="text-lg font-black text-slate-900 mb-2">Prefer to email first?</h3>
            <p className="text-slate-500 font-medium text-sm mb-3">We read everything.</p>
            <a href="mailto:info@aidatahouse.com" className="inline-flex items-center gap-2 text-emerald-600 font-black"><Mail size={18} /> info@aidatahouse.com</a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto contact-faq">
          <div className="space-y-4">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              const panelId = `contact-faq-panel-${i}`;
              return (
                <div key={i} className={`contact-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="contact-faq-question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <ChevronDown size={19} aria-hidden="true" />
                  </button>
                  <div id={panelId} className="contact-faq-answer" aria-hidden={!isOpen}>
                    <div><p>{f.a}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── LEGAL / SECURITY ────────────────────────────────────────────────────────
interface LegalSection { heading: string; body: string[] }

const LEGAL: Record<string, { title: string; meta: string; updated: string; intro: string; sections: LegalSection[] }> = {
  security: {
    title: 'Security & Data Handling',
    meta: 'How AI Data House protects client data, deploys securely, and handles compliance for automation and AI projects.',
    updated: 'June 2026',
    intro: 'Security is a build decision, not an afterthought. Here is how we handle your data, your credentials, and your infrastructure on every engagement.',
    sections: [
      { heading: 'Where your data lives', body: ['Wherever possible, we deploy automations inside your own accounts and infrastructure, your CRM, your Google Workspace, your cloud. We do not store client operational data on shared servers. Dedicated instances and private model deployments are available on request.'] },
      { heading: 'Credentials and access', body: ['API keys and credentials are stored in secure secret managers, never in code or in git history. Access is scoped to the minimum needed for the workflow, documented at handoff, and can be rotated or revoked by you at any time.'] },
      { heading: 'Transport and headers', body: ['The site runs over HTTPS with HSTS. We set X-Frame-Options, X-Content-Type-Options, and a strict referrer policy. Lead-intake webhooks are authenticated server-side, credentials are never exposed in the browser.'] },
      { heading: 'Compliance-sensitive work', body: ['For healthcare, legal, and financial workflows we design around your regulatory requirements. For HIPAA contexts we use only compliant communication tools with Business Associate Agreements and never process PHI in non-compliant environments. We disclose exactly what is and is not covered during scoping.'] },
      { heading: 'Reporting a vulnerability', body: ['If you believe you have found a security issue, email security@aidatahouse.com. See our security.txt at /.well-known/security.txt. We aim to acknowledge reports within two business days.'] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    meta: 'How AI Data House collects, uses, and protects information submitted through aidatahouse.com.',
    updated: 'June 2026',
    intro: 'This policy explains what information we collect through this website and how we use it. We keep it short and plain because that is the point.',
    sections: [
      { heading: 'What we collect', body: ['When you submit an audit request, contact form, or newsletter signup, we collect the information you provide, typically your name, business email, company, and a description of your needs. We also collect basic analytics (pages visited, referrer, device type) to understand how the site is used.'] },
      { heading: 'How we use it', body: ['We use your information to respond to your request, schedule and prepare for your audit, send the newsletter if you subscribed, and improve the site. We do not sell your personal information to third parties.'] },
      { heading: 'Where it goes', body: ['Form submissions are processed through our automation backbone (n8n) and stored in our CRM so we can follow up. We use reputable third-party tools (analytics, email, scheduling) that process data on our behalf under their own terms.'] },
      { heading: 'Your choices', body: ['You can unsubscribe from the newsletter at any time using the link in any email. You can request access to, correction of, or deletion of your information by emailing info@aidatahouse.com.'] },
      { heading: 'Cookies', body: ['We use essential cookies and privacy-respecting analytics to understand traffic. You can control cookies through your browser settings.'] },
      { heading: 'Contact', body: ['Questions about this policy? Email info@aidatahouse.com.'] },
    ],
  },
  terms: {
    title: 'Terms of Service',
    meta: 'The terms governing use of the AI Data House website and the information presented on it.',
    updated: 'June 2026',
    intro: 'These terms govern your use of this website. Project engagements are governed by a separate written agreement signed before any work begins.',
    sections: [
      { heading: 'Use of this site', body: ['This website is provided for general information about AI Data House and its services. You may not use it to attempt unauthorized access, disrupt the service, or scrape content at scale without permission.'] },
      { heading: 'No warranty on content', body: ['Pricing ranges, timelines, case-study figures, and ROI estimates shown here are illustrative and based on typical engagements. They are not a quote or a guarantee. Your actual scope, timeline, and cost are defined in a written proposal.'] },
      { heading: 'Engagements are separate', body: ['Any project we deliver is governed by a separate statement of work or contract that covers scope, payment, ownership, confidentiality, and support. Those terms control over anything implied by this website.'] },
      { heading: 'Intellectual property', body: ['The content, copy, and design of this site are owned by AI Data House. Code and systems we build for a client belong to that client per the engagement agreement.'] },
      { heading: 'Limitation of liability', body: ['To the extent permitted by law, AI Data House is not liable for indirect or consequential damages arising from use of this website.'] },
      { heading: 'Contact', body: ['Questions about these terms? Email info@aidatahouse.com.'] },
    ],
  },
};

export const LegalPage = ({ kind }: { kind: 'security' | 'privacy' | 'terms' }) => {
  const navigate = useNavigate();
  const data = LEGAL[kind];
  useSeo({
    title: `${data.title} | AI Data House`,
    description: data.meta,
    path: `/${kind}`,
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: data.title, path: `/${kind}` }]),
  });

  return (
    <div className="pt-40 pb-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {kind === 'security' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-6 border border-emerald-100">
            <ShieldCheck size={12} /> Security
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">{data.title}</h1>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-8">Last updated: {data.updated}</p>
        <p className="text-lg text-slate-600 font-medium leading-relaxed mb-12">{data.intro}</p>
        <div className="space-y-10">
          {data.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-xl font-black text-slate-900 mb-3">{s.heading}</h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-slate-600 font-medium leading-relaxed mb-3">{p}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
          <button onClick={() => navigate('/privacy')} className="text-sm font-bold text-slate-500 hover:text-emerald-600">Privacy</button>
          <button onClick={() => navigate('/terms')} className="text-sm font-bold text-slate-500 hover:text-emerald-600">Terms</button>
          <button onClick={() => navigate('/security')} className="text-sm font-bold text-slate-500 hover:text-emerald-600">Security</button>
          <button onClick={() => navigate('/contact')} className="text-sm font-bold text-emerald-600">Book a Free Audit →</button>
        </div>
      </div>
    </div>
  );
};
