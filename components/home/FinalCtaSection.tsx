import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { sendToN8n, ACTIONS } from '../../lib/n8n';

/**
 * Closing call to action. A deep panel on the white page: it is the only dark
 * surface on the homepage, which is what makes it read as the end of the story
 * rather than one more section.
 *
 * Same copy and destinations as the markup block this replaced.
 */
// Kept short so the row stays on one line at desktop width.
const PROMISES = [
  '100% free',
  'No pitch, no pressure',
  'ROI estimate in 30 min',
  'Reply in under 24h',
];

const FinalCtaSection: React.FC = () => {
  const navigate = useNavigate();

  const go = (label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'Final CTA', label });
    navigate('/contact');
    window.scrollTo(0, 0);
  };

  return (
    <section className="fcta" id="cta" aria-labelledby="fcta-heading">
      <div className="wrap">
        <div className="fcta-panel">
          {/* Decorative: a soft green bloom and a faint grid, both behind the copy. */}
          <span className="fcta-glow" aria-hidden="true" />
          <span className="fcta-grid" aria-hidden="true" />

          <div className="fcta-inner">
            <p className="fcta-eyebrow">
              <span className="pulse-dot"><span></span></span>
              Free 30-minute audit
            </p>

            <h2 id="fcta-heading">
              Ready to stop running your business
              <br />
              on spreadsheets?
            </h2>

            <p className="fcta-sub">
              We look at your workflows, find your highest-ROI automation, and tell you
              exactly what it takes to build it. No pitch. Just a clear diagnosis.
            </p>

            <div className="fcta-actions">
              <a className="fcta-btn fcta-btn-primary" href="/contact" onClick={go('Book Free Audit')}>
                Book Free Audit <span className="arrow">→</span>
              </a>
              <a className="fcta-btn fcta-btn-ghost" href="/contact" onClick={go('Send us your workflow challenge')}>
                Send us your workflow challenge
              </a>
            </div>

            <ul className="fcta-promises">
              {PROMISES.map((p) => (
                <li key={p}>
                  <span className="fcta-check" aria-hidden="true"><Check size={12} strokeWidth={3.4} /></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
