import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { CASE_STUDIES } from '../../data/caseStudies';
import { sendToN8n, ACTIONS } from '../../lib/n8n';

const realBefore = (before: string) => {
  const v = before.trim().replace(/,$/, '').trim();
  return v.length > 0 ? v : null;
};

const METRIC_ICONS = [Clock3, Clock3, CheckCircle2] as const;

const CaseStudiesSection: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const total = CASE_STUDIES.length;
  const active = CASE_STUDIES[index];
  const metrics = active.results.slice(0, 3);

  const step = (delta: number) => setIndex((i) => (i + delta + total) % total);

  const openCaseStudiesIndex = (e: React.MouseEvent) => {
    e.preventDefault();
    sendToN8n(ACTIONS.CTA_CLICK, {
      location: 'Case studies',
      label: 'View all case studies',
    });
    navigate('/case-studies');
    window.scrollTo(0, 0);
  };

  const openCaseStudy = (e: React.MouseEvent) => {
    e.preventDefault();
    sendToN8n(ACTIONS.CTA_CLICK, {
      location: 'Case studies',
      label: `Case study: ${active.title}`.slice(0, 48),
    });
    navigate(`/case-studies/${active.slug}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="cases" id="case-studies" aria-labelledby="cases-heading">
      <div className="wrap">
        <div className="cases-head">
          <div>
            <p className="eyebrow">Case studies</p>
            <h2 id="cases-heading">Systems built to replace busywork with measurable outcomes.</h2>
          </div>
          <a className="cases-all" href="/case-studies" onClick={openCaseStudiesIndex}>
            View all case studies <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>

        <div className="cs-panel" key={active.slug}>
          <div className="cs-showcase">
            <div className="cs-media">
              <img src={active.image} alt={`${active.industry} case study`} loading="lazy" />
            </div>

            <div className="cs-insight">
              <span className="cs-insight-icon" aria-hidden="true">
                <Sparkles size={23} strokeWidth={2} />
              </span>
              <p>{active.homeCard.system}</p>
            </div>

            <div className="cs-metrics">
              {metrics.map((m, i) => {
                const before = realBefore(m.before);
                const Icon = METRIC_ICONS[i] || CheckCircle2;
                return (
                  <div className="cs-metric" key={m.metric}>
                    <Icon className="cs-metric-icon" size={26} strokeWidth={2} aria-hidden="true" />
                    <b className={m.after.length > 12 ? 'is-long' : undefined}>{m.after}</b>
                    <span className="cs-metric-label">{m.metric}</span>
                    {before && <span className="cs-metric-from">from {before}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cs-body">
            <div className="cs-meta">
              <span className="cs-kicker">Featured transformation</span>
              <span className="cs-badge">{active.industry}</span>
              <span className="cs-meta-facts">
                {active.companySize} {'\u00b7'} {active.duration}
              </span>
            </div>

            <h3 className="cs-title">{active.title}</h3>
            <p className="cs-summary">{active.summary}</p>

            <ul className="cs-tools" aria-label="Technologies used">
              {active.tools.map((t) => <li key={t}>{t}</li>)}
            </ul>

            <a
              className="btn btn-primary cs-cta"
              href={`/case-studies/${active.slug}`}
              onClick={openCaseStudy}
            >
              View Case Study <span className="arrow">{'\u2192'}</span>
            </a>
          </div>
        </div>

        <div className="cs-nav">
          <button type="button" className="cs-arrow" onClick={() => step(-1)} aria-label="Previous case study">
            <ArrowLeft size={19} />
          </button>

          <div className="cs-dots" role="tablist" aria-label="Case studies">
            {CASE_STUDIES.map((cs, i) => (
              <button
                key={cs.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={cs.title}
                className={`cs-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <button type="button" className="cs-arrow" onClick={() => step(1)} aria-label="Next case study">
            <ArrowRight size={19} />
          </button>

          <span className="cs-count" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}<i> / {String(total).padStart(2, '0')}</i>
          </span>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
