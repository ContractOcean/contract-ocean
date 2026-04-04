import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Shield, Lock, Users, Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordCheck {
  label: string;
  met: boolean;
}

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks: PasswordCheck[] = useMemo(
    () => [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One number", met: /\d/.test(password) },
      {
        label: "One special character",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ],
    [password]
  );

  const strengthScore = passwordChecks.filter((c) => c.met).length;

  const strengthLabel = useMemo(() => {
    if (password.length === 0) return "";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1200);
  };

  const inputFocusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#005fd4";
    e.target.style.boxShadow = "0 0 0 3px rgba(0,95,212,0.1)";
  };

  const inputBlurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Left Panel - Brand */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #003d8a 0%, #005fd4 40%, #0a7aff 70%, #38a3ff 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <Waves className="h-8 w-8 text-white" strokeWidth={2} />
            <span
              className="text-xl font-semibold tracking-tight text-white"
              style={{ fontSize: "20px" }}
            >
              Contract Ocean
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1
            className="font-semibold leading-tight text-white"
            style={{ fontSize: "32px", lineHeight: "1.2" }}
          >
            Stop chasing contracts across email threads.
          </h1>
          <p
            className="mt-4 leading-relaxed text-blue-100"
            style={{ fontSize: "17px", opacity: 0.85 }}
          >
            One workspace for every agreement. Draft, negotiate, sign, and
            manage contracts from a single source of truth.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-200" />
              <span
                className="font-medium text-blue-100"
                style={{ fontSize: "13px" }}
              >
                Trusted by 2,400+ businesses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-200" />
              <span
                className="font-medium text-blue-100"
                style={{ fontSize: "13px" }}
              >
                SOC 2 compliant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-200" />
              <span
                className="font-medium text-blue-100"
                style={{ fontSize: "13px" }}
              >
                256-bit encryption
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <p
              className="italic leading-relaxed text-blue-100"
              style={{ fontSize: "14px" }}
            >
              "We onboarded our entire legal team in under a week. The
              collaborative editing alone saved us thousands in outside counsel
              fees."
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                MK
              </div>
              <div>
                <p
                  className="font-medium text-white"
                  style={{ fontSize: "13px" }}
                >
                  Michael Kim
                </p>
                <p className="text-blue-200" style={{ fontSize: "12px" }}>
                  General Counsel, Flexport
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div
        className="flex w-full flex-col justify-center px-6 py-10 lg:w-1/2 lg:px-0"
        style={{ backgroundColor: "#fcfcfd" }}
      >
        <div className="mx-auto w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Waves className="h-7 w-7" style={{ color: "#005fd4" }} strokeWidth={2} />
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: "#0f172a", fontSize: "18px" }}
            >
              Contract Ocean
            </span>
          </div>

          <h2
            className="font-semibold"
            style={{ fontSize: "28px", color: "#0f172a", lineHeight: "1.2" }}
          >
            Start your free trial
          </h2>
          <p className="mt-2" style={{ fontSize: "14px", color: "#64748b" }}>
            No credit card required. 14-day free trial.
          </p>

          {/* Google Sign-in */}
          <button
            type="button"
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-2.5 font-medium transition-colors hover:bg-slate-50"
            style={{
              borderColor: "#e2e8f0",
              fontSize: "14px",
              color: "#0f172a",
              height: "44px",
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: "#e2e8f0" }}
            />
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>OR</span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: "#e2e8f0" }}
            />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block font-medium"
                style={{ fontSize: "13px", color: "#0f172a" }}
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full rounded-lg border px-3.5 py-2.5 outline-none transition-colors placeholder:text-slate-400"
                style={{
                  borderColor: "#e2e8f0",
                  fontSize: "14px",
                  color: "#0f172a",
                  height: "44px",
                }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            <div>
              <label
                htmlFor="signupEmail"
                className="mb-1.5 block font-medium"
                style={{ fontSize: "13px", color: "#0f172a" }}
              >
                Work email
              </label>
              <input
                id="signupEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border px-3.5 py-2.5 outline-none transition-colors placeholder:text-slate-400"
                style={{
                  borderColor: "#e2e8f0",
                  fontSize: "14px",
                  color: "#0f172a",
                  height: "44px",
                }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="mb-1.5 block font-medium"
                style={{ fontSize: "13px", color: "#0f172a" }}
              >
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc."
                required
                className="w-full rounded-lg border px-3.5 py-2.5 outline-none transition-colors placeholder:text-slate-400"
                style={{
                  borderColor: "#e2e8f0",
                  fontSize: "14px",
                  color: "#0f172a",
                  height: "44px",
                }}
                onFocus={inputFocusStyle}
                onBlur={inputBlurStyle}
              />
            </div>

            <div>
              <label
                htmlFor="signupPassword"
                className="mb-1.5 block font-medium"
                style={{ fontSize: "13px", color: "#0f172a" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-lg border px-3.5 py-2.5 pr-11 outline-none transition-colors placeholder:text-slate-400"
                  style={{
                    borderColor: "#e2e8f0",
                    fontSize: "14px",
                    color: "#0f172a",
                    height: "44px",
                  }}
                  onFocus={inputFocusStyle}
                  onBlur={inputBlurStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#94a3b8" }}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Password strength
                    </span>
                    <span
                      className="font-medium"
                      style={{ fontSize: "12px", color: strengthColor }}
                    >
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{
                          backgroundColor:
                            i <= strengthScore ? strengthColor : "#e2e8f0",
                        }}
                      />
                    ))}
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {passwordChecks.map((check) => (
                      <li
                        key={check.label}
                        className="flex items-center gap-2"
                      >
                        {check.met ? (
                          <Check
                            className="h-3.5 w-3.5"
                            style={{ color: "#22c55e" }}
                          />
                        ) : (
                          <X
                            className="h-3.5 w-3.5"
                            style={{ color: "#cbd5e1" }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: "12px",
                            color: check.met ? "#64748b" : "#94a3b8",
                          }}
                        >
                          {check.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5" style={{ marginTop: "20px" }}>
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-blue-600"
                style={{ accentColor: "#005fd4" }}
              />
              <label
                htmlFor="terms"
                style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}
              >
                I agree to the{" "}
                <button
                  type="button"
                  className="font-medium hover:underline"
                  style={{ color: "#005fd4" }}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-medium hover:underline"
                  style={{ color: "#005fd4" }}
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="flex w-full items-center justify-center rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: "#005fd4",
                fontSize: "14px",
                height: "44px",
                marginTop: "24px",
              }}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p
            className="mt-8 text-center"
            style={{ fontSize: "13px", color: "#64748b" }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium transition-colors hover:underline"
              style={{ color: "#005fd4" }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
