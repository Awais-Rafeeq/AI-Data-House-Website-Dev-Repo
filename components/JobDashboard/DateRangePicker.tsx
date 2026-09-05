import React, { useState, useRef, useEffect } from 'react';
import type { DateRange } from '../../types';

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS: { label: string; value: DateRange['preset'] }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'This year', value: 'year' },
  { label: 'All time', value: 'all' },
  { label: 'Custom', value: 'custom' },
];

export function buildDateRange(preset: DateRange['preset'], customStart?: Date, customEnd?: Date): DateRange {
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);

  switch (preset) {
    case 'today':
      return { preset, start: todayStart, end: todayEnd };
    case 'yesterday': {
      const ys = new Date(todayStart); ys.setDate(ys.getDate() - 1);
      const ye = new Date(todayEnd); ye.setDate(ye.getDate() - 1);
      return { preset, start: ys, end: ye };
    }
    case '7d': {
      const s = new Date(now); s.setDate(s.getDate() - 7);
      return { preset, start: s, end: now };
    }
    case '30d': {
      const s = new Date(now); s.setDate(s.getDate() - 30);
      return { preset, start: s, end: now };
    }
    case '3m': {
      const s = new Date(now); s.setMonth(s.getMonth() - 3);
      return { preset, start: s, end: now };
    }
    case 'year': {
      const s = new Date(now.getFullYear(), 0, 1);
      return { preset, start: s, end: now };
    }
    case 'all':
      return { preset, start: new Date('2025-09-01'), end: now };
    case 'custom':
      return { preset, start: customStart ?? todayStart, end: customEnd ?? todayEnd };
  }
}

export default function DateRangePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.start.toISOString().slice(0, 10));
  const [customEnd, setCustomEnd] = useState(value.end.toISOString().slice(0, 10));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = PRESETS.find((p) => p.value === value.preset)?.label ?? 'Custom';

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-emerald-400 transition-colors shadow-sm"
      >
        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{label}</span>
        <span className="text-slate-400 text-xs">
          {formatDate(value.start)} – {formatDate(value.end)}
        </span>
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 min-w-[280px]">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PRESETS.filter((p) => p.value !== 'custom').map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  onChange(buildDateRange(p.value));
                  setOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  value.preset === p.value
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Custom range</p>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-400 text-sm">–</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => {
                onChange(buildDateRange('custom', new Date(customStart), new Date(customEnd)));
                setOpen(false);
              }}
              className="mt-2 w-full bg-emerald-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Apply custom range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
