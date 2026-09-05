import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  getUserViews,
  saveView,
  deleteView,
  markViewSeen,
  getGlobalSettings,
  saveGlobalSettings,
  getProfileByAuthId,
  getKPIStats,
  getDailyTrend,
  getHourlyHeatmap,
  getMonthlyTrend,
  getNicheBreakdown,
  getCountryBreakdown,
  getNewJobsCount,
} from '../../lib/jobQueries';
import { subscribeToNewJobs } from '../../lib/realtimeService';
import { buildDateRange } from './DateRangePicker';
import type {
  JobView,
  DateRange,
  GlobalCondition,
  ViewCondition,
  KPIData,
  DailyPoint,
  HeatmapCell,
  MonthlyPoint,
  NichePoint,
  CountryPoint,
} from '../../types';

import AuthModal from './AuthModal';
import DateRangePicker from './DateRangePicker';
import GlobalFilterBar from './GlobalFilterBar';
import ViewTabs from './ViewTabs';
import ViewBuilder from './ViewBuilder';
import KPICards from './KPICards';
import DailyTrendChart from './DailyTrendChart';
import HourlyHeatmap from './HourlyHeatmap';
import MonthlyChart from './MonthlyChart';
import NicheChart from './NicheChart';
import CountryChart from './CountryChart';
import JobTable from './JobTable';

interface Profile {
  id: string;
  name: string;
  title: string;
}

