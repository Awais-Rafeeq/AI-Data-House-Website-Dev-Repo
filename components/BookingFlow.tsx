import React, { useState } from 'react';
import { Check, Loader2, Calendar, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { sendToN8n, ACTIONS } from '../lib/n8n';

// Notion scheduler. It sets `frame-ancestors` to Notion only, so it CANNOT be
// iframed on our site (would render blank). We open it in a new tab instead.
const CALENDAR_URL = 'https://calendar.notion.so/meet/awaisrafeeq/discoverycall';

const SERVICES = [
  'Not sure yet, help me figure it out',
  'Lead Rescue (capture + follow up leads)',
  'Ops Autopilot (workflow automation)',
  'Decision Dashboard (live reporting)',
  'Always-On Agent (AI voice / chat)',
  'Business OS (full build)',
];

// Calendar-first booking. The old version gated the calendar behind a 5-step
// wizard; ready buyers now book in one click. The short form on the side is
// OPTIONAL, for people not ready to book yet, and still posts to the same n8n
// consultation hook.
const BookingFlow: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', service_type: SERVICES[0], message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const bookClick = () => {
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'Contact', label: 'Open scheduler' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setIsSubmitting(true);
    const res = await sendToN8n(ACTIONS.CONSULTATION, {
      ...form,
      is_qualified: true,
      lead_source: 'Contact page quick form',
    });
    setIsSubmitting(false);
    if (res.success) setSent(true);
    else alert('Something went wrong. Please email info@aidatahouse.com and we will get right back to you.');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6 items-start">

        {/* PRIMARY: book in one click */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.06)] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0"><Calendar size={20} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">Book your free 30-minute audit</h2>
              <p className="text-sm text-slate-500 font-medium">Pick a time that works. No form required.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200"><Calendar size={30} /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Grab a slot in under a minute</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">See our live availability and pick the time that suits you. No pitch, just a clear read on your best automation opportunity.</p>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={bookClick}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all text-lg"
            >
              Open the calendar <ArrowRight size={20} />
            </a>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {['30 minutes', 'No pitch', 'Free', 'US timezone'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <Check size={13} className="text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SECONDARY: optional prep / not-ready capture */}
        <div className="bg-slate-900 rounded-[2rem] p-7 md:p-8 text-white lg:sticky lg:top-28">
          {sent ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-emerald-500/15 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5"><Check size={28} /></div>
              <h3 className="text-xl font-black mb-2">Got it, thank you.</h3>
              <p className="text-slate-300 text-sm font-medium">We will be in touch within one business day. If you want, grab a calendar slot now so we can talk sooner.</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-black mb-1">Not ready to book?</h3>
              <p className="text-slate-400 text-sm font-medium mb-6">Leave your details and we will reach out. Or tell us what you need so we come prepared.</p>
              <form onSubmit={submit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium placeholder:text-slate-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium placeholder:text-slate-500"
                />
                <select
                  value={form.service_type}
                  onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-200"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s} className="text-slate-900">{s}</option>
                  ))}
                </select>
                <textarea
                  placeholder="What is eating up your team's time? (optional)"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium placeholder:text-slate-500 resize-none"
                />
                <button
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Send it over'}
                </button>
              </form>
            </>
          )}

          <div className="mt-7 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <Clock size={14} className="text-emerald-400" /> Replies within one business day
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" /> US timezone coverage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
