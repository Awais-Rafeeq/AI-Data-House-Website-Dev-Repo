import React from 'react';

// Scenario 03 — AI customer support. Repeat questions arrive across channels,
// the agent answers instantly, and only the genuinely tricky ones reach a human.
const HeroSupportVisual: React.FC = () => (
  <>
    <div className="flow-head">
      <span className="flow-title">Support agent · live</span>
      <span className="flow-live"><span className="pulse-dot"><span></span></span> ANSWERING</span>
    </div>
    <div className="flow-stage">
      <svg
        className="flow-svg"
        viewBox="0 0 400 250"
        role="img"
        aria-label="Questions from chat, WhatsApp and email are answered instantly by an AI agent, with only complex cases escalated to a human"
      >
        <path className="conn" d="M120 46 H160 Q174 46 174 60 V100" />
        <path className="conn" d="M120 110 H174" />
        <path className="conn" d="M120 174 H160 Q174 174 174 160 V134" />
        <path className="conn" d="M242 104 H286 Q300 104 300 90 V66" />
        <path className="conn" d="M242 122 H286 Q300 122 300 136 V166" />
        <path className="conn-flow" d="M120 110 H174" />
        <path className="conn-flow" d="M242 104 H286 Q300 104 300 90 V66" />

        <circle className="spark" r="3.4">
          <animateMotion
            dur="2.6s"
            repeatCount="indefinite"
            keyPoints="0;0.5;1"
            keyTimes="0;0.5;1"
            calcMode="linear"
            path="M120 110 H174 M242 104 H286 Q300 104 300 90 V66"
          />
        </circle>

        {/* inbound channels */}
        <g>
          <rect className="node-rect" x="14" y="30" width="106" height="32" rx="8" />
          <circle className="node-ico" cx="30" cy="46" r="4" />
          <text className="node-label" x="42" y="43">Website chat</text>
          <text className="node-sub" x="42" y="54">"do you ship?"</text>
        </g>
        <g>
          <rect className="node-rect hot" x="14" y="94" width="106" height="32" rx="8" />
          <circle className="node-ico" cx="30" cy="110" r="4" />
          <text className="node-label" x="42" y="107">WhatsApp</text>
          <text className="node-sub" x="42" y="118">"order status?"</text>
        </g>
        <g>
          <rect className="node-rect" x="14" y="158" width="106" height="32" rx="8" />
          <circle className="node-ico" cx="30" cy="174" r="4" />
          <text className="node-label" x="42" y="171">Email inbox</text>
          <text className="node-sub" x="42" y="182">"pricing tiers?"</text>
        </g>

        {/* the agent */}
        <g>
          <rect className="node-rect scoring" x="174" y="88" width="68" height="50" rx="10" />
          <rect className="node-ico" x="196" y="104" width="10" height="10" rx="3" />
          <rect className="node-ico" x="210" y="104" width="10" height="10" rx="3" />
          <text className="node-sub" x="208" y="130" textAnchor="middle">AI agent</text>
        </g>

        {/* outcomes */}
        <g>
          <rect className="node-rect hot" x="286" y="34" width="100" height="32" rx="8" />
          <path
            className="node-ico"
            d="M298 50 l4 4 l7 -8"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text className="node-label" x="316" y="47">Resolved</text>
          <text className="node-sub" x="316" y="58">8 sec · no human</text>
        </g>
        <g>
          <rect className="node-rect" x="286" y="166" width="100" height="32" rx="8" />
          <text className="node-label" x="298" y="180">Escalated</text>
          <text className="node-sub" x="298" y="191">1 of 8 · with context</text>
        </g>
      </svg>
    </div>
    <div className="flow-foot">
      <div className="flow-metric"><b>24/7</b><span>every channel covered</span></div>
      <div className="flow-metric" style={{ textAlign: 'right' }}><b>87%</b><span>resolved without a rep</span></div>
    </div>
  </>
);

export default HeroSupportVisual;
