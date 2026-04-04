import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Plus,
  Bell,
  Search,
  ChevronRight,
  AlertCircle,
  Send,
  Zap,
  ShieldAlert,
  CalendarClock,
  ArrowRight,
  BarChart3,
  Target,
  Lightbulb,
  ExternalLink,
  Building2,
  PenLine,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dashboardStats, activityFeed, chartData, contracts } from '../../data/mockData';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

// ─── Activity icon / color mapping ──────────────────────────────────────────

const activityMeta: Record<string, { dot: string; Icon: React.ElementType; label: string; bg: string }> = {
  signed: { dot: 'bg-emerald-500', Icon: CheckCircle2, label: 'Signed', bg: 'bg-emerald-50 text-emerald-700' },
  sent: { dot: 'bg-ocean-500', Icon: Send, label: 'Sent', bg: 'bg-ocean-50 text-ocean-700' },
  created: { dot: 'bg-slate-400', Icon: PenLine, label: 'Created', bg: 'bg-slate-50 text-slate-600' },
  comment: { dot: 'bg-amber-500', Icon: AlertCircle, label: 'Comment', bg: 'bg-amber-50 text-amber-700' },
  expiring: { dot: 'bg-red-500', Icon: AlertTriangle, label: 'Expiring', bg: 'bg-red-50 text-red-700' },
};

// ─── Custom Chart Tooltip ───────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white text-[12px] px-3 py-2 rounded-lg shadow-lg border border-slate-700">
      <p className="font-medium text-slate-300 text-[11px]">{label}</p>
      <p className="text-[14px] font-semibold">{payload[0].value} contracts</p>
    </div>
  );
}

// ─── Attention Item Component ───────────────────────────────────────────────

const priorityConfig = {
  critical: { label: 'Critical', color: 'text-red-700 bg-red-100', dot: 'bg-red-500' },
  needs_action: { label: 'Needs Action', color: 'text-amber-700 bg-amber-100', dot: 'bg-amber-500' },
  in_progress: { label: 'In Progress', color: 'text-ocean-700 bg-ocean-50', dot: 'bg-ocean-500' },
} as const;

type Priority = keyof typeof priorityConfig;

