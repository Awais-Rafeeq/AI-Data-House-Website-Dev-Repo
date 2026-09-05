import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, CheckCircle, ShieldCheck, ArrowLeftRight } from 'lucide-react';
import { getIndustry } from '../data/industries';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import { useSeo, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from '../lib/seo';

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">{children}</h2>
);

const IndustryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const ind = getIndustry(slug);

  useSeo({
    title: ind ? ind.metaTitle : 'Industry Not Found | AI Data House',
    description: ind ? ind.metaDescription : '',
    path: `/industries/${slug}`,
    image: ind ? `/images/og/og-industry-${ind.slug}.png` : undefined,
    jsonLd: ind
      ? [
          serviceJsonLd(`AI Automation for ${ind.navLabel}`, ind.metaDescription, `/industries/${ind.slug}`),
          faqJsonLd(ind.faqs),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: '/industries' },
            { name: ind.navLabel, path: `/industries/${ind.slug}` },
          ]),
        ]
      : undefined,
  });

  if (!ind) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen">
        <h1 className="text-4xl font-black mb-4">Industry Not Found</h1>
        <button onClick={() => navigate('/')} className="text-emerald-600 font-bold underline">Return Home</button>
      </div>
    );
  }

  const book = (location: string) => {
    sendToN8n(ACTIONS.CTA_CLICK, { location, industry: ind.navLabel });
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-emerald-600 blur-[180px] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6">AI Automation for {ind.navLabel}</p>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-6">{ind.hero.headline}</h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8">{ind.hero.sub}</p>
            <div className="flex flex-col lg:flex-row gap-4">
              <button onClick={() => book('IndustryHero')} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                {ind.hero.cta1} <ArrowRight size={18} />
              </button>
              <a href="#automations" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                {ind.hero.cta2}
              </a>
            </div>
          </div>
          <div className="relative">
            <img src={ind.image} alt={ind.navLabel} className="w-full rounded-[2rem] shadow-2xl border border-white/10" />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>The Problem</Eyebrow>
          {ind.problem.body.map((p, i) => (
            <p key={i} className={`font-medium leading-relaxed mb-5 ${i === 0 ? 'text-2xl text-slate-900 font-black' : 'text-lg text-slate-500'}`}>{p}</p>
          ))}
          <div className="mt-8 bg-rose-50 border border-rose-100 rounded-[2rem] p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">{ind.problem.statHeading}</p>
            {ind.problem.statBody.map((p, i) => (
              <p key={i} className="text-slate-700 font-semibold mb-3 leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* THE AFTER */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xs font-black tracking-[0.3em] text-emerald-400 uppercase mb-4">The After</h2>
          <h3 className="text-3xl md:text-4xl font-black mb-10">Here's what changes once the systems are running.</h3>
          <div className="space-y-6">
            {ind.after.map((p, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle size={22} className="text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-300 font-medium leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTOMATIONS */}
      <section id="automations" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Eyebrow>What We Build</Eyebrow>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900">{ind.automationsHeading}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {ind.automations.map((a, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <h4 className="text-xl font-black text-slate-900">{a.title}</h4>
                </div>
                <div className="mb-3 flex items-start gap-2">
                  <ArrowLeftRight size={14} className="text-rose-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-slate-500 font-medium"><span className="font-black text-slate-700">Replaces:</span> {a.replaces}</p>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-3">{a.does}</p>
                {a.sees && <p className="text-sm text-emerald-700 font-bold bg-emerald-50 rounded-xl p-3">{a.sees}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 blur-[100px] opacity-20"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6">Real Result</p>
              {ind.proof.map((p, i) => (
                <p key={i} className={`leading-relaxed mb-5 ${i === 0 ? 'text-xl font-bold text-white' : 'text-slate-300 font-medium'}`}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><Eyebrow>Tech Stack</Eyebrow><h3 className="text-3xl font-black text-slate-900">Tools you'll recognize.</h3></div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                {ind.techStack.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-4 font-black text-slate-900 w-1/2">{t.fn}</td>
                    <td className="p-4 text-slate-500 font-semibold">{t.tool}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HEALTHCARE NOTE */}
      {ind.healthcareNote && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <ShieldCheck size={28} className="text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-black text-slate-900 mb-1">Healthcare Note</p>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{ind.healthcareNote}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRICING */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><Eyebrow>Timeline + Investment</Eyebrow><h3 className="text-3xl font-black text-slate-900">Build it in phases.</h3></div>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
                  <th className="p-5 font-black">Phase</th>
                  <th className="p-5 font-black hidden md:table-cell">What Gets Built</th>
                  <th className="p-5 font-black">Timeline</th>
                  <th className="p-5 font-black">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {ind.pricing.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-5 font-black text-slate-900">{p.phase}</td>
                    <td className="p-5 text-slate-500 font-medium hidden md:table-cell">{p.built}</td>
                    <td className="p-5 text-slate-600 font-semibold whitespace-nowrap">{p.timeline}</td>
                    <td className="p-5 text-emerald-600 font-black whitespace-nowrap">{p.investment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ind.pricingNote && <p className="text-center text-sm text-slate-500 font-semibold mt-6">{ind.pricingNote}</p>}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><Eyebrow>FAQ</Eyebrow><h3 className="text-3xl font-black text-slate-900">Real objections, real answers.</h3></div>
          <div className="space-y-3">
            {ind.faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className="font-black text-slate-900 pr-4">{f.q}</span>
                  <ChevronDown size={18} className={`text-emerald-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed text-sm">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-emerald-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">{ind.cta.headline}</h2>
          <p className="text-lg text-emerald-50 font-medium mb-10">{ind.cta.sub}</p>
          <button onClick={() => book('IndustryFooterCTA')} className="px-10 py-5 bg-white text-emerald-700 font-black rounded-2xl shadow-2xl hover:bg-emerald-50 transition-all inline-flex items-center gap-3 text-lg">
            {ind.cta.button} <ArrowRight size={20} />
          </button>
          {ind.cta.below && <p className="text-sm text-emerald-100 font-medium mt-8 max-w-xl mx-auto">{ind.cta.below}</p>}
        </div>
      </section>
    </div>
  );
};

export default IndustryPage;
