import React from 'react';

// Hand-authored, on-brand SVG infographics, one per solution. These replace the
// heavy, dense PNGs (600KB-990KB) that IMAGE_STRATEGY.md flagged as unreadable at
// display size. Inline SVG means zero network weight, crisp at any size, and a
// real LCP/perf win on the solution routes. Brand: navy #0f172a, green #1a7a3c.

const NAVY = '#0f172a';
const PANEL = '#1e293b';
const PANEL_2 = '#172033';
const GREEN = '#1a7a3c';
const GREEN_BRIGHT = '#42a868';
const GREEN_SOFT = '#70b990';
const WHITE = '#f8fafc';
const SLATE = '#94a3b8';
const SLATE_LT = '#cbd5e1';
const FONT = "'Plus Jakarta Sans', 'Inter', sans-serif";

const Frame = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <svg
    viewBox="0 0 640 400"
    role="img"
    aria-label={label}
    width="100%"
    height="auto"
    className="w-full h-auto rounded-[2rem] border border-white/10 shadow-2xl"
    style={{ fontFamily: FONT, display: 'block' }}
  >
    <rect x="0" y="0" width="640" height="400" rx="28" fill={NAVY} />
    <rect x="0" y="0" width="640" height="400" rx="28" fill="url(#adhGlow)" />
    <defs>
      <radialGradient id="adhGlow" cx="80%" cy="10%" r="70%">
        <stop offset="0%" stopColor={GREEN} stopOpacity="0.22" />
        <stop offset="60%" stopColor={GREEN} stopOpacity="0" />
      </radialGradient>
    </defs>
    {children}
  </svg>
);

// ── Workflow automation: trigger → steps → done ──────────────────────────────
const WorkflowFlow = () => (
  <Frame label="An automation flow: a trigger fires a sequence of steps that finishes automatically">
    <text x="40" y="58" fill={SLATE} fontSize="15" fontWeight="700" letterSpacing="2">AUTOMATION FLOW</text>
    {/* connecting line */}
    <line x1="120" y1="200" x2="520" y2="200" stroke={GREEN} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
    {/* trigger */}
    <g>
      <circle cx="120" cy="200" r="46" fill={GREEN} />
      <text x="120" y="196" textAnchor="middle" fill={WHITE} fontSize="15" fontWeight="800">Lead</text>
      <text x="120" y="216" textAnchor="middle" fill={WHITE} fontSize="15" fontWeight="800">in</text>
      <text x="120" y="272" textAnchor="middle" fill={SLATE} fontSize="13" fontWeight="700">Trigger</text>
    </g>
    {/* steps */}
    {[
      { x: 250, t1: 'Sync', t2: 'CRM' },
      { x: 380, t1: 'Notify', t2: 'team' },
    ].map((s, i) => (
      <g key={i}>
        <rect x={s.x - 46} y="164" width="92" height="72" rx="16" fill={PANEL} stroke={GREEN_BRIGHT} strokeWidth="1.5" />
        <text x={s.x} y="196" textAnchor="middle" fill={WHITE} fontSize="15" fontWeight="800">{s.t1}</text>
        <text x={s.x} y="216" textAnchor="middle" fill={SLATE_LT} fontSize="14" fontWeight="600">{s.t2}</text>
        <text x={s.x} y="272" textAnchor="middle" fill={SLATE} fontSize="13" fontWeight="700">Step {i + 1}</text>
      </g>
    ))}
    {/* done */}
    <g>
      <circle cx="520" cy="200" r="46" fill={GREEN_BRIGHT} />
      <path d="M502 200 l12 12 l24 -26" fill="none" stroke={NAVY} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="520" y="272" textAnchor="middle" fill={GREEN_SOFT} fontSize="13" fontWeight="700">Done</text>
    </g>
    <text x="320" y="342" textAnchor="middle" fill={WHITE} fontSize="17" fontWeight="800">Runs end to end. No one touches it.</text>
  </Frame>
);

