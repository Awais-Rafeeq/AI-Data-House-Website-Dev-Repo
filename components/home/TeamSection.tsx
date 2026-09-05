import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TEAM, initialsOf } from './teamData';

/**
 * Team carousel: a stack of cards on the left (the next two members peek out
 * from behind the active one) with the active member's details on the right,
 * stepped through with the prev/next controls.
 *
 * The stack is built from the *upcoming* members rather than fixed decoration,
 * so the cards behind are the ones you are about to see.
 */
const TeamSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const total = TEAM.length;
  const active = TEAM[index];

  const step = (delta: number) => setIndex((i) => (i + delta + total) % total);

  // Two members deep, drawn behind the active card.
  const behind = [2, 1].map((offset) => ({ offset, member: TEAM[(index + offset) % total] }));

  return (
    <section className="team">
      <div className="wrap">
        <div className="sec-head center">
          <h2>The people who build and run your systems.</h2>
          <p>A small, senior team. The person who scopes your build is the person who stays on it.</p>
        </div>

        <div className="team-grid">
          <div className="team-stack">
            {behind.map(({ offset, member }) => (
              <div
                key={`behind-${member.name}`}
                className={`team-card team-card-behind team-card-behind-${offset}`}
                aria-hidden="true"
              >
                <span className="team-mono">{initialsOf(member.name)}</span>
              </div>
            ))}
            <div className="team-card team-card-active" key={active.name}>
              {active.photo
                ? <img src={active.photo} alt={active.name} />
                : (
                  <>
                    <span className="team-mono">{initialsOf(active.name)}</span>
                    <span className="team-photo-note">Photo coming soon</span>
                  </>
                )}
            </div>
          </div>

          <div className="team-detail" key={`detail-${active.name}`}>
            <h3 className="team-name">{active.name}</h3>
            <p className="team-role">{active.role}</p>
            <p className="team-desc">{active.desc}</p>
            <p className="team-tools">{active.tools}</p>

            <div className="team-nav">
              <button type="button" className="team-arrow" onClick={() => step(-1)}>
                <ArrowLeft size={19} aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button type="button" className="team-arrow team-arrow-next" onClick={() => step(1)}>
                <span>Next</span>
                <ArrowRight size={19} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