export default function JobDashboard() {
  // Auth state
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Filter state
  const [dateRange, setDateRange] = useState<DateRange>(buildDateRange('30d'));
  const [globalCond, setGlobalCond] = useState<GlobalCondition>({});
  const [views, setViews] = useState<JobView[]>([]);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [newJobCounts, setNewJobCounts] = useState<Record<string, number>>({});

  // Builder modal
  const [builderView, setBuilderView] = useState<Partial<JobView> | null>(null);

  // Chart data
  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [daily, setDaily] = useState<DailyPoint[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([]);
  const [niche, setNiche] = useState<NichePoint[]>([]);
  const [country, setCountry] = useState<CountryPoint[]>([]);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const realtimeUnsubRef = useRef<(() => void) | null>(null);

  // ─── Auth ────────────────────────────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session as typeof session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess as typeof session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setProfile(null); return; }
    getProfileByAuthId(session.user.id).then((p) => setProfile(p));
  }, [session]);

  // ─── Load views + global settings ────────────────────────────────────────

  useEffect(() => {
    if (!profile) return;
    Promise.all([getUserViews(profile.id), getGlobalSettings(profile.id)]).then(
      ([v, gc]) => {
        setViews(v);
        setGlobalCond(gc);
        if (v.length > 0 && !activeViewId) setActiveViewId(v[0].id);
      },
    );
  }, [profile]);

  // ─── Load initial new-job counts for all views ────────────────────────────

  useEffect(() => {
    if (!views.length) return;
    views.forEach(async (view) => {
      const count = await getNewJobsCount(globalCond, view.conditions, view.last_seen_at);
      setNewJobCounts((prev) => ({ ...prev, [view.id]: count }));
    });
  }, [views, globalCond]);

  // ─── Realtime subscription ────────────────────────────────────────────────

  useEffect(() => {
    if (!views.length) return;
    if (realtimeUnsubRef.current) realtimeUnsubRef.current();
    realtimeUnsubRef.current = subscribeToNewJobs(views, globalCond, (viewId) => {
      setNewJobCounts((prev) => ({ ...prev, [viewId]: (prev[viewId] ?? 0) + 1 }));
    });
    return () => { if (realtimeUnsubRef.current) realtimeUnsubRef.current(); };
  }, [views, globalCond]);

  // ─── Active view conditions ───────────────────────────────────────────────

  const activeView = views.find((v) => v.id === activeViewId);
  const viewCond: ViewCondition = activeView?.conditions ?? {};

  // ─── Load charts data ─────────────────────────────────────────────────────

  const loadCharts = useCallback(async () => {
    if (!session) return;
    setChartsLoading(true);
    const [k, d, h, m, n, c] = await Promise.all([
      getKPIStats(dateRange, globalCond, viewCond),
      getDailyTrend(dateRange, globalCond, viewCond),
      getHourlyHeatmap(dateRange, globalCond, viewCond),
      getMonthlyTrend(dateRange, globalCond, viewCond),
      getNicheBreakdown(dateRange, globalCond, viewCond),
      getCountryBreakdown(dateRange, globalCond, viewCond),
    ]);
    setKpi(k);
    setDaily(d);
    setHeatmap(h);
    setMonthly(m);
    setNiche(n);
    setCountry(c);
    setChartsLoading(false);
  }, [dateRange, globalCond, activeViewId, session]);

  useEffect(() => {
    loadCharts();
  }, [loadCharts]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectView = async (viewId: string) => {
    setActiveViewId(viewId);
    // Mark as seen → reset badge
    await markViewSeen(viewId);
    setNewJobCounts((prev) => ({ ...prev, [viewId]: 0 }));
    setRefreshKey((k) => k + 1);
  };

  const handleSaveView = async (viewData: Partial<JobView>) => {
    if (!profile) return;
    const saved = await saveView({
      ...viewData,
      profile_id: profile.id,
      position: viewData.id ? viewData.position ?? 0 : views.length,
    });
    if (saved) {
      setViews((prev) => {
        const exists = prev.find((v) => v.id === saved.id);
        return exists ? prev.map((v) => (v.id === saved.id ? saved : v)) : [...prev, saved];
      });
      setActiveViewId(saved.id);
    }
    setBuilderView(null);
  };

  const handleDeleteView = async (viewId: string) => {
    if (!confirm('Delete this view?')) return;
    await deleteView(viewId);
    setViews((prev) => prev.filter((v) => v.id !== viewId));
    if (activeViewId === viewId) {
      const remaining = views.filter((v) => v.id !== viewId);
      setActiveViewId(remaining[0]?.id ?? null);
    }
  };

  const handleGlobalFilterSave = async (cond: GlobalCondition) => {
    if (!profile) return;
    await saveGlobalSettings(profile.id, cond);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViews([]);
    setProfile(null);
    setActiveViewId(null);
    setNewJobCounts({});
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthModal onLogin={() => {}} />;
  }

  const activeGlobalChips: string[] = [
    ...(globalCond.countries ?? []).map((c) => `🌍 ${c}`),
    ...(globalCond.minClientRating ? [`⭐ ≥${globalCond.minClientRating}`] : []),
    ...(globalCond.paymentVerified ? ['✓ Verified'] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-plus-jakarta">
      {/* ViewBuilder modal */}
      {builderView !== null && (
        <ViewBuilder
          view={builderView}
          onSave={handleSaveView}
          onClose={() => setBuilderView(null)}
        />
      )}

      {/* Top Nav */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Logo / Title */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-900 hidden sm:block">ADH Jobs</span>
            </div>

            {/* Date Range */}
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            {/* Global Filter */}
            <GlobalFilterBar
              value={globalCond}
              onChange={setGlobalCond}
              onSave={handleGlobalFilterSave}
            />

            {/* Active global chips */}
            {activeGlobalChips.map((chip) => (
              <span key={chip} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                {chip}
              </span>
            ))}

            <div className="ml-auto flex items-center gap-3">
              {profile && (
                <span className="text-xs text-slate-500 font-medium hidden sm:block">
                  {profile.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-rose-500 transition-colors font-medium"
              >
                Sign out
              </button>
              <a
                href="#/"
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                title="Back to website"
              >
                ← Site
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
          <ViewTabs
            views={views}
            activeViewId={activeViewId}
            newJobCounts={newJobCounts}
            onSelect={handleSelectView}
            onAdd={() => setBuilderView({})}
            onEdit={(view) => setBuilderView(view)}
            onDelete={handleDeleteView}
          />

          {/* View conditions summary */}
          {activeView && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(activeView.conditions.keywords ?? []).map((kw) => (
                <span key={kw} className="text-[11px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                  🔍 {kw}
                </span>
              ))}
              {(activeView.conditions.niches ?? []).map((n) => (
                <span key={n} className="text-[11px] bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full font-medium capitalize">
                  {n}
                </span>
              ))}
              {activeView.conditions.paymentCat && (
                <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                  {activeView.conditions.paymentCat}
                </span>
              )}
              {activeView.conditions.minScore != null && activeView.conditions.minScore > 0 && (
                <span className="text-[11px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                  Score ≥ {activeView.conditions.minScore}
                </span>
              )}
            </div>
          )}

          {!activeView && views.length === 0 && (
            <p className="text-sm text-slate-400 mt-2">
              Create a view to start filtering jobs →{' '}
              <button onClick={() => setBuilderView({})} className="text-emerald-600 font-semibold hover:underline">
                New View
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <KPICards data={kpi} loading={chartsLoading} />

        {/* Row 1: Daily Trend + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyTrendChart data={daily} loading={chartsLoading} />
          <HourlyHeatmap data={heatmap} loading={chartsLoading} />
        </div>

        {/* Row 2: Monthly + Niche + Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MonthlyChart data={monthly} loading={chartsLoading} />
          <NicheChart data={niche} loading={chartsLoading} />
          <CountryChart data={country} loading={chartsLoading} />
        </div>

        {/* Job Feed */}
        <JobTable
          dateRange={dateRange}
          globalCond={globalCond}
          viewCond={viewCond}
          lastSeenAt={activeView?.last_seen_at ?? null}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
}
