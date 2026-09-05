import React from 'react';

// Scenario 02 — lead scoring. Raw inbound leads on the left get scored, then
// split into "book now" vs "nurture" so the sales team only works the top rows.
const HeroQualifyVisual: React.FC = () => (
  <>
    <div className="flow-head">
      <span className="flow-title">Lead scoring engine · live</span>
      <span className="flow-live"><span className="pulse-dot"><span></span></span> SCORING</span>
    </div>
    <div className="flow-stage">
      <svg
        className="flow-svg"
        viewBox="0 0 400 250"
        role="img"
        aria-label="Inbound leads are scored on intent and budget, then routed to sales or to a nurture sequence"
      >
        <path className="conn" d="M150 44 H214 Q228 44 228 58 V96" />
        <path className="conn" d="M150 108 H228" />
        <path className="conn" d="M150 172 H214 Q228 172 228 158 V132" />
        <path className="conn" d="M286 100 H320 Q334 100 334 86 V70" />
        <path className="conn" d="M286 116 H320 Q334 116 334 130 V158" />
        <path className="conn-flow" d="M150 108 H228" />
        <path className="conn-flow" d="M286 100 H320 Q334 100 334 86 V70" />

        <circle className="spark" r="3.4">
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            keyPoints="0;0.5;1"
            keyTimes="0;0.5;1"
            calcMode="linear"
            path="M150 44 H214 Q228 44 228 58 V96 M286 100 H320 Q334 100 334 86 V70"
          />
        </circle>

        {/* incoming leads, each with an intent score */}
        <g>
          <rect className="node-rect hot" x="14" y="28" width="136" height="32" rx="8" />
          <text className="node-label" x="26" y="42">Lead · web form</text>
          <text className="node-sub" x="26" y="53">budget confirmed</text>
          <text className="node-score hot-score" x="138" y="48" textAnchor="end">92</text>
        </g>
        <g>
          <rect className="node-rect" x="14" y="92" width="136" height="32" rx="8" />
          <text className="node-label" x="26" y="106">Lead · referral</text>
          <text className="node-sub" x="26" y="117">ready to buy</text>
          <text className="node-score hot-score" x="138" y="112" textAnchor="end">88</text>
        </g>
        <g>
          <rect className="node-rect" x="14" y="156" width="136" height="32" rx="8" />
          <text className="node-label" x="26" y="170">Lead · cold list</text>
          <text className="node-sub" x="26" y="181">just browsing</text>
          <text className="node-score" x="138" y="176" textAnchor="end">14</text>
        </g>

        {/* scoring engine */}
        <g>
          <rect className="node-rect scoring" x="228" y="82" width="58" height="52" rx="10" />
          <path
            className="node-ico"
            d="M243 108 l6 7 l12 -15"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text className="node-sub" x="257" y="127" textAnchor="middle">AI score</text>
        </g>

        {/* outputs */}
        <g>
          <rect className="node-rect hot" x="278" y="38" width="108" height="32" rx="8" />
          <text className="node-label" x="290" y="52">Book the call</text>
          <text className="node-sub" x="290" y="63">routed to sales · 2</text>
        </g>
        <g>
          <rect className="node-rect" x="278" y="158" width="108" height="32" rx="8" />
          <text className="node-label" x="290" y="172">Nurture track</text>
          <text className="node-sub" x="290" y="183">no rep time · 1</text>
        </g>
      </svg>
    </div>
    <div className="flow-foot">
      <div className="flow-metric"><b>3x</b><span>more qualified pipeline</span></div>
      <div className="flow-metric" style={{ textAlign: 'right' }}><b>0</b><span>hours chasing dead leads</span></div>
    </div>
  </>
);

export default HeroQualifyVisual;
