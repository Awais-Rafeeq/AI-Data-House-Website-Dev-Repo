import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { INDUSTRIES } from '../../data/industries';
import { CASE_STUDIES } from '../../data/caseStudies';
import { sendToN8n, ACTIONS } from '../../lib/n8n';

/**
 * Industry picker for the homepage. Everything shown comes from the existing
 * INDUSTRIES data (the same source the /industries/:slug pages render), so the
 * homepage and the detail pages can never drift apart:
 *
 *   badge      <- navLabel
 *   quote      <- hero.headline      (already written as the client's own pain)
 *   summary    <- homeCard.blurb
 *   use cases  <- automations[].title
 *
 * The case-study link only renders for industries that actually have one —
 * Professional Services and Healthcare currently do not.
 */
const caseStudyFor = (navLabel: string) =>
  CASE_STUDIES.find((cs) => cs.industry === navLabel);

const IndustrySelector: React.FC = () => {
  const navigate = useNavigate();
  const [activeSlug, setActiveSlug] = useState(INDUSTRIES[0].slug);
  const active = INDUSTRIES.find((i) => i.slug === activeSlug) ?? INDUSTRIES[0];
  const caseStudy = caseStudyFor(active.navLabel);

  const go = (path: string, label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    sendToN8n(ACTIONS.CTA_CLICK, { location: 'Industries', label });
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <section className="ind">
      <div className="wrap">
        <div className="ind-head">
          <div className="ind-head-copy">
            <h2>AI deployed across the industries you operate in.</h2>
            <p>
              Select your industry to see the specific AI use cases, tools, and deployment
              approach AI Data House uses in your sector.
            </p>
          </div>
          <div className="ind-tabs" role="tablist" aria-label="Industries">
            {INDUSTRIES.map((i) => (
              <button
                key={i.slug}
                type="button"
                role="tab"
                aria-selected={i.slug === activeSlug}
                className={`ind-tab${i.slug === activeSlug ? ' active' : ''}`}
                onClick={() => setActiveSlug(i.slug)}
              >
                {i.navLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="ind-panel" key={active.slug}>
          <div className="ind-panel-main">
            <span className="ind-badge">{active.navLabel}</span>
            <blockquote className="ind-quote">“{active.hero.headline}”</blockquote>
            <p className="ind-summary">{active.homeCard.blurb}</p>
            <a
              className="btn btn-primary ind-cta"
              href={`/industries/${active.slug}`}
              onClick={go(`/industries/${active.slug}`, `Industry: ${active.navLabel}`)}
            >
              See the {active.navLabel} setup <ArrowRight size={16} />
            </a>
          </div>

          <div className="ind-panel-side">
            <p className="ind-side-label">Common use cases</p>
            <ul className="ind-cases">
              {active.automations.slice(0, 4).map((a) => (
                <li key={a.title}>{a.title}</li>
              ))}
            </ul>
            {caseStudy && (
              <a
                className="ind-case-link"
                href={`/case-studies/${caseStudy.slug}`}
                onClick={go(`/case-studies/${caseStudy.slug}`, `Case study: ${caseStudy.title}`)}
              >
                Read: {active.navLabel} case study <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustrySelector;
