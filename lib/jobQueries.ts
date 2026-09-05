import { supabase } from './supabase';
import type {
  DateRange,
  ViewCondition,
  GlobalCondition,
  KPIData,
  DailyPoint,
  HeatmapCell,
  MonthlyPoint,
  NichePoint,
  CountryPoint,
  UpworkJob,
  JobView,
} from '../types';

// ─── Filter builder ────────────────────────────────────────────────────────

function applyFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
) {
  // Date range
  query = query
    .gte('"Posted On"', dateRange.start.toISOString())
    .lte('"Posted On"', dateRange.end.toISOString());

  // Global: countries (normalise USA / United States)
  if (globalCond.countries && globalCond.countries.length > 0) {
    const expanded = new Set<string>();
    globalCond.countries.forEach((c) => {
      expanded.add(c);
      if (c === 'USA' || c === 'United States') {
        expanded.add('USA');
        expanded.add('United States');
      }
    });
    query = query.in('Country', Array.from(expanded));
  }

  // Global: min client rating
  if (globalCond.minClientRating && globalCond.minClientRating > 0) {
    query = query.gte('"Client Rating"', globalCond.minClientRating);
  }

  // Global: payment verified
  if (globalCond.paymentVerified) {
    query = query.eq('"Payment Verified"', 'Yes');
  }

  // View: niches
  if (viewCond.niches && viewCond.niches.length > 0) {
    query = query.in('Niche', viewCond.niches);
  }

  // View: payment category
  if (viewCond.paymentCat) {
    query = query.eq('"Payment Cat"', viewCond.paymentCat);
  }

  // View: min score
  if (viewCond.minScore && viewCond.minScore > 0) {
    query = query.gte('Score', viewCond.minScore);
  }

  // View: min client spending
  if (viewCond.minClientSpending && viewCond.minClientSpending > 0) {
    query = query.gte('"Client Spending Value"', viewCond.minClientSpending);
  }

  // View: keywords (OR across Title, Description, Skills)
  if (viewCond.keywords && viewCond.keywords.length > 0) {
    const orParts = viewCond.keywords.flatMap((kw) => [
      `Title.ilike.%${kw}%`,
      `Description.ilike.%${kw}%`,
      `Skills.ilike.%${kw}%`,
    ]);
    query = query.or(orParts.join(','));
  }

  return query;
}

// ─── KPI Stats ─────────────────────────────────────────────────────────────

export async function getKPIStats(
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
): Promise<KPIData> {
  // Total count
  let q = supabase.from('upwork_jobs_feed').select('*', { count: 'exact', head: true });
  q = applyFilters(q, dateRange, globalCond, viewCond);
  const { count: total } = await q;

  // Today count
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let tq = supabase.from('upwork_jobs_feed').select('*', { count: 'exact', head: true });
  tq = tq.gte('"Posted On"', todayStart.toISOString());
  if (globalCond.countries && globalCond.countries.length > 0) {
    const expanded = new Set<string>();
    globalCond.countries.forEach((c) => {
      expanded.add(c);
      if (c === 'USA' || c === 'United States') {
        expanded.add('USA');
        expanded.add('United States');
      }
    });
    tq = tq.in('Country', Array.from(expanded));
  }
  if (globalCond.minClientRating) tq = tq.gte('"Client Rating"', globalCond.minClientRating);
  if (viewCond.niches?.length) tq = tq.in('Niche', viewCond.niches);
  if (viewCond.keywords?.length) {
    const orParts = viewCond.keywords.flatMap((kw) => [
      `Title.ilike.%${kw}%`,
      `Description.ilike.%${kw}%`,
      `Skills.ilike.%${kw}%`,
    ]);
    tq = tq.or(orParts.join(','));
  }
  const { count: today } = await tq;

  // High score count (Score >= 5)
  let sq = supabase.from('upwork_jobs_feed').select('*', { count: 'exact', head: true });
  sq = applyFilters(sq, dateRange, globalCond, viewCond);
  sq = sq.gte('Score', 5);
  const { count: highScore } = await sq;

  // Favourites
  let fq = supabase.from('upwork_jobs_feed').select('*', { count: 'exact', head: true });
  fq = applyFilters(fq, dateRange, globalCond, viewCond);
  fq = fq.eq('Favourite', true);
  const { count: favourites } = await fq;

  const days = Math.max(
    1,
    Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    total: total ?? 0,
    today: today ?? 0,
    avgPerDay: Math.round((total ?? 0) / days),
    highScorePercent: total ? Math.round(((highScore ?? 0) / total) * 100) : 0,
    favourites: favourites ?? 0,
  };
}

