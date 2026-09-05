import React, { useState } from 'react';
import { sendToN8n, ACTIONS } from '../../lib/n8n';

type Status = 'idle' | 'sending' | 'done' | 'error';

/** Decorative asterisk in the corner of the band, as in the reference. */
const Asterisk: React.FC = () => (
  <svg className="news-star" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    {[0, 45, 90, 135].map((deg) => (
      <rect key={deg} x="43" y="6" width="14" height="88" rx="7" transform={`rotate(${deg} 50 50)`} />
    ))}
  </svg>
);

/**
 * Newsletter band. Posts to the same n8n newsletter action the footer form
 * uses, so both signup points land in one place.
 */
const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'sending') return;
    setStatus('sending');
    // Unlike the footer form, the result is actually checked so a failed
    // webhook does not report success to the visitor.
    const res = await sendToN8n(ACTIONS.NEWSLETTER, { email, source: 'Homepage newsletter band' });
    if (res?.success) {
      setStatus('done');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="news" aria-labelledby="news-heading">
      <div className="news-band">
        <Asterisk />
        <div className="wrap news-grid">
          <div className="news-copy">
            <p className="news-eyebrow">Newsletter</p>
            <h2 id="news-heading">Automation notes, straight to your inbox.</h2>
            <p className="news-sub">
              No generic AI hype. Just what we learn building these systems — what worked,
              what broke, and what we would do differently next time.
            </p>
          </div>

          <div className="news-action">
            {status === 'done' ? (
              <p className="news-done" role="status">You’re on the list. Talk soon.</p>
            ) : (
              <form className="news-form" onSubmit={submit}>
                <label className="news-label" htmlFor="news-email">Email address</label>
                <input
                  id="news-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                />
                <button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Subscribe'}
                </button>
              </form>
            )}
            <p className={`news-note${status === 'error' ? ' news-note-error' : ''}`} role={status === 'error' ? 'alert' : undefined}>
              {status === 'error'
                ? 'That did not go through. Try again, or email info@aidatahouse.com.'
                : 'No spam. Unsubscribe anytime.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
