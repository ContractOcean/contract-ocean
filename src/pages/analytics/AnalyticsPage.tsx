import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Bell,
  Eye,
  Send,
  Zap,
  Target,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { chartData } from "../../data/mockData";

const DATE_RANGES = ["Last 30 days", "Last 90 days", "Last 12 months"] as const;

const TOP_TEMPLATES = [
  { name: "Mutual Non-Disclosure Agreement", uses: 4213, signed: 3892, rate: 92 },
  { name: "Independent Contractor Agreement", uses: 3105, signed: 2670, rate: 86 },
  { name: "Master Service Agreement", uses: 2847, signed: 2561, rate: 90 },
  { name: "Statement of Work", uses: 2341, signed: 1965, rate: 84 },
  { name: "Software-as-a-Service Agreement", uses: 1956, signed: 1507, rate: 77 },
];

const PENDING_APPROVALS = [
  {
    name: "Marketing Partnership Agreement",
    requester: "Sarah Chen",
    status: "Awaiting Legal Review",
    statusColor: "bg-amber-50 text-amber-700",
    waitDays: 3,
  },
  {
    name: "Data Processing Agreement",
    requester: "Maria Santos",
    status: "Pending Signature",
    statusColor: "bg-ocean-50 text-ocean-700",
    waitDays: 5,
  },
  {
    name: "Consulting Engagement Letter",
    requester: "Sarah Chen",
    status: "Draft Review",
    statusColor: "bg-violet-50 text-violet-700",
    waitDays: 1,
  },
];

const CATEGORY_COLORS = ["#0284c7", "#7c3aed", "#059669", "#d97706", "#e11d48", "#0891b2"];

// Custom tooltip
function ChartTip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white text-[12px] px-3 py-2 rounded-lg shadow-lg border border-slate-700">
      <p className="text-slate-400 text-[11px]">{label}</p>
      <p className="font-semibold text-[14px]">
        {payload[0].value}
        {unit || ""}
      </p>
    </div>
  );
}