// ─── Daily Trend ───────────────────────────────────────────────────────────

export async function getDailyTrend(
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
): Promise<DailyPoint[]> {
  // Fetch all matching rows with just the Posted On column, then aggregate client-side
  let q = supabase
    .from('upwork_jobs_feed')
    .select('"Posted On"')
    .order('"Posted On"', { ascending: true });
  q = applyFilters(q, dateRange, globalCond, viewCond);

  const { data, error } = await q;
  if (error || !data) return [];

  const counts: Record<string, number> = {};
  data.forEach((row: { 'Posted On': string }) => {
    const day = row['Posted On']?.slice(0, 10);
    if (day) counts[day] = (counts[day] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

// ─── Hourly Heatmap ────────────────────────────────────────────────────────

export async function getHourlyHeatmap(
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
): Promise<HeatmapCell[]> {
  let q = supabase.from('upwork_jobs_feed').select('"Posted On"');
  q = applyFilters(q, dateRange, globalCond, viewCond);

  const { data, error } = await q;
  if (error || !data) return [];

  const counts: Record<string, number> = {};
  data.forEach((row: { 'Posted On': string }) => {
    if (!row['Posted On']) return;
    const d = new Date(row['Posted On']);
    // getDay(): 0=Sun,1=Mon...6=Sat → convert to Mon=0..Sun=6
    const rawDow = d.getUTCDay();
    const dow = rawDow === 0 ? 6 : rawDow - 1;
    const hour = d.getUTCHours();
    const key = `${dow}-${hour}`;
    counts[key] = (counts[key] ?? 0) + 1;
  });

  const cells: HeatmapCell[] = [];
  for (let dow = 0; dow < 7; dow++) {
    for (let hour = 0; hour < 24; hour++) {
      cells.push({ dow, hour, count: counts[`${dow}-${hour}`] ?? 0 });
    }
  }
  return cells;
}

// ─── Monthly Trend ─────────────────────────────────────────────────────────

export async function getMonthlyTrend(
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
): Promise<MonthlyPoint[]> {
  let q = supabase.from('upwork_jobs_feed').select('"Posted On"');
  q = applyFilters(q, dateRange, globalCond, viewCond);

  const { data, error } = await q;
  if (error || !data) return [];

  const counts: Record<string, number> = {};
  data.forEach((row: { 'Posted On': string }) => {
    const month = row['Posted On']?.slice(0, 7); // YYYY-MM
    if (month) counts[month] = (counts[month] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// ─── Niche Breakdown ───────────────────────────────────────────────────────

export async function getNicheBreakdown(
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
): Promise<NichePoint[]> {
  let q = supabase.from('upwork_jobs_feed').select('Niche');
  q = applyFilters(q, dateRange, globalCond, viewCond);

  const { data, error } = await q;
  if (error || !data) return [];

  const counts: Record<string, number> = {};
  data.forEach((row: { Niche: string }) => {
    const n = row.Niche || 'other';
    counts[n] = (counts[n] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([niche, count]) => ({ niche, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Country Breakdown ─────────────────────────────────────────────────────

export async function getCountryBreakdown(
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
): Promise<CountryPoint[]> {
  let q = supabase.from('upwork_jobs_feed').select('Country');
  q = applyFilters(q, dateRange, globalCond, viewCond);

  const { data, error } = await q;
  if (error || !data) return [];

  const counts: Record<string, number> = {};
  data.forEach((row: { Country: string }) => {
    const c = row.Country || 'Unknown';
    // Merge USA / United States
    const key = c === 'USA' ? 'United States' : c;
    counts[key] = (counts[key] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// ─── Job List ──────────────────────────────────────────────────────────────

export type SortField = 'Posted On' | 'Score' | 'Client Rating' | 'Client Spending Value';

export async function getJobsList(
  dateRange: DateRange,
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
  page: number,
  sortField: SortField,
  lastSeenAt: string | null,
): Promise<{ jobs: UpworkJob[]; total: number }> {
  const PAGE_SIZE = 25;
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let q = supabase
    .from('upwork_jobs_feed')
    .select(
      '"Job Link", Title, Niche, Country, "Payment Cat", "Payment Amount", Score, "Client Rating", "Client Spending Value", "Posted On", Favourite, Description, Skills, Experience, "Hours/Week", Duration, "Payment Verified", "Positive KWs", "Negative KWs"',
      { count: 'exact' },
    )
    .order(`"${sortField}"`, { ascending: false, nullsFirst: false })
    .range(from, to);

  q = applyFilters(q, dateRange, globalCond, viewCond);

  const { data, count, error } = await q;
  if (error) return { jobs: [], total: 0 };

  const jobs = (data ?? []).map((row) => ({
    ...row,
    isNew: lastSeenAt ? row['Posted On'] > lastSeenAt : false,
  })) as UpworkJob[];

  return { jobs, total: count ?? 0 };
}

// ─── New jobs count since last_seen_at (for badge) ─────────────────────────

export async function getNewJobsCount(
  globalCond: GlobalCondition,
  viewCond: ViewCondition,
  lastSeenAt: string,
): Promise<number> {
  let q = supabase
    .from('upwork_jobs_feed')
    .select('*', { count: 'exact', head: true })
    .gt('"Posted On"', lastSeenAt);

  // Apply global + view filters (without date range)
  if (globalCond.countries?.length) {
    const expanded = new Set<string>();
    globalCond.countries.forEach((c) => {
      expanded.add(c);
      if (c === 'USA' || c === 'United States') {
        expanded.add('USA');
        expanded.add('United States');
      }
    });
    q = q.in('Country', Array.from(expanded));
  }
  if (globalCond.minClientRating) q = q.gte('"Client Rating"', globalCond.minClientRating);
  if (viewCond.niches?.length) q = q.in('Niche', viewCond.niches);
  if (viewCond.paymentCat) q = q.eq('"Payment Cat"', viewCond.paymentCat);
  if (viewCond.minScore) q = q.gte('Score', viewCond.minScore);
  if (viewCond.keywords?.length) {
    const orParts = viewCond.keywords.flatMap((kw) => [
      `Title.ilike.%${kw}%`,
      `Description.ilike.%${kw}%`,
      `Skills.ilike.%${kw}%`,
    ]);
    q = q.or(orParts.join(','));
  }

  const { count } = await q;
  return count ?? 0;
}

// ─── Toggle Favourite ──────────────────────────────────────────────────────

export async function toggleFavourite(jobLink: string, value: boolean): Promise<void> {
  await supabase
    .from('upwork_jobs_feed')
    .update({ Favourite: value })
    .eq('"Job Link"', jobLink);
}

// ─── View CRUD ─────────────────────────────────────────────────────────────

export async function getUserViews(profileId: string): Promise<JobView[]> {
  const { data } = await supabase
    .from('job_views')
    .select('*')
    .eq('profile_id', profileId)
    .order('position', { ascending: true });
  return (data ?? []) as JobView[];
}

export async function saveView(view: Partial<JobView> & { profile_id: string }): Promise<JobView | null> {
  const { data, error } = await supabase
    .from('job_views')
    .upsert(view)
    .select()
    .single();
  if (error) return null;
  return data as JobView;
}

export async function deleteView(id: string): Promise<void> {
  await supabase.from('job_views').delete().eq('id', id);
}

export async function markViewSeen(id: string): Promise<void> {
  await supabase
    .from('job_views')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', id);
}

// ─── User Settings (global filter) ─────────────────────────────────────────

export async function getGlobalSettings(profileId: string): Promise<GlobalCondition> {
  const { data } = await supabase
    .from('user_settings')
    .select('global_conditions')
    .eq('profile_id', profileId)
    .single();
  return (data?.global_conditions ?? {}) as GlobalCondition;
}

export async function saveGlobalSettings(
  profileId: string,
  conditions: GlobalCondition,
): Promise<void> {
  await supabase.from('user_settings').upsert({
    profile_id: profileId,
    global_conditions: conditions,
    updated_at: new Date().toISOString(),
  });
}

// ─── Profile lookup ────────────────────────────────────────────────────────

export async function getProfileByAuthId(authId: string): Promise<{ id: string; name: string; title: string } | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, name, title')
    .eq('id', authId)
    .single();
  return data ?? null;
}
