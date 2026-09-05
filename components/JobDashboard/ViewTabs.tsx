import React from 'react';
import type { JobView } from '../../types';

const COLOR_MAP: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
};

const BADGE_MAP: Record<string, string> = {
  emerald: 'bg-emerald-600 text-white',
  blue: 'bg-blue-600 text-white',
  purple: 'bg-purple-600 text-white',
  rose: 'bg-rose-600 text-white',
  amber: 'bg-amber-500 text-white',
  cyan: 'bg-cyan-600 text-white',
};

interface Props {
  views: JobView[];
  activeViewId: string | null;
  newJobCounts: Record<string, number>;
  onSelect: (viewId: string) => void;
  onAdd: () => void;
  onEdit: (view: JobView) => void;
  onDelete: (viewId: string) => void;
}

export default function ViewTabs({
  views,
  activeViewId,
  newJobCounts,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {views.map((view) => {
        const isActive = view.id === activeViewId;
        const newCount = newJobCounts[view.id] ?? 0;
        const dotColor = COLOR_MAP[view.color] ?? 'bg-emerald-500';
        const badgeColor = BADGE_MAP[view.color] ?? 'bg-emerald-600 text-white';

        return (
          <div
            key={view.id}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all flex-shrink-0 ${
              isActive
                ? 'bg-white border-slate-300 shadow-sm'
                : 'bg-slate-100 border-transparent hover:bg-white hover:border-slate-200'
            }`}
            onClick={() => onSelect(view.id)}
          >
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />

            <span className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
              {view.name}
            </span>

            {newCount > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full animate-pulse ${badgeColor}`}>
                {newCount} new
              </span>
            )}

            {isActive && (
              <div className="hidden group-hover:flex items-center gap-1 ml-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(view); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Edit view"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(view.id); }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Delete view"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex-shrink-0 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New View
      </button>
    </div>
  );
}
