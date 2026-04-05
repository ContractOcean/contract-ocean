import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function BillingSuccessPage() {
  const navigate = useNavigate();
  // session_id available in URL params for future webhook verification

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => navigate('/'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-25 flex items-center justify-center" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="text-center max-w-md px-6">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-[24px] font-bold text-slate-900 mb-2">You're all set!</h1>
        <p className="text-[15px] text-slate-500 leading-relaxed mb-2">
          Your subscription is now active. You can create unlimited contracts and send them for signature.
        </p>
        <p className="text-[12px] text-slate-400 mb-8">
          Redirecting to your dashboard...
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
