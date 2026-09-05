import React, { useState, useRef, useEffect } from 'react';
import type { GlobalCondition } from '../../types';

const ALL_COUNTRIES = [
  'United States', 'United Kingdom', 'Australia', 'Canada', 'India',
  'Nigeria', 'United Arab Emirates', 'Germany', 'Pakistan', 'Netherlands',
  'France', 'Israel', 'Singapore', 'Saudi Arabia', 'South Africa',
];

interface Props {
  value: GlobalCondition;
  onChange: (cond: GlobalCondition) => void;
  onSave: (cond: GlobalCondition) => void;
}

export default function GlobalFilterBar({ value, onChange, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<GlobalCondition>(value);
  const [countrySearch, setCountrySearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCount =
    (value.countries?.length ?? 0) +
    (value.minClientRating ? 1 : 0) +
    (value.paymentVerified ? 1 : 0);

  const toggleCountry = (country: string) => {
    const current = draft.countries ?? [];
    setDraft({
      ...draft,
      countries: current.includes(country)
        ? current.filter((c) => c !== country)
        : [...current, country],
    });
  };

  const apply = () => {
    onChange(draft);
    onSave(draft);
    setOpen(false);
  };

  const clear = () => {
    const empty: GlobalCondition = {};
    setDraft(empty);
    onChange(empty);
    onSave(empty);
    setOpen(false);
  };

  const filtered = ALL_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setDraft(value); setOpen(!open); }}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors shadow-sm ${
          activeCount > 0
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Global Filter
        {activeCount > 0 && (
          <span className="bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 w-80">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Global Filter</h3>
          <p className="text-xs text-slate-500 mb-4 -mt-2">Applies to all views simultaneously</p>

          {/* Countries */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Countries</p>
            <input
              type="text"
              placeholder="Search countries…"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm mb-2 focus:outline-none focus:border-emerald-500"
            />
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filtered.map((c) => (
                <label key={c} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(draft.countries ?? []).includes(c)}
                    onChange={() => toggleCountry(c)}
                    className="rounded accent-emerald-600"
                  />
                  <span className="text-sm text-slate-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min Client Rating */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Min Client Rating
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0} max={5} step={0.5}
                value={draft.minClientRating ?? 0}
                onChange={(e) => setDraft({ ...draft, minClientRating: parseFloat(e.target.value) })}
                className="flex-1 accent-emerald-600"
              />
              <span className="text-sm font-semibold text-slate-700 w-8 text-right">
                {draft.minClientRating ?? 0}
              </span>
            </div>
          </div>

          {/* Payment Verified */}
          <div className="mb-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.paymentVerified ?? false}
                onChange={(e) => setDraft({ ...draft, paymentVerified: e.target.checked })}
                className="rounded accent-emerald-600 w-4 h-4"
              />
              <span className="text-sm text-slate-700 font-medium">Payment verified only</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clear}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={apply}
              className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