// Contracts needing reminders (mock data matching contracts page)
const REMINDER_CONTRACTS = [
  { id: "CON-002", name: "Software License Agreement", counterparty: "CloudVault Inc.", status: "Awaiting Signature", waitDays: 9, value: 45000, signatureStatus: "1 of 2 signed" },
  { id: "CON-004", name: "Employment Contract — Senior Engineer", counterparty: "David Park", status: "Sent", waitDays: 8, value: 95000, signatureStatus: "Sent to counterparty" },
  { id: "CON-010", name: "Data Processing Agreement", counterparty: "SecureNet Solutions", status: "Awaiting Signature", waitDays: 7, value: 0, signatureStatus: "0 of 2 signed" },
  { id: "CON-006", name: "Marketing Partnership Agreement", counterparty: "BrightWave Digital", status: "In Review", waitDays: 6, value: 72000, signatureStatus: "Under review" },
  { id: "CON-012", name: "Creative Services Agreement", counterparty: "Studio Neon", status: "Sent", waitDays: 9, value: 28000, signatureStatus: "Sent to counterparty" },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<(typeof DATE_RANGES)[number]>("Last 30 days");
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [reminderSelected, setReminderSelected] = useState<Set<string>>(new Set(REMINDER_CONTRACTS.map((c) => c.id)));
  const [reminderSent, setReminderSent] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("Hi,\n\nThis is a friendly reminder that the following contract is awaiting your signature. Please review and sign at your earliest convenience.\n\nBest regards,\nSarah Chen\nAcme Corporation");

  const maxTemplateUses = TOP_TEMPLATES[0].uses;

  function openReminders() {
    setReminderSent(false);
    setReminderSelected(new Set(REMINDER_CONTRACTS.map((c) => c.id)));
    setShowRemindersModal(true);
  }

  function sendReminders() {
    setReminderSent(true);
    setTimeout(() => {
      setShowRemindersModal(false);
      setReminderSent(false);
    }, 2500);
  }

  function toggleReminderContract(id: string) {
    setReminderSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div
      className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Analytics</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Contract performance insights &middot; Updated today
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
          {DATE_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                dateRange === range
                  ? "bg-ocean-50 text-ocean-700"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* AI RECOMMENDATIONS PANEL                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <div className="mb-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 shadow-sm">
        {/* Main problem headline */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ocean-400 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-white">Smart Insights</h3>
              <p className="text-[12px] text-red-400 font-medium mt-0.5">
                Your biggest issue: 5 contracts are stuck at the signature stage
              </p>
            </div>
          </div>
          <button
            onClick={openReminders}
            className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-white bg-ocean-500 hover:bg-ocean-400 rounded-lg transition-colors shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Fix bottlenecks
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              text: "5 contracts are stuck awaiting signature for 3+ days — you\u2019re losing $117K in delayed revenue.",
              impact: "Could recover $117K",
              urgency: "3+ days overdue",
              action: "Send reminders now",
              onClick: openReminders,
              icon: Bell,
              iconBg: "bg-red-500",
              priority: "high" as const,
            },
            {
              text: "2 drafts are idle for 5+ days. Complete them to unlock an estimated $35K in your pipeline.",
              impact: "Unlock $35K pipeline",
              urgency: "Idle 5+ days",
              action: "Complete drafts",
              onClick: () => navigate("/contracts?filter=draft"),
              icon: Target,
              iconBg: "bg-amber-500",
              priority: "medium" as const,
            },
            {
              text: "NDA is your highest-volume template (34 contracts). Optimizing it could save 2+ hours per week.",
              impact: "Save 2+ hrs/week",
              urgency: "",
              action: "Optimize template",
              onClick: () => navigate("/templates"),
              icon: Zap,
              iconBg: "bg-violet-500",
              priority: "low" as const,
            },
          ].map((insight, i) => (
            <div
              key={i}
              className={`bg-white/[0.07] backdrop-blur-sm border rounded-lg p-3.5 hover:bg-white/[0.12] transition-all cursor-pointer group ${
                insight.priority === "high" ? "border-red-500/30" : insight.priority === "medium" ? "border-amber-500/30" : "border-white/[0.08]"
              }`}
              onClick={insight.onClick}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-md ${insight.iconBg} flex items-center justify-center shrink-0`}>
                  <insight.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      insight.priority === "high" ? "bg-red-500/20 text-red-400" : insight.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {insight.priority}
                    </span>
                    {insight.urgency && (
                      <span className="text-[10px] text-slate-500">{insight.urgency}</span>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-300 leading-relaxed">{insight.text}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] font-semibold text-emerald-400">{insight.impact}</span>
                    <button className="text-[11px] font-semibold text-ocean-400 hover:text-ocean-300 flex items-center gap-1 transition-colors">
                      {insight.action}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* KPI ROW — with insight line                                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Contracts Created */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate("/contracts")}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-500">Contracts Created</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ocean-50">
              <FileText className="h-4.5 w-4.5 text-ocean-600" />
            </div>
          </div>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">18</p>
          <div className="mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[12px] font-semibold text-emerald-600">+22%</span>
            <span className="text-[12px] text-slate-400">vs last month</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-600">Strong growth.</span> You created 22% more contracts than last month. March is your best month this quarter.
            </p>
          </div>
        </div>

        {/* Avg Signature Time */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate("/contracts?filter=awaiting_signature")}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-500">Avg. Signature Time</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <Clock className="h-4.5 w-4.5 text-emerald-600" />
            </div>
          </div>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">
            2.4<span className="text-[18px] font-semibold text-slate-400 ml-0.5">days</span>
          </p>
          <div className="mt-1 flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[12px] font-semibold text-emerald-600">-18%</span>
            <span className="text-[12px] text-slate-400">faster than avg</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-600">Outperforming.</span> Industry average is 5.7 days. Your contracts are signed 58% faster than the benchmark.
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate("/contracts")}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-500">Completion Rate</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <CheckCircle2 className="h-4.5 w-4.5 text-violet-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <p className="text-[28px] font-bold tracking-tight text-slate-900">87<span className="text-[18px] font-semibold text-slate-400">%</span></p>
            <div className="relative h-12 w-12">
              <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none" stroke="#7c3aed" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${87 * 1.257} ${125.7 - 87 * 1.257}`}
                />
              </svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-medium text-amber-600">You&rsquo;re leaving money on the table.</span> 13% of contracts never close. Sending follow-ups could recover an estimated $45K in pipeline.
            </p>
          </div>
        </div>

        {/* Total Contract Value */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate("/analytics")}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-500">Total Contract Value</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <DollarSign className="h-4.5 w-4.5 text-amber-600" />
            </div>
          </div>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">$2.4M</p>
          <div className="mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[12px] font-semibold text-emerald-600">+8%</span>
            <span className="text-[12px] text-slate-400">vs last quarter</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-600">Revenue growing.</span> Driven by Sales ($890K) and Vendor ($720K) agreements. Service contracts gaining momentum.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CHARTS GRID — with contextual insights                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Contracts Over Time */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Contracts Over Time</h3>
              <p className="text-[12px] text-slate-400">Monthly creation trend</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +38% this quarter
            </div>
          </div>
          <div className="bg-ocean-50/50 border border-ocean-100 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-ocean-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-ocean-700 leading-relaxed">
              <span className="font-semibold">March peaked at 18 contracts</span> — a 64% increase since October. Your creation velocity is accelerating.
            </p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.contractsOverTime}>
                <defs>
                  <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a7aff" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#0a7aff" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip content={<ChartTip unit=" contracts" />} />
                <Area type="monotone" dataKey="count" stroke="#0a7aff" strokeWidth={2.5} fill="url(#oceanGrad)" dot={{ r: 4, fill: "#fff", stroke: "#0a7aff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#0a7aff", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signature Turnaround */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Signature Turnaround</h3>
              <p className="text-[12px] text-slate-400">Average days to complete signing</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingDown className="w-3 h-3" />
              -43% since Oct
            </div>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              <span className="font-semibold">Turnaround dropped from 4.2 to 2.4 days.</span> December was an outlier at 5.1 days — likely due to holiday delays.
            </p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.signatureTurnaround}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} unit="d" />
                <Tooltip content={<ChartTip unit=" days" />} />
                <Area type="monotone" dataKey="days" stroke="#10b981" strokeWidth={2.5} fill="url(#emeraldGrad)" dot={{ r: 4, fill: "#fff", stroke: "#10b981", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contracts by Category */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-[15px] font-semibold text-slate-900">Contracts by Category</h3>
          <p className="mb-4 text-[12px] text-slate-400">Distribution across contract types</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.contractsByCategory} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} width={80} />
                <Tooltip content={<ChartTip unit=" contracts" />} />
                <Bar dataKey="count" name="Contracts" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.contractsByCategory.map((_, idx) => (
                    <Cell key={idx} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            <span className="font-medium text-slate-600">NDA leads at 34 contracts.</span> Consider creating an optimized NDA template to save time.
          </div>
        </div>

        {/* Contract Value by Category */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-[15px] font-semibold text-slate-900">Contract Value by Category</h3>
          <p className="mb-4 text-[12px] text-slate-400">Total value in USD per category</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.contractsByCategory.filter((d) => d.value > 0)}>
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-slate-900 text-white text-[12px] px-3 py-2 rounded-lg shadow-lg border border-slate-700">
                        <p className="text-slate-400 text-[11px]">{label}</p>
                        <p className="font-semibold text-[14px]">${Number(payload[0].value).toLocaleString()}</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]} barSize={36}>
                  {chartData.contractsByCategory.filter((d) => d.value > 0).map((_, idx) => (
                    <Cell key={idx} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            <span className="font-medium text-slate-600">Sales agreements drive the most value</span> at $890K. Vendor contracts are second at $720K.
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BOTTLENECK DETECTION                                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/40 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">Bottleneck Detection</h3>
            <p className="text-[12px] text-slate-500">Areas slowing down your contract workflow</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              title: "You\u2019re losing time at the signature stage",
              desc: "5 contracts stuck for 3+ days. This stage causes 68% of all delays and is blocking $117K in revenue.",
              impact: "Blocking $117K",
              urgency: "3+ days overdue",
              severity: "high" as const,
              action: "Send reminders now",
              onClick: openReminders,
            },
            {
              title: "Legal review is slower than usual",
              desc: "Marketing Partnership Agreement has been waiting 3 days. Your average is 1.5 days \u2014 this is 2\u00D7 slower.",
              impact: "Delaying $72K deal",
              urgency: "Waiting 3 days",
              severity: "medium" as const,
              action: "Review contract",
              onClick: () => navigate("/editor"),
            },
            {
              title: "2 drafts are idle \u2014 complete them to unlock $35K",
              desc: "These drafts haven\u2019t been touched in 5+ days. Finishing them adds $35K to your active pipeline.",
              impact: "Unlock $35K pipeline",
              urgency: "Idle 5+ days",
              severity: "low" as const,
              action: "Complete drafts",
              onClick: () => navigate("/contracts?filter=draft"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`bg-white rounded-lg border p-4 hover:shadow-sm transition-all cursor-pointer group ${
                item.severity === "high" ? "border-red-200" : item.severity === "medium" ? "border-amber-200" : "border-slate-200"
              }`}
              onClick={item.onClick}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    item.severity === "high" ? "bg-red-500" : item.severity === "medium" ? "bg-amber-500" : "bg-ocean-500"
                  }`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    item.severity === "high" ? "bg-red-50 text-red-600" : item.severity === "medium" ? "bg-amber-50 text-amber-600" : "bg-ocean-50 text-ocean-600"
                  }`}>
                    {item.severity}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold ${
                  item.severity === "high" ? "text-red-500" : item.severity === "medium" ? "text-amber-500" : "text-slate-400"
                }`}>
                  {item.urgency}
                </span>
              </div>
              <h4 className="text-[13px] font-semibold text-slate-800 mb-1.5">{item.title}</h4>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-3">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-600">{item.impact}</span>
                <button className="text-[11px] font-semibold text-ocean-600 hover:text-ocean-700 flex items-center gap-1 transition-colors">
                  {item.action}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BOTTOM SECTION                                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Top Performing Templates */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-slate-900">Top Performing Templates</h3>
            <button onClick={() => navigate("/templates")} className="text-[12px] font-medium text-ocean-600 hover:text-ocean-700 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3.5">
            {TOP_TEMPLATES.map((t, idx) => (
              <div key={t.name} className="flex items-center gap-3 group">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="truncate text-[13px] font-medium text-slate-800">{t.name}</p>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        t.rate >= 90 ? "bg-emerald-50 text-emerald-700" : t.rate >= 80 ? "bg-ocean-50 text-ocean-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {t.rate >= 90 ? "High completion" : t.rate >= 80 ? "Good" : "Needs improvement"}
                      </span>
                      <span className="text-[12px] text-slate-400">{t.uses.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-ocean-500 transition-all"
                        style={{ width: `${(t.uses / maxTemplateUses) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 w-14 text-right">
                      {t.rate}% signed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals — Actionable */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-slate-900">Pending Approvals</h3>
            <button onClick={() => navigate("/contracts")} className="inline-flex items-center gap-1 text-[13px] font-medium text-ocean-600 hover:text-ocean-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {PENDING_APPROVALS.map((a) => (
              <div
                key={a.name}
                className="rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-slate-50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ocean-50">
                    <FileText className="h-4 w-4 text-ocean-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-medium text-slate-800">{a.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[12px] text-slate-400">by {a.requester}</span>
                      <span className="text-slate-300">&middot;</span>
                      <span className={`text-[11px] font-semibold ${a.waitDays >= 5 ? "text-red-500" : a.waitDays >= 3 ? "text-amber-600" : "text-slate-400"}`}>
                        {a.waitDays >= 5 ? `Overdue \u2014 ${a.waitDays}d` : `Waiting ${a.waitDays}d`}
                      </span>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${a.statusColor}`}>
                    {a.status}
                  </span>
                </div>
                {/* Quick actions on hover */}
                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate("/editor")} className="text-[11px] font-medium text-ocean-600 hover:text-ocean-700 flex items-center gap-1 transition-colors">
                    <Eye className="w-3 h-3" /> Review
                  </button>
                  <span className="text-slate-200">|</span>
                  <button onClick={openReminders} className="text-[11px] font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
                    <Send className="w-3 h-3" /> Send reminder
                  </button>
                  <span className="text-slate-200">|</span>
                  <button onClick={() => navigate("/editor")} className="text-[11px] font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors">
                    Open contract
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SEND REMINDERS MODAL                                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {showRemindersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Bell className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-slate-900">Send Signature Reminders</h2>
                  <p className="text-[12px] text-slate-500">{REMINDER_CONTRACTS.length} contracts awaiting action</p>
                </div>
              </div>
              <button onClick={() => setShowRemindersModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <span className="text-[18px]">&times;</span>
              </button>
            </div>

            {reminderSent ? (
              /* Success state */
              <div className="p-10 text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">Reminders sent!</h3>
                <p className="mt-2 text-[13px] text-slate-500">
                  {reminderSelected.size} reminder{reminderSelected.size !== 1 ? "s" : ""} sent to counterparties. You&rsquo;ll be notified when they respond.
                </p>
              </div>
            ) : (
              <>
                {/* Contract list */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select contracts to remind ({reminderSelected.size} of {REMINDER_CONTRACTS.length})
                    </h4>
                    <button
                      onClick={() => {
                        if (reminderSelected.size === REMINDER_CONTRACTS.length) {
                          setReminderSelected(new Set());
                        } else {
                          setReminderSelected(new Set(REMINDER_CONTRACTS.map((c) => c.id)));
                        }
                      }}
                      className="text-[12px] font-medium text-ocean-600 hover:text-ocean-700 transition-colors"
                    >
                      {reminderSelected.size === REMINDER_CONTRACTS.length ? "Deselect all" : "Select all"}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {REMINDER_CONTRACTS.map((contract) => {
                      const isSelected = reminderSelected.has(contract.id);
                      return (
                        <div
                          key={contract.id}
                          onClick={() => toggleReminderContract(contract.id)}
                          className={`flex items-center gap-3.5 p-3.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "border-ocean-200 bg-ocean-50/30"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-25"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleReminderContract(contract.id)}
                            className="h-4 w-4 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-semibold text-slate-800 truncate">{contract.name}</p>
                              <span className="text-[11px] text-slate-400">{contract.id}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[12px] text-slate-500">{contract.counterparty}</span>
                              <span className="text-slate-300">&middot;</span>
                              <span className="text-[11px] text-slate-400">{contract.signatureStatus}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-[11px] font-semibold ${contract.waitDays >= 7 ? "text-red-500" : "text-amber-600"}`}>
                              {contract.waitDays >= 7 ? "Overdue" : "Waiting"} {contract.waitDays}d
                            </span>
                            {contract.value > 0 && (
                              <p className="text-[11px] text-slate-400 mt-0.5">${contract.value.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message preview */}
                  <div className="mt-5">
                    <h4 className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Reminder Message</h4>
                    <textarea
                      value={reminderMessage}
                      onChange={(e) => setReminderMessage(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-700 leading-relaxed resize-none focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100 transition-all"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      This message will be sent via email to each counterparty&rsquo;s contact.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-25 shrink-0">
                  <div className="text-[12px] text-slate-500">
                    {reminderSelected.size > 0 ? (
                      <span>
                        Sending to <span className="font-semibold text-slate-700">{reminderSelected.size} counterpart{reminderSelected.size !== 1 ? "ies" : "y"}</span>
                        {(() => {
                          const totalValue = REMINDER_CONTRACTS.filter((c) => reminderSelected.has(c.id)).reduce((s, c) => s + c.value, 0);
                          return totalValue > 0 ? <span> &middot; <span className="font-semibold text-emerald-600">${totalValue.toLocaleString()}</span> in pipeline</span> : null;
                        })()}
                      </span>
                    ) : (
                      <span className="text-amber-600">Select at least one contract</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRemindersModal(false)}
                      className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendReminders}
                      disabled={reminderSelected.size === 0}
                      className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send {reminderSelected.size} reminder{reminderSelected.size !== 1 ? "s" : ""}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
