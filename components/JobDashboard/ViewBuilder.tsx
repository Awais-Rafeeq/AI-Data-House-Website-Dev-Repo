import React, { useState, useEffect, useRef } from 'react';
import type { JobView, ViewCondition } from '../../types';

const NICHES = ['ai', 'automation', 'data', 'general'];
const COLORS = ['emerald', 'blue', 'purple', 'rose', 'amber', 'cyan'];
const COLOR_SWATCHES: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
};

interface Props {
  view: Partial<JobView> | null;
  onSave: (view: Partial<JobView>) => void;
  onClose: () => void;
}

export default function ViewBuilder({ view, onSave, onClose }: Props) {
  const [name, setName] = useState(view?.name ?? '');
  const [color, setColor] = useState(view?.color ?? 'emerald');
  const [conditions, setConditions] = useState<ViewCondition>(view?.conditions ?? {});
  const [kwInput, setKwInput] = useState('');
  const kwRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(view?.name ?? '');
    setColor(view?.color ?? 'emerald');
    setConditions(view?.conditions ?? {});
    setKwInput('');
  }, [view]);

  const addKeyword = () => {
    const kw = kwInput.trim().toLowerCase();
    if (!kw) return;
    const current = conditions.keywords ?? [];
    if (!current.includes(kw)) {
      setConditions({ ...conditions, keywords: [...current, kw] });
    }
    setKwInput('');
    kwRef.current?.focus();
  };

  const removeKeyword = (kw: string) => {
    setConditions({
      ...conditions,
      keywords: (conditions.keywords ?? []).filter((k) => k !== kw),
    });
  };

  const toggleNiche = (niche: string) => {
    const current = conditions.niches ?? [];
    setConditions({
      ...conditions,
      niches: current.includes(niche)
        ? current.filter((n) => n !== niche)
        : [...current, niche],
    });
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ ...view, name: name.trim(), color, conditions });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {view?.id ? 'Edit View' : 'Create New View'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">View Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Umar Data 001"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${COLOR_SWATCHES[c]} transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'
                  }`}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Keywords <span className="font-normal normal-case text-slate-400">(OR logic — searches Title, Description, Skills)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                ref={kwRef}
                type="text"
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                placeholder="e.g. excel, power bi, appsheet…"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Add
              </button>
            </div>
            {(conditions.keywords ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(conditions.keywords ?? []).map((kw) => (
                  <span key={kw} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="text-emerald-400 hover:text-emerald-700 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Niches */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Niches</label>
            <div className="flex gap-2 flex-wrap">
              {NICHES.map((n) => (
                <button
                  key={n}
                  onClick={() => toggleNiche(n)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-colors capitalize ${
                    (conditions.niches ?? []).includes(n)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Min Score */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Min Score: <span className="text-slate-900 font-bold">{conditions.minScore ?? 0}</span>
            </label>
            <input
              type="range"
              min={0} max={10} step={1}
              value={conditions.minScore ?? 0}
              onChange={(e) => setConditions({ ...conditions, minScore: parseInt(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>0</span><span>5</span><span>10</span>
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Payment Type</label>
            <div className="flex gap-2">
              {(['Any', 'Fixed', 'Hourly'] as const).map((pt) => (
                <button
                  key={pt}
                  onClick={() => setConditions({
                    ...conditions,
                    paymentCat: pt === 'Any' ? undefined : pt,
                  })}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-colors ${
                    (pt === 'Any' ? !conditions.paymentCat : conditions.paymentCat === pt)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          {/* Min Client Spending */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Min Client Spending ($)</label>
            <input
              type="number"
              min={0}
              step={100}
              value={conditions.minClientSpending ?? ''}
              onChange={(e) => setConditions({
                ...conditions,
                minClientSpending: e.target.value ? parseInt(e.target.value) : undefined,
              })}
              placeholder="e.g. 1000"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40"
          >
            {view?.id ? 'Save Changes' : 'Create View'}
          </button>
        </div>
      </div>
    </div>
  );
}
