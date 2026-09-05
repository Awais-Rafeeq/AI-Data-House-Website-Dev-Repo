import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, CheckCircle, Quote, Clock, Users } from 'lucide-react';
import { CASE_STUDIES, getCaseStudy } from '../data/caseStudies';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import { useSeo, breadcrumbJsonLd } from '../lib/seo';

export const CaseStudyIndexPage = () => {
  const navigate = useNavigate();
  useSeo({
    title: 'AI Automation Case Studies, Real Results | AI Data House',
    description: 'Real before-and-after numbers from US businesses we have automated: real estate, e-commerce, restaurants, and agencies. NDA-anonymized, results verified.',
    path: '/case-studies',
    image: '/images/og/og-solutions.png',
    jsonLd: breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Case Studies', path: '/case-studies' }]),
  });

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Proven Results</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">Real clients. Real numbers.</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">Every engagement below is anonymized under NDA, but the before-and-after numbers are real. Full architecture available on request.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {CASE_STUDIES.map((cs) => (
            <button
              key={cs.slug}
              onClick={() => navigate(`/case-studies/${cs.slug}`)}
              className="group text-left bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <span className="absolute bottom-4 left-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{cs.industry}</span>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h2 className="text-xl font-black text-slate-900 mb-3 leading-snug group-hover:text-emerald-600 transition-colors">{cs.title}</h2>
                <p className="text-slate-500 font-medium text-sm mb-6 flex-1">{cs.summary}</p>
                <span className="flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:gap-3 transition-all">Read the breakdown <ArrowRight size={16} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CaseStudyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const cs = getCaseStudy(slug);

  useSeo({
    title: cs ? `${cs.title} | AI Data House` : 'Case Study Not Found',
    description: cs ? cs.metaDescription : '',
    path: `/case-studies/${slug}`,
    image: cs?.image,
    type: 'article',
    jsonLd: cs ? breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Case Studies', path: '/case-studies' }, { name: cs.title, path: `/case-studies/${cs.slug}` }]) : undefined,
  });

  if (!cs) return <Navigate to="/case-studies" replace />;

  const book = () => {
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'CaseStudy', caseStudy: cs.slug });
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-emerald-600 blur-[160px] opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button onClick={() => navigate('/case-studies')} className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 font-bold uppercase tracking-widest text-xs mb-8 transition-colors">
            <ChevronLeft size={16} /> All Case Studies
          </button>
          <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">{cs.industry}</span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">{cs.title}</h1>
          <p className="text-lg text-slate-300 font-medium mb-8">{cs.summary}</p>
          <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-2"><Users size={16} /> {cs.companySize}</span>
            <span className="flex items-center gap-2"><Clock size={16} /> Built in {cs.duration}</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">The Challenge</h2>
            <ul className="space-y-4">
              {cs.challenge.map((c, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 font-medium"><span className="text-rose-400 font-black mt-0.5">×</span> {c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">What We Built</h2>
            <ul className="space-y-4">
              {cs.solution.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 font-medium"><CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" /> {s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Results table */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">The Numbers</h2>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
                  <th className="p-5 font-black">Metric</th>
                  <th className="p-5 font-black">Before</th>
                  <th className="p-5 font-black">After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {cs.results.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-5 font-black text-slate-900">{r.metric}</td>
                    <td className="p-5 text-slate-400 font-semibold">{r.before}</td>
                    <td className="p-5 text-emerald-600 font-black">{r.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {cs.tools.map((t) => (
              <span key={t} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-wider">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {cs.quote && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Quote size={36} className="text-emerald-500 mx-auto mb-6" />
            <p className="text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-6">"{cs.quote.text}"</p>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">, {cs.quote.author}, {cs.quote.role}</p>
          </div>
        </section>
      )}

      <section className="py-24 bg-emerald-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black mb-5">Want results like these for your business?</h2>
          <p className="text-emerald-50 font-medium mb-8">Book a free 30-minute AI Audit and we'll map your highest-ROI automation.</p>
          <div className="flex flex-col lg:flex-row gap-4 justify-center">
            <button onClick={book} className="px-8 py-4 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all inline-flex items-center justify-center gap-2">Book a Free AI Audit <ArrowRight size={18} /></button>
            <button onClick={() => navigate(`/solutions/${cs.relatedSolution.slug}`)} className="px-8 py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all">Explore {cs.relatedSolution.label}</button>
          </div>
        </div>
      </section>
    </div>
  );
};
