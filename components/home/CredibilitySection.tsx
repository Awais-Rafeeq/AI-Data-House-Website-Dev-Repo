import React from 'react';
import { Boxes, Clock, ShieldCheck } from 'lucide-react';
import TechLogo from './TechLogo';
import { TECH_MARKS } from './techLogoData';
import {
  TRUST_PLATFORMS,
  PROOF_METRICS,
  TRUSTED_CLIENTS,
  TECH_ROW_ONE,
  TECH_ROW_TWO,
} from './credibilityData';

const PROOF_ICONS = {
  systems: Boxes,
  response: Clock,
  registered: ShieldCheck,
} as const;

/** Upwork's "Up" glyph on a solid tile; the wordmark would duplicate the label. */
const UpworkMark: React.FC = () => {
  const mark = TECH_MARKS['Upwork Glyph'];
  if (!mark) return null;
  return (
    <svg viewBox={mark.viewBox} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: mark.body }} />
  );
};

const PLATFORM_MARKS: Record<string, React.FC> = {
  upwork: UpworkMark,
};

const MarqueeRow: React.FC<{ items: string[]; reverse?: boolean; label?: string }> = ({
  items,
  reverse,
  label,
}) => (
  <div
    className={`marquee${reverse ? ' rev' : ''}`}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    <div className="marquee-track">
      {items.map((name) => (
        <span className="tool-chip" key={name}><TechLogo name={name} />{name}</span>
      ))}
      <span className="dup" aria-hidden="true">
        {items.map((name) => (
          <span className="tool-chip" key={`dup-${name}`}><TechLogo name={name} />{name}</span>
        ))}
      </span>
    </div>
  </div>
);

const ClientLogoRail: React.FC = () => (
  <div className="client-marquee" aria-label="Trusted client logos">
    <div className="client-track">
      <span className="client-set">
        {TRUSTED_CLIENTS.map((c) => (
          <span key={c.name} className={`client-logo client-logo-${c.id}`}>
            <img src={c.logoSrc} alt={c.name} loading="lazy" />
          </span>
        ))}
      </span>
      <span className="client-set" aria-hidden="true">
        {TRUSTED_CLIENTS.map((c) => (
          <span key={`dup-${c.name}`} className={`client-logo client-logo-${c.id}`}>
            <img src={c.logoSrc} alt="" loading="lazy" />
          </span>
        ))}
      </span>
    </div>
  </div>
);

const CredibilitySection: React.FC = () => (
  <section className="cred">
    <div className="wrap">
      <div className="cred-card">
        <div className="cred-bar">
          <div className="cred-zone cred-trust">
            {TRUST_PLATFORMS.map((p) => {
              const Mark = PLATFORM_MARKS[p.id];
              return (
                <a
                  key={p.id}
                  className={`trust-badge trust-badge-${p.id}`}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.ariaLabel}
                >
                  <span className="trust-badge-mark" aria-hidden="true">
                    {p.logoSrc ? <img src={p.logoSrc} alt="" loading="lazy" /> : Mark ? <Mark /> : null}
                  </span>
                  <span className="trust-badge-body">
                    <span className="trust-badge-top">
                      <b>{p.name}</b>
                      <span className="trust-badge-score">{p.score}</span>
                    </span>
                    <span className="trust-badge-stars" aria-hidden="true">{'\u2605\u2605\u2605\u2605\u2605'}</span>
                    <span className="trust-badge-meta">{p.meta}</span>
                  </span>
                </a>
              );
            })}
          </div>

          <div className="cred-zone cred-clients">
            <p className="cred-eyebrow">
              <span className="cred-eyebrow-icon" aria-hidden="true">
                <ShieldCheck size={15} strokeWidth={2.2} />
              </span>
              <span className="cred-eyebrow-text">Trusted by clients</span>
            </p>
            <ClientLogoRail />
          </div>

          <div className="cred-zone cred-proof">
            {PROOF_METRICS.map((m) => {
              const Icon = PROOF_ICONS[m.icon];
              return (
                <div className="proof-stat" key={m.label}>
                  <span className="proof-stat-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span className="proof-stat-value">{m.value}</span>
                  <span className="proof-stat-label">{m.label}</span>
                  <span className="proof-stat-detail">{m.detail}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cred-tech">
          <p className="cred-tech-label">
            Built on the stack your business already uses <span aria-hidden="true">{'\u00b7'}</span> <b>40+ tools</b>, wired into one system
          </p>
          <MarqueeRow items={TECH_ROW_ONE} label="Tools we integrate" />
          <MarqueeRow items={TECH_ROW_TWO} reverse />
        </div>
      </div>
    </div>
  </section>
);

export default CredibilitySection;