// ── Chatbots: live chat window ───────────────────────────────────────────────
const ChatWindow = () => (
  <Frame label="A live AI chat window qualifying a website visitor and marking the lead qualified">
    <rect x="150" y="46" width="340" height="308" rx="22" fill={PANEL_2} stroke="#243247" strokeWidth="1.5" />
    <rect x="150" y="46" width="340" height="52" rx="22" fill={PANEL} />
    <rect x="150" y="76" width="340" height="22" fill={PANEL} />
    <circle cx="180" cy="72" r="12" fill={GREEN} />
    <text x="200" y="77" fill={WHITE} fontSize="15" fontWeight="800">AI Assistant</text>
    <circle cx="454" cy="72" r="4" fill={GREEN_BRIGHT} />
    <text x="462" y="76" fill={GREEN_SOFT} fontSize="11" fontWeight="700">online</text>
    {/* bot bubble */}
    <rect x="172" y="118" width="220" height="44" rx="14" fill={PANEL} />
    <text x="188" y="145" fill={SLATE_LT} fontSize="13" fontWeight="600">What are you looking to build?</text>
    {/* user bubble */}
    <rect x="270" y="176" width="200" height="44" rx="14" fill={GREEN} />
    <text x="290" y="203" fill={WHITE} fontSize="13" fontWeight="700">A booking system, this week</text>
    {/* bot bubble 2 */}
    <rect x="172" y="234" width="240" height="44" rx="14" fill={PANEL} />
    <text x="188" y="261" fill={SLATE_LT} fontSize="13" fontWeight="600">Great. Booking a call for you now.</text>
    {/* qualified tag */}
    <rect x="172" y="296" width="150" height="34" rx="17" fill="rgba(66,168,104,0.18)" stroke={GREEN_BRIGHT} strokeWidth="1.5" />
    <path d="M188 313 l7 7 l14 -15" fill="none" stroke={GREEN_BRIGHT} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="216" y="318" fill={GREEN_SOFT} fontSize="13" fontWeight="800">Lead qualified</text>
    <text x="40" y="58" fill={SLATE} fontSize="15" fontWeight="700" letterSpacing="2">24/7</text>
  </Frame>
);

// ── Voice agents: call-flow diagram ──────────────────────────────────────────
const CallFlow = () => (
  <Frame label="A call-flow diagram: an inbound call is answered, qualified, and booked by an AI voice agent">
    <text x="40" y="58" fill={SLATE} fontSize="15" fontWeight="700" letterSpacing="2">CALL FLOW</text>
    {/* phone node */}
    <g>
      <circle cx="110" cy="180" r="44" fill={GREEN} />
      <path d="M98 168 c0 22 12 34 34 34 l0 -14 c-4 0 -8 -1 -11 -2 l-6 6 c-6 -4 -11 -9 -15 -15 l6 -6 c-1 -3 -2 -7 -2 -11 z" fill={WHITE} />
      <text x="110" y="250" textAnchor="middle" fill={SLATE} fontSize="13" fontWeight="700">Inbound call</text>
    </g>
    {/* waveform */}
    <g>
      {[150, 160, 170, 180, 190, 200, 210].map((x, i) => {
        const h = [22, 40, 16, 52, 24, 44, 18][i];
        return <rect key={i} x={x} y={180 - h / 2} width="5" height={h} rx="2.5" fill={GREEN_BRIGHT} />;
      })}
    </g>
    <line x1="222" y1="180" x2="270" y2="180" stroke={GREEN} strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
    {/* steps stack */}
    {[
      { y: 96, t: 'AI answers in 1 ring' },
      { y: 156, t: 'Qualifies the caller' },
      { y: 216, t: 'Books the appointment' },
    ].map((s, i) => (
      <g key={i}>
        <rect x="286" y={s.y} width="266" height="46" rx="14" fill={PANEL} stroke="#243247" strokeWidth="1.5" />
        <circle cx="312" cy={s.y + 23} r="11" fill={GREEN} />
        <text x="312" y={s.y + 28} textAnchor="middle" fill={WHITE} fontSize="13" fontWeight="800">{i + 1}</text>
        <text x="334" y={s.y + 28} fill={SLATE_LT} fontSize="14" fontWeight="700">{s.t}</text>
      </g>
    ))}
    <text x="320" y="342" textAnchor="middle" fill={WHITE} fontSize="17" fontWeight="800">Every call answered. Zero hold time.</text>
  </Frame>
);

