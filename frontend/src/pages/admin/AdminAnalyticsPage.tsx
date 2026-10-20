import React, { useState, useEffect, useMemo } from 'react';
import { api, ApiAnalyticsData } from '../../services/api';
import {
  BarChart3,
  Users,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Award,
  ShieldCheck,
  CheckCircle2,
  Gamepad2,
  BookOpen,
  PieChart as PieIcon,
  Activity as ActivityIcon,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '365d'>('30d');
  const [data, setData] = useState<ApiAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active hover states for charts
  const [activeGrowthPoint, setActiveGrowthPoint] = useState<{
    date: string;
    label: string;
    newUsers: number;
    cumulativeUsers: number;
    x: number;
    y: number;
  } | null>(null);

  const [activeDonutSegment, setActiveDonutSegment] = useState<string | null>(null);
  const [activeBarItem, setActiveBarItem] = useState<string | null>(null);

  const fetchAnalytics = async (selectedRange = range) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.admin.getAnalytics(selectedRange);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch platform analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  // Derived calculations for User Growth SVG Line Chart
  const growthChartCoords = useMemo(() => {
    if (!data || !data.userGrowth || data.userGrowth.length === 0) return null;
    const points = data.userGrowth;
    const maxVal = Math.max(...points.map((p) => p.cumulativeUsers), 5);
    const width = 600;
    const height = 200;
    const padding = 25;

    const coords = points.map((p, i) => {
      const x = padding + (i / Math.max(1, points.length - 1)) * (width - padding * 2);
      const y = height - padding - (p.cumulativeUsers / maxVal) * (height - padding * 2);
      return { ...p, x, y };
    });

    // Create SVG path
    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cx = (prev.x + curr.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return { coords, pathD, areaD, maxVal, width, height, padding };
  }, [data]);

  // Derived calculations for Donut Chart
  const donutSlices = useMemo(() => {
    if (!data || !data.roleDistribution) return [];
    let cumulativeAngle = 0;
    const total = data.roleDistribution.reduce((sum, r) => sum + r.count, 0) || 1;

    return data.roleDistribution.map((role) => {
      const sliceAngle = (role.count / total) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;
      cumulativeAngle += sliceAngle;

      // Polar to cartesian for donut arc (center 100, 100, radius 70, innerRadius 45)
      const rOuter = 70;
      const rInner = 45;
      const cx = 100;
      const cy = 100;

      const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
      const x1 = cx + rOuter * Math.cos(rad(startAngle));
      const y1 = cy + rOuter * Math.sin(rad(startAngle));
      const x2 = cx + rOuter * Math.cos(rad(endAngle));
      const y2 = cy + rOuter * Math.sin(rad(endAngle));

      const ix1 = cx + rInner * Math.cos(rad(endAngle));
      const iy1 = cy + rInner * Math.sin(rad(endAngle));
      const ix2 = cx + rInner * Math.cos(rad(startAngle));
      const iy2 = cy + rInner * Math.sin(rad(startAngle));

      const largeArc = sliceAngle > 180 ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix1} ${iy1}
        A ${rInner} ${rInner} 0 ${largeArc} 0 ${ix2} ${iy2}
        Z
      `;

      return {
        ...role,
        pathData,
        startAngle,
        endAngle,
      };
    });
  }, [data]);

  // Derived calculations for Platform Activity Area Chart
  const activityChartCoords = useMemo(() => {
    if (!data || !data.platformActivity || data.platformActivity.length === 0) return null;
    const points = data.platformActivity;
    const maxVal = Math.max(...points.map((p) => p.total), 8);
    const width = 600;
    const height = 180;
    const padding = 25;

    const coords = points.map((p, i) => {
      const x = padding + (i / Math.max(1, points.length - 1)) * (width - padding * 2);
      const yTotal = height - padding - (p.total / maxVal) * (height - padding * 2);
      const yGames = height - padding - (p.gameSessions / maxVal) * (height - padding * 2);
      const yStories = height - padding - (p.storyViews / maxVal) * (height - padding * 2);
      return { ...p, x, yTotal, yGames, yStories };
    });

    let totalPath = `M ${coords[0].x} ${coords[0].yTotal}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const cx = (prev.x + curr.x) / 2;
      totalPath += ` C ${cx} ${prev.yTotal}, ${cx} ${curr.yTotal}, ${curr.x} ${curr.yTotal}`;
    }
    const totalArea = `${totalPath} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return { coords, totalPath, totalArea, maxVal, width, height, padding };
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EAE7DF]/70">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E2EBD9] flex items-center justify-center text-[#568469]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#263831]">
              Eshal Platform Analytics
            </h1>
          </div>
          <p className="text-xs text-[#728078] mt-1 font-medium">
            Aggregated metrics, user registrations, and content interaction trends across Eshal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Filter Pills */}
          <div className="inline-flex items-center p-1 bg-[#F0EBDD]/70 rounded-2xl border border-[#EAE7DF]">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '3 Months' },
              { key: '365d', label: '1 Year' },
            ].map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => setRange(btn.key as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  range === btn.key
                    ? 'bg-[#568469] text-white shadow-2xs'
                    : 'text-[#728078] hover:text-[#263831] hover:bg-[#FFFDF8]/50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchAnalytics()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FFFDF8] border border-[#EAE7DF] text-xs font-bold text-[#568469] hover:bg-[#E2EBD9] transition-colors cursor-pointer"
            title="Refresh Analytics Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-3xl bg-[#F4DDD3]/60 border border-[#F4DDD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#8A3B29]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2">
            {error.includes('Authentication required') && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.auth.login({ email: 'admin@eshal.org', password: 'AdminPassword123!' });
                    fetchAnalytics();
                  } catch (e: any) {
                    setError(e.message);
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-[#568469] text-white font-bold text-xs hover:bg-[#456C55] transition-colors cursor-pointer shadow-xs shrink-0"
              >
                🚀 Authenticate as Admin
              </button>
            )}
            <button
              onClick={() => fetchAnalytics()}
              className="px-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#EAE7DF] font-bold text-[#263831] hover:bg-[#E2EBD9] cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* 5 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#EAE7DF] shadow-2xs hover:border-[#568469]/30 transition-all">
          <div className="flex items-center justify-between text-[#728078] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-[#E2EBD9] text-[#568469] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#263831]">
              {data ? data.summary.totalUsers : '—'}
            </span>
            <span className="text-[11px] font-bold text-[#568469] bg-[#E2EBD9]/60 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
          <p className="text-[11px] text-[#728078] mt-2">Active accounts on Eshal</p>
        </div>

        {/* New Users This Month */}
        <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#EAE7DF] shadow-2xs hover:border-[#568469]/30 transition-all">
          <div className="flex items-center justify-between text-[#728078] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">New This Month</span>
            <div className="w-8 h-8 rounded-xl bg-[#F5D998]/40 text-[#9E731B] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#263831]">
              +{data ? data.summary.newUsersThisMonth : '—'}
            </span>
            <span className="text-[11px] font-bold text-[#9E731B] bg-[#F5D998]/30 px-2 py-0.5 rounded-full">
              Growth
            </span>
          </div>
          <p className="text-[11px] text-[#728078] mt-2">Registered in current month</p>
        </div>

        {/* Stories and Games */}
        <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#EAE7DF] shadow-2xs hover:border-[#568469]/30 transition-all">
          <div className="flex items-center justify-between text-[#728078] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Stories & Games</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCE8EE] text-[#426F85] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#263831]">
              {data ? data.summary.totalStoriesAndGames : '—'}
            </span>
            <span className="text-[11px] font-bold text-[#426F85] bg-[#DCE8EE]/60 px-2 py-0.5 rounded-full">
              Catalog
            </span>
          </div>
          <p className="text-[11px] text-[#728078] mt-2">Published learning items</p>
        </div>

        {/* Activity Sessions */}
        <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#EAE7DF] shadow-2xs hover:border-[#568469]/30 transition-all">
          <div className="flex items-center justify-between text-[#728078] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Activity Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-[#E2EBD9] text-[#568469] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#263831]">
              {data ? data.summary.totalActivitySessions : '—'}
            </span>
            <span className="text-[11px] font-bold text-[#568469] bg-[#E2EBD9]/60 px-2 py-0.5 rounded-full">
              Engagements
            </span>
          </div>
          <p className="text-[11px] text-[#728078] mt-2">Child session interactions</p>
        </div>

        {/* Most-Used Content */}
        <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#EAE7DF] shadow-2xs hover:border-[#568469]/30 transition-all">
          <div className="flex items-center justify-between text-[#728078] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Top Content</span>
            <div className="w-8 h-8 rounded-xl bg-[#F4DDD3] text-[#B25D48] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-[#263831] truncate" title={data?.summary.mostUsedContent?.title}>
              {data?.summary.mostUsedContent?.title || '—'}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-[#568469] bg-[#E2EBD9] px-2 py-0.5 rounded-full truncate">
                {data?.summary.mostUsedContent?.categoryName || ''}
              </span>
              <span className="text-[11px] font-semibold text-[#728078]">
                {data?.summary.mostUsedContent ? `${data.summary.mostUsedContent.interactions} plays` : ''}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#728078] mt-2">Highest engagement item</p>
        </div>
      </div>

      {/* Grid: Chart A (User Growth Line) & Chart B (Role Distribution Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart A: User Growth Line Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-[#FFFDF8] rounded-3xl p-6 border border-[#EAE7DF] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#568469]" />
                <h2 className="text-base font-extrabold text-[#263831]">User Growth Over Time</h2>
              </div>
              <span className="text-xs font-bold text-[#728078]">
                Range: {range.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#728078] mb-6">
              Cumulative registered caregiver and family accounts across the selected window.
            </p>
          </div>

          {/* Line Chart SVG Canvas */}
          <div className="relative w-full aspect-[2.8/1] min-h-[220px]">
            {growthChartCoords && growthChartCoords.coords.length > 0 ? (
              <svg
                viewBox={`0 0 ${growthChartCoords.width} ${growthChartCoords.height}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#568469" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#568469" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.33, 0.66, 1].map((pct, idx) => {
                  const y = growthChartCoords.padding + pct * (growthChartCoords.height - growthChartCoords.padding * 2);
                  const val = Math.round((1 - pct) * growthChartCoords.maxVal);
                  return (
                    <g key={idx}>
                      <line
                        x1={growthChartCoords.padding}
                        y1={y}
                        x2={growthChartCoords.width - growthChartCoords.padding}
                        y2={y}
                        stroke="#EAE7DF"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={growthChartCoords.padding - 6}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] fill-[#728078] font-bold"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Filled Gradient Area */}
                <path d={growthChartCoords.areaD} fill="url(#growthGradient)" />

                {/* Main Curve Line */}
                <path
                  d={growthChartCoords.pathD}
                  fill="none"
                  stroke="#568469"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {growthChartCoords.coords.map((pt, i) => (
                  <g
                    key={i}
                    className="cursor-pointer group"
                    onMouseEnter={() => setActiveGrowthPoint(pt)}
                    onMouseLeave={() => setActiveGrowthPoint(null)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#FFFDF8"
                      stroke="#568469"
                      strokeWidth="2.5"
                      className="transition-transform group-hover:scale-150"
                    />
                    {/* Bottom Date Labels on select intervals */}
                    {(i === 0 || i === Math.floor(growthChartCoords.coords.length / 2) || i === growthChartCoords.coords.length - 1) && (
                      <text
                        x={pt.x}
                        y={growthChartCoords.height - 5}
                        textAnchor="middle"
                        className="text-[10px] fill-[#728078] font-semibold"
                      >
                        {pt.label}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#728078] text-xs">
                <AlertCircle className="w-5 h-5 mb-1" />
                <span>No user growth recorded in this timeframe.</span>
              </div>
            )}

            {/* Hover Tooltip Box */}
            {activeGrowthPoint && (
              <div
                className="absolute z-10 pointer-events-none bg-[#263831] text-white p-2.5 rounded-xl shadow-lg text-[11px] space-y-0.5"
                style={{
                  left: `${(activeGrowthPoint.x / (growthChartCoords?.width || 600)) * 100}%`,
                  top: `${(activeGrowthPoint.y / (growthChartCoords?.height || 200)) * 100}%`,
                  transform: 'translate(-50%, -125%)',
                }}
              >
                <p className="font-extrabold text-[#F5D998]">{activeGrowthPoint.label}</p>
                <p className="font-medium text-white/90">
                  Total Users: <span className="font-bold">{activeGrowthPoint.cumulativeUsers}</span>
                </p>
                <p className="text-[10px] text-white/70">
                  New on this day: +{activeGrowthPoint.newUsers}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#728078]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#568469]" />
              Cumulative Registered Accounts
            </span>
            <span className="text-[11px] font-medium">Real-time sync</span>
          </div>
        </div>

        {/* Chart B: Account Distribution Donut (1 Column) */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#EAE7DF] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-[#568469]" />
              <h2 className="text-base font-extrabold text-[#263831]">Account Distribution</h2>
            </div>
            <p className="text-xs text-[#728078] mb-4">
              Registered users segmented by active system access role.
            </p>
          </div>

          {/* Donut SVG Canvas */}
          <div className="relative w-48 h-48 mx-auto my-2">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {donutSlices.map((slice, i) => (
                <path
                  key={i}
                  d={slice.pathData}
                  fill={slice.color}
                  className="transition-all cursor-pointer hover:opacity-90 hover:scale-105 origin-center"
                  onMouseEnter={() => setActiveDonutSegment(slice.role)}
                  onMouseLeave={() => setActiveDonutSegment(null)}
                />
              ))}
            </svg>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-black text-[#263831]">
                {data ? data.summary.totalUsers : 0}
              </span>
              <span className="text-[10px] font-bold text-[#728078] uppercase tracking-wider">
                Accounts
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 mt-4 pt-3 border-t border-[#EAE7DF]">
            {data?.roleDistribution.map((r) => (
              <div
                key={r.role}
                onMouseEnter={() => setActiveDonutSegment(r.role)}
                onMouseLeave={() => setActiveDonutSegment(null)}
                className={`flex items-center justify-between text-xs px-2 py-1 rounded-xl transition-all ${
                  activeDonutSegment === r.role ? 'bg-[#E2EBD9]' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="font-semibold text-[#263831]">{r.label}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-[#728078]">
                  <span>{r.count}</span>
                  <span className="text-[11px] text-[#263831] bg-[#F0EBDD] px-1.5 py-0.5 rounded-md">
                    {r.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Chart C (Content Performance) & Chart D (Platform Activity Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart C: Content Performance Bar Chart */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#EAE7DF] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-[#568469]" />
              <h2 className="text-base font-extrabold text-[#263831]">Content Performance</h2>
            </div>
            <p className="text-xs text-[#728078] mb-6">
              Interactions, session starts, and completions across educational categories.
            </p>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4">
            {data?.contentPerformance.map((item) => {
              const maxInteractions = Math.max(...data.contentPerformance.map((c) => c.count), 10);
              const widthPct = Math.round((item.count / maxInteractions) * 100);

              return (
                <div
                  key={item.type}
                  onMouseEnter={() => setActiveBarItem(item.type)}
                  onMouseLeave={() => setActiveBarItem(null)}
                  className={`p-2.5 rounded-2xl transition-all ${
                    activeBarItem === item.type ? 'bg-[#F0EBDD]/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#263831]">{item.label}</span>
                    <span className="font-bold text-[#568469] text-xs">{item.count} interactions</span>
                  </div>

                  {/* Horizontal Bar with progress */}
                  <div className="w-full h-3 bg-[#EAE7DF]/70 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(10, widthPct)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#728078] mt-1.5 font-medium">
                    <span>{item.sessions} session starts</span>
                    <span>{item.completions} completions</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#728078]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#568469]" />
              Tracked via interactive learner events
            </span>
          </div>
        </div>

        {/* Chart D: Platform Activity Area Chart */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#EAE7DF] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-[#568469]" />
                <h2 className="text-base font-extrabold text-[#263831]">Platform Activity Timeline</h2>
              </div>
              <span className="text-xs font-bold text-[#728078]">
                Daily Activity
              </span>
            </div>
            <p className="text-xs text-[#728078] mb-6">
              Story reading, game completions, and daily sensory sessions over the chosen period.
            </p>
          </div>

          {/* Area Chart SVG */}
          <div className="relative w-full aspect-[2.6/1] min-h-[200px]">
            {activityChartCoords && activityChartCoords.coords.length > 0 ? (
              <svg
                viewBox={`0 0 ${activityChartCoords.width} ${activityChartCoords.height}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#84A98C" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#84A98C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.5, 1].map((pct, idx) => {
                  const y = activityChartCoords.padding + pct * (activityChartCoords.height - activityChartCoords.padding * 2);
                  const val = Math.round((1 - pct) * activityChartCoords.maxVal);
                  return (
                    <g key={idx}>
                      <line
                        x1={activityChartCoords.padding}
                        y1={y}
                        x2={activityChartCoords.width - activityChartCoords.padding}
                        y2={y}
                        stroke="#EAE7DF"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={activityChartCoords.padding - 6}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] fill-[#728078] font-bold"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area */}
                <path d={activityChartCoords.totalArea} fill="url(#activityGradient)" />

                {/* Line Path */}
                <path
                  d={activityChartCoords.totalPath}
                  fill="none"
                  stroke="#52796F"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />

                {/* Points */}
                {activityChartCoords.coords.map((pt, i) => (
                  <g key={i} className="group">
                    <circle
                      cx={pt.x}
                      cy={pt.yTotal}
                      r="3.5"
                      fill="#FFFDF8"
                      stroke="#52796F"
                      strokeWidth="2"
                    />
                    {(i === 0 || i === Math.floor(activityChartCoords.coords.length / 2) || i === activityChartCoords.coords.length - 1) && (
                      <text
                        x={pt.x}
                        y={activityChartCoords.height - 4}
                        textAnchor="middle"
                        className="text-[9px] fill-[#728078] font-semibold"
                      >
                        {pt.label}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#728078] text-xs">
                <AlertCircle className="w-5 h-5 mb-1" />
                <span>No platform activity logged yet.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#728078]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#52796F]" />
                Total Platform Events
              </span>
            </div>
            <span className="text-[11px] font-medium">Aggregated</span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Notice */}
      <div className="p-4 rounded-3xl bg-[#E2EBD9]/60 border border-[#C5D7B7] flex items-start sm:items-center gap-3 text-xs text-[#263831]">
        <ShieldCheck className="w-5 h-5 text-[#568469] shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <span className="font-extrabold text-[#568469]">Privacy & Anonymity Safeguard: </span>
          <span>
            All metrics shown above are purely aggregated system-level statistics. In accordance with child data privacy protections, no personal identifiers, child profiles, or individual diagnostic histories are exposed in analytics.
          </span>
        </div>
      </div>
    </div>
  );
};
