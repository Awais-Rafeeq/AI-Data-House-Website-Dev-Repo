import React, { useState } from 'react';
import type { HeatmapCell } from '../../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getIntensityClass(count: number, max: number): string {
  if (count === 0 || max === 0) return 'bg-slate-100';
  const ratio = count / max;
  if (ratio < 0.15) return 'bg-emerald-100';
  if (ratio < 0.3) return 'bg-emerald-200';
  if (ratio < 0.5) return 'bg-emerald-300';
  if (ratio < 0.7) return 'bg-emerald-400';
  if (ratio < 0.85) return 'bg-emerald-500';
  return 'bg-emerald-600';
}

interface Props {
  data: HeatmapCell[];
  loading: boolean;
}

interface Tooltip {
  x: number;
  y: number;
  content: string;
}

export default function HourlyHeatmap({ data, loading }: Props) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const cellMap: Record<string, number> = {};
  data.forEach(({ dow, hour, count }) => {
    cellMap[`${dow}-${hour}`] = count;
  });

  const max = Math.max(...data.map((d) => d.count), 1);

  const handleMouseEnter = (e: React.MouseEvent, dow: number, hour: number, count: number) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const container = (e.target as HTMLElement).closest('.heatmap-container')?.getBoundingClientRect();
    if (!container) return;
    setTooltip({
      x: rect.left - container.left + rect.width / 2,
      y: rect.top - container.top - 4,
      content: `${DAYS[dow]} ${String(hour).padStart(2, '0')}:00 — ${count} jobs`,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-1">Activity Heatmap</h3>
      <p className="text-xs text-slate-400 mb-4">Jobs by day of week × hour (UTC)</p>

      {loading ? (
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
      ) : (
        <div className="relative heatmap-container overflow-x-auto">
          {tooltip && (
            <div
              className="absolute z-10 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg pointer-events-none -translate-x-1/2 -translate-y-full whitespace-nowrap"
              style={{ left: tooltip.x, top: tooltip.y - 8 }}
            >
              {tooltip.content}
            </div>
          )}

          <div className="flex gap-1 min-w-max">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              <div className="h-4" />
              {DAYS.map((d) => (
                <div key={d} className="h-5 flex items-center">
                  <span className="text-[10px] text-slate-400 w-7 text-right">{d}</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-1">
              {/* Hour labels */}
              <div className="flex gap-1">
                {HOURS.map((h) => (
                  <div key={h} className="w-5 flex items-center justify-center">
                    {h % 6 === 0 && (
                      <span className="text-[9px] text-slate-400">{h}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Cells */}
              {DAYS.map((_, dow) => (
                <div key={dow} className="flex gap-1">
                  {HOURS.map((hour) => {
                    const count = cellMap[`${dow}-${hour}`] ?? 0;
                    return (
                      <div
                        key={hour}
                        className={`w-5 h-5 rounded-sm cursor-default transition-opacity hover:opacity-80 ${getIntensityClass(count, max)}`}
                        onMouseEnter={(e) => handleMouseEnter(e, dow, hour, count)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-[10px] text-slate-400">Less</span>
            {['bg-slate-100', 'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'].map((cls) => (
              <div key={cls} className={`w-4 h-4 rounded-sm ${cls}`} />
            ))}
            <span className="text-[10px] text-slate-400">More</span>
          </div>
        </div>
      )}
    </div>
  );
}
