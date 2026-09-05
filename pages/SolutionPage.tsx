import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, CheckCircle, Check, Clock, ShieldCheck, ArrowLeft, PhoneCall, BookOpen,
} from 'lucide-react';
import { getSolution, LEGACY_SOLUTION_SLUGS } from '../data/solutions';
import SolutionInfographic from '../components/SolutionInfographic';
import { getPostMeta } from '../data/blog';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import { useSeo, faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from '../lib/seo';

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">{children}</h2>
);

const SolutionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Redirect legacy slugs to canonical ones
  if (slug && LEGACY_SOLUTION_SLUGS[slug]) {
    return <Navigate to={`/solutions/${LEGACY_SOLUTION_SLUGS[slug]}`} replace />;
  }

  const s = getSolution(slug);

  useSeo({
    title: s ? s.metaTitle : 'Solution Not Found | AI Data House',
    description: s ? s.metaDescription : '',
    path: `/solutions/${slug}`,
    image: s?.image,
    jsonLd: s
      ? [
          serviceJsonLd(s.navLabel, s.metaDescription, `/solutions/${s.slug}`),
          faqJsonLd(s.faqs),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Solutions', path: '/solutions' },
            { name: s.navLabel, path: `/solutions/${s.slug}` },
          ]),
        ]
      : undefined,
  });

  if (!s) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen">
        <h1 className="text-4xl font-black mb-4">Solution Not Found</h1>
        <button onClick={() => navigate('/')} className="text-emerald-600 font-bold underline">Return Home</button>
      </div>
    );
  }

  const book = (location: string) => {
    sendToN8n(ACTIONS.CTA_CLICK, { location, solution: s.navLabel });
    navigate('/contact');
  };

  const relatedPosts = (s.relatedPosts || []).map(getPostMeta).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600 blur-[180px] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <button onClick={() => navigate('/solutions/' + s.slug)} className="hidden" aria-hidden />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6">AI Data House Solution</p>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-5">{s.hero.headline}</h1>
            <p className="text-xl md:text-2xl font-black text-emerald-400 leading-snug mb-6">{s.whatItIs}</p>
            <p className="text-lg text-slate-200 font-medium leading-relaxed mb-8 max-w-xl">{s.hero.sub}</p>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <button onClick={() => book('SolutionHero')} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                {s.hero.primaryCta} <ArrowRight size={18} />
              </button>
              <a href="#how-it-works" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                {s.hero.secondaryCta}
              </a>
            </div>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{s.hero.trustRow}</p>
          </div>
          <div className="relative">
            <SolutionInfographic slug={s.slug} />
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
              <span className="text-3xl md:text-4xl font-black text-emerald-400 whitespace-nowrap">{s.bigStat.value}</span>
              <span className="text-sm text-slate-200 font-semibold leading-snug">{s.bigStat.label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* VOICE DEMO (voice agents page only) */}
      {s.hasVoiceDemo && (
        <section className="py-12 bg-emerald-50 border-y border-emerald-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-5 border border-emerald-100">
              <PhoneCall size={12} /> Live Demo
            </div>
            <h2 className="text-3xl font-black mb-4 text-slate-900">AI Voice Agent Taking a Restaurant Order</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto font-medium">Hear what a real AI receptionist sounds like. It reads a live menu, takes the order, and confirms, in a natural voice.</p>
            <button onClick={() => navigate('/solutions/restaurant-ai')} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-500 transition-all inline-flex items-center gap-2">
              Launch Interactive Demo <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* PROBLEM */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>The Problem</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6 max-w-3xl">{s.problem.headline}</h2>
          {s.problem.body.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? 'text-xl text-slate-800 font-semibold leading-relaxed mb-5 max-w-[65ch]'
                  : 'text-lg text-slate-600 font-medium leading-relaxed mb-5 max-w-[65ch]'
              }
            >
              {p}
            </p>
          ))}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {s.problem.costs.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <span className="text-rose-400 font-black mt-0.5">×</span>
                <span className="text-slate-700 font-semibold text-sm leading-relaxed">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO FOR */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>Who It Is For</Eyebrow>
          <h2 className="text-3xl font-black text-slate-900 mb-8">{s.whoFor.intro}</h2>
          <ul className="space-y-3 mb-10">
            {s.whoFor.points.map((p, i) => (
              <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-100">
                <Check size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-semibold">{p}</span>
              </li>
            ))}
          </ul>
          <div className="bg-slate-900 text-white p-6 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Industries we serve most</p>
            <p className="font-bold">{s.whoFor.industries}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">{s.workflowsHeading}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {s.workflows.map((w, i) => (
              <div key={i} className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <h3 className="text-xl font-black text-slate-900">{w.title}</h3>
                </div>
                {w.before && (
                  <div className="mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Before</p>
                    <p className="text-sm text-slate-600 font-medium">{w.before}</p>
                  </div>
                )}
                {w.after && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">After</p>
                    <p className="text-sm text-slate-700 font-semibold">{w.after}</p>
                  </div>
                )}
                {w.body && <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">{w.body}</p>}
                <p className="text-xs text-slate-400 font-bold border-t border-slate-200 pt-3">{w.tools}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-black tracking-[0.3em] text-emerald-400 uppercase mb-4">Tech Stack</h2>
            <h3 className="text-3xl font-black">We build around the tools you already use.</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {s.techStack.map((t, i) => (
              <div key={i} className="flex gap-4 p-5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <span className="text-emerald-400 font-black text-xs uppercase tracking-widest w-40 flex-shrink-0">{t.label}</span>
                <span className="text-slate-300 font-semibold text-sm">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Eyebrow>Timeline + Pricing</Eyebrow>
            <h3 className="text-3xl font-black text-slate-900">Clear scope. Clear cost.</h3>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
                  <th className="p-5 font-black">Scope</th>
                  <th className="p-5 font-black hidden md:table-cell">What's Included</th>
                  <th className="p-5 font-black">Timeline</th>
                  <th className="p-5 font-black">Starting At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {s.pricing.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-5 font-black text-slate-900">{p.scope}</td>
                    <td className="p-5 text-slate-500 font-medium hidden md:table-cell">{p.includes}</td>
                    <td className="p-5 text-slate-600 font-semibold whitespace-nowrap">{p.timeline}</td>
                    <td className="p-5 text-emerald-600 font-black whitespace-nowrap">{p.startingAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 md:p-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-6 border border-emerald-100">
              <CheckCircle size={12} /> {s.proof.heading}
            </div>
            <div className="space-y-5">
              <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">The situation</p><p className="text-slate-600 font-medium">{s.proof.situation}</p></div>
              <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">What we built</p><p className="text-slate-600 font-medium">{s.proof.built}</p></div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">The result</p>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-4xl md:text-5xl font-black text-emerald-600 leading-none">{s.bigStat.value}</span>
                  <span className="text-sm font-bold text-slate-700 leading-snug">{s.bigStat.label}</span>
                </div>
                <p className="text-slate-800 font-semibold leading-relaxed">{s.proof.result}</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-400 italic">{s.proof.note}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14"><Eyebrow>FAQ</Eyebrow><h3 className="text-3xl font-black text-slate-900">Questions, answered.</h3></div>
          <div className="space-y-3">
            {s.faqs.map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
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

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-8 flex items-center gap-2"><BookOpen size={14} /> Keep Reading</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((p: any) => (
                <button key={p.slug} onClick={() => navigate(`/resources/${p.slug}`)} className="text-left bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-emerald-200 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{p.category}</span>
                  <p className="font-black text-slate-900 mt-2 leading-snug">{p.title}</p>
                  <span className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-3"><Clock size={12} /> {p.readTime} read</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-28 bg-emerald-600 text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">{s.cta.headline}</h2>
          <p className="text-lg text-emerald-50 font-medium mb-10">{s.cta.body}</p>
          <button onClick={() => book('SolutionFooterCTA')} className="px-10 py-5 bg-white text-emerald-700 font-black rounded-2xl shadow-2xl hover:bg-emerald-50 transition-all inline-flex items-center gap-3 text-lg">
            {s.cta.button} <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default SolutionPage;
