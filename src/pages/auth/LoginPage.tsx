import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Shield, Lock, Users, Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    setIsLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #005fd4 0%, #0a7aff 50%, #3b95ff 100%)' }}>
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <span className="text-[18px] font-bold tracking-tight">Contract Ocean</span>
          </div>
          <h2 className="text-[28px] font-bold leading-tight mb-4">
            Stop chasing contracts<br />across email threads.
          </h2>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-sm">
            One place to create, send, sign, and manage all your business agreements.
          </p>
        </div>

        <div className="space-y-5">
          <div className="bg-white/10 backdrop-blur rounded-xl p-5">
            <p className="text-[13px] text-white/90 leading-relaxed italic">
              &ldquo;Contract Ocean cut our contract turnaround from 2 weeks to 2 days. The AI generation alone saved us hundreds of hours.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">MK</div>
              <div>
                <p className="text-[12px] font-semibold">Michael Krueger</p>
                <p className="text-[11px] text-white/60">COO, Meridian Technologies</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: Shield, text: "SOC 2 Compliant" },
              { icon: Lock, text: "256-bit encryption" },
              { icon: Users, text: "2,400+ businesses" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                  <Icon className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[11px] font-medium text-white/70">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fcfcfd]">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-ocean-600 flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <span className="text-[18px] font-bold text-slate-900 tracking-tight">Contract Ocean</span>
          </div>

          <h1 className="text-[24px] font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-[14px] text-slate-500 mb-7">Sign in to your account to continue.</p>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700 flex items-start gap-2">
              <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              {error === 'Invalid login credentials' ? 'Incorrect email or password. Please try again.' : error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                autoFocus
                className="w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-slate-700">Password</label>
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-[12px] font-medium text-ocean-600 hover:text-ocean-700 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-11 px-3.5 pr-10 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-11 bg-ocean-600 hover:bg-ocean-700 text-white text-[14px] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-slate-500">
            Don&rsquo;t have an account?{' '}
            <button onClick={() => navigate('/signup')} className="font-semibold text-ocean-600 hover:text-ocean-700 transition-colors">Create account</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
