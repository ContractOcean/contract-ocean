import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Shield, Lock, Users, Eye, EyeOff } from "lucide-react";
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
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Left Panel - Brand */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Ocean gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #003d8a 0%, #005fd4 40%, #0a7aff 70%, #38a3ff 100%)",
          }}
        />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />

        {/* Content */}
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

          {/* Trust badges */}
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

        {/* Testimonial */}
        <div className="relative z-10">
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <p
              className="italic leading-relaxed text-blue-100"
              style={{ fontSize: "14px" }}
            >
              "Contract Ocean cut our contract turnaround time by 65%. What used
              to take weeks now takes days."
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                SR
              </div>
              <div>
                <p
                  className="font-medium text-white"
                  style={{ fontSize: "13px" }}
                >
                  Sarah Rodriguez
                </p>
                <p className="text-blue-200" style={{ fontSize: "12px" }}>
                  VP of Legal, TechScale Inc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div
        className="flex w-full flex-col justify-center px-6 lg:w-1/2 lg:px-0"
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
            Welcome back
          </h2>
          <p className="mt-2" style={{ fontSize: "14px", color: "#64748b" }}>
            Sign in to your account to continue
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

          {/* Auth Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block font-medium"
                style={{ fontSize: "13px", color: "#0f172a" }}
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border px-3.5 py-2.5 outline-none transition-colors placeholder:text-slate-400 focus:ring-2"
                style={{
                  borderColor: "#e2e8f0",
                  fontSize: "14px",
                  color: "#0f172a",
                  height: "44px",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#005fd4";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(0,95,212,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block font-medium"
                  style={{ fontSize: "13px", color: "#0f172a" }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-medium transition-colors hover:underline"
                  style={{ fontSize: "13px", color: "#005fd4" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border px-3.5 py-2.5 pr-11 outline-none transition-colors placeholder:text-slate-400"
                  style={{
                    borderColor: "#e2e8f0",
                    fontSize: "14px",
                    color: "#0f172a",
                    height: "44px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#005fd4";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(0,95,212,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{
                backgroundColor: "#005fd4",
                fontSize: "14px",
                height: "44px",
                marginTop: "24px",
              }}
            >
              {isLoading ? (
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p
            className="mt-8 text-center"
            style={{ fontSize: "13px", color: "#64748b" }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-medium transition-colors hover:underline"
              style={{ color: "#005fd4" }}
            >
              Start free trial
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
