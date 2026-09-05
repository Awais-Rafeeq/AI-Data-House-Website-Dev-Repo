import React from 'react';
import { AlertCircle } from 'lucide-react';

/** One input language for the whole studio, matching the site's form styling. */
export const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-300 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition';

export const Field: React.FC<{
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  counter?: string;
  children: React.ReactNode;
}> = ({ label, hint, error, required, htmlFor, counter, children }) => (
  <div>
    <div className="flex items-baseline justify-between gap-3 mb-1.5">
      <label htmlFor={htmlFor} className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
        {label} {required && <span className="text-emerald-600" aria-hidden="true">*</span>}
      </label>
      {counter && <span className="text-[10px] font-bold text-slate-300 tabular-nums">{counter}</span>}
    </div>
    {children}
    {error ? (
      <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-[11px] font-bold text-rose-600">
        <AlertCircle size={12} className="mt-px flex-none" aria-hidden="true" /> {error}
      </p>
    ) : hint ? (
      <p className="mt-1.5 text-[11px] font-medium text-slate-400 leading-relaxed">{hint}</p>
    ) : null}
  </div>
);

/** A collapsible group in the inspector, so the sidebar stays scannable. */
export const InspectorSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => (
  <details open={defaultOpen} className="group border-b border-slate-100 last:border-b-0">
    <summary className="flex items-center justify-between gap-2 cursor-pointer list-none px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{title}</span>
      <span className="text-slate-300 text-xs transition-transform group-open:rotate-90" aria-hidden="true">›</span>
    </summary>
    <div className="px-5 pb-5 pt-1 space-y-4">{children}</div>
  </details>
);
