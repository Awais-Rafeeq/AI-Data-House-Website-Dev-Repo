import { supabase } from './supabase';
import type { UpworkJob, GlobalCondition, ViewCondition, JobView } from '../types';

type NewJobCallback = (viewId: string) => void;

// Evaluate if a new job matches a view's combined conditions (client-side)
function jobMatchesView(
  job: Partial<UpworkJob>,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
): boolean {
  // Global: countries
  if (globalCond.countries && globalCond.countries.length > 0) {
    const expanded = new Set<string>();
    globalCond.countries.forEach((c) => {
      expanded.add(c);
      if (c === 'USA' || c === 'United States') {
        expanded.add('USA');
        expanded.add('United States');
      }
    });
    if (!expanded.has(job.Country ?? '')) return false;
  }

  // Global: min client rating
  if (
    globalCond.minClientRating &&
    globalCond.minClientRating > 0 &&
    (job['Client Rating'] ?? 0) < globalCond.minClientRating
  ) {
    return false;
  }

  // View: niches
  if (viewCond.niches && viewCond.niches.length > 0) {
    if (!viewCond.niches.includes(job.Niche ?? '')) return false;
  }

  // View: payment category
  if (viewCond.paymentCat && job['Payment Cat'] !== viewCond.paymentCat) return false;

  // View: min score
  if (viewCond.minScore && (job.Score ?? 0) < viewCond.minScore) return false;

  // View: min client spending
  if (
    viewCond.minClientSpending &&
    (job['Client Spending Value'] ?? 0) < viewCond.minClientSpending
  ) {
    return false;
  }

  // View: keywords (OR logic)
  if (viewCond.keywords && viewCond.keywords.length > 0) {
    const searchable =
      `${job.Title ?? ''} ${job.Description ?? ''} ${job.Skills ?? ''}`.toLowerCase();
    const matches = viewCond.keywords.some((kw) => searchable.includes(kw.toLowerCase()));
    if (!matches) return false;
  }

  return true;
}

let channel: ReturnType<typeof supabase.channel> | null = null;

export function subscribeToNewJobs(
  views: JobView[],
  globalCond: GlobalCondition,
  onNewJob: NewJobCallback,
): () => void {
  // Clean up any previous subscription
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }

  channel = supabase
    .channel('upwork-jobs-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'upwork_jobs_feed' },
      (payload) => {
        const job = payload.new as Partial<UpworkJob>;
        views.forEach((view) => {
          if (jobMatchesView(job, globalCond, view.conditions)) {
            onNewJob(view.id);
          }
        });
      },
    )
    .subscribe();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  };
}
