import React from 'react';
import { TECH_MARKS } from './techLogoData';

/**
 * Real brand marks for the technology marquee, in full brand colour.
 *
 * Marks are baked into techLogoData.ts at build time (see
 * scripts/generate-tech-logos.mjs) from two complementary sets: the Iconify
 * "logos" collection covers Salesforce, Slack, AWS, Twilio and friends that
 * simple-icons had to drop over trademark requests, and simple-icons covers
 * n8n, Make, Calendly and the rest that Iconify lacks.
 *
 * A handful of brands (GoHighLevel, Vapi, Retell, Voiceflow, Microsoft
 * Fabric) are in neither set. Drawing those from memory would mean shipping
 * wrong logos, so they get a monogram tile instead.
 */
const TechLogo: React.FC<{ name: string }> = ({ name }) => {
  const mark = TECH_MARKS[name];

  if (mark) {
    return (
      <svg
        className="tech-logo"
        viewBox={mark.viewBox}
        role="img"
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: mark.body }}
      />
    );
  }

  return (
    <span className="tech-logo tech-logo-mono" aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  );
};

export default TechLogo;
