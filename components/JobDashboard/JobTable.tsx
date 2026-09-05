import React, { useState } from 'react';
import type { UpworkJob, DateRange, GlobalCondition, ViewCondition } from '../../types';
import { getJobsList, toggleFavourite, type SortField } from '../../lib/jobQueries';

interface Props {
  dateRange: DateRange;
  globalCond: GlobalCondition;
  viewCond: ViewCondition;
  lastSeenAt: string | null;
  refreshKey: number;
}

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: 'Posted On', value: 'Posted On' },
  { label: 'Score', value: 'Score' },
  { label: 'Client Rating', value: 'Client Rating' },
  { label: 'Client Spending', value: 'Client Spending Value' },
];

function scoreColor(score: number): string {
  if (score >= 7) return 'bg-emerald-100 text-emerald-700';
  if (score >= 4) return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-500';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function JobTable({ dateRange, globalCond, viewCond, lastSeenAt, refreshKey }: Props) {
  const [jobs, setJobs] = useState<(UpworkJob & { isNew?: boolean })[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<SortField>('Posted On');
  const [loading, setLoading] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const PAGE_SIZE = 25;

  React.useEffect(() => {
    setPage(0);
  }, [dateRange, globalCond, viewCond, sort, refreshKey]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getJobsList(dateRange, globalCond, viewCond, page, sort, lastSeenAt).then(({ jobs: j, total: t }) => {
      if (!cancelled) {
        setJobs(j);
        setTotal(t);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [dateRange, globalCond, viewCond, page, sort, lastSeenAt, refreshKey]);

  const handleFav = async (jobLink: string, current: boolean) => {
    await toggleFavourite(jobLink, !current);
    setJobs((prev) =>
      prev.map((j) => (j['Job Link'] === jobLink ? { ...j, Favourite: !current } : j)),
    );
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Job Feed</h3>
          <p className="text-xs text-slate-400 mt-0.5">{total.toLocaleString()} jobs matching filters</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortField)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-500 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job rows */}
      {loading ? (
        <div className="divide-y divide-slate-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-slate-50 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">No jobs match your filters</p>
          <p className="text-slate-400 text-xs mt-1">Try adjusting the date range or filter conditions</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {jobs.map((job) => {
            const isNew = job['isNew' as keyof typeof job] as boolean | undefined;
            const isExpanded = expandedJob === job['Job Link'];

            return (
              <div
                key={job['Job Link']}
                className={`px-5 py-4 transition-colors ${
                  isNew ? 'bg-amber-50 border-l-2 border-amber-400' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* New badge */}
                  {isNew && (
                    <span className="flex-shrink-0 mt-0.5 text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <a
                        href={job['Job Link']}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors leading-tight"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {job.Title || 'Untitled Job'}
                      </a>
                      <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor(job.Score ?? 0)}`}>
                        Score: {job.Score ?? 0}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
                      {job.Niche && (
                        <span className="capitalize font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {job.Niche}
                        </span>
                      )}
                      {job.Country && <span>🌍 {job.Country}</span>}
                      {job['Payment Cat'] && (
                        <span className={`font-medium ${job['Payment Cat'] === 'Fixed' ? 'text-blue-600' : 'text-purple-600'}`}>
                          {job['Payment Cat']}
                          {job['Payment Amount'] ? ` · ${job['Payment Amount']}` : ''}
                        </span>
                      )}
                      {job['Client Rating'] != null && (
                        <span>⭐ {Number(job['Client Rating']).toFixed(1)}</span>
                      )}
                      {job['Client Spending Value'] != null && job['Client Spending Value'] > 0 && (
                        <span>${(job['Client Spending Value'] / 1000).toFixed(0)}k spent</span>
                      )}
                      {job.Experience && <span>{job.Experience}</span>}
                      {job['Posted On'] && (
                        <span className="text-slate-400">{timeAgo(job['Posted On'])}</span>
                      )}
                    </div>

                    {/* Expanded: description + skills */}
                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        {job.Skills && (
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold">Skills:</span> {job.Skills}
                          </p>
                        )}
                        {job.Description && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-6">
                            {job.Description.slice(0, 600)}{job.Description.length > 600 ? '…' : ''}
                          </p>
                        )}
                        {job['Positive KWs'] && (
                          <p className="text-xs text-emerald-600">
                            <span className="font-semibold">+KWs:</span> {job['Positive KWs']}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setExpandedJob(isExpanded ? null : job['Job Link'])}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleFav(job['Job Link'], job.Favourite)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        job.Favourite
                          ? 'text-rose-500 hover:text-rose-700 bg-rose-50'
                          : 'text-slate-400 hover:text-rose-400 hover:bg-rose-50'
                      }`}
                      title={job.Favourite ? 'Remove favourite' : 'Add favourite'}
                    >
                      <svg className="w-4 h-4" fill={job.Favourite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>

                    <a
                      href={job['Job Link']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Open on Upwork"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Page {page + 1} of {totalPages} · {total.toLocaleString()} total
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 disabled:opacity-40 hover:bg-white transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 disabled:opacity-40 hover:bg-white transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
