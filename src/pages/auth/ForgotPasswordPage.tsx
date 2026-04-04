import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, ArrowLeft, Mail } from "lucide-react";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        backgroundColor: "#fcfcfd",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <Waves className="h-8 w-8" style={{ color: "#005fd4" }} strokeWidth={2} />
          <span
            className="text-xl font-semibold tracking-tight"
            style={{ color: "#0f172a", fontSize: "20px" }}
          >
            Contract Ocean
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-xl border p-8"
          style={{
            borderColor: "#e2e8f0",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
          }}
        >
          {!isSubmitted ? (
            <>
              <h2
                className="text-center font-semibold"
                style={{
                  fontSize: "24px",
                  color: "#0f172a",
                  lineHeight: "1.2",
                }}
              >
                Reset your password
              </h2>
              <p
                className="mt-2 text-center"
                style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}
              >
                Enter the email address associated with your account and we'll
                send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6">
                <div>
                  <label
                    htmlFor="resetEmail"
                    className="mb-1.5 block font-medium"
                    style={{ fontSize: "13px", color: "#0f172a" }}
                  >
                    Work email
                  </label>
                  <input
                    id="resetEmail"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-5 flex w-full items-center justify-center rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{
                    backgroundColor: "#005fd4",
                    fontSize: "14px",
                    height: "44px",
                  }}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(0,95,212,0.08)" }}
              >
                <Mail className="h-6 w-6" style={{ color: "#005fd4" }} />
              </div>
              <h2
                className="font-semibold"
                style={{
                  fontSize: "24px",
                  color: "#0f172a",
                  lineHeight: "1.2",
                }}
              >
                Check your email
              </h2>
              <p
                className="mt-2"
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  lineHeight: "1.5",
                }}
              >
                We've sent a password reset link to{" "}
                <span className="font-medium" style={{ color: "#0f172a" }}>
                  {email}
                </span>
                . The link will expire in 60 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="mt-5 font-medium transition-colors hover:underline"
                style={{ fontSize: "13px", color: "#005fd4" }}
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>

        {/* Back to login */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mx-auto mt-6 flex items-center gap-1.5 transition-colors hover:underline"
          style={{ fontSize: "13px", color: "#64748b" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