function AttentionItem({
  icon: Icon,
  iconBg,
  title,
  subtitle,
  badge,
  badgeColor,
  action,
  actionLabel,
  priority,
  value,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  action: () => void;
  actionLabel: string;
  priority: Priority;
  value?: number;
}) {
  const prio = priorityConfig[priority];
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-card cursor-pointer group ${
        priority === 'critical'
          ? 'bg-red-50/50 border-red-200 hover:border-red-300'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
      onClick={action}
    >
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className="w-[18px] h-[18px] text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-slate-900 truncate">{title}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${prio.color} shrink-0`}>
            {prio.label}
          </span>
        </div>
        <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      {value != null && value > 0 && (
        <span className="text-[13px] font-semibold text-slate-700 whitespace-nowrap">{formatFullCurrency(value)}</span>
      )}
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeColor}`}>
        {badge}
      </span>
      <button className="text-[12px] font-medium text-ocean-600 hover:text-ocean-700 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap flex items-center gap-1">
        {actionLabel}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [aiDismissed, setAiDismissed] = useState<string[]>([]);

  // ─── Derived data ───────────────────────────────────────────────────────

  const attentionContracts = contracts
    .filter((c) => ['awaiting_signature', 'expiring_soon', 'sent'].includes(c.status))
    .sort((a, b) => {
      const priority: Record<string, number> = { expiring_soon: 0, awaiting_signature: 1, sent: 2 };
      return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
    });

  const topContracts = [...contracts]
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalPipelineValue = contracts
    .filter((c) => ['sent', 'awaiting_signature', 'in_review'].includes(c.status))
    .reduce((sum, c) => sum + c.value, 0);

  const signedValue = contracts
    .filter((c) => ['signed', 'completed'].includes(c.status))
    .reduce((sum, c) => sum + c.value, 0);

  const draftCount = contracts.filter((c) => c.status === 'draft').length;
  const awaitingCount = contracts.filter((c) => c.status === 'awaiting_signature').length;

  // ─── AI Suggestions ─────────────────────────────────────────────────────

  const aiSuggestions = [
    {
      id: 'ai-1',
      icon: AlertTriangle,
      iconBg: 'bg-amber-500',
      title: 'Renewal risk detected',
      description: `Freelancer Services Agreement with Lena Kovacs expires in ${daysUntil('2026-04-01')} days. No renewal draft has been started.`,
      action: 'Start renewal',
      priority: 'high' as const,
      onClick: () => navigate('/ai-generator'),
    },
    {
      id: 'ai-2',
      icon: Target,
      iconBg: 'bg-ocean-500',
      title: 'Signature bottleneck',
      description: `${awaitingCount} contracts awaiting signature with an avg wait of 4.2 days. Consider sending reminders to accelerate close rate.`,
      action: 'Send reminders',
      priority: 'medium' as const,
      onClick: () => navigate('/contracts?filter=awaiting_signature'),
    },
    {
      id: 'ai-3',
      icon: Lightbulb,
      iconBg: 'bg-violet-500',
      title: `${draftCount} drafts worth $35K stalled`,
      description: 'Two draft contracts have been idle for 48+ hours. Finalizing them this week could close your Q1 pipeline gap.',
      action: 'Review drafts',
      priority: 'low' as const,
      onClick: () => navigate('/contracts?filter=draft'),
    },
    {
      id: 'ai-4',
      icon: TrendingUp,
      iconBg: 'bg-emerald-500',
      title: 'Vendor consolidation opportunity',
      description: 'You have 3 active vendor agreements with overlapping scopes. Consolidating could reduce legal overhead by ~$12K annually.',
      action: 'View vendor contracts',
      priority: 'low' as const,
      onClick: () => navigate('/contracts'),
    },
  ].filter((s) => !aiDismissed.includes(s.id));

  // ─── Category bar colors ──────────────────────────────────────────────

  const categoryColors: Record<string, string> = {
    Service: '#0a7aff',
    Sales: '#10b981',
    Employment: '#8b5cf6',
    NDA: '#64748b',
    Vendor: '#f59e0b',
    Consulting: '#ec4899',
  };

  const maxCategoryCount = Math.max(...chartData.contractsByCategory.map((c) => c.count));

  // ─── Status color helper ──────────────────────────────────────────────

  function getStatusClasses(status: string) {
    const map: Record<string, string> = {
      signed: 'bg-emerald-50 text-emerald-700',
      completed: 'bg-emerald-50 text-emerald-700',
      awaiting_signature: 'bg-amber-50 text-amber-700',
      sent: 'bg-ocean-50 text-ocean-700',
      draft: 'bg-slate-100 text-slate-600',
      in_review: 'bg-violet-50 text-violet-700',
      expiring_soon: 'bg-red-50 text-red-700',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  }

  function getStatusLabel(status: string) {
    return status.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-25 px-8 py-8 max-w-[1440px] mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-slate-900 tracking-tight">
            {getGreeting()}, Sarah
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">
            {formatDate(today)} &middot; {attentionContracts.length} items need your attention &middot; {formatCurrency(totalPipelineValue)} in open pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all"
            onClick={() => navigate('/contracts')}
          >
            <Search className="w-4 h-4 text-slate-400" />
            Search contracts&hellip;
          </button>
          <button className="relative p-2.5 text-slate-500 bg-white border border-slate-200 rounded-lg shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 shadow-sm transition-all"
            onClick={() => navigate('/ai-generator')}
          >
            <Plus className="w-4 h-4" />
            New Contract
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: Attention Required ─────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      {attentionContracts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-[18px] h-[18px] text-red-500" />
            <h2 className="text-[15px] font-semibold text-slate-900">Attention Required</h2>
            <span className="text-[12px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {attentionContracts.length} items
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {attentionContracts.slice(0, 4).map((contract) => {
              const days = daysUntil(contract.expiryDate);
              const isExpiring = contract.status === 'expiring_soon';
              const isAwaiting = contract.status === 'awaiting_signature';
              const priority: Priority = isExpiring ? 'critical' : isAwaiting ? 'needs_action' : 'in_progress';

              return (
                <AttentionItem
                  key={contract.id}
                  icon={isExpiring ? CalendarClock : isAwaiting ? Clock : Send}
                  iconBg={isExpiring ? 'bg-red-500' : isAwaiting ? 'bg-amber-500' : 'bg-ocean-500'}
                  title={contract.name}
                  subtitle={`${contract.counterparty} · ${contract.signatureStatus}`}
                  badge={
                    isExpiring
                      ? `${days}d to expiry`
                      : isAwaiting
                      ? contract.signatureStatus
                      : 'Sent — awaiting response'
                  }
                  badgeColor={
                    isExpiring
                      ? 'text-red-700 bg-red-100'
                      : isAwaiting
                      ? 'text-amber-700 bg-amber-100'
                      : 'text-ocean-700 bg-ocean-50'
                  }
                  action={() => navigate(`/editor`)}
                  actionLabel={isExpiring ? 'Start renewal' : isAwaiting ? 'Send reminder' : 'Track status'}
                  priority={priority}
                  value={contract.value}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: KPI Cards with Insights ────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <div className="grid grid-cols-4 gap-5 mb-8">
        {/* KPI: Active Contracts */}
        <div
          className="bg-white border border-slate-200 rounded-xl shadow-card p-5 hover:shadow-card-hover hover:border-slate-300 transition-all cursor-pointer group"
          onClick={() => navigate('/contracts')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-ocean-50 flex items-center justify-center">
              <FileText className="w-[20px] h-[20px] text-ocean-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              +12% vs last month
            </span>
          </div>
          <p className="text-[28px] font-bold text-slate-900 leading-none">{dashboardStats.totalContracts}</p>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Active Contracts</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-600">{dashboardStats.signedThisMonth} signed</span> this month &middot; {draftCount} in draft
            </p>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-ocean-500 transition-colors shrink-0" />
          </div>
        </div>

        {/* KPI: Pipeline Value */}
        <div
          className="bg-white border border-slate-200 rounded-xl shadow-card p-5 hover:shadow-card-hover hover:border-slate-300 transition-all cursor-pointer group"
          onClick={() => navigate('/analytics')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-[20px] h-[20px] text-emerald-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              +8% vs Q4
            </span>
          </div>
          <p className="text-[28px] font-bold text-slate-900 leading-none">{formatCurrency(totalPipelineValue)}</p>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Open Pipeline</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-600">{formatCurrency(signedValue)} closed</span> across {contracts.filter((c) => c.status === 'signed').length} deals
            </p>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-ocean-500 transition-colors shrink-0" />
          </div>
        </div>

        {/* KPI: Avg Signature Time */}
        <div
          className="bg-white border border-slate-200 rounded-xl shadow-card p-5 hover:shadow-card-hover hover:border-slate-300 transition-all cursor-pointer group"
          onClick={() => navigate('/analytics')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Clock className="w-[20px] h-[20px] text-violet-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight className="w-3 h-3" />
              -18% faster
            </span>
          </div>
          <p className="text-[28px] font-bold text-slate-900 leading-none">2.4<span className="text-[18px] font-semibold text-slate-400 ml-0.5">days</span></p>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Avg. Time to Signature</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Was <span className="font-medium text-slate-600">2.9 days</span> last month &middot; Industry: 5.7 days
            </p>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-ocean-500 transition-colors shrink-0" />
          </div>
        </div>

        {/* KPI: Completion Rate */}
        <div
          className="bg-white border border-slate-200 rounded-xl shadow-card p-5 hover:shadow-card-hover hover:border-slate-300 transition-all cursor-pointer group"
          onClick={() => navigate('/contracts?filter=awaiting_signature')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Target className="w-[20px] h-[20px] text-amber-600" />
            </div>
            {dashboardStats.completionRate >= 85 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                On track
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                Below target
              </span>
            )}
          </div>
          <p className="text-[28px] font-bold text-slate-900 leading-none">{dashboardStats.completionRate}<span className="text-[18px] font-semibold text-slate-400 ml-0.5">%</span></p>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Signature Completion</p>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ocean-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${dashboardStats.completionRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[11px] text-slate-400">
                {awaitingCount} pending &middot; {dashboardStats.expiringSoon} at risk
              </p>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-ocean-500 transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 3: Two-Column Layout ──────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* ── LEFT COLUMN (2/3) ──────────────────────────────────────── */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* ── Contracts Trend Chart with Insights ──────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">Contract Volume</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Contracts created per month &middot; Last 6 months</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +38% this quarter
                </div>
                <button
                  onClick={() => navigate('/analytics')}
                  className="text-[12px] font-medium text-ocean-500 hover:text-ocean-600 flex items-center gap-1 transition-colors"
                >
                  Full analytics
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Insight callout */}
            <div className="bg-ocean-50/60 border border-ocean-100 rounded-lg px-4 py-2.5 mb-5 flex items-start gap-2.5">
              <BarChart3 className="w-4 h-4 text-ocean-500 mt-0.5 shrink-0" />
              <p className="text-[12px] text-ocean-700 leading-relaxed">
                <span className="font-semibold">March is your strongest month yet.</span> 18 contracts created — 64% above your October baseline. At this rate, you&rsquo;re on pace to close Q1 with 44 contracts, up from 29 last quarter.
              </p>
            </div>

            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.contractsOverTime} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a7aff" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0a7aff" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    dx={-4}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#0a7aff"
                    strokeWidth={2.5}
                    fill="url(#areaFill)"
                    dot={{ r: 4, fill: '#fff', stroke: '#0a7aff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#0a7aff', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Top Contracts by Value ────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">Top Contracts by Value</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Your highest-value agreements across all categories</p>
              </div>
              <button
                onClick={() => navigate('/contracts')}
                className="text-[12px] font-medium text-ocean-500 hover:text-ocean-600 flex items-center gap-1 transition-colors"
              >
                View all contracts
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Contract</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Counterparty</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Status</th>
                    <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Expires</th>
                    <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Value</th>
                    <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {topContracts.map((contract, idx) => {
                    const days = daysUntil(contract.expiryDate);
                    const isUrgent = days <= 90;
                    const expiryDate = new Date(contract.expiryDate);
                    const expiryStr = expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <tr
                        key={contract.id}
                        className={`hover:bg-slate-25 cursor-pointer transition-colors group ${
                          idx !== topContracts.length - 1 ? 'border-b border-slate-100' : ''
                        }`}
                        onClick={() => navigate('/editor')}
                      >
                        <td className="py-3.5 px-4">
                          <p className="text-[13px] font-medium text-slate-900">{contract.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{contract.id} &middot; {contract.signatureStatus}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                              <Building2 className="w-3 h-3 text-slate-500" />
                            </div>
                            <span className="text-[13px] text-slate-600">{contract.counterparty}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getStatusClasses(contract.status)}`}>
                            {getStatusLabel(contract.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                            <span className={`text-[12px] ${isUrgent ? 'font-semibold text-red-600' : 'text-slate-500'}`}>
                              {expiryStr}
                            </span>
                          </div>
                          {isUrgent && <p className="text-[10px] text-red-500 mt-0.5">{days}d remaining</p>}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-[14px] font-semibold text-slate-900">{formatFullCurrency(contract.value)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-ocean-500 transition-colors inline-block" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Value summary bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <p className="text-[12px] text-slate-400">
                Top 5 contracts represent <span className="font-semibold text-slate-600">{formatFullCurrency(topContracts.reduce((s, c) => s + c.value, 0))}</span> in total value
              </p>
              <div className="flex items-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-500">Signed: {topContracts.filter((c) => ['signed', 'completed'].includes(c.status)).length}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-500">Pending: {topContracts.filter((c) => ['awaiting_signature', 'sent', 'in_review'].includes(c.status)).length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── Category Breakdown with Value Context ─────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">Portfolio Breakdown</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Contract distribution by type and value</p>
              </div>
              <button
                onClick={() => navigate('/analytics')}
                className="text-[12px] font-medium text-ocean-500 hover:text-ocean-600 flex items-center gap-1 transition-colors"
              >
                View analytics
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-4">
              {chartData.contractsByCategory.map((cat) => {
                const pct = Math.round((cat.count / maxCategoryCount) * 100);
                const color = categoryColors[cat.category] || '#64748b';
                return (
                  <div key={cat.category} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="text-[13px] font-medium text-slate-700">{cat.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[12px] text-slate-400">{formatCurrency(cat.value)}</span>
                        <span className="text-[13px] font-semibold text-slate-700 w-8 text-right">{cat.count}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (1/3) ─────────────────────────────────────── */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* ── AI Contract Intelligence ─────────────────────────────── */}
          {aiSuggestions.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-card p-5 text-white">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-400 to-violet-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold">Contract Intelligence</h2>
                  <p className="text-[11px] text-slate-400">AI-powered insights from your portfolio</p>
                </div>
              </div>

              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => {
                  const Icon = suggestion.icon;
                  return (
                    <div
                      key={suggestion.id}
                      className="bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] rounded-lg p-3.5 hover:bg-white/[0.12] transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-md ${suggestion.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[12px] font-semibold text-white">{suggestion.title}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAiDismissed((prev) => [...prev, suggestion.id]);
                              }}
                              className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                              title="Dismiss"
                            >
                              <span className="text-[10px] text-slate-400">&times;</span>
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                            {suggestion.description}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              suggestion.onClick();
                            }}
                            className="mt-2.5 text-[11px] font-semibold text-ocean-400 hover:text-ocean-300 flex items-center gap-1 transition-colors"
                          >
                            {suggestion.action}
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate('/ai-generator')}
                className="mt-4 w-full flex items-center justify-center gap-2 text-[12px] font-semibold text-white bg-white/[0.1] hover:bg-white/[0.15] border border-white/[0.1] rounded-lg py-2.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                Generate a contract with AI
              </button>
            </div>
          )}

          {/* ── Recent Activity (Enhanced) ───────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-slate-900">Recent Activity</h2>
              <button
                onClick={() => navigate('/contracts')}
                className="text-[12px] font-medium text-ocean-500 hover:text-ocean-600 flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-0">
              {activityFeed.map((item, idx) => {
                const meta = activityMeta[item.action] || { dot: 'bg-slate-400', Icon: FileText, label: 'Update', bg: 'bg-slate-50 text-slate-600' };
                const Icon = meta.Icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 py-3.5 group cursor-pointer hover:bg-slate-25 -mx-2 px-2 rounded-lg transition-colors ${
                      idx !== activityFeed.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-md ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-slate-700 leading-snug line-clamp-2 font-medium">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] text-slate-400">{item.time}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${meta.bg}`}>
                          {meta.label}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Signature Performance + Quick Create (combined) ────── */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-semibold text-slate-900">Signature Turnaround</h2>
              <button
                onClick={() => navigate('/analytics')}
                className="text-[12px] font-medium text-ocean-500 hover:text-ocean-600 flex items-center gap-1 transition-colors"
              >
                Details
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.signatureTurnaround} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="sigFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    dy={6}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    dx={-4}
                    unit="d"
                  />
                  <Tooltip
                    content={({ active, payload, label }: any) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-slate-900 text-white text-[12px] px-3 py-2 rounded-lg shadow-lg">
                          <p className="text-slate-300 text-[11px]">{label}</p>
                          <p className="font-semibold">{payload[0].value} days avg</p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="days"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#sigFill)"
                    dot={{ r: 3.5, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Down <span className="font-semibold text-emerald-600">43%</span> since October &middot; 2.4 days avg &middot; fastest quarter yet
              </p>
            </div>

            {/* Quick actions inline */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Quick Create</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'AI Contract', icon: Sparkles, route: '/ai-generator', color: 'text-violet-600', bg: 'bg-violet-50' },
                  { label: 'From Template', icon: FileText, route: '/templates', color: 'text-ocean-600', bg: 'bg-ocean-50' },
                  { label: 'Send to Sign', icon: Send, route: '/sign-send', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Blank Draft', icon: PenLine, route: '/editor', color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((item) => {
                  const QIcon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.route)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-150 hover:border-slate-300 hover:shadow-card transition-all text-left group"
                    >
                      <div className={`w-7 h-7 rounded-md ${item.bg} flex items-center justify-center shrink-0`}>
                        <QIcon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
