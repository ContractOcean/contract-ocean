import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import {
  Check,
  CreditCard,
  Download,
  Sparkles,
  FileText,
  Crown,
  Lock,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Brain,
  ShieldCheck,
} from 'lucide-react';

// ─── Billing history (empty for new users — populated from payment provider) ─

const billingHistory: { date: string; description: string; amount: string; status: string; invoice: string }[] = [];

// ─── Component ───────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { user } = useAuth();
  const [currentPlan] = useState<'essentials' | 'growth'>('essentials');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleUpgrade() {
    if (!user) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro', userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout');
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong');
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-25">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Billing & Plans</h1>
            <p className="mt-1 text-[13px] text-slate-500">Manage your subscription and billing details.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-card">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <span className="text-[13px] font-medium text-slate-700">Essentials — $14/mo</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
        </div>

        {/* Plan includes */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-ocean-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-ocean-600" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-900">Unlimited Contracts</p>
              <p className="text-[12px] text-slate-400">Create & send without limits</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-900">Unlimited Templates</p>
              <p className="text-[12px] text-slate-400">All templates, no restrictions</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-900">E-Signatures Included</p>
              <p className="text-[12px] text-slate-400">Legally binding on every plan</p>
            </div>
          </div>
        </div>

        {/* ── Pricing: 2-Tier ──────────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-[16px] font-semibold text-slate-900 mb-1">Choose Your Plan</h2>
          <p className="text-[13px] text-slate-400 mb-6">Simple pricing. No hidden fees. Upgrade anytime.</p>

          <div className="grid grid-cols-2 gap-6">
            {/* ── Essentials ─────────────────────────────────────── */}
            <div
              className={`relative flex flex-col rounded-2xl border p-7 transition-all ${
                currentPlan === 'essentials'
                  ? 'border-ocean-400 ring-1 ring-ocean-100 bg-white shadow-card-hover'
                  : 'border-slate-200 bg-white shadow-card hover:shadow-card-hover'
              }`}
            >
              {currentPlan === 'essentials' && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-600 px-3.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                    <Crown className="h-3 w-3" />
                    Current Plan
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[17px] font-semibold text-slate-900">Essentials</h3>
                <p className="text-[12px] text-slate-400 mt-1">Everything you need to create and send contracts.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-[36px] font-bold text-slate-900 tracking-tight">$14</span>
                  <span className="text-[14px] text-slate-400 font-medium">/mo</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3.5">
                {[
                  'Create & send contracts',
                  'All templates included',
                  'E-signatures',
                  'AI contract generation',
                  'Basic analytics',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-[13px] text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Locked features teaser */}
              <div className="mb-6 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Available in Growth</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Smart Insights', icon: Brain },
                    { label: 'Bottleneck detection', icon: Target },
                    { label: 'Advanced analytics', icon: BarChart3 },
                    { label: 'Smart recommendations', icon: Zap },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-2.5">
                        <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <Icon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="text-[12px] text-slate-400">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={currentPlan === 'essentials'}
                className="w-full rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors cursor-not-allowed bg-slate-100 text-slate-400"
              >
                Current Plan
              </button>
            </div>

            {/* ── Growth ─────────────────────────────────────────── */}
            <div
              className={`relative flex flex-col rounded-2xl border p-7 transition-all ${
                currentPlan === 'growth'
                  ? 'border-ocean-400 ring-1 ring-ocean-100 bg-white shadow-card-hover'
                  : 'border-slate-200 bg-gradient-to-br from-white to-ocean-50/30 shadow-card hover:shadow-card-hover'
              }`}
            >
              {currentPlan === 'growth' ? (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-600 px-3.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                    <Crown className="h-3 w-3" />
                    Current Plan
                  </span>
                </div>
              ) : (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-ocean-500 to-violet-500 px-3.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[17px] font-semibold text-slate-900">Growth</h3>
                <p className="text-[12px] text-slate-400 mt-1">Close contracts faster with AI-powered intelligence.</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-[36px] font-bold text-slate-900 tracking-tight">$49</span>
                  <span className="text-[14px] text-slate-400 font-medium">/mo</span>
                </div>
              </div>

              <ul className="mb-6 flex-1 space-y-3.5">
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-[13px] text-slate-600 font-medium">Everything in Essentials</span>
                </li>
                {[
                  'Smart Insights — spot risks before they escalate',
                  'Bottleneck detection — identify what slows deals down',
                  'Advanced analytics & reporting',
                  'Smart recommendations — AI-driven next steps',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    <span className="text-[13px] text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Value callouts */}
              <div className="mb-6 rounded-lg bg-slate-900 p-4 space-y-2.5">
                {[
                  { icon: TrendingUp, text: 'Close contracts 40% faster' },
                  { icon: Target, text: 'Recover lost deals with smart alerts' },
                  { icon: Zap, text: 'Identify bottlenecks instantly' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-ocean-400 shrink-0" />
                      <span className="text-[12px] font-medium text-slate-300">{item.text}</span>
                    </div>
                  );
                })}
              </div>

              {currentPlan === 'growth' ? (
                <button
                  disabled
                  className="w-full rounded-lg px-4 py-2.5 text-[13px] font-medium cursor-not-allowed bg-slate-100 text-slate-400"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold bg-ocean-600 text-white shadow-sm hover:bg-ocean-700 transition-colors disabled:opacity-60"
                >
                  {checkoutLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>Unlock Insights <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Checkout error */}
        {checkoutError && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700 text-center">
            {checkoutError}
          </div>
        )}

        {/* ── Billing history ──────────────────────────────────────── */}
        <div>
          <h2 className="text-[16px] font-semibold text-slate-900 mb-5">Billing History</h2>
          {billingHistory.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-card py-12 text-center">
              <p className="text-[14px] text-slate-400">No billing history yet.</p>
              <p className="text-[12px] text-slate-300 mt-1">Invoices will appear here after your first payment.</p>
            </div>
          ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Description</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {billingHistory.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-25 transition-colors">
                    <td className="px-6 py-4 text-[13px] text-slate-600">{row.date}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-slate-900">{row.description}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-slate-900">{row.amount}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ocean-600 hover:text-ocean-700 transition-colors">
                        <Download className="h-3.5 w-3.5" />
                        {row.invoice}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
