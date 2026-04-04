import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Shield, Lock, Users, Eye, EyeOff, Check, X, ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

// ─── OTP Input Component ────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, char: string) {
    if (!/^\d?$/.test(char)) return;
    const arr = value.split('');
    arr[idx] = char;
    const next = arr.join('').slice(0, 6);
    onChange(next);
    if (char && idx < 5) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-[20px] font-semibold text-slate-900 bg-white border-2 border-slate-200 rounded-xl focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 outline-none transition-all"
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

// ─── Password Strength ──────────────────────────────────────────────────────

interface PasswordCheck { label: string; met: boolean }

// ─── Main Component ─────────────────────────────────────────────────────────

type Step = 'email' | 'verify' | 'password';

function SignupPage() {
  const navigate = useNavigate();
  const { signUp, verifyOtp, resendOtp } = useAuth();

  // State
  const [step, setStep] = useState<Step>('email');
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Password validation
  const passwordChecks: PasswordCheck[] = useMemo(() => [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const strengthScore = passwordChecks.filter((c) => c.met).length;
  const strengthLabel = useMemo(() => {
    if (!password) return "";
    if (strengthScore <= 1) return "Weak";
    if (strengthScore <= 2) return "Fair";
    if (strengthScore <= 3) return "Good";
    return "Strong";
  }, [password, strengthScore]);

  const strengthColor = useMemo(() => {
    if (strengthScore <= 1) return "#ef4444";
    if (strengthScore <= 2) return "#f59e0b";
    if (strengthScore <= 3) return "#3b82f6";
    return "#22c55e";
  }, [strengthScore]);

  // ── Handlers ────────────────────────────────────────────────────────────

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !fullName) return;
    setIsLoading(true);
    setError(null);

    // Sign up with a temporary password first, we'll verify email via OTP
    const tempPassword = crypto.randomUUID().slice(0, 16) + 'Aa1!';
    const { error: err, needsVerification } = await signUp(email, tempPassword, fullName);
    setIsLoading(false);

    if (err) {
      setError(err);
      return;
    }

    if (needsVerification) {
      setStep('verify');
      setResendCooldown(60);
    } else {
      // If no verification needed (e.g. confirm_email disabled), go to password
      setStep('password');
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true);
    setError(null);

    const { error: err } = await verifyOtp(email, otp);
    setIsLoading(false);

    if (err) {
      setError(err);
      return;
    }

    // After verification, user is signed in — redirect to onboarding
    navigate('/onboarding');
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError(null);
    const { error: err } = await resendOtp(email);
    if (err) {
      setError(err);
    } else {
      setResendCooldown(60);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (strengthScore < 3) return;
    setIsLoading(true);
    setError(null);

    // Update the user's password
    const { error: err } = await signUp(email, password, fullName);
    setIsLoading(false);

    if (err) {
      setError(err);
      return;
    }

    navigate('/onboarding');
  }

  // ── Step indicator ──────────────────────────────────────────────────────

  const steps = [
    { key: 'email', label: 'Account' },
    { key: 'verify', label: 'Verify' },
  ];

  // ── Render ──────────────────────────────────────────────────────────────

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
            Create, send, and sign<br />contracts in minutes.
          </h2>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-sm">
            Join thousands of businesses using AI-powered contract management to close deals faster.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {[
              { icon: Shield, text: "Bank-grade security" },
              { icon: Users, text: "Built for teams" },
              { icon: Lock, text: "Legally binding e-signatures" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                  <Icon className="w-4 h-4 text-white/80" />
                  <span className="text-[12px] font-medium text-white/80">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#fcfcfd]">
        <div className="w-full max-w-[420px]">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${
                  s.key === step ? 'bg-ocean-600 text-white' :
                  steps.findIndex((st) => st.key === step) > i ? 'bg-emerald-500 text-white' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {steps.findIndex((st) => st.key === step) > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[12px] font-medium ${s.key === step ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
                {i < steps.length - 1 && <div className="w-8 h-px bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700 flex items-start gap-2">
              <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* ── STEP: Email ────────────────────────────────────── */}
          {step === 'email' && (
            <>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">Create your account</h1>
              <p className="text-[14px] text-slate-500 mb-7">Start managing contracts in under 60 seconds.</p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">For teams, we recommend using your company email</p>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className="w-full h-11 px-3.5 pr-10 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2.5">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div key={level} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: strengthScore >= level ? strengthColor : '#e2e8f0' }} />
                        ))}
                      </div>
                      <p className="text-[11px] font-medium" style={{ color: strengthColor }}>{strengthLabel}</p>
                      <div className="mt-2 space-y-1">
                        {passwordChecks.map((c) => (
                          <div key={c.label} className="flex items-center gap-2">
                            {c.met ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-300" />}
                            <span className={`text-[11px] ${c.met ? 'text-slate-500' : 'text-slate-400'}`}>{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !fullName || !password || strengthScore < 3}
                  className="w-full h-11 bg-ocean-600 hover:bg-ocean-700 text-white text-[14px] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[13px] text-slate-500">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="font-semibold text-ocean-600 hover:text-ocean-700 transition-colors">Sign in</button>
              </p>
            </>
          )}

          {/* ── STEP: Verify OTP ───────────────────────────────── */}
          {step === 'verify' && (
            <>
              <button onClick={() => setStep('email')} className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mb-8">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-ocean-50 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-ocean-600" />
                </div>
                <h1 className="text-[24px] font-bold text-slate-900 mb-2">Check your email</h1>
                <p className="text-[14px] text-slate-500">
                  We sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <OtpInput value={otp} onChange={setOtp} />

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-11 bg-ocean-600 hover:bg-ocean-700 text-white text-[14px] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    'Verify email'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-[13px] text-slate-500 hover:text-ocean-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </>
          )}

          {/* ── STEP: Password (backup, if OTP flow bypassed) ─── */}
          {step === 'password' && (
            <>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">Set your password</h1>
              <p className="text-[14px] text-slate-500 mb-7">Choose a strong password for your account.</p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      autoFocus
                      className="w-full h-11 px-3.5 pr-10 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-2.5">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div key={level} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: strengthScore >= level ? strengthColor : '#e2e8f0' }} />
                        ))}
                      </div>
                      <p className="text-[11px] font-medium" style={{ color: strengthColor }}>{strengthLabel}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || strengthScore < 3}
                  className="w-full h-11 bg-ocean-600 hover:bg-ocean-700 text-white text-[14px] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    'Continue'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
