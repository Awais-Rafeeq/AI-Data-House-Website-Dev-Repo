import React, { useCallback, useState } from 'react';
import { Check, Loader2, Calendar, ShieldCheck, Clock, ArrowRight, Send, LockKeyhole } from 'lucide-react';
import { sendToN8n, ACTIONS } from '../lib/n8n';
import { submitContactForm } from '../lib/contact';
import TurnstileWidget from './TurnstileWidget';
import { n8nActionToGaEvent, trackEvent } from '../lib/analytics';

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [formError, setFormError] = useState('');
  const [website, setWebsite] = useState('');

  const handleTokenChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) setFormError('');
  }, []);

  const bookClick = () => {
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'Contact', label: 'Open scheduler' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    if (!turnstileToken) {
      setFormError('Please wait for secure verification to finish, then submit again.');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    trackEvent(n8nActionToGaEvent(ACTIONS.CONSULTATION));
    const res = await submitContactForm(form, turnstileToken, website);
    setIsSubmitting(false);
    if (res.success) {
      setSent(true);
      return;
    }

    setTurnstileReset((value) => value + 1);
    setFormError(res.error || 'Something went wrong. Please try again or email info@aidatahouse.com.');
  };

  return (
    <div className="contact-conversion">
      <div className="contact-paths">
        <section className="contact-path contact-path-calendar" aria-labelledby="booking-title">
          <div className="contact-path-heading">
            <div className="contact-path-icon"><Calendar size={20} aria-hidden="true" /></div>
            <div>
              <p className="contact-path-kicker">Fastest route</p>
              <h2 id="booking-title">Book your free 30-minute audit</h2>
              <p>Pick a time that works. No form required.</p>
            </div>
          </div>

          <div className="contact-calendar-panel">
            <div className="contact-calendar-icon"><Calendar size={28} aria-hidden="true" /></div>
            <h3>Grab a slot in under a minute</h3>
            <p>See our live availability and pick the time that suits you. No pitch, just a clear read on your best automation opportunity.</p>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={bookClick}
              className="contact-calendar-cta"
            >
              Open the calendar <ArrowRight size={19} aria-hidden="true" />
            </a>
            <div className="contact-calendar-facts">
              {['30 minutes', 'No pitch', 'Free', 'US timezone'].map((t) => (
                <span key={t}>
                  <Check size={13} aria-hidden="true" /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-path contact-path-form" aria-labelledby="contact-form-title">
          {sent ? (
            <div className="contact-success" role="status">
              <div><Check size={27} aria-hidden="true" /></div>
              <h3>Got it, thank you.</h3>
              <p>Your request arrived safely. We will be in touch within one business day. If you want, grab a calendar slot now so we can talk sooner.</p>
              <p className="contact-success-note">If you receive a confirmation email from AI Data House, reply with anything we should know before the call.</p>
            </div>
          ) : (
            <>
              <div className="contact-form-intro">
                <p className="contact-path-kicker">Prefer a message?</p>
                <h3 id="contact-form-title">Not ready to book?</h3>
                <p>Leave your details and we will reach out. Or tell us what you need so we come prepared.</p>
              </div>
              <form onSubmit={submit} className="contact-form">
                <div className="contact-field">
                  <label htmlFor="contact-name">Name</label>
                  <input id="contact-name" type="text" autoComplete="name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email">Work email <span aria-hidden="true">*</span></label>
                  <input id="contact-email" type="email" autoComplete="email" required placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={254} />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-service">What can we help with?</label>
                  <select id="contact-service" value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })}>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-message">What is eating up your team's time? <span>(optional)</span></label>
                  <textarea id="contact-message" placeholder="What is eating up your team's time? (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} maxLength={3000} />
                </div>
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <TurnstileWidget onTokenChange={handleTokenChange} resetSignal={turnstileReset} />
                {formError && <p className="contact-form-error" role="alert">{formError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                  className="contact-submit"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={19} aria-hidden="true" /> Sending securely...</> : <>Send it over <Send size={17} aria-hidden="true" /></>}
                </button>
                {!turnstileToken && !formError && <p className="contact-submit-hint"><LockKeyhole size={13} aria-hidden="true" /> Submit unlocks after secure verification.</p>}
              </form>
            </>
          )}

          <div className="contact-form-trust">
            <div>
              <Clock size={14} aria-hidden="true" /> Replies within one business day
            </div>
            <div>
              <ShieldCheck size={14} aria-hidden="true" /> US timezone coverage
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingFlow;
