import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  X, Check, Sparkles, Crown, ArrowRight,
} from 'lucide-react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

// ─── Config (easy to adjust) ────────────────────────────────────────────────

export const PLAN_CONFIG = {
  free: {
    maxContracts: 2,
    canSend: false,
    label: 'Free',
  },
  pro: {
    maxContracts: Infinity,
    canSend: true,
    label: 'Pro',
    price: '\u20ac15',
    period: '/month',
  },
  business: {
    maxContracts: Infinity,
    canSend: true,
    label: 'Business',
    price: '\u20ac50',
    period: '/month',
  },
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;

// ─── Context ────────────────────────────────────────────────────────────────

interface PaywallState {
  currentPlan: PlanKey;
  contractCount: number;
  canCreateContract: boolean;
  canSendContract: boolean;
  checkCreateLimit: () => boolean; // returns true if allowed, false if blocked (shows modal)
  checkSendLimit: () => boolean;
  showUpgrade: (reason?: string) => void;
  setContractCount: (count: number) => void;
}

const PaywallContext = createContext<PaywallState | undefined>(undefined);

export function PaywallProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const planFromProfile = (profile?.plan_selected === 'growth' ? 'business' : profile?.plan_selected === 'pro' ? 'pro' : 'free') as PlanKey;
  const [currentPlan] = useState<PlanKey>(planFromProfile);
  const [contractCount, setContractCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  // Auto-sync contract count from Supabase
  useEffect(() => {
    if (!user) return;
    supabase.from('contracts').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count !== null) setContractCount(count);
    });
  }, [user]);

  const config = PLAN_CONFIG[currentPlan];
  const canCreateContract = contractCount < config.maxContracts;
  const canSendContract = config.canSend;

  const showUpgrade = useCallback((reason = '') => {
    setUpgradeReason(reason);
    setModalOpen(true);
  }, []);

  const checkCreateLimit = useCallback(() => {
    if (contractCount >= config.maxContracts) {
      showUpgrade('create');
      return false;
    }
    return true;
  }, [contractCount, config.maxContracts, showUpgrade]);

  const checkSendLimit = useCallback(() => {
    if (!config.canSend) {
      showUpgrade('send');
      return false;
    }
    return true;
  }, [config.canSend, showUpgrade]);

  return (
    <PaywallContext.Provider value={{
      currentPlan, contractCount, canCreateContract, canSendContract,
      checkCreateLimit, checkSendLimit, showUpgrade, setContractCount,
    }}>
      {children}
      {modalOpen && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setModalOpen(false)}
          contractCount={contractCount}
          maxContracts={config.maxContracts}
          userId={user?.id ?? null}
        />
      )}
    </PaywallContext.Provider>
  );
}

export function usePaywall() {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error('usePaywall must be used within PaywallProvider');
  return ctx;
}

// ─── Upgrade Modal ──────────────────────────────────────────────────────────

function UpgradeModal({
  reason,
  onClose,
  contractCount,
  maxContracts,
  userId,
}: {
  reason: string;
  onClose: () => void;
  contractCount: number;
  maxContracts: number;
  userId: string | null;
}) {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleUpgrade(plan: 'pro' | 'business') {
    if (!userId) { setCheckoutError('Please sign in to upgrade.'); return; }
    setCheckoutLoading(plan);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout');
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong');
      setCheckoutLoading(null);
    }
  }

  const headline = reason === 'send'
    ? 'Upgrade to send contracts'
    : reason === 'create'
    ? 'Unlock unlimited contracts'
    : 'Unlock the full experience';

  const subtext = reason === 'send'
    ? 'Sending contracts for signature is available on Pro and Business plans.'
    : reason === 'create'
    ? `You\u2019ve used ${contractCount} of ${maxContracts} free contracts. Upgrade to create without limits.`
    : 'Create, send, and manage contracts without limits.';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-4 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-500 to-violet-500 flex items-center justify-center">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-[20px] font-bold text-slate-900">{headline}</h2>
          <p className="mt-2 text-[14px] text-slate-500 max-w-sm mx-auto">{subtext}</p>
        </div>

        {/* Plans */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Pro */}
            <div className="relative flex flex-col p-5 rounded-xl border-2 border-ocean-400 bg-ocean-50/30">
              <div className="absolute -top-2.5 left-4">
                <span className="text-[10px] font-semibold bg-ocean-600 text-white px-2.5 py-0.5 rounded-full">Most Popular</span>
              </div>
              <h3 className="text-[15px] font-semibold text-slate-900 mt-1">Pro</h3>
              <div className="flex items-baseline gap-0.5 mt-2 mb-3">
                <span className="text-[26px] font-bold text-slate-900">{PLAN_CONFIG.pro.price}</span>
                <span className="text-[12px] text-slate-400">{PLAN_CONFIG.pro.period}</span>
              </div>
              <ul className="space-y-2 mb-5 flex-1">
                {[
                  'Unlimited contracts',
                  'Send for signature',
                  'All templates',
                  'AI generation',
                  'Analytics',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={checkoutLoading === 'pro'}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm disabled:opacity-60"
              >
                {checkoutLoading === 'pro' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>Upgrade to Pro <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>

            {/* Business */}
            <div className="flex flex-col p-5 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-[15px] font-semibold text-slate-900 mt-1">Business</h3>
              <div className="flex items-baseline gap-0.5 mt-2 mb-3">
                <span className="text-[26px] font-bold text-slate-900">{PLAN_CONFIG.business.price}</span>
                <span className="text-[12px] text-slate-400">{PLAN_CONFIG.business.period}</span>
              </div>
              <ul className="space-y-2 mb-5 flex-1">
                {[
                  'Everything in Pro',
                  'Team collaboration',
                  'Priority support',
                  'Advanced permissions',
                  'Custom branding',
                ].map((f, i) => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-slate-600">
                    {i === 0 ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade('business')}
                disabled={checkoutLoading === 'business'}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {checkoutLoading === 'business' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                ) : (
                  'Choose Business'
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {checkoutError && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-700 text-center">
              {checkoutError}
            </div>
          )}

          {/* Continue free */}
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              Continue with free plan ({maxContracts - contractCount > 0 ? `${maxContracts - contractCount} contract${maxContracts - contractCount !== 1 ? 's' : ''} remaining` : 'limit reached'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
