import React from 'react';

// Scenario 04 — system integration. Disconnected tools around the edge, one
// synced source of truth in the middle, records flowing both ways.
const HeroSyncVisual: React.FC = () => (
  <>
    <div className="flow-head">
      <span className="flow-title">Integration layer · live</span>
      <span className="flow-live"><span className="pulse-dot"><span></span></span> IN SYNC</span>
    </div>
    <div className="flow-stage">
      <svg
        className="flow-svg"
        viewBox="0 0 400 250"
        role="img"
        aria-label="CRM, spreadsheets, billing and operations tools all sync through one central system so every record stays current"
      >
        <path className="conn" d="M104 46 H150 Q166 46 166 66 V104" />
        <path className="conn" d="M104 196 H150 Q166 196 166 176 V146" />
        <path className="conn" d="M296 46 H250 Q234 46 234 66 V104" />
        <path className="conn" d="M296 196 H250 Q234 196 234 176 V146" />
        <path className="conn-flow" d="M104 46 H150 Q166 46 166 66 V104" />
        <path className="conn-flow" d="M296 196 H250 Q234 196 234 176 V146" />

        <circle className="spark" r="3.4">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            keyPoints="0;0.5;1"
            keyTimes="0;0.5;1"
            calcMode="linear"
            path="M104 46 H150 Q166 46 166 66 V104 M296 196 H250 Q234 196 234 176 V146"
          />
        </circle>

        {/* the four corner tools */}
        <g>
          <rect className="node-rect" x="14" y="30" width="90" height="32" rx="8" />
          <text className="node-label" x="26" y="44">CRM</text>
          <text className="node-sub" x="26" y="55">contacts · deals</text>
        </g>
        <g>
          <rect className="node-rect" x="14" y="180" width="90" height="32" rx="8" />
          <text className="node-label" x="26" y="194">Spreadsheets</text>
          <text className="node-sub" x="26" y="205">the real database</text>
        </g>
        <g>
          <rect className="node-rect" x="296" y="30" width="90" height="32" rx="8" />
          <text className="node-label" x="308" y="44">Billing</text>
          <text className="node-sub" x="308" y="55">invoices · plans</text>
        </g>
        <g>
          <rect className="node-rect" x="296" y="180" width="90" height="32" rx="8" />
          <text className="node-label" x="308" y="194">Ops &amp; Slack</text>
          <text className="node-sub" x="308" y="205">fulfilment</text>
        </g>

        {/* the hub */}
        <g>
          <rect className="node-rect hot" x="146" y="98" width="108" height="54" rx="12" />
          <path
            className="node-ico"
            d="M176 126 h48 M200 112 v28"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <text className="node-label" x="200" y="121" textAnchor="middle">One system</text>
          <text className="node-sub" x="200" y="145" textAnchor="middle">synced · always current</text>
        </g>
      </svg>
    </div>
    <div className="flow-foot">
      <div className="flow-metric"><b>1</b><span>source of truth</span></div>
      <div className="flow-metric" style={{ textAlign: 'right' }}><b>0</b><span>double data entry</span></div>
    </div>
  </>
);

export default HeroSyncVisual;