// ── Internal web apps: app screen with sidebar + stat cards + table ──────────
const AppScreen = () => (
  <Frame label="A custom internal web app screen with a sidebar, stat cards, and a data table">
    {/* window */}
    <rect x="40" y="46" width="560" height="308" rx="20" fill={PANEL_2} stroke="#243247" strokeWidth="1.5" />
    {/* sidebar */}
    <rect x="40" y="46" width="120" height="308" rx="20" fill={PANEL} />
    <rect x="150" y="46" width="10" height="308" fill={PANEL} />
    <rect x="60" y="70" width="80" height="14" rx="7" fill={GREEN_BRIGHT} />
    {[110, 138, 166, 194].map((y, i) => (
      <rect key={i} x="60" y={y} width={i === 0 ? 84 : 68} height="10" rx="5" fill={i === 0 ? GREEN : '#334155'} />
    ))}
    {/* stat cards */}
    {[
      { x: 180, v: '128', l: 'Active' },
      { x: 320, v: '42', l: 'This week' },
      { x: 460, v: '99%', l: 'On time' },
    ].map((c, i) => (
      <g key={i}>
        <rect x={c.x} y="70" width="120" height="70" rx="14" fill={PANEL} stroke="#243247" strokeWidth="1.5" />
        <text x={c.x + 16} y="108" fill={WHITE} fontSize="26" fontWeight="800">{c.v}</text>
        <text x={c.x + 16} y="128" fill={SLATE} fontSize="12" fontWeight="700">{c.l}</text>
      </g>
    ))}
    {/* table */}
    <rect x="180" y="158" width="400" height="176" rx="14" fill={PANEL} stroke="#243247" strokeWidth="1.5" />
    <rect x="180" y="158" width="400" height="34" rx="14" fill="#131c2b" />
    <text x="200" y="180" fill={SLATE} fontSize="12" fontWeight="800" letterSpacing="1">RECORD</text>
    <text x="400" y="180" fill={SLATE} fontSize="12" fontWeight="800" letterSpacing="1">OWNER</text>
    <text x="510" y="180" fill={SLATE} fontSize="12" fontWeight="800" letterSpacing="1">STATUS</text>
    {[210, 248, 286].map((y, i) => (
      <g key={i}>
        <rect x="196" y={y} width="150" height="10" rx="5" fill="#334155" />
        <rect x="396" y={y} width="70" height="10" rx="5" fill="#334155" />
        <rect x="500" y={y - 6} width="62" height="22" rx="11" fill="rgba(66,168,104,0.18)" />
        <text x="531" y={y + 9} textAnchor="middle" fill={GREEN_SOFT} fontSize="11" fontWeight="800">Live</text>
      </g>
    ))}
  </Frame>
);

