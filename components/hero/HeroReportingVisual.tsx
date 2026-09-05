import React from 'react';

// Scenario 05 — reporting automation. Numbers pull themselves together
// overnight and land as a live dashboard before anyone opens a spreadsheet.
const HeroReportingVisual: React.FC = () => (
  <>
    <div className="flow-head">
      <span className="flow-title">Monday report · automated</span>
      <span className="flow-live"><span className="pulse-dot"><span></span></span> BUILT 06:00</span>
    </div>
    <div className="flow-stage">
      <svg
        className="flow-svg"
        viewBox="0 0 400 250"
        role="img"
        aria-label="Data from every source is pulled overnight into a live dashboard that is ready before the week starts"
      >
        <path className="conn" d="M96 40 H130 Q144 40 144 54 V104" />
        <path className="conn" d="M96 96 H130 Q144 96 144 106 V112" />
        <path className="conn" d="M96 152 H130 Q144 152 144 138 V122" />
        <path className="conn-flow" d="M96 96 H130 Q144 96 144 106 V112" />

        <circle className="spark" r="3.4">
          <animateMotion
            dur="2.4s"
            repeatCount="indefinite"
            path="M96 96 H130 Q144 96 144 106 V112"
          />
        </circle>

        {/* raw sources */}
        <g>
          <rect className="node-rect" x="14" y="26" width="82" height="28" rx="7" />
          <text className="node-label" x="24" y="38">Sales data</text>
          <text className="node-sub" x="24" y="48">CRM export</text>
        </g>
        <g>
          <rect className="node-rect" x="14" y="82" width="82" height="28" rx="7" />
          <text className="node-label" x="24" y="94">Ad spend</text>
          <text className="node-sub" x="24" y="104">3 platforms</text>
        </g>
        <g>
          <rect className="node-rect" x="14" y="138" width="82" height="28" rx="7" />
          <text className="node-label" x="24" y="150">Ops log</text>
          <text className="node-sub" x="24" y="160">jobs · hours</text>
        </g>

        {/* the dashboard */}
        <g>
          <rect className="node-rect hot" x="144" y="34" width="242" height="150" rx="12" />
          <text className="node-label" x="160" y="54">This week at a glance</text>
          <text className="node-sub" x="160" y="66">refreshed 6 minutes ago</text>

          {/* chart bars — all sit on the y=158 baseline and grow in, staggered */}
          <g className="rep-bars">
            <rect className="rep-bar" x="164" y="120" width="18" height="38" rx="4" />
            <rect className="rep-bar" x="192" y="102" width="18" height="56" rx="4" />
            <rect className="rep-bar" x="220" y="128" width="18" height="30" rx="4" />
            <rect className="rep-bar hot-bar" x="248" y="90" width="18" height="68" rx="4" />
          </g>

          <text className="node-score hot-score" x="372" y="104" textAnchor="end">+38%</text>
          <text className="node-sub" x="372" y="116" textAnchor="end">vs last week</text>
          <text className="node-label" x="372" y="146" textAnchor="end">$84,200</text>
          <text className="node-sub" x="372" y="158" textAnchor="end">booked revenue</text>

          <text className="node-sub" x="160" y="174">sent to your inbox · every Monday 06:00</text>
        </g>
      </svg>
    </div>
    <div className="flow-foot">
      <div className="flow-metric"><b>~4 hrs</b><span>saved every week</span></div>
      <div className="flow-metric" style={{ textAlign: 'right' }}><b>0</b><span>spreadsheets rebuilt</span></div>
    </div>
  </>
);

export default HeroReportingVisual;
