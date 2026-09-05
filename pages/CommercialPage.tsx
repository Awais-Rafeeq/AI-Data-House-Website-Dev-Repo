import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import { getCommercialPage } from '../data/commercialPages';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import { useSeo, serviceJsonLd, faqJsonLd, breadcrumbJsonLd } from '../lib/seo';

// Renders the bottom-funnel commercial ("hire us") landing pages. Content lives
// in data/commercialPages.ts; SEO is mirrored in lib/seoConfig.ts for prerender.
const CommercialPage = ({ slug }: { slug: string }) => {
  const navigate = useNavigate();
  const page = getCommercialPage(slug);

  useSeo({
    title: page ? page.metaTitle : 'Page Not Found | AI Data House',
    description: page ? page.metaDescription : '',
    path: `/${slug || ''}`,
    image: page ? `/images/og/og-${page.slug}.png` : '/images/og/og-solutions.png',
    jsonLd: page
      ? [
          serviceJsonLd(page.navLabel, page.metaDescription, `/${page.slug}`),
          faqJsonLd(page.faqs),
          breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: page.navLabel, path: `/${page.slug}` }]),
        ]
      : undefined,
  });

  if (!page) return <Navigate to="/" replace />;

  const book = (label: string) => {
    sendToN8n(ACTIONS.CTA_CLICK, { location: `Commercial:${page.slug}`, label });
    navigate('/contact');
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-5">{page.hero.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">{page.hero.headline}</h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-3xl mb-8 leading-relaxed">{page.hero.sub}</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => book(page.hero.cta)}
              className="px-8 py-4 bg-emerald-600 text-white font-black rounded-xl shadow-lg hover:bg-emerald-700 transition-all inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {page.hero.cta} <ArrowRight size={18} aria-hidden="true" />
            </button>
            <span className="text-sm font-bold text-slate-500">30 minutes. No pitch. No obligation.</span>
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="py-10 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            {page.proof.map((p) => (
              <div key={p.label}>
                <p className="text-2xl md:text-4xl font-black text-white mb-1">{p.metric}</p>
                <p className="text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-widest">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {page.intro.map((para, i) => (
            <p key={i} className="text-lg text-slate-600 font-medium leading-relaxed">{para}</p>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">{page.servicesHeading}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.services.map((s) => (
              <div key={s.title} className="p-6 rounded-2xl border border-slate-200 bg-white">
                <h3 className="font-black text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">Why businesses hire us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {page.whyUs.map((w) => (
              <div key={w.title} className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 bg-slate-50">
                <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-black text-slate-900 mb-1">{w.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">How it works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.process.map((p) => (
              <div key={p.step} className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">{p.step}</p>
                <h3 className="font-black text-white text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">Common questions</h2>
          <div className="space-y-6">
            {page.faqs.map((f) => (
              <div key={f.q} className="border-b border-slate-100 pb-6">
                <h3 className="font-black text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">Related</p>
          <ul className="space-y-2">
            {page.related.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  onClick={(e) => { if (r.href.startsWith('/')) { e.preventDefault(); navigate(r.href); } }}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 px-5 py-4 font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span>{r.label}</span>
                  <ChevronRight size={16} className="text-emerald-500 flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{page.cta.headline}</h2>
          <p className="text-lg text-emerald-100 font-medium mb-8 leading-relaxed">{page.cta.sub}</p>
          <button
            onClick={() => book(page.cta.button)}
            className="px-8 py-4 bg-white text-emerald-700 font-black rounded-xl hover:bg-emerald-50 transition-all inline-flex items-center gap-2 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-600"
          >
            {page.cta.button} <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CommercialPage;
