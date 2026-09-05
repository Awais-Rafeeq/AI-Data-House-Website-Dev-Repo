import React from 'react';

// Scenario 01 — the existing "Speed-to-Lead" system diagram. This is the
// original hero animation (extracted unchanged from the previous static
// HOME_HTML markup) so it keeps working as the real, first hero scenario.
const HeroFlowVisual: React.FC = () => (
  <>
    <div className="flow-head">
      <span className="flow-title">Speed-to-Lead system · live</span>
      <span className="flow-live"><span className="pulse-dot"><span></span></span> RUNNING</span>
    </div>
    <div className="flow-stage">
      <svg
        className="flow-svg"
        viewBox="0 0 400 250"
        role="img"
        aria-label="A new lead flows through an automated pipeline to a booked call in 94 seconds"
      >
        <path className="conn" d="M70 48 H200 Q214 48 214 62 V96" />
        <path className="conn" d="M214 130 V150 Q214 164 200 164 H90 Q76 164 76 178 V200" />
        <path className="conn" d="M158 214 H310 Q324 214 324 200 V150" />

        <path className="conn-flow" d="M70 48 H200 Q214 48 214 62 V96" />
        <path className="conn-flow" d="M214 130 V150 Q214 164 200 164 H90 Q76 164 76 178 V200" />
        <path className="conn-flow" d="M158 214 H310 Q324 214 324 200 V150" />

        <circle className="spark" r="4">
          <animateMotion
            dur="3.4s"
            repeatCount="indefinite"
            keyPoints="0;0.33;0.66;1"
            keyTimes="0;0.34;0.68;1"
            calcMode="linear"
            path="M70 48 H200 Q214 48 214 62 V96 M214 130 V150 Q214 164 200 164 H90 Q76 164 76 178 V200 M158 214 H310 Q324 214 324 200 V150"
          />
        </circle>

        <g>
          <rect className="node-rect hot" x="14" y="30" width="112" height="36" rx="9" />
          <circle className="node-ico" cx="32" cy="48" r="4" />
          <text className="node-label" x="46" y="45">New lead</text>
          <text className="node-sub" x="46" y="57">web form · 0s</text>
        </g>
        <g>
          <rect className="node-rect" x="158" y="96" width="112" height="36" rx="9" />
          <rect className="node-ico" x="172" y="110" width="8" height="8" rx="2" />
          <text className="node-label" x="188" y="113">AI qualify</text>
          <text className="node-sub" x="188" y="125">intent · 12s</text>
        </g>
        <g>
          <rect className="node-rect" x="20" y="200" width="112" height="36" rx="9" />
          <path className="node-ico" d="M34 214 h8 v8 h-8 z" />
          <text className="node-label" x="50" y="217">CRM record</text>
          <text className="node-sub" x="50" y="229">follow-up · 40s</text>
        </g>
        <g>
          <rect className="node-rect hot" x="262" y="114" width="122" height="36" rx="9" />
          <path
            className="node-ico"
            d="M276 128 l4 4 l7 -8"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text className="node-label" x="294" y="131">Call booked</text>
          <text className="node-sub" x="294" y="143">booked · 94s</text>
        </g>
      </svg>
    </div>
    <div className="flow-foot">
      <div className="flow-metric"><b>94s</b><span>lead → booked call</span></div>
      <div className="flow-metric" style={{ textAlign: 'right' }}><b>0</b><span>missed leads</span></div>
    </div>
  </>
);

export default HeroFlowVisual;
