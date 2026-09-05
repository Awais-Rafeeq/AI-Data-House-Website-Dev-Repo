import React from 'react';

/**
 * AI Data House logo mark — a chat/dashboard window with an ascending green
 * bar chart and a growth arrow that breaks out of the window to the top-right.
 * Rebuilt as SVG to match the real brand mark exactly: crisp at any size,
 * transparent on any background, and recolorable for dark vs light headers.
 *   stroke = window frame + dots + growth arrow
 *   bars   = the ascending bar chart (brand green on light, white on dark)
 */
export const AdhMark = ({
  className = '',
  stroke = '#0f172a',
  bars = '#1a7a3c',
}: { className?: string; stroke?: string; bars?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* window frame: rounded top-left, left + bottom edges, downward speech
        tail at the bottom, bottom-right corner, right edge left open at the
        top so the growth arrow can break through */}
    <path
      d="M46 20 H30 a10 10 0 0 0 -10 10 V58 a10 10 0 0 0 10 10 H40 L48 80 L56 68 H70 a10 10 0 0 0 10 -10 V44"
      stroke={stroke}
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* window dots along the open top edge */}
    <circle cx="52" cy="20" r="2.6" fill={stroke} />
    <circle cx="60" cy="20" r="2.6" fill={stroke} />
    <circle cx="68" cy="20" r="2.6" fill={stroke} />
    {/* ascending bar chart */}
    <path
      d="M35 62 V54 M43 62 V49 M51 62 V43 M59 62 V36"
      stroke={bars}
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* growth arrow: rises from the speech tail out to the top-right */}
    <path
      d="M48 80 L84 32 M84 32 L72.5 33.5 M84 32 L82.5 44"
      stroke={stroke}
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Full lockup: mark + "Ai Data House" wordmark.
 *   variant="light" → all white, for dark backgrounds (hero, footer)
 *   variant="dark"  → dark frame + arrow, green bars + green wordmark, for light backgrounds
 */
export const AdhLogo = ({
  variant = 'dark',
  className = '',
}: { variant?: 'dark' | 'light'; className?: string }) => {
  const stroke = variant === 'light' ? '#ffffff' : '#0f172a';
  const bars = variant === 'light' ? '#ffffff' : '#1a7a3c';
  const text = variant === 'light' ? '#ffffff' : '#1a7a3c';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AdhMark className="h-9 w-9 flex-shrink-0" stroke={stroke} bars={bars} />
      <span
        className="font-extrabold text-[19px] tracking-tight leading-none whitespace-nowrap"
        style={{ color: text }}
      >
        Ai Data House
      </span>
    </span>
  );
};

export default AdhLogo;