// ── CRM: pipeline board ──────────────────────────────────────────────────────
const CrmPipeline = () => (
  <Frame label="A CRM pipeline board moving leads through New, Qualified, and Won stages">
    <text x="40" y="58" fill={SLATE} fontSize="15" fontWeight="700" letterSpacing="2">PIPELINE</text>
    {[
      { x: 40, title: 'New', n: 3, accent: SLATE },
      { x: 235, title: 'Qualified', n: 2, accent: GREEN_BRIGHT },
      { x: 430, title: 'Won', n: 1, accent: GREEN },
    ].map((col, ci) => (
      <g key={ci}>
        <rect x={col.x} y="78" width="170" height="276" rx="18" fill={PANEL_2} stroke="#243247" strokeWidth="1.5" />
        <circle cx={col.x + 24} cy="106" r="6" fill={col.accent} />
        <text x={col.x + 38} y="111" fill={WHITE} fontSize="15" fontWeight="800">{col.title}</text>
        <text x={col.x + 148} y="111" textAnchor="end" fill={SLATE} fontSize="13" fontWeight="700">{col.n}</text>
        {Array.from({ length: col.n }).map((_, ri) => (
          <g key={ri}>
            <rect x={col.x + 16} y={128 + ri * 62} width="138" height="50" rx="12" fill={PANEL} stroke={ci === 2 ? GREEN : '#243247'} strokeWidth="1.5" />
            <circle cx={col.x + 36} cy={153 + ri * 62} r="11" fill={col.accent} opacity="0.9" />
            <rect x={col.x + 54} y={144 + ri * 62} width="80" height="9" rx="4.5" fill="#475569" />
            <rect x={col.x + 54} y={160 + ri * 62} width="54" height="8" rx="4" fill="#334155" />
          </g>
        ))}
      </g>
    ))}
    {/* arrows */}
    <path d="M214 200 l14 0 m-6 -6 l6 6 l-6 6" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M409 200 l14 0 m-6 -6 l6 6 l-6 6" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Frame>
);

// ── Dashboards: KPI tiles + bars + trend line ────────────────────────────────
const DashboardMock = () => (
  <Frame label="A live business dashboard with KPI tiles, a bar chart, and a revenue trend line">
    <text x="40" y="58" fill={SLATE} fontSize="15" fontWeight="700" letterSpacing="2">LIVE DASHBOARD</text>
    {/* KPI tiles */}
    {[
      { x: 40, v: '$84.2k', l: 'Revenue' },
      { x: 190, v: '312', l: 'Leads' },
      { x: 340, v: '28%', l: 'Close rate' },
      { x: 490, v: '4h', l: 'Saved/wk' },
    ].map((k, i) => (
      <g key={i}>
        <rect x={k.x} y="78" width="120" height="72" rx="14" fill={PANEL} stroke="#243247" strokeWidth="1.5" />
        <text x={k.x + 16} y="116" fill={WHITE} fontSize="24" fontWeight="800">{k.v}</text>
        <text x={k.x + 16} y="136" fill={SLATE} fontSize="12" fontWeight="700">{k.l}</text>
      </g>
    ))}
    {/* bar chart */}
    <rect x="40" y="170" width="270" height="184" rx="16" fill={PANEL_2} stroke="#243247" strokeWidth="1.5" />
    <text x="60" y="198" fill={SLATE_LT} fontSize="13" fontWeight="800">By channel</text>
    {[70, 110, 150, 190, 230].map((x, i) => {
      const h = [58, 96, 74, 120, 88][i];
      return <rect key={i} x={x} y={330 - h} width="26" height={h} rx="6" fill={i === 3 ? GREEN_BRIGHT : GREEN} />;
    })}
    {/* trend line */}
    <rect x="330" y="170" width="270" height="184" rx="16" fill={PANEL_2} stroke="#243247" strokeWidth="1.5" />
    <text x="350" y="198" fill={SLATE_LT} fontSize="13" fontWeight="800">Revenue trend</text>
    <polyline
      points="352,318 392,300 432,306 472,268 512,278 552,224 584,232"
      fill="none"
      stroke={GREEN_BRIGHT}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polygon points="352,318 392,300 432,306 472,268 512,278 552,224 584,232 584,338 352,338" fill={GREEN} opacity="0.14" />
    {['352', '432', '512', '584'].map((x, i) => (
      <circle key={i} cx={Number(x)} cy={[318, 306, 278, 232][i]} r="4" fill={WHITE} />
    ))}
  </Frame>
);

const MAP: Record<string, React.FC> = {
  'ai-workflow-automation': WorkflowFlow,
  'ai-chatbots': ChatWindow,
  'ai-voice-agents': CallFlow,
  'internal-web-apps': AppScreen,
  'crm-lead-automation': CrmPipeline,
  'data-dashboards-reporting': DashboardMock,
};

const SolutionInfographic = ({ slug }: { slug: string }) => {
  const Cmp = MAP[slug];
  if (!Cmp) return null;
  return <Cmp />;
};

export default SolutionInfographic;
